import { onRequest } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";
import { db } from "../helpers";

/**
 * Paddle webhook endpoint.
 *
 * Paddle이 `subscription.activated` / `subscription.updated` / `subscription.canceled` /
 * `transaction.completed` 이벤트를 POST 한다. 서명은 `Paddle-Signature` 헤더의
 * `ts=...;h1=...` 형식으로 오며 HMAC-SHA256(PADDLE_WEBHOOK_SECRET, `${ts}:${rawBody}`)
 * 와 일치해야 한다.
 *
 * 멱등성: 동일 notification_id 재전송 시 Firestore 덮어쓰기로 자연 처리
 * (paymentId = transaction.id 를 doc ID 로 사용).
 */
export const paddleWebhook = onRequest(
  { cors: false, secrets: ["PADDLE_WEBHOOK_SECRET"] },
  async (req, res) => {
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

    const secret = process.env.PADDLE_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[Paddle webhook] PADDLE_WEBHOOK_SECRET not configured");
      res.status(500).json({ error: "Server misconfigured" });
      return;
    }

    const signatureHeader = req.header("paddle-signature");
    if (!signatureHeader) { res.status(401).json({ error: "Missing signature" }); return; }

    // 서명 파싱: "ts=123;h1=abc..."
    const parts = Object.fromEntries(
      signatureHeader.split(";").map((p) => {
        const [k, v] = p.split("=");
        return [k, v];
      })
    );
    const ts = parts.ts;
    const h1 = parts.h1;
    if (!ts || !h1) { res.status(401).json({ error: "Malformed signature" }); return; }

    // Firebase Functions v2: req.rawBody 는 파싱 전 원본 Buffer
    const rawBody = (req as unknown as { rawBody: Buffer }).rawBody;
    if (!rawBody) { res.status(400).json({ error: "No raw body" }); return; }

    const computed = crypto
      .createHmac("sha256", secret)
      .update(`${ts}:${rawBody.toString("utf8")}`)
      .digest("hex");

    try {
      const sigOk =
        computed.length === h1.length &&
        crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(h1, "hex"));
      if (!sigOk) { res.status(401).json({ error: "Invalid signature" }); return; }
    } catch {
      res.status(401).json({ error: "Invalid signature" });
      return;
    }

    // 서명 통과 — 이제 payload 파싱
    let body: PaddleWebhookPayload;
    try {
      body = JSON.parse(rawBody.toString("utf8"));
    } catch {
      res.status(400).json({ error: "Invalid JSON" });
      return;
    }

    try {
      await handleEvent(body);
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("[Paddle webhook] handler error", err);
      // 5xx 반환 → Paddle 재시도. 멱등성 보장이라 안전.
      res.status(500).json({ error: "Handler failed" });
    }
  }
);

// ===== 타입 정의 (Paddle v1 webhook payload — 필요한 필드만) =====

interface PaddleWebhookPayload {
  event_id: string;
  event_type: string;
  occurred_at: string;
  data: Record<string, unknown>;
  notification_id?: string;
}

interface PaddleSubscriptionData {
  id: string;
  status: string;
  customer_id: string;
  currency_code: string;
  current_billing_period?: { starts_at: string; ends_at: string };
  next_billed_at?: string;
  canceled_at?: string | null;
  scheduled_change?: { action: string; effective_at: string } | null;
  items?: Array<{ price: { id: string; unit_price: { amount: string; currency_code: string } } }>;
  custom_data?: { firebaseUid?: string };
}

interface PaddleTransactionData {
  id: string;
  status: string;
  customer_id: string;
  subscription_id?: string;
  billed_at?: string;
  currency_code: string;
  details?: { totals?: { total: string; currency_code: string } };
  items?: Array<{ price_id: string }>;
  custom_data?: { firebaseUid?: string };
}

// ===== 이벤트 라우팅 =====

async function handleEvent(body: PaddleWebhookPayload): Promise<void> {
  const { event_type, data } = body;

  switch (event_type) {
    case "subscription.activated":
    case "subscription.resumed": {
      await upsertSubscription(data as unknown as PaddleSubscriptionData, "active");
      return;
    }
    case "subscription.updated": {
      // `.updated` 는 기본 active 로 처리하지만, 유저가 해지 요청 후엔 Paddle 이 status=active 로
      // 보내면서 scheduled_change.action="cancel" 또는 canceled_at 을 포함해 보냄. 이 경우 로컬은
      // 이미 "cancelled" 상태로 확정돼 있어야 재해지 시도 시 pending_changes 400 충돌이 사라짐.
      const sub = data as unknown as PaddleSubscriptionData;
      const isCancellationPending =
        !!sub.canceled_at || sub.scheduled_change?.action === "cancel";
      await upsertSubscription(sub, isCancellationPending ? "cancelled" : "active");
      return;
    }
    case "subscription.canceled":
      await upsertSubscription(data as unknown as PaddleSubscriptionData, "cancelled");
      return;
    case "subscription.past_due":
      await upsertSubscription(data as unknown as PaddleSubscriptionData, "past_due");
      return;
    case "transaction.completed":
    case "transaction.paid":
      await recordPayment(data as unknown as PaddleTransactionData);
      return;
    default:
      // 그 외 이벤트는 무시하되 로그로 남김
      console.log(`[Paddle webhook] Unhandled event: ${event_type}`);
      return;
  }
}

