"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Ensure GSAP plugins are registered safely on the client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  // Set default timing and easing for classified cinematic transitions
  gsap.defaults({
    ease: "power3.out",
    duration: 1.2,
  });

  // Optimize ScrollTrigger refresh behavior
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
    ignoreMobileResize: true,
  });
}

export { gsap, ScrollTrigger, useGSAP };

