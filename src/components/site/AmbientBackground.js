"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ambient animated backdrop used behind hero sections and page headers.
 *
 * Layers, all compositor-only (transform/opacity) except the two explicitly
 * called out below, so it costs no layout or paint work per frame and stays
 * smooth on low-end laptops and phones:
 *   1. depth wash & vignette  — static gradients, the fix for a flat/white hero
 *   2. drifting colour orbs   — soft radial gradients, no blur() filter
 *   3. measurement grid       — static, masked at the edges
 *   4. depth contours         — one seamless-looping SVG translation
 *   5. sensor ripples         — three delayed rings from the focal point
 *   6. film grain             — static noise texture, painted once
 *
 * `variant="hero"` is the full composition, including a fourth, multiply-
 * blended orb that is what actually reads as "depth" rather than more pale
 * gradient. `variant="subtle"` keeps the lighter set, for page headers that
 * must not compete with their content. All of it is switched off under
 * prefers-reduced-motion (see globals.css).
 */

/**
 * One long, shallow wave repeating every 600 units across a 2400 viewBox, so
 * the path tiles seamlessly and reads as a depth contour rather than a ripple.
 * Amplitude is deliberately tiny — this is texture, not decoration.
 */
const WAVE_PATH = (y, amplitude) =>
  `M0,${y} q150,${-amplitude} 300,0 t300,0 t300,0 t300,0 t300,0 t300,0 t300,0 t300,0`;

const CONTOUR_LINES = [
  { y: 92, amplitude: 11, opacity: 0.11, width: 1.25 },
  { y: 122, amplitude: 10, opacity: 0.095, width: 1 },
  { y: 152, amplitude: 9, opacity: 0.08, width: 1 },
  { y: 182, amplitude: 8, opacity: 0.065, width: 1 },
  { y: 212, amplitude: 7, opacity: 0.05, width: 1 },
  { y: 242, amplitude: 6, opacity: 0.04, width: 1 },
  { y: 272, amplitude: 5, opacity: 0.03, width: 1 },
];

function Contours() {
  const svg = (
    <svg viewBox="0 0 2400 300" preserveAspectRatio="none" aria-hidden="true">
      {CONTOUR_LINES.map((line) => (
        <path
          key={line.y}
          d={WAVE_PATH(line.y, line.amplitude)}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={line.width}
          strokeOpacity={line.opacity}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );

  return (
    <div className="jj-contours">
      {svg}
      {svg}
    </div>
  );
}

export default function AmbientBackground({
  variant = "hero",
  focal = { x: "72%", y: "46%" },
  fade = true,
  className = "",
}) {
  const isHero = variant === "hero";
  const ref = useRef(null);
  const [active, setActive] = useState(true);

  // Once the backdrop scrolls off screen its animations are pure waste, so they
  // are paused until it comes back into view.
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "120px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-active={active ? "true" : "false"}
      className={`jj-ambient ${className}`}
    >
      <div className="jj-hero-wash" />
      <div className="jj-orb jj-orb-a" />
      <div className="jj-orb jj-orb-b" />
      <div className="jj-orb jj-orb-c" />
      {isHero ? <div className="jj-orb jj-orb-d" /> : null}
      <div className="jj-grid" />

      {isHero ? (
        <>
          <Contours />
          <div
            className="absolute hidden h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 lg:block"
            style={{ left: focal.x, top: focal.y }}
          >
            <div className="jj-ripple" />
            <div className="jj-ripple jj-ripple-2" />
            <div className="jj-ripple jj-ripple-3" />
          </div>
        </>
      ) : null}

      <div className="jj-grain" />
      <div className="jj-hero-vignette" />
      {fade ? <div className="jj-ambient-fade" /> : null}
    </div>
  );
}
