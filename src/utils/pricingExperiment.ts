"use client";

/**
 * 회의 ζ-5-A (2026-04-30): 가격 실험 모듈.
 *
 * 6 tier deterministic 할당 — uid 해시 → mod 6 → 한 유저 평생 같은 가격.
 *
 * 통화 분기:
 * - locale="ko" → KRW (990 / 1900 / 2900 / 3900 / 4900 / 5900) → PortOne 동적 amount
 * - locale!="ko" → USD ($1.99 / 2.99 / 3.99 / 4.99 / 5.99 / 6.99) → Paddle Price ID
 *
 * Firestore: pricing_experiments/{uid}
 *   - tier: PricingTier
 *   - assignedAt: Timestamp
 *   - paywallViews: number (increment)
 *   - lastPaywallAt: Timestamp
 *   - paid: boolean
 *   - paidAt: Timestamp
 *   - paidAmount: number (KRW or USD cents)
 *   - paidCurrency: "KRW" | "USD"
 *   - paidProvider: "portone" | "paddle"
 *
 * 분석: paywall_views vs paid count → 전환율. (price × 전환율) → ARPU 도출 → 최적가 결정.
 */

import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp, increment } from "firebase/firestore";
import { trackEvent } from "@/utils/analytics";

export type PricingTier = "t1" | "t2" | "t3" | "t4" | "t5" | "t6";

const TIERS: PricingTier[] = ["t1", "t2", "t3", "t4", "t5", "t6"];

/** 한국 KRW 가격 — PortOne 결제 amount 로 직접 사용 */
export const KRW_BY_TIER: Record<PricingTier, number> = {
  t1: 990,
  t2: 1900,
  t3: 2900,
  t4: 3900,
  t5: 4900,
  t6: 5900,
};

/** 해외 USD 가격 — UI 표시용 (실제 결제는 Paddle Price ID 통해) */
export const USD_BY_TIER: Record<PricingTier, number> = {
  t1: 1.99,
  t2: 2.99,
  t3: 3.99,
  t4: 4.99,
  t5: 5.99,
  t6: 6.99,
};

/** Paddle Price ID — env 에서 6개 읽음 */
const PADDLE_PRICE_ID_BY_TIER: Record<PricingTier, string> = {
  t1: process.env.NEXT_PUBLIC_PADDLE_PRICE_199 ?? "",
  t2: process.env.NEXT_PUBLIC_PADDLE_PRICE_299 ?? "",
  t3: process.env.NEXT_PUBLIC_PADDLE_PRICE_399 ?? "",
  t4: process.env.NEXT_PUBLIC_PADDLE_PRICE_499 ?? "",
  t5: process.env.NEXT_PUBLIC_PADDLE_PRICE_599 ?? "",
  t6: process.env.NEXT_PUBLIC_PADDLE_PRICE_699 ?? "",
};

export function getPaddlePriceIdForTier(tier: PricingTier): string {
  return PADDLE_PRICE_ID_BY_TIER[tier];
}

/** uid 해시 → tier index. DJB2 변형. */
function hashUid(uid: string): number {
  let h = 5381;
  for (let i = 0; i < uid.length; i++) {
    h = ((h * 33) ^ uid.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getTierForUid(uid: string): PricingTier {
  return TIERS[hashUid(uid) % 6];
}

/**
 * 유저의 tier 조회. Firestore 에 doc 있으면 그 tier 사용 (이미 할당됨).
 * 없으면 새로 할당 + Firestore 기록 + GA 이벤트.
 *
 * 같은 유저가 두 번째 호출하면 첫 호출에서 박힌 tier 그대로 반환 → "한 유저 평생 한 가격" 보장.
 *
 * @param locale "ko" / "en" — admin 분석 시 한국·해외 행 분리용. 첫 할당 때 박힘.
 */
export async function getOrAssignTier(uid: string, locale: "ko" | "en" = "ko"): Promise<PricingTier> {
  const ref = doc(db, "pricing_experiments", uid);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      if (data?.tier && TIERS.includes(data.tier as PricingTier)) {
        return data.tier as PricingTier;
      }
    }
  } catch (e) {
    console.warn("[pricingExperiment] getDoc failed, falling back to deterministic hash", e);
    return getTierForUid(uid);
  }
  const tier = getTierForUid(uid);
  try {
    await setDoc(ref, {
      tier,
      locale,
      assignedAt: serverTimestamp(),
      paywallViews: 0,
      paid: false,
    }, { merge: true });
    trackEvent("pricing_experiment_assigned", { tier, locale });
  } catch (e) {
    console.warn("[pricingExperiment] setDoc failed", e);
  }
  return tier;
}

/** Paywall 노출 시 호출 — Firestore 카운터 증가 + GA */
export async function recordPaywallView(tier: PricingTier, source?: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  trackEvent("pricing_experiment_paywall_view", { tier, source: source ?? "unknown" });
  try {
    const ref = doc(db, "pricing_experiments", uid);
    await setDoc(ref, {
      tier,
      paywallViews: increment(1),
      lastPaywallAt: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.warn("[pricingExperiment] recordPaywallView failed", e);
  }
}

/**
 * 결제 완료 시 호출 — GA 이벤트만 발화.
 * 회의 ζ-5-A 평가자 P0-2 (2026-04-30): paid 필드 Firestore write 는 서버 admin SDK 만 허용 (위변조 방지).
 * → FE 는 GA 만, 실제 paid 기록은 PortOne `/subscribe` Cloud Function + Paddle webhook 이 담당.
 */
export async function recordPaywallPaid(
  tier: PricingTier,
  amount: number,
  currency: "KRW" | "USD",
  provider: "portone" | "paddle",
): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  trackEvent("pricing_experiment_paid", { tier, amount, currency, provider });
}

/** 표시용: locale 기반 가격 문자열 ("₩2,900" / "$2.99") */
export function formatPriceForLocale(tier: PricingTier, locale: "ko" | "en"): string {
  if (locale === "ko") {
    return `₩${KRW_BY_TIER[tier].toLocaleString("ko-KR")}`;
  }
  return `$${USD_BY_TIER[tier].toFixed(2)}`;
}
