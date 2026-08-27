"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ExpandIcon,
} from "@/components/icons";
import AmbientBackground from "@/components/site/AmbientBackground";
import { useGetStarted } from "@/components/site/GetStarted";
import Reveal from "@/components/site/Reveal";
import SiteShell from "@/components/site/SiteShell";

/**
 * ---------------------------------------------------------------------------
 * PHOTOS — the whole gallery lives in this one list.
 *
 * To add a picture: drop the file in /public and append an entry. `width` and
 * `height` are the file's real pixel size — they let the masonry reserve the
 * exact space before the image loads, so nothing jumps as the page fills in
 * (check with: sips -g pixelWidth -g pixelHeight public/yourfile.jpg).
 *
 * Captions carry over from the slider on /classic, with typos corrected.
 * ---------------------------------------------------------------------------
 */
const PHOTOS = [
  {
    src: "/gallery-img1.webp",
    width: 2000,
    height: 2673,
    category: "recognition",
    title: "First Poster Award, NIH Roorkee",
    caption:
      "The team receiving the First Poster Award at NIH Roorkee for the PSD test.",
  },
  {
    src: "/gallery-img4.webp",
    width: 2000,
    height: 1497,
    category: "exhibitions",
    title: "Presenting the kit",
    caption: "Presenting the Jaljyoti kit and its workflow to an audience.",
  },
  {
    src: "/gallery-img7.webp",
    width: 960,
    height: 1280,
    category: "recognition",
    title: "Demonstration to the former UGC Chairman",
    caption:
      "Demonstrating the test to Prof. M. Jagadesh Kumar, former Chairman of the UGC.",
  },
  {
    src: "/gallery-img2.webp",
    width: 1884,
    height: 2356,
    category: "recognition",
    title: "With the Director of NIH Roorkee",
    caption: "Meeting the Director of the National Institute of Hydrology, Roorkee.",
  },
  {
    src: "/gallery-img5.webp",
    width: 960,
    height: 1280,
    category: "exhibitions",
    title: "THRIVE exhibition",
    caption: "Showing the test in action at the THRIVE exhibition.",
  },
  {
    src: "/gallery-img3.webp",
    width: 2000,
    height: 2667,
    category: "recognition",
    title: "With Sharmilla Oswal",
    caption: "With Sharmilla Oswal, the Millet Woman of India.",
  },
  {
    src: "/gallery-img6.webp",
    width: 960,
    height: 1280,
    category: "exhibitions",
    title: "At the exhibition stall",
    caption: "Walking visitors through a live test at the exhibition stall.",
  },
  {
    src: "/gallery-img8.webp",
    width: 715,
    height: 1600,
    category: "field",
    title: "Kit presentation in a rural area",
    caption:
      "Presenting the kit to residents in a rural area, where lab access is hardest.",
  },
  {
    src: "/gallery-img9.webp",
    width: 576,
    height: 1280,
    category: "field",
    title: "Testing with students",
    caption:
      "Students and residents running the paper-strip test on their own water supply.",
  },
];

const FILTERS = [
  { id: "all", label: "Everything" },
  { id: "recognition", label: "Recognition" },
  { id: "exhibitions", label: "Exhibitions" },
  { id: "field", label: "In the field" },
];

const CATEGORY_LABEL = {
  recognition: "Recognition",
  exhibitions: "Exhibition",
  field: "Field work",
};

function Lightbox({ photo, index, total, onClose, onPrev, onNext }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!photo) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [photo, onClose, onPrev, onNext]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      className="fixed inset-0 z-[90] flex flex-col bg-inverse-surface/95 backdrop-blur-sm"
      style={{ animation: "jj-fade-in 0.25s ease both" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/55 to-transparent px-margin-mobile py-5 md:px-margin-desktop [&>*]:pointer-events-auto">
        <span className="font-body text-label-md uppercase tracking-widest text-inverse-on-surface/70">
          {CATEGORY_LABEL[photo.category]} · {index + 1} / {total}
        </span>
        <button
          type="button"
          ref={closeRef}
          onClick={onClose}
          aria-label="Close image"
          className="rounded-full p-2 text-inverse-on-surface transition-colors hover:bg-white/10"
        >
          <CloseIcon size={22} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 py-4">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous image"
          className="absolute left-2 z-10 rounded-full bg-white/10 p-3 text-inverse-on-surface transition-colors hover:bg-white/20 md:left-8"
        >
          <ChevronLeftIcon size={20} />
        </button>

        {/* The figure owns the available box; the image fills whatever is left
            after the caption. A fixed `max-h-[68vh]` was capping every photo at
            68% of the viewport height regardless of shape — which left a
            portrait shot rendering 221px wide inside a 1440px overlay, with the
            entire width of the screen unused. Constraining on both axes and
            letting object-contain resolve it means a portrait uses the height
            and a landscape uses the width. */}
        <figure
          key={photo.src}
          className="jj-fade-up relative flex h-full w-full items-center justify-center"
        >
          {/*
            max-h/max-w only ever *constrain* an <img> — they never make one
            grow. With h-auto/w-auto the element rendered at whatever intrinsic
            size Next happened to serve, which for a portrait was 201x450 inside
            a 1440px overlay.

            Filling the box and letting object-contain letterbox the picture is
            the only form that is correct for every aspect ratio. The catch is
            that the element is then larger than the visible photo on one axis,
            so a box-shadow would float away from its edges — drop-shadow is
            applied to the rendered pixels instead, so it hugs the photo whatever
            shape it is.
          */}
          <div className="relative mx-auto flex h-full w-full max-w-6xl items-center justify-center">
            <Image
              src={photo.src}
              alt={photo.caption}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 768px) 92vw, 70vw"
              className="h-full w-full object-contain [filter:drop-shadow(0_18px_45px_rgba(0,0,0,0.55))]"
            />
          </div>
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/70 via-black/35 to-transparent px-6 pt-16 pb-6 text-center">
            <p className="font-display text-headline-md text-white">{photo.title}</p>
            <p className="mx-auto mt-1.5 max-w-2xl font-body text-body-md text-inverse-on-surface/80">
              {photo.caption}
            </p>
          </figcaption>
        </figure>

        <button
          type="button"
          onClick={onNext}
          aria-label="Next image"
          className="absolute right-2 z-10 rounded-full bg-white/10 p-3 text-inverse-on-surface transition-colors hover:bg-white/20 md:right-8"
        >
          <ChevronRightIcon size={20} />
        </button>
      </div>
    </div>
  );
}

