import { describe, test, expect, beforeEach, vi } from "vitest";

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(k: string) { return this.store.get(k) ?? null; }
  setItem(k: string, v: string) { this.store.set(k, String(v)); }
  removeItem(k: string) { this.store.delete(k); }
  clear() { this.store.clear(); }
  key(i: number) { return Array.from(this.store.keys())[i] ?? null; }
  get length() { return this.store.size; }
}

const listeners = new Map<string, Set<EventListener>>();
const fakeWindow = {
  addEventListener(event: string, handler: EventListener) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event)!.add(handler);
  },
  removeEventListener(event: string, handler: EventListener) {
    listeners.get(event)?.delete(handler);
  },
  dispatchEvent(e: Event) {
    listeners.get(e.type)?.forEach((h) => h(e));
    return true;
  },
};

vi.stubGlobal("localStorage", new MemoryStorage());
vi.stubGlobal("window", fakeWindow);
vi.stubGlobal("CustomEvent", class<T = unknown> extends Event {
  detail: T;
  constructor(type: string, init?: { detail: T }) {
    super(type);
    this.detail = init?.detail as T;
  }
});

const {
  getBeginnerMode,
  setBeginnerMode,
  isBeginnerModeUndecided,
  BEGINNER_MODE_STORAGE_KEY,
} = await import("../beginnerMode");

describe("beginnerMode helpers", () => {
  beforeEach(() => {
    localStorage.clear();
    listeners.clear();
  });

  test("getBeginnerMode returns undefined when nothing set", () => {
    expect(getBeginnerMode()).toBeUndefined();
    expect(isBeginnerModeUndecided()).toBe(true);
  });

  test("setBeginnerMode(true) persists '1' and reads back true", () => {
    setBeginnerMode(true);
    expect(localStorage.getItem(BEGINNER_MODE_STORAGE_KEY)).toBe("1");
    expect(getBeginnerMode()).toBe(true);
    expect(isBeginnerModeUndecided()).toBe(false);
  });

  test("setBeginnerMode(false) persists '0' and reads back false", () => {
    setBeginnerMode(false);
    expect(localStorage.getItem(BEGINNER_MODE_STORAGE_KEY)).toBe("0");
    expect(getBeginnerMode()).toBe(false);
    expect(isBeginnerModeUndecided()).toBe(false);
  });

  test("malformed values fall through to undefined", () => {
    localStorage.setItem(BEGINNER_MODE_STORAGE_KEY, "yes");
    expect(getBeginnerMode()).toBeUndefined();
    expect(isBeginnerModeUndecided()).toBe(true);
  });

  test("setBeginnerMode dispatches beginner_mode_change event", () => {
    let received: boolean | undefined;
    const handler = (e: Event) => {
      received = (e as CustomEvent<{ enabled: boolean }>).detail.enabled;
    };
    window.addEventListener("beginner_mode_change", handler);
    setBeginnerMode(true);
    expect(received).toBe(true);
    setBeginnerMode(false);
    expect(received).toBe(false);
    window.removeEventListener("beginner_mode_change", handler);
  });
});
