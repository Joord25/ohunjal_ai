import { onSchedule } from "firebase-functions/v2/scheduler";
import { FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";
import { db } from "../helpers";

const PORTONE_API_BASE = "https://api.portone.io";
// 가격 개정 (2026-09-08): 할인 실험(₩1,900) 종료 → ₩4,900.
// 단, 갱신은 이 상수를 쓰지 않는다. 기존 구독자는 가입 당시 가격으로 평생 고정
// (대표 결정: 자동갱신도 계속 기존 가격, 해지 후 재등록해야 정가 적용).
// → 구독 문서의 lockedPriceKrw 를 청구 금액의 SSOT 로 사용. resolveRenewalAmount 참고.
const LIST_PRICE_KRW = 4900;
const RENEW_WINDOW_HOURS = 6;

/**
 * 이 구독자에게 청구할 금액을 결정한다.
 *
 * 우선순위:
 *  1) lockedPriceKrw — backfill 스크립트(lock-subscription-prices.js) 또는 subscribe() 가 박아둔 확정 가격
 *  2) amount — subscribe() 가 가입 시 기록한 결제 금액 (구형 문서 대비)
 *  3) LIST_PRICE_KRW — 위 둘 다 없는 비정상 문서
 *
 * 절대 "상수로 일괄 청구" 로 되돌리지 말 것. 그렇게 하면 할인가 구독자가
 * 동의 없이 정가로 자동청구된다 (기존 계약조건 무단 변경).
 */
function resolveRenewalAmount(uid: string, data: FirebaseFirestore.DocumentData): number {
  const locked = data.lockedPriceKrw;
  if (typeof locked === "number" && locked > 0) return locked;

  const recorded = data.amount;
  if (typeof recorded === "number" && recorded > 0) {
    console.warn(`[renewPortOne] ${uid} lockedPriceKrw 없음 → amount(${recorded}) 로 청구. backfill 스크립트 실행 필요.`);
    return recorded;
  }

  console.error(`[renewPortOne] ${uid} 가격 정보 없음 → 정가(${LIST_PRICE_KRW}) 청구. 문서 점검 필요.`);
  return LIST_PRICE_KRW;
}

/**
 * PortOne 자동 갱신 (시간당 1회).
 *
 * 배경: 기존 subscribe() 는 첫 결제만 하고 billingKey 만 저장. 한 달 뒤 만료되면 재결제
 * 안 일어나 그냥 expired 됨 → MRR 0. 비즈니스 전제 무너짐.
 *
 * 해결: expiresAt 이 향후 RENEW_WINDOW_HOURS 시간 내 도래하는 active PortOne 구독을
 * 매시 정각에 스캔, 저장된 billingKey 로 구독자별 확정 가격을 재결제, 성공 시
 * expiresAt 을 +1개월 연장 + payments 서브컬렉션에 갱신 기록.
 *
 * 멱등성: 동일 시간 사이클 내 expiresAt 이 이미 미래로 밀려있으면 후속 호출은
 * 윈도우 밖이라 자동 skip. 망정 내 시도가 중복돼도 PortOne paymentId 가 매번 unique.
 *
 * 실패 처리 (V1): 로그만 남기고 다음 사이클에서 재시도. 만료 시점까지 모두 실패하면
 * expireSubscriptions (03:00 KST) 가 status="expired" 로 마킹.
 *
 * 향후 (V2): N회 연속 실패 → "past_due" 상태 + 이메일 알림.
 */
export const renewPortOneSubscriptions = onSchedule(
  {
    schedule: "0 * * * *", // 매시 정각
    timeZone: "Asia/Seoul",
    secrets: ["PORTONE_API_SECRET"],
  },
  async () => {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + RENEW_WINDOW_HOURS * 60 * 60 * 1000);

    const secret = process.env.PORTONE_API_SECRET;
    if (!secret) {
      console.error("[renewPortOne] PORTONE_API_SECRET not configured");
      return;
    }

    const snap = await db.collection("subscriptions").get();
    const candidates: Array<{ uid: string; billingKey: string; expiresAt: string; amount: number }> = [];

    snap.forEach((doc) => {
      const data = doc.data();
      const provider = data.provider || "portone"; // legacy = PortOne
      if (provider !== "portone") return;
      if (data.status !== "active") return;
      if (!data.billingKey || data.billingKey === "manual_admin") return;
      if (!data.expiresAt) return;

      const exp = new Date(data.expiresAt);
      if (isNaN(exp.getTime())) return;
      if (exp < now) return; // 이미 만료 → expireSubscriptions 책임
      if (exp >= windowEnd) return; // 윈도우 밖 → 다음 사이클

      candidates.push({
        uid: doc.id,
        billingKey: data.billingKey,
        expiresAt: data.expiresAt,
        amount: resolveRenewalAmount(doc.id, data),
      });
    });

    if (candidates.length === 0) {
      return;
    }

    console.log(`[renewPortOne] ${candidates.length} subscriptions in renewal window`);

    let success = 0;
    let failed = 0;

    for (const { uid, billingKey, expiresAt: oldExpiresAt, amount: chargeAmount } of candidates) {
      try {
        const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
        const rand = crypto.randomBytes(4).toString("hex");
        const paymentId = `OHUNJAL-RENEW-${dateStr}-${rand}`;

        const payRes = await fetch(`${PORTONE_API_BASE}/payments/${paymentId}/billing-key`, {
          method: "POST",
          headers: {
            "Authorization": `PortOne ${secret}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            billingKey,
            orderName: "오운잘 AI 월간 구독 갱신",
            amount: { total: chargeAmount },
            currency: "KRW",
          }),
        });

        if (!payRes.ok) {
          const errBody = await payRes.text().catch(() => "");
          console.error(`[renewPortOne] ${uid} charge failed: ${payRes.status} ${errBody}`);
          failed++;
          continue;
        }

        // 성공 → expiresAt 을 기존 만료일 기준 +1개월 (대기 시간 보존)
        const newExpiresAt = new Date(oldExpiresAt);
        newExpiresAt.setMonth(newExpiresAt.getMonth() + 1);

        const subRef = db.collection("subscriptions").doc(uid);
        await subRef.update({
          lastPaymentId: paymentId,
          lastPaymentAt: now.toISOString(),
          expiresAt: newExpiresAt.toISOString(),
          updatedAt: FieldValue.serverTimestamp(),
        });

        await subRef.collection("payments").doc(paymentId).set({
          paymentId,
          provider: "portone",
          amount: chargeAmount,
          currency: "KRW",
          plan: "monthly",
          status: "paid",
          paidAt: now.toISOString(),
          periodStart: oldExpiresAt,
          periodEnd: newExpiresAt.toISOString(),
          renewal: true,
          createdAt: FieldValue.serverTimestamp(),
        });

        success++;
      } catch (err) {
        console.error(`[renewPortOne] ${uid} exception:`, err);
        failed++;
      }
    }

    console.log(`[renewPortOne] done: success=${success} failed=${failed}`);
  }
);