function GalleryMain() {
  const [filter, setFilter] = useState("all");
  const [activeIndex, setActiveIndex] = useState(-1);
  const { openGetStarted } = useGetStarted();

  const photos = useMemo(
    () => (filter === "all" ? PHOTOS : PHOTOS.filter((p) => p.category === filter)),
    [filter]
  );

  const close = useCallback(() => setActiveIndex(-1), []);
  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + photos.length) % photos.length),
    [photos.length]
  );
  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % photos.length),
    [photos.length]
  );

  const counts = useMemo(() => {
    const base = { all: PHOTOS.length };
    PHOTOS.forEach((photo) => {
      base[photo.category] = (base[photo.category] ?? 0) + 1;
    });
    return base;
  }, []);

  return (
    <main className="pt-[clamp(3.5rem,9vh,8rem)] pb-[clamp(3.5rem,9vh,8rem)]">
      <section className="relative mb-16">
        <AmbientBackground variant="subtle" />
        <div className="relative z-10 mx-auto max-w-[1280px] px-margin-mobile text-center md:px-margin-desktop">
          <Reveal>
            <span className="mb-6 inline-block rounded-full bg-secondary-container/20 px-4 py-1 font-body text-label-md uppercase tracking-widest text-secondary">
              Out of the lab
            </span>
            <h1 className="mb-6 font-display text-display-sm text-on-surface md:text-display-lg">
              Where the test
              <br />
              has already been.
            </h1>
            <p className="mx-auto max-w-2xl font-body text-body-lg text-on-surface-variant">
              Exhibitions, award halls, and village courtyards — every photograph
              here is a real demonstration of the Jaljyoti paper-strip test.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-margin-mobile md:px-margin-desktop">
        {/* Filters */}
        <Reveal className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {FILTERS.map((option) => {
            const isActive = option.id === filter;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setFilter(option.id);
                  setActiveIndex(-1);
                }}
                aria-pressed={isActive}
                className={`rounded-full border px-5 py-2.5 font-body text-body-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "border-primary bg-primary text-on-primary shadow-md"
                    : "border-outline-variant bg-white text-on-surface-variant hover:border-primary/40 hover:text-primary"
                }`}
              >
                {option.label}
                <span
                  className={`ml-2 font-body text-[11px] ${
                    isActive ? "text-on-primary/70" : "text-outline"
                  }`}
                >
                  {counts[option.id] ?? 0}
                </span>
              </button>
            );
          })}
        </Reveal>

        {/* Masonry — natural aspect ratios, no crops, no layout shift */}
        <div key={filter} className="columns-1 gap-gutter sm:columns-2 lg:columns-3">
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              style={{ animationDelay: `${index * 70}ms` }}
              className="jj-fade-up group mb-gutter block w-full break-inside-avoid overflow-hidden rounded-[24px] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <div className="relative overflow-hidden rounded-[24px] bg-surface-container-highest shadow-[0_4px_20px_rgba(15,23,42,0.06)] transition-shadow duration-500 group-hover:shadow-[0_16px_40px_rgba(15,23,42,0.16)]">
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  width={photo.width}
                  height={photo.height}
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                  className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04]"
                />

                {/* Caption panel slides up on hover, always readable on touch */}
                <div className="absolute inset-x-0 bottom-0 translate-y-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-6 pt-16 transition-all duration-500 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                  <span className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 font-body text-[11px] font-bold uppercase tracking-wider text-white">
                    {CATEGORY_LABEL[photo.category]}
                  </span>
                  <p className="font-display text-body-lg font-bold text-white">
                    {photo.title}
                  </p>
                  <p className="mt-1 font-body text-body-sm text-white/80">
                    {photo.caption}
                  </p>
                </div>

                <span className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-primary opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <ExpandIcon size={18} />
                </span>
              </div>
            </button>
          ))}
        </div>

        <Reveal className="mt-20 rounded-[32px] bg-primary p-12 text-center text-on-primary md:p-16">
          <h2 className="mb-4 font-display text-headline-lg">
            Want the kit at your site?
          </h2>
          <p className="mx-auto mb-8 max-w-xl font-body text-body-lg text-on-primary-container">
            We run demonstrations for schools, panchayats, farms, and
            institutions. Tell us where, and we&apos;ll bring it.
          </p>
          <button
            type="button"
            onClick={() => openGetStarted("Book a demo")}
            className="rounded-2xl bg-white px-10 py-4 font-display font-bold text-primary transition-colors hover:bg-on-primary-container active:scale-[0.98]"
          >
            Arrange a demonstration
          </button>
        </Reveal>
      </section>

      <Lightbox
        photo={activeIndex >= 0 ? photos[activeIndex] : null}
        index={activeIndex}
        total={photos.length}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </main>
  );
}

export default function GalleryContent() {
  return (
    <SiteShell active="/gallery">
      <GalleryMain />
    </SiteShell>
  );
}
