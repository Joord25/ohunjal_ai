"use client";

import { useEffect } from "react";

/**
 * Sets --safe-area-bottom CSS variable on <html>.
 *
 * 회의 2026-04-28 (재): 브라우저 vs PWA standalone 동작 차이 핵심.
 * - 모바일 브라우저: viewport(100dvh)가 시스템 nav 위까지만 잡힘 → padding 0이어도 안 가려짐
 * - 안드 PWA: 풀스크린 모드라 viewport가 nav 뒤까지 확장 → env(safe-area-inset-bottom)으로 회피 필수
 * - iOS PWA: env이 ~34px로 과해서 12px 고정
 * - PC: 4px (브라우저 윈도우 하단과 약간 여유)
 */
export function useSafeArea() {
  useEffect(() => {
    function update() {
      const isDesktop = window.matchMedia("(min-width: 640px)").matches;
      if (isDesktop) {
        document.documentElement.style.setProperty("--safe-area-bottom", "4px");
        return;
      }

      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true;
      const isIOS = (navigator as unknown as { standalone?: boolean }).standalone === true
        || /iPhone|iPad|iPod/.test(navigator.userAgent);

      if (isIOS && isStandalone) {
        // iOS PWA: 홈 인디케이터 회피 — env(~34px)는 과해서 12px 고정.
        document.documentElement.style.setProperty("--safe-area-bottom", "12px");
        return;
      }

      // 모바일 (브라우저 + 안드 PWA): PhoneFrame height가 이미 nav 영역 제외(calc(100dvh - env))
      // 했으므로 추가 padding 0 → BottomTabs가 PhoneFrame 하단 = nav top과 동일선상.
      document.documentElement.style.setProperty("--safe-area-bottom", "0px");
    }

    update();

    // Re-check on display mode change or viewport resize
    const mql = window.matchMedia("(display-mode: standalone)");
    mql.addEventListener("change", update);
    window.addEventListener("resize", update);

    return () => {
      mql.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);
}
