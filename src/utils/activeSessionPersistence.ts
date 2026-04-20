/**
 * 회의 64-γ (2026-04-20): 모바일 백그라운드 복귀 시 운동 세션 유실 방지.
 * iOS Safari / Android Chrome / 카톡·인스타 인앱 웹뷰가 메모리 압박 시 페이지를 discard 하여
 * 운동 중 창을 숨겼다가 돌아오면 새로고침되며 진행 상황이 날아가는 문제 해결.
 *
 * 전략: 진행 상태를 localStorage에 실시간 백업 → 앱 재시작 시 자동 복원(배너 없이 바로 재진입).
 * TTL 12시간 초과 시 자동 폐기(어제 하다 만 세션이 유령처럼 떠오르지 않게).
 */
import type {
  WorkoutSessionData,
  UserCondition,
  WorkoutGoal,
  ExerciseLog,
  ExerciseStep,
  ExerciseTiming,
  RunningStats,
  SessionSelection,
} from "@/constants/workout";

const KEY = "ohunjal_active_session";
const TTL_MS = 12 * 60 * 60 * 1000; // 12시간
const SCHEMA_V = 1;

export type ActiveSessionProgress = {
  exercises: ExerciseStep[];
  currentExerciseIndex: number;
  currentSet: number;
  logs: Record<number, ExerciseLog[]>;
  timings: ExerciseTiming[];
  sessionStartEpoch: number;
  exerciseStartEpoch: number;
  runningStats?: RunningStats | null;
  showAddExercise?: boolean;
};

export type ActiveSessionSnapshot = {
  v: number;
  view: "master_plan_preview" | "workout_session";
  sessionData: WorkoutSessionData;
  planSource?: "chat" | "saved" | "program" | "resume";
  activeSavedPlanId?: string | null;
  condition?: UserCondition | null;
  goal?: WorkoutGoal | null;
  session?: SessionSelection | null;
  recommendedIntensity?: "high" | "moderate" | "low" | null;
  previewExercises?: ExerciseStep[];
  progress?: ActiveSessionProgress;
  updatedAt: number;
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function saveActiveSession(
  snap: Omit<ActiveSessionSnapshot, "v" | "updatedAt">
): void {
  if (!isBrowser()) return;
  try {
    const full: ActiveSessionSnapshot = { ...snap, v: SCHEMA_V, updatedAt: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(full));
  } catch {
    /* quota / disabled storage */
  }
}

export function loadActiveSession(): ActiveSessionSnapshot | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveSessionSnapshot;
    if (!parsed || parsed.v !== SCHEMA_V || typeof parsed.updatedAt !== "number") {
      clearActiveSession();
      return null;
    }
    if (Date.now() - parsed.updatedAt > TTL_MS) {
      clearActiveSession();
      return null;
    }
    if (!parsed.sessionData || !Array.isArray(parsed.sessionData.exercises)) {
      clearActiveSession();
      return null;
    }
    return parsed;
  } catch {
    clearActiveSession();
    return null;
  }
}

/**
 * 기존 snapshot이 있을 때만 부분 갱신(progress/previewExercises 등 하위 필드).
 * snapshot이 없으면 no-op — 최초 생성은 saveActiveSession 으로 명시 호출.
 */
export function updateActiveSession(patch: Partial<ActiveSessionSnapshot>): void {
  if (!isBrowser()) return;
  const existing = loadActiveSession();
  if (!existing) return;
  try {
    const merged: ActiveSessionSnapshot = {
      ...existing,
      ...patch,
      v: SCHEMA_V,
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(KEY, JSON.stringify(merged));
  } catch {
    /* quota */
  }
}

export function clearActiveSession(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* disabled storage */
  }
}
