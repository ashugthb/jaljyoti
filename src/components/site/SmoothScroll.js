"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";

/**
 * Lenis smooth scroll, driven by GSAP's ticker.
 *
 * This is the official integration from the Lenis README
 * (https://github.com/darkroomengineering/lenis/tree/main/packages/react):
 * `autoRaf: false` hands the animation frame to `gsap.ticker`, so Lenis and
 * every ScrollTrigger advance on the same clock. Without it the two run on
 * separate rAF loops and pinned sections visibly lag the scroll position.
 *
 * `lagSmoothing(0)` is the companion call GSAP recommends for this setup — it
 * stops GSAP from trying to "catch up" after a frame drop, which would
 * otherwise fight Lenis's own interpolation.
 */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Smooth scrolling hijacks the native scroll, which is exactly what
    // someone asking for reduced motion is trying to avoid.
    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger's cached positions in step with Lenis.
    const lenis = lenisRef.current?.lenis;
    lenis?.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      lenis?.off("scroll", ScrollTrigger.update);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
