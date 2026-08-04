"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor-magnetic wrapper — the child eases toward the pointer as it
 * approaches, then springs back once the pointer leaves. A common "premium
 * button" micro-interaction; pure CSS transform, no dependency needed.
 *
 * Tracked on `window` with an inside/outside rect check (the same pattern as
 * CursorSpotlight and TiltCard) rather than onMouseMove/onMouseLeave on the
 * element itself — React's synthetic mouseleave proved unreliable to trigger
 * consistently, so "is the pointer within bounds right now" is recomputed on
 * every move instead of depending on a discrete leave event firing.
 */
export default function Magnetic({ children, strength = 0.35, className = "" }) {
  const ref = useRef(null);
  const frameRef = useRef(null);
  const insideRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia("(hover: none)").matches) return undefined;

    const reset = () => {
      el.style.transform = "translate(0px, 0px)";
    };

    const onPointerMove = (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

      if (!inside) {
        if (insideRef.current) reset();
        insideRef.current = false;
        return;
      }
      insideRef.current = true;

      const offsetX = (x - rect.width / 2) * strength;
      const offsetY = (y - rect.height / 2) * strength;

      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`jj-magnetic ${className}`}>
      {children}
    </div>
  );
}
