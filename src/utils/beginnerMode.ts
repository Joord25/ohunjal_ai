const STORAGE_KEY = "ohunjal_beginner_mode";

export type BeginnerModeValue = "1" | "0";

export function getBeginnerMode(): boolean | undefined {
  if (typeof window === "undefined") return undefined;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === "1") return true;
  if (raw === "0") return false;
  return undefined;
}

export function setBeginnerMode(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  window.dispatchEvent(new CustomEvent("beginner_mode_change", { detail: { enabled } }));
}

export function isBeginnerModeUndecided(): boolean {
  return getBeginnerMode() === undefined;
}

export const BEGINNER_MODE_STORAGE_KEY = STORAGE_KEY;
export const BEGINNER_MODE_EVENT = "beginner_mode_change";
