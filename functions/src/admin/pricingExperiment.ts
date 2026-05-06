import { onRequest } from "firebase-functions/v2/https";
import { verifyAdmin, db } from "../helpers";

/**
 * POST /adminPricingExperiment
 * Admin only — pricing_experiments 컬렉션 집계 (locale 분리, 단일 가격).
 *
 * 회의 ζ-5-A (2026-04-30): 가격 실험 시작 (6 tier × 2 locale = 12행).
 * 가격 실험 종료 (2026-05-06): 단일 가격 ₩1,900 / $1.99 고정 → KO/EN 2행 합산.
 * 과거 tier 할당 데이터는 컬렉션에 보존, 집계만 locale 차원으로 단순화.
 *
 * Response:
 * {
 *   rows: [{ tier:"all", locale, price, currency, assignedCount, paywallViews,
 *            paidCount, conversionRate, paymentConversionRate, revenuePerAssignedKrw }, ...],  // 2 rows
 *   total: { assignedCount, paywallViews, paidCount },
 *   byLocale: { ko: {...}, en: {...} },
 *   updatedAt: ISO,
 * }
 */

const FIXED_KRW = 1900;
const FIXED_USD = 1.99;
const LOCALES = ["ko", "en"] as const;
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

      const buckets: Record<"ko" | "en", { assigned: number; views: number; paid: number }> = {
        ko: { assigned: 0, views: 0, paid: 0 },
        en: { assigned: 0, views: 0, paid: 0 },
      };

      let totalAssigned = 0;
      let totalViews = 0;
      let totalPaid = 0;

      snap.forEach(doc => {
        const data = doc.data();
        const localeRaw = data?.locale as string | undefined;
        const locale: typeof LOCALES[number] = localeRaw === "en" ? "en" : "ko";

        const b = buckets[locale];
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

      const rows = LOCALES.map(locale => {
        const b = buckets[locale];
        const price = locale === "ko" ? FIXED_KRW : FIXED_USD;
        const priceKrw = locale === "ko" ? FIXED_KRW : Math.round(FIXED_USD * USD_TO_KRW);
        const conversionRate = b.assigned > 0 ? b.paid / b.assigned : 0;
        const paymentConversionRate = b.views > 0 ? b.paid / b.views : 0;
        const revenuePerAssignedKrw = Math.round(priceKrw * conversionRate);
        return {
          tier: "all",
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
      });

      const localeBreakdown: Record<"ko" | "en", { assignedCount: number; paywallViews: number; paidCount: number }> = {
        ko: { assignedCount: buckets.ko.assigned, paywallViews: buckets.ko.views, paidCount: buckets.ko.paid },
        en: { assignedCount: buckets.en.assigned, paywallViews: buckets.en.views, paidCount: buckets.en.paid },
      };

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
