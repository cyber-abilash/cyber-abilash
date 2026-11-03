"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap-config";
import SceneContainer from "@/components/canvas/scene-container";

interface SmoothScrollContextType {
  getLenis: () => Lenis | null;
  scrollTo: (
    target: string | HTMLElement | number,
    options?: { offset?: number; immediate?: boolean; duration?: number }
  ) => void;
  stop: () => void;
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  getLenis: () => null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Run Lenis within GSAP ticker for 120Hz/60Hz frame synchronization
    const updateRaf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(0);

    // Initial ScrollTrigger refresh
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(updateRaf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = (
    target: string | HTMLElement | number,
    options?: { offset?: number; immediate?: boolean; duration?: number }
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    } else if (typeof target === "string" && target.startsWith("#")) {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stop = () => {
    lenisRef.current?.stop();
  };

  const start = () => {
    lenisRef.current?.start();
  };

  const getLenis = () => lenisRef.current;

  return (
    <SmoothScrollContext.Provider
      value={{
        getLenis,
        scrollTo,
        stop,
        start,
      }}
    >
      <SceneContainer />
      <div className="relative z-10 flex min-h-full flex-1 flex-col">
        {children}
      </div>
    </SmoothScrollContext.Provider>
  );
}
