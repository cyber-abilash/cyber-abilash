"use client";

import { useSyncExternalStore, useRef, useEffect, type RefObject } from "react";
import { gsap } from "./gsap-config";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * Idiomatic React 19 hook to detect if the user prefers reduced motion
 */
export function useReducedMotionPreference(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

function subscribeScroll(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("scroll", callback, { passive: true });
  window.addEventListener("resize", callback, { passive: true });
  return () => {
    window.removeEventListener("scroll", callback);
    window.removeEventListener("resize", callback);
  };
}

function getScrollSnapshot(): number {
  if (typeof window === "undefined") return 0;
  const scrollY = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  return docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
}

function getScrollServerSnapshot(): number {
  return 0;
}

/**
 * Idiomatic React 19 hook tracking normalized scroll progress [0, 1]
 */
export function useScrollProgress(): number {
  return useSyncExternalStore(
    subscribeScroll,
    getScrollSnapshot,
    getScrollServerSnapshot
  );
}

/**
 * Magnetic button / card hover effect for cyber HUD interactions
 */
export function useMagneticHover<T extends HTMLElement>(
  strength: number = 0.35
): RefObject<T | null> {
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || typeof window === "undefined") return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return elementRef;
}
