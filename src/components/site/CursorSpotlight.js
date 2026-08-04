"use client";

import { useEffect, useRef } from "react";

/**
 * A soft, brand-tinted glow that follows the cursor across its wrapped
 * section — the "spotlight" pattern behind most premium hero sections
 * (Linear, Stripe, Vercel all use a variant of this): a radial-gradient
 * positioned via CSS custom properties, updated directly from pointermove.
 * No requestAnimationFrame needed — the JS thread only ever touches two CSS
 * variables, never layout or the DOM, so the browser's own paint scheduling
 * handles the cost (see the standard technique this follows:
 * https://frontendmasters.com/blog/css-spotlight-effect/).
 *
 * Tracked on `window` rather than this element, because this element stays
 * `pointer-events-none` — it must never intercept clicks meant for the real
 * content stacked above it. Position is computed against this element's own
 * bounding rect, and the glow's opacity turns off outside those bounds so it
 * never lingers at a stale position once the cursor leaves the section.
 */
export default function CursorSpotlight({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // No cursor to spotlight on a touch device.
    if (window.matchMedia("(hover: none)").matches) return undefined;

    const onMove = (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      el.style.setProperty("--spot-x", `${x}px`);
      el.style.setProperty("--spot-y", `${y}px`);
      el.style.setProperty("--spot-opacity", inside ? "1" : "0");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return <div ref={ref} aria-hidden="true" className={`jj-spotlight ${className}`} />;
}
