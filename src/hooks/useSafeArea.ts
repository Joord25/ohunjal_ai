"use client";

import { useEffect } from "react";

/**
 * Sets --safe-area-bottom CSS variable on <html>.
 *
 * - If env(safe-area-inset-bottom) > 0 (iOS, some Android): uses it directly
 * - If env() returns 0 AND in standalone PWA: uses a small fallback (12px)
 *   to prevent overlap with Android gesture/button nav bar
 * - Browser mode: 0px (browser chrome handles spacing)
 */
export function useSafeArea() {
  useEffect(() => {
    function update() {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true;

      // Check if CSS env() provides a real value
      const test = document.createElement("div");
      test.style.paddingBottom = "env(safe-area-inset-bottom)";
      document.body.appendChild(test);
      const envValue = parseInt(getComputedStyle(test).paddingBottom) || 0;
      document.body.removeChild(test);

      if (isStandalone) {
        // PWA 모드: iOS/Android 모두 고정값 사용
        // iOS: env(safe-area-inset-bottom)은 ~34px로 너무 커서 네비 바가 붕 뜸
        const isIOS = (navigator as unknown as { standalone?: boolean }).standalone === true
          || /iPhone|iPad|iPod/.test(navigator.userAgent);
        document.documentElement.style.setProperty(
          "--safe-area-bottom",
          isIOS ? "12px" : "24px"
        );
      } else if (envValue > 0) {
        // 브라우저 모드 + safe-area 지원 기기: 축소 적용
        document.documentElement.style.setProperty(
          "--safe-area-bottom",
          "12px"
        );
      } else {
        // Regular browser: browser chrome provides spacing
        document.documentElement.style.setProperty("--safe-area-bottom", "0px");
      }
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
