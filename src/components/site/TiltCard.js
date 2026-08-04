"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor-driven 3D tilt + glare — the card leans away from the pointer like
 * an object being turned in the light, with a soft highlight sweeping across
 * it in step. This is the interactive-card pattern behind most "premium"
 * product shots (Stripe, Linear, and Apple's product pages all use a version
 * of it): pure CSS perspective + transform driven by pointer position, no
 * WebGL involved.
 *
 * Tracked on `window` rather than via onMouseMove/onMouseLeave on the card
 * itself — React's synthetic mouseleave (derived from mouseout + relatedTarget
 * bookkeeping) proved unreliable to trigger consistently. A single
 * window-level pointermove plus an inside/outside rect check, the same
 * pattern CursorSpotlight uses, sidesteps that entirely: the reset is just
 * "is the pointer currently within these bounds," recomputed on every move,
 * not a discrete enter/leave event that has to fire correctly.
 */
export default function TiltCard({ children, className = "", maxTilt = 8 }) {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const frameRef = useRef(null);
  const insideRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return undefined;
    if (window.matchMedia("(hover: none)").matches) return undefined; // no cursor to tilt toward on touch

    const applyTilt = (px, py) => {
      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
      if (glareRef.current) {
        glareRef.current.style.opacity = "1";
        glareRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.35), transparent 60%)`;
      }
    };

    const resetTilt = () => {
      card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      if (glareRef.current) glareRef.current.style.opacity = "0";
    };

    const onPointerMove = (event) => {
      const rect = wrap.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

      if (!inside) {
        if (insideRef.current) resetTilt();
        insideRef.current = false;
        return;
      }
      insideRef.current = true;

      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => applyTilt(x / rect.width, y / rect.height));
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [maxTilt]);

  return (
    <div ref={wrapRef} className={className}>
      <div ref={cardRef} className="jj-tilt-card relative">
        {children}
        <div ref={glareRef} aria-hidden="true" className="jj-tilt-glare rounded-[40px]" />
      </div>
    </div>
  );
}
