"use client";

import { useEffect, useState } from "react";

/**
 * Entrance animation for content that is visible the instant the page loads —
 * the hero — where `Reveal`'s IntersectionObserver never fires because the
 * element starts in view. Fires once on mount instead, so a whole hero can be
 * choreographed as a sequence via `delay`.
 *
 * Variants (see globals.css for the keyframes):
 *   "wipe"  — curtain-style clip-path reveal, for headlines
 *   "blur"  — soften-into-focus, for supporting text
 *   "pop"   — scale + fade, for badges/buttons
 *   "image" — clip-path + scale settle, for hero imagery
 */
export default function LoadReveal({
  as: Tag = "div",
  variant = "blur",
  delay = 0,
  className = "",
  children,
  ...rest
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // One rAF so the initial (hidden) paint commits first — without it some
    // browsers coalesce the state change into the first frame and skip the
    // animation entirely.
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Tag
      data-shown={shown ? "true" : "false"}
      style={{ animationDelay: `${delay}ms` }}
      className={`jj-load jj-load-${variant} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
