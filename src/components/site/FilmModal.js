"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon, PlayIcon } from "@/components/icons";

/**
 * "Watch the film" — the site's one real playable-video moment. Backed by the
 * actual /video.mp4 already in /public (a lab interview with Prof. Meenu
 * Chhabra), which is footage, not a loop — it plays on demand in a modal
 * rather than as ambient hero background. Follows the same dialog pattern
 * (focus trap, Escape, scroll lock) as GetStarted.js and the gallery Lightbox.
 */
export default function FilmModal({
  src = "/video.mp4",
  poster = "/Prof.MeenuChhabra.jpg",
  title = "Inside the Jaljyoti lab",
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef(null);
  const closeRef = useRef(null);
  const lastFocusedRef = useRef(null);

  // The trigger can end up nested inside an animated ancestor (a hero
  // LoadReveal, say) whose entrance leaves a resolved `transform` behind —
  // any non-"none" transform on an ancestor creates a new containing block
  // for `position: fixed`, which would pin this dialog to that ancestor's box
  // instead of the viewport. Portaling to <body> sidesteps that regardless of
  // where the trigger is ever placed. Gated on mount since document isn't
  // available during SSR.
  useEffect(() => setMounted(true), []);

  const openModal = (event) => {
    // event.currentTarget (the button itself), not document.activeElement —
    // Safari doesn't move focus to a <button> on click, so activeElement
    // would silently be wrong there and focus wouldn't return to the trigger
    // on close.
    lastFocusedRef.current = event.currentTarget;
    setOpen(true);
  };

  const closeModal = () => {
    videoRef.current?.pause();
    setOpen(false);
    if (lastFocusedRef.current instanceof HTMLElement) {
      lastFocusedRef.current.focus();
    }
  };

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const dialog = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-0 z-[85] flex items-center justify-center bg-inverse-surface/95 p-4 backdrop-blur-sm transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close video"
        onClick={closeModal}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <div
        className={`relative w-full max-w-4xl overflow-hidden rounded-[28px] bg-black shadow-2xl transition-all duration-300 ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <p className="font-body text-body-sm text-white/70">{title}</p>
          <button
            type="button"
            ref={closeRef}
            onClick={closeModal}
            tabIndex={open ? 0 : -1}
            aria-label="Close video"
            className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
          >
            <CloseIcon size={22} />
          </button>
        </div>

        <div className="aspect-video w-full bg-black">
          {open ? (
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              controls
              playsInline
              autoPlay
              className="h-full w-full"
            >
              Your browser doesn&apos;t support embedded video.
            </video>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="group inline-flex items-center gap-3 font-display text-body-md font-bold text-on-surface transition-colors hover:text-primary"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-primary shadow-md ring-1 ring-outline-variant/60 transition-transform duration-300 group-hover:scale-105">
          <PlayIcon size={22} />
        </span>
        Watch the film
      </button>

      {mounted ? createPortal(dialog, document.body) : null}
    </>
  );
}
