import { onRequest } from "firebase-functions/v2/https";
import { verifyAdmin, db } from "../helpers";

/**
 * POST /adminPricingExperiment
 * Admin only — pricing_experiments 컬렉션 집계 (tier × locale 분리).
 *
 * 회의 ζ-5-A (2026-04-30): 가격 실험 + locale 행 분리 (대표 지시).
 *
 * Response:
 * {
 *   rows: [
 *     { tier, locale: "ko" | "en", price, currency, assignedCount, paywallViews,
 *       paidCount, conversionRate, paymentConversionRate, revenuePerAssignedKrw },
 *     ...  // 6 tier × 2 locale = 12 rows
 *   ],
 *   total: { assignedCount, paywallViews, paidCount },
 *   updatedAt: ISO,
 * }
 */

const TIER_KRW: Record<string, number> = {
  t1: 990, t2: 1900, t3: 2900, t4: 3900, t5: 4900, t6: 5900,
};
const TIER_USD: Record<string, number> = {
  t1: 1.99, t2: 2.99, t3: 3.99, t4: 4.99, t5: 5.99, t6: 6.99,
};
const TIERS = ["t1", "t2", "t3", "t4", "t5", "t6"] as const;
const LOCALES = ["ko", "en"] as const;

// 매출/할당 → KRW 통일 비교 위한 USD→KRW 환산 (대략)
const USD_TO_KRW = 1400;

export const adminPricingExperiment = onRequest(
  { cors: true },
  async (req, res) => {
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

    try { await verifyAdmin(req.headers.authorization); } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unauthorized";
      res.status(msg.includes("Forbidden") ? 403 : 401).json({ error: msg });
      return;
    }

    try {
      const snap = await db.collection("pricing_experiments").get();

      // [tier][locale] = stats
      const buckets: Record<string, Record<string, { assigned: number; views: number; paid: number }>> = {};
      for (const tier of TIERS) {
        buckets[tier] = {};
        for (const locale of LOCALES) {
          buckets[tier][locale] = { assigned: 0, views: 0, paid: 0 };
        }
      }

      let totalAssigned = 0;
      let totalViews = 0;
      let totalPaid = 0;

      snap.forEach(doc => {
        const data = doc.data();
        const tier = data?.tier as string | undefined;
        if (!tier || !TIERS.includes(tier as typeof TIERS[number])) return;
        const localeRaw = data?.locale as string | undefined;
        const locale: typeof LOCALES[number] = localeRaw === "en" ? "en" : "ko"; // 미설정 doc 은 ko fallback

        const b = buckets[tier][locale];
        b.assigned += 1;
        totalAssigned += 1;
        const views = typeof data?.paywallViews === "number" ? data.paywallViews : 0;
        b.views += views;
        totalViews += views;
        if (data?.paid === true) {
          b.paid += 1;
          totalPaid += 1;
        }
      });

      const rows = TIERS.flatMap(tier =>
        LOCALES.map(locale => {
          const b = buckets[tier][locale];
          const price = locale === "ko" ? TIER_KRW[tier] : TIER_USD[tier];
          const priceKrw = locale === "ko" ? TIER_KRW[tier] : Math.round(TIER_USD[tier] * USD_TO_KRW);
          const conversionRate = b.assigned > 0 ? b.paid / b.assigned : 0;
          const paymentConversionRate = b.views > 0 ? b.paid / b.views : 0;
          const revenuePerAssignedKrw = Math.round(priceKrw * conversionRate);
          return {
            tier,
            locale,
            price,
            currency: locale === "ko" ? "KRW" : "USD",
            assignedCount: b.assigned,
            paywallViews: b.views,
            paidCount: b.paid,
            conversionRate,
            paymentConversionRate,
            revenuePerAssignedKrw,
          };
        })
      );

      // 회의 ζ-5-A 평가자 P1-7 (2026-04-30): 통화별 분리 합계 — KO/EN cohort LTV 비대칭 비교 방지.
      const localeBreakdown: Record<"ko" | "en", { assignedCount: number; paywallViews: number; paidCount: number }> = {
        ko: { assignedCount: 0, paywallViews: 0, paidCount: 0 },
        en: { assignedCount: 0, paywallViews: 0, paidCount: 0 },
      };
      for (const tier of TIERS) {
        for (const locale of LOCALES) {
          const b = buckets[tier][locale];
          localeBreakdown[locale].assignedCount += b.assigned;
          localeBreakdown[locale].paywallViews += b.views;
          localeBreakdown[locale].paidCount += b.paid;
        }
      }

      res.status(200).json({
        rows,
        total: { assignedCount: totalAssigned, paywallViews: totalViews, paidCount: totalPaid },
        byLocale: localeBreakdown,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("adminPricingExperiment error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "집계 실패" });
    }
  }
);
