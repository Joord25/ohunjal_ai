import { setGlobalOptions } from "firebase-functions/v2/options";
import "./helpers"; // ensure app is initialized

setGlobalOptions({ region: "us-central1" });

export { getCoachMessage } from "./ai/coach";
export { getNutritionGuide, nutritionChat } from "./ai/nutrition";
// 회의 ζ-5-A (2026-04-30): parseIntent 폐기 (ChatHome 폐기 — WeightHub/RunningHub/HomeWorkoutHub 로 흐름 분산).
// 회의 ζ-5-A 평가자 P1-4 (2026-04-30): getGuestTrialStatus 폐기 (게스트 시스템 통째 제거).
export { planSession, generateProgramSessions } from "./plan/session";
export { savePlan, listSavedPlans, deleteSavedPlan, markSavedPlanUsed, saveProgram, deleteProgram } from "./plan/savedPlans";
export { generateRunningProgramFn, checkFullSub3GateFn } from "./plan/runningProgramApi";
export { subscribe, getSubscription, cancelSubscription, submitRefundRequest } from "./billing/subscription";
export { paddleWebhook } from "./billing/paddleWebhook";
export { expireSubscriptions } from "./billing/expireSubscriptions";
export { renewPortOneSubscriptions } from "./billing/renewPortOneSubscriptions";
export { selfDeleteAccount } from "./billing/selfDelete";
export { adminActivate, adminCheckUser, adminCheckSelf, adminDeactivate, adminDashboard, adminListUsers, adminListPayments, adminLogs, adminCancelFeedbacks, adminRefundRequests, adminProcessRefund } from "./admin/admin";
export { adminAnalyticsFunnel } from "./admin/analyticsFunnel";
export { adminPricingExperiment } from "./admin/pricingExperiment";
// 회의 ζ-5-A (2026-04-30): SEED-003 research/youtube 통째 폐기.
export { generateCatalogProgram } from "./catalog/catalogApi";