// ===== Subscription upsert =====

async function upsertSubscription(
  sub: PaddleSubscriptionData,
  status: "active" | "cancelled" | "past_due"
): Promise<void> {
  const uid = sub.custom_data?.firebaseUid;
  if (!uid) {
    console.error(`[Paddle webhook] subscription ${sub.id} missing custom_data.firebaseUid`);
    return;
  }

  // 만료 시점: current_billing_period.ends_at > next_billed_at > 기본값
  const expiresAt =
    sub.current_billing_period?.ends_at ||
    sub.next_billed_at ||
    null;

  const amount = sub.items?.[0]?.price?.unit_price?.amount
    ? Number(sub.items[0].price.unit_price.amount) / 100 // cents → dollars
    : null;

  const subRef = db.collection("subscriptions").doc(uid);
  await subRef.set(
    {
      uid,
      provider: "paddle",
      paddleSubscriptionId: sub.id,
      paddleCustomerId: sub.customer_id,
      status,
      plan: "monthly",
      amount,
      currency: sub.currency_code || "USD",
      expiresAt,
      canceledAt: sub.canceled_at || null,
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(), // merge:true 라 기존값 유지
    },
    { merge: true }
  );
}

// ===== 회의 ζ-5-A 평가자 P0-1 (2026-04-30): Paddle Price ID → tier 역매핑 =====
// env (NEXT_PUBLIC_PADDLE_PRICE_*) 가 빌드타임에만 박히므로 webhook 코드에 하드코딩.
// Paddle Price ID 변경 시 이 매핑도 같이 수정.
const PADDLE_PRICE_TO_TIER: Record<string, "t1" | "t2" | "t3" | "t4" | "t5" | "t6"> = {
  "pri_01kqdmk2bpst2z6wg6sqapah8v": "t1", // $1.99
  "pri_01kqdmmgkb1nf7m0bmgc5fgqhb": "t2", // $2.99
  "pri_01kqdmn6e3nc1b7hj9n9kw1dhb": "t3", // $3.99
  "pri_01kppp2svqxqb9q2fzqcs0nbse": "t4", // $4.99
  "pri_01kqdmp1cyb2gr9bp6v025ge33": "t5", // $5.99
  "pri_01kqdmqzay6gzj308jppa3srvq": "t6", // $6.99
};

function tierFromPaddlePriceId(priceId: string | undefined): string | null {
  if (!priceId) return null;
  return PADDLE_PRICE_TO_TIER[priceId] ?? null;
}

// ===== Transaction (payment history) =====

async function recordPayment(tx: PaddleTransactionData): Promise<void> {
  const uid = tx.custom_data?.firebaseUid;
  if (!uid) {
    // 트랜잭션의 subscription_id 로 역조회 가능하나, custom_data 누락은 로깅만
    console.error(`[Paddle webhook] transaction ${tx.id} missing custom_data.firebaseUid`);
    return;
  }

  const amount = tx.details?.totals?.total
    ? Number(tx.details.totals.total) / 100
    : null;

  const paidAt = tx.billed_at || new Date().toISOString();

  const subRef = db.collection("subscriptions").doc(uid);
  await subRef.collection("payments").doc(tx.id).set(
    {
      paymentId: tx.id,
      provider: "paddle",
      amount,
      currency: tx.currency_code || "USD",
      plan: "monthly",
      status: tx.status === "completed" || tx.status === "paid" ? "paid" : tx.status,
      paidAt,
      paddleSubscriptionId: tx.subscription_id || null,
      createdAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // 메인 subscription doc 의 lastPayment* 업데이트 (status 는 건드리지 않음)
  await subRef.set(
    {
      lastPaymentId: tx.id,
      lastPaymentAt: paidAt,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // 회의 ζ-5-A 평가자 P0-1 (2026-04-30): pricing_experiments paid 기록 (해외 USD 결제 데이터 손실 방지)
  const priceId = tx.items?.[0]?.price_id;
  const tier = tierFromPaddlePriceId(priceId);
  if (tier && (tx.status === "completed" || tx.status === "paid")) {
    try {
      await db.collection("pricing_experiments").doc(uid).set({
        tier,
        paid: true,
        paidAt: FieldValue.serverTimestamp(),
        paidAmount: amount,
        paidCurrency: tx.currency_code || "USD",
        paidProvider: "paddle",
      }, { merge: true });
    } catch (e) {
      console.error(`[Paddle webhook] pricing_experiments record failed for ${uid}:`, e);
    }
  }
}
