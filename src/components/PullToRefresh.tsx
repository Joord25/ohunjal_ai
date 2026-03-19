"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";

const THRESHOLD = 80;
const MAX_PULL = 120;

export const PullToRefresh: React.FC<{ children: React.ReactNode; enabled?: boolean }> = ({ children, enabled = true }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const startYRef = useRef(0);
  const pullingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect standalone mode on client only to avoid SSR hydration mismatch
  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
  }, []);

  // Find the nearest scrollable child element
  const getScrollableChild = useCallback((): HTMLElement | null => {
    const container = containerRef.current;
    if (!container) return null;
    // The scrollable element is the overflow-y-auto div inside page content
    const scrollable = container.querySelector("[data-scroll-container]") as HTMLElement | null;
    if (scrollable) return scrollable;
    // Fallback: find first child with overflow scroll/auto
    const children = container.querySelectorAll("*");
    for (const child of children) {
      const style = window.getComputedStyle(child);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        return child as HTMLElement;
      }
    }
    return null;
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isRefreshing) return;
    // Check if the scrollable content is at the top
    const scrollEl = getScrollableChild();
    if (scrollEl && scrollEl.scrollTop > 0) return;
    startYRef.current = e.touches[0].clientY;
    pullingRef.current = true;
  }, [isRefreshing, getScrollableChild]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!pullingRef.current || isRefreshing) return;
    const dy = e.touches[0].clientY - startYRef.current;
    if (dy > 0) {
      const dampened = Math.min(dy * 0.4, MAX_PULL);
      setPullDistance(dampened);
      if (dampened > 10) e.preventDefault();
    } else {
      pullingRef.current = false;
      setPullDistance(0);
    }
  }, [isRefreshing]);

  const handleTouchEnd = useCallback(() => {
    if (!pullingRef.current) return;
    pullingRef.current = false;
    if (pullDistance >= THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(THRESHOLD);
      window.location.reload();
    } else {
      setPullDistance(0);
    }
  }, [pullDistance]);

  useEffect(() => {
    if (!isStandalone || !enabled) return;
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isStandalone, enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Pull indicator */}
      {isStandalone && pullDistance > 10 && (
        <div
          className="absolute left-0 right-0 flex items-center justify-center pointer-events-none"
          style={{
            top: 0,
            height: pullDistance,
            zIndex: 100,
            transition: pullingRef.current ? "none" : "height 0.3s ease-out",
          }}
        >
          <div
            className="w-8 h-8 rounded-full border-[2.5px] border-[#2D6A4F]"
            style={{
              borderTopColor: "transparent",
              transform: `rotate(${progress * 360}deg)`,
              opacity: progress,
              animation: isRefreshing ? "spin 0.6s linear infinite" : "none",
            }}
          />
        </div>
      )}
      {/* Content — only translate when actively pulling */}
      <div
        className="w-full h-full"
        style={{
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
          transition: pullingRef.current ? "none" : "transform 0.3s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
};
