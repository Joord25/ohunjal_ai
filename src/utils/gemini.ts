import { UserCondition, WorkoutGoal, WorkoutSessionData, ExerciseLog, WorkoutAnalysis } from "@/constants/workout";
import { buildWorkoutMetrics, HistoryTrendSummary } from "@/utils/workoutMetrics";
import { auth } from "@/lib/firebase";

// Helper: get current user's ID token for authenticated requests
async function getIdToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return user.getIdToken();
}

// Functions base URL
const FUNCTIONS_BASE = "/api";

export const analyzeWorkoutSession = async (
  sessionData: WorkoutSessionData,
  logs: Record<number, ExerciseLog[]>,
  bodyWeightKg?: number,
  gender?: "male" | "female",
  birthYear?: number,
  historyStats?: { avgVolume28d: number; sessionCount: number } | null,
  historyTrend?: HistoryTrendSummary | null,
  intensityContext?: {
    sessionIntensity: { level: string; avgPercentile1RM: number | null; avgRepsPerSet: number };
    weekSummary: { high: number; moderate: number; low: number };
    target: { high: number; moderate: number; low: number };
    nextRecommended: string;
  } | null,
): Promise<WorkoutAnalysis | null> => {
  try {
    const token = await getIdToken();
    const metrics = buildWorkoutMetrics(sessionData.exercises, logs, bodyWeightKg);

    const response = await fetch(`${FUNCTIONS_BASE}/analyzeWorkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        sessionData,
        logs,
        bodyWeightKg,
        gender,
        birthYear,
        historyStats,
        historyTrend,
        metrics,
        intensityContext,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${response.status}`);
    }

    return await response.json() as WorkoutAnalysis;
  } catch (error) {
    console.error("Failed to analyze workout:", error);
    return null;
  }
};

export const generateAIWorkoutPlan = async (
  condition: UserCondition,
  goal: WorkoutGoal,
  dayName: string,
  selectedSessionType?: string,
  intensityContext?: {
    recommended: "high" | "moderate" | "low";
    weekSummary: { high: number; moderate: number; low: number };
    target: { high: number; moderate: number; low: number };
    reason: string;
  } | null,
): Promise<WorkoutSessionData | null> => {
  try {
    const token = await getIdToken();

    const response = await fetch(`${FUNCTIONS_BASE}/generateWorkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        condition,
        goal,
        dayName,
        selectedSessionType,
        intensityContext,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${response.status}`);
    }

    return await response.json() as WorkoutSessionData;
  } catch (error) {
    console.error("Failed to generate workout with Functions:", error);
    return null;
  }
};
