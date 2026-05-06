"use client";

import { useEffect } from "react";

/**
 * Sets --safe-area-bottom CSS variable on <html>.
 *
 * 회의 ζ-3 (2026-04-28): cbad2b5 의 "PhoneFrame height calc(100dvh - env)" 가 안드 PWA 에서
 * env() 가 0 으로 잡히는 케이스 발생 → viewport 가 nav 뒤로 확장 → 화면이 nav 뒤로 숨음.
 * PhoneFrame 100dvh 복원 + useSafeArea 가 환경별 padding 직접 보장:
 * - 안드 PWA: env() 안 잡혀도 fallback 48px 강제 (Android nav bar 평균)
 * - iOS PWA / iOS 사파리: 0px (대표 지시 2026-05-04 — iOS는 하단 여백 불필요)
 * - 모바일 브라우저: 0px (chrome 이 nav 위에서 끝남)
 * - PC: 4px
 */
export function useSafeArea() {
  useEffect(() => {
    function update() {
      const isDesktop = window.matchMedia("(min-width: 640px)").matches;
      if (isDesktop) {
        document.documentElement.style.setProperty("--safe-area-bottom", "4px");
        return;
      }

      const isIOS = (navigator as unknown as { standalone?: boolean }).standalone === true
        || /iPhone|iPad|iPod/.test(navigator.userAgent);

      if (isIOS) {
        // iOS (PWA·사파리 공통): 대표 지시 2026-05-04 — 하단 여백 0.
        // 안드는 시스템 nav bar 때문에 padding 필요하지만 iOS는 svh 자체가 home indicator 위에서 끝남.
        document.documentElement.style.setProperty("--safe-area-bottom", "0px");
        // 대표 지시 2026-05-06: 콘텐츠 wrapper paddingBottom 88px magic number 를 iOS 에서만 80px 로 축소.
        // 88px(default, 안드/PC fallback) → BottomTabs 영역(52+16=68) + 여유 12px 적정. 안드/PC 는 미정의 → 88 그대로.
        document.documentElement.style.setProperty("--content-bottom-pad", "80px");
        return;
      }

      // 안드 PWA: 회의 ζ-3 (2026-04-28) — env() 안 잡혀도 fallback 48px 강제 (Android nav bar 평균).
      // 100dvh 채택 시 viewport 가 nav 영역 포함하므로 paddingBottom 으로 회피.
      const isAndroid = /Android/.test(navigator.userAgent);
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      if (isAndroid && isStandalone) {
        document.documentElement.style.setProperty("--safe-area-bottom", "48px");
        return;
      }

      // 그 외 모바일 브라우저 — chrome 이 nav 위에서 끝남 → 추가 padding 0.
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
