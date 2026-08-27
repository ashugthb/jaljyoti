"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowRightIcon,
  AwardIcon,
  BeakerIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  CrisisAlertIcon,
  DnaIcon,
  DoneAllIcon,
  DropperIcon,
  FactoryIcon,
  GroupsIcon,
  MicroscopeIcon,
  SchoolIcon,
  SparkleIcon,
  TestStripIcon,
  TimerIcon,
  WarningIcon,
  WaterDropIcon,
} from "@/components/icons";
import FilmModal from "@/components/site/FilmModal";
import { useGetStarted } from "@/components/site/GetStarted";
import LoadReveal from "@/components/site/LoadReveal";
import Magnetic from "@/components/site/Magnetic";
import MediaFrame from "@/components/site/MediaFrame";
import Reveal from "@/components/site/Reveal";
import SiteShell from "@/components/site/SiteShell";
import { BorderBeam } from "@/components/ui/border-beam";
import { Marquee } from "@/components/ui/marquee";
import { Spotlight } from "@/components/ui/spotlight-new";

/**
 * Both of these open a WebGL context on mount, so they are client-only and
 * excluded from the server render. TestKitScene's `loading` element holds the
 * hero's layout height, so nothing reflows when the canvas mounts.
 */
const Aurora = dynamic(() => import("@/components/ui/aurora"), { ssr: false });
const TestKitScene = dynamic(() => import("@/components/three/TestKitScene"), {
  ssr: false,
  loading: () => (
    <div
      className="h-[24rem] w-full sm:h-[28rem] lg:h-[min(34rem,62vh)]"
      aria-hidden="true"
    />
  ),
});

/**
 * ---------------------------------------------------------------------------
 * IMAGES — every visual slot on this page, in one place.
 * Drop a file in /public and point the entry at it; set a slot to `null` to get
 * the dashed placeholder (same size, no layout shift) until the shot arrives.
 *
 * Current values reuse existing /public assets as stand-ins. `hint` is the
 * shot each slot is really waiting for.
 * ---------------------------------------------------------------------------
 */
const IMAGES = {
  hero: {
    src: "/hero-bg.webp",
    alt: "Macro illustration of glowing microorganisms in water, evoking biological contamination at a cellular scale",
    label: "Product kit hero",
    hint: "Studio shot of the Jaljyoti kit — vial, reagent, strip, colour chart. 4:5 portrait, ~1200×1500.",
  },
  impact: {
    // Source file is public/img8.JPG.jpeg at 6720x4480 / 7.3MB — far too heavy to
    // ship. This is the same photograph resized to 1800px wide at ~386KB.
    //
    // TODO(jaljyoti): the certificate in this photo names a specific award,
    // track and prize amount. The caption in the markup stays deliberately
    // general until someone confirms the exact wording — same rule the
    // COMPARISON table follows.
    src: "/award.webp",
    alt: "The Jaljyoti team receiving an innovation challenge award certificate",
    label: "Award presentation",
    hint: "Portrait or square crop of the award presentation, ~1400x1750.",
    objectPosition: "center 42%",
  },
  agriculture: {
    src: "/agriculture.webp",
    alt: "Irrigation watering a field of young crops",
    label: "Agriculture",
    hint: "Landscape, ~1600×900.",
  },
  community: {
    // Portrait source (576x1280), so it gets the bento's tall cell rather than
    // being cropped to a letterbox — which is what made it look mangled.
    src: "/community.webp",
    alt: "Residents testing water with the Jaljyoti kit in a village",
    label: "Schools & communities",
    hint: "Portrait deployment shot, ~1000x1750.",
    objectPosition: "center 38%",
  },
  municipal: {
    src: "/municipal.webp",
    alt: "Clean treated water flowing from a supply outlet",
    label: "Municipal supply",
    hint: "Landscape shot of a treatment plant or municipal supply point, ~2000×900.",
  },
};

/** Three numbers that carry the pitch, shown under the hero call to action. */
const HERO_FACTS = [
  { icon: TimerIcon, value: "~5 min", label: "Time to a readable result" },
  { icon: MicroscopeIcon, value: "0", label: "Lab instruments needed" },
  { icon: WaterDropIcon, value: "On-site", label: "Tested where the water is" },
];

/**
 * Credentials the repo can actually back up (team affiliations in Team.js and
 * the exhibition captions in Gallary.js). Add a row only when it is verifiable —
 * certification badges belong here only once the certificate exists.
 */
const TRUST_MARKERS = [
  { icon: SchoolIcon, label: "IIT Jodhpur", detail: "Research home" },
  {
    icon: AwardIcon,
    label: "NIH Roorkee",
    detail: "First poster award, PSD test",
  },
  {
    icon: DnaIcon,
    label: "CETSD",
    detail: "Emerging tech for sustainability",
  },
  {
    icon: GroupsIcon,
    label: "Field tested",
    detail: "Rural deployments across India",
  },
];

/**
 * The three numbers that carry the problem.
 *
 * Every figure here is already published elsewhere on this page — the WHO/UNICEF
 * count, the 48-72 hour lab turnaround from COMPARISON, and the "0 lab
 * instruments" from HERO_FACTS. Nothing new is asserted.
 *
 * `count`/`suffix` exist so the value can be counted up on scroll rather than
 * simply appearing; `pair` is the after-state for the two that are really a
 * before/after, drawn as a second, much shorter bar.
 */
const PROBLEM_STATS = [
  {
    icon: CrisisAlertIcon,
    accent: { from: "#ef4444", to: "#fca5a5", text: "text-error", ring: "ring-error/20" },
    count: 2.2,
    decimals: 1,
    suffix: "B",
    headline: "people",
    label: "still live without safely managed drinking water.",
    source: "WHO / UNICEF Joint Monitoring Programme",
    bar: 0.28,
    barNote: "of the world",
  },
  {
    icon: ClockIcon,
    accent: { from: "#006398", to: "#5bb8fe", text: "text-secondary", ring: "ring-secondary/20" },
    count: 72,
    decimals: 0,
    suffix: "h",
    headline: "of incubation",
    label: "collapses to about five minutes, read at the water source.",
    source: "Versus standard laboratory turnaround",
    bar: 1,
    pair: 0.06,
    barNote: "lab vs Jaljyoti",
  },
  {
    icon: MicroscopeIcon,
    accent: { from: "#005c55", to: "#80d5cb", text: "text-primary", ring: "ring-primary/20" },
    count: 0,
    decimals: 0,
    suffix: "",
    headline: "instruments",
    label: "needed to read a result — no incubator, no bench, no power.",
    source: "Paper strip and reagent only",
    bar: 0.02,
    barNote: "equipment required",
  },
];

/**
 * The detection cycle as a straight comparison.
 *
 * Earlier passes drew this as a track with markers, hatched dead time and step
 * chips — three visual systems competing inside one card, which read as busy
 * rather than considered. The comparison only needs two things: the two
 * durations set against each other, and what actually happens in each. A single
 * rule under each number carries the proportion; nothing else has to.
 */
const ROUTES = [
  {
    key: "lab",
    label: "Conventional laboratory",
    value: "48-72",
    unit: "hours",
    weight: 100,
    steps: [
      "Collect and bottle the sample",
      "Transport it to a laboratory",
      "Incubate for two to three days",
      "Report returned",
    ],
    verdict: "The water was drunk days before the answer arrived.",
  },
  {
    key: "jaljyoti",
    label: "With Jaljyoti",
    approx: true,
    value: "5",
    unit: "minutes",
    weight: 6,
    steps: [
      "Collect at the source",
      "Dip the paper strip",
      "Read the colour against the chart",
    ],
    verdict: "Answered before you leave the tap.",
  },
];

/**
 * The walkthrough.
 *
 * `detail`, `needs`, `takes` and `mode` exist because a full-height pinned
 * section carrying a two-word title and one sentence read as empty. Every one
 * of them is derived from a claim already on this page — the 48-72 hour
 * incubation and "paper strip, no power" come from COMPARISON, the three
 * verdicts from the simulator — so the section says more without asserting
 * anything new about the product.
 *
 * `takes` stays qualitative on purpose. The only timing the site actually
 * commits to is the roughly five-minute reaction; per-step stopwatch figures
 * would be invented. `span` is the width each step gets on the time track and
 * is a drawing ratio, not a measurement.
 */
const PROCESS_STEPS = [
  {
    icon: WaterDropIcon,
    title: "Collect",
    body: "Take a small sample from any source.",
    detail:
      "Well, tap, tank or canal. The test travels to the water, so nothing has to be bottled and shipped anywhere.",
    needs: "Sample vial",
    takes: "Seconds",
    mode: "Hands-on",
    span: 1,
  },
  {
    icon: BeakerIcon,
    title: "Add reagent",
    body: "Add the enzyme reagent to the sample.",
    detail:
      "The enzymatic biomarkers arrive pre-measured — nothing to weigh, dilute or calibrate in the field.",
    needs: "Reagent ampoule",
    takes: "Seconds",
    mode: "Hands-on",
    span: 1,
  },
  {
    icon: TestStripIcon,
    title: "Dip",
    body: "Place the paper strip into the solution.",
    detail:
      "Paper does the rest. No incubator, no power supply, no laboratory bench.",
    needs: "Test strip",
    takes: "Seconds",
    mode: "Hands-on",
    span: 1,
  },
  {
    icon: TimerIcon,
    title: "Wait",
    body: "Allow about five minutes for the reaction.",
    detail:
      "Nothing to supervise. A laboratory would be starting a 48-72 hour incubation at this point.",
    needs: "Nothing — set it down",
    takes: "About 5 minutes",
    mode: "Unattended",
    span: 5,
  },
  {
    icon: DoneAllIcon,
    title: "Compare",
    body: "Read the result against the colour chart.",
    detail:
      "Safe, boil before use, or contaminated — read by eye, by anyone, with no training.",
    needs: "Colour chart",
    takes: "Seconds",
    mode: "Hands-on",
    span: 1,
  },
];

/**
 * One accent per walkthrough step, pulled from the existing design tokens so
 * the section gains colour without introducing a new palette. `ring` drives the
 * rotating conic halo behind each icon; `dot` is the progress pip.
 */
const STEP_ACCENTS = [
  { from: "#5bb8fe", to: "#9cf2e8", text: "text-secondary" },
  { from: "#0f766e", to: "#80d5cb", text: "text-primary" },
  { from: "#007488", to: "#acedff", text: "text-tertiary" },
  { from: "#ffb84d", to: "#ffe0a3", text: "text-on-surface" },
  { from: "#005c55", to: "#9cf2e8", text: "text-primary" },
];

/**
 * Comparison claims stay qualitative on purpose. Swap in exact figures
 * (turnaround minutes, ₹ per test) once they are confirmed for publication.
 */
const COMPARISON = [
  {
    criteria: "Turnaround time",
    traditional: "48–72 hours",
    jaljyoti: "About 5 minutes",
  },
  {
    criteria: "Cost per test",
    traditional: "Lab fee plus sample transport",
    jaljyoti: "A fraction of lab cost",
  },
  {
    criteria: "Expertise required",
    traditional: "Trained lab technician",
    jaljyoti: "No training needed",
  },
  {
    criteria: "Equipment",
    traditional: "Incubator and lab bench",
    jaljyoti: "Paper strip, no power",
  },
  {
    criteria: "Logistics",
    traditional: "Samples must be transported",
    jaljyoti: "On-site and portable",
  },
];

/** Illustrative reading used by the simulator — not a measurement. */
function readingFor(purity) {
  if (purity > 80) {
    return {
      key: "safe",
      color: "#22c55e",
      cardClass: "border-success/20 bg-success/5",
      textClass: "text-success",
      icon: CheckCircleIcon,
      title: "Water is safe",
      description:
        "Negligible bacterial presence detected. Suitable for general consumption and agricultural use.",
      label: "Safe",
    };
  }
  if (purity > 40) {
    return {
      key: "warning",
      color: "#eab308",
      cardClass: "border-warning/20 bg-warning/5",
      textClass: "text-warning",
      icon: WarningIcon,
      title: "Boil before use",
      description:
        "Low to moderate contamination detected. Water should be filtered or boiled before it is used.",
      label: "Warning",
    };
  }
  return {
    key: "danger",
    color: "#ef4444",
    cardClass: "border-error/20 bg-error/5",
    textClass: "text-error",
    icon: CrisisAlertIcon,
    title: "Highly contaminated",
    description:
      "Dangerous levels of pathogens present. Do not consume. Immediate sanitation measures required.",
    label: "Danger",
  };
}

/**
 * Counts a number up when it scrolls into view.
 *
 * Magic UI ships a `number-ticker` for this, but it is built on `motion` — and
 * this project already runs GSAP as its single animation authority, with
 * ScrollTrigger imported two lines up. Reaching for a second runtime to move one
 * integer would be the wrong trade.
 *
 * The final value is rendered on the server and only overwritten once the
 * animation starts, so the figure is present for crawlers and for anyone with
 * reduced motion.
 */
function StatCounter({ value, decimals = 0, suffix = "" }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const state = { n: 0 };
        gsap.to(state, {
          n: value,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = state.n.toFixed(decimals) + suffix;
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return <span ref={ref}>{value.toFixed(decimals) + suffix}</span>;
}

function Simulator() {
  const [purity, setPurity] = useState(98);
  const reading = useMemo(() => readingFor(purity), [purity]);
  const ResultIcon = reading.icon;

  return (
    <section className="py-[clamp(3rem,8vh,6rem)]">
      <div className="mx-auto max-w-[1280px] px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <span className="mb-4 inline-block rounded-full bg-surface-container-high px-3 py-1 font-body text-label-md uppercase tracking-widest text-on-surface-variant">
              Illustrative demo
            </span>
            <h2 className="mb-6 font-display text-headline-lg text-on-surface">
              See it in action
            </h2>
            <p className="mb-10 font-body text-body-lg text-on-surface-variant">
              Our reagents are designed for visual clarity. Move the slider to
              see how the strip responds across purity levels. This is a
              simulation of the colour response, not a live measurement.
            </p>

            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex justify-between font-body font-bold">
                  <label htmlFor="purity-slider" className="text-on-surface">
                    Purity level
                  </label>
                  <span className={reading.textClass}>
                    {purity}% ({reading.label})
                  </span>
                </div>
                <input
                  id="purity-slider"
                  type="range"
                  min="0"
                  max="100"
                  value={purity}
                  onChange={(event) => setPurity(Number(event.target.value))}
                  aria-valuetext={`${purity} percent purity, ${reading.label}`}
                  className="jj-slider jj-strip-gradient h-3 w-full cursor-pointer appearance-none rounded-full"
                />
              </div>

              <div
                className={`rounded-3xl border p-8 transition-all duration-500 ${reading.cardClass}`}
                aria-live="polite"
              >
                <div className="mb-4 flex items-center gap-4">
                  {/* `key` remounts the icon whenever the verdict changes, so
                      the new state draws itself in rather than swapping glyphs. */}
                  <ResultIcon
                    key={reading.key}
                    size={40}
                    play="always"
                    className={reading.textClass}
                  />
                  <h3
                    className={`font-display text-headline-md ${reading.textClass}`}
                  >
                    {reading.title}
                  </h3>
                </div>
                <p className="font-body text-body-md text-on-surface-variant">
                  {reading.description}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="flex items-center justify-center">
            <div className="jj-panel relative flex h-[min(32rem,72vh)] min-h-[22rem] w-full max-w-sm flex-col items-center justify-between rounded-[60px] p-6 shadow-2xl sm:p-8">
              <div className="h-4 w-24 shrink-0 rounded-full bg-outline-variant/20" />
              {/* min-h-0 lets this flex child actually shrink — without it the
                  strip keeps its content height and pushes the caption out. */}
              <div className="relative my-6 w-20 min-h-0 flex-1 overflow-hidden rounded-full border-8 border-white bg-surface-container shadow-inner">
                <div
                  className="absolute bottom-0 w-full transition-all duration-700 ease-out"
                  style={{
                    height: `${100 - purity}%`,
                    backgroundColor: reading.color,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5" />
              </div>
              <div className="shrink-0 text-center">
                <div className="mb-2 font-body text-label-md uppercase tracking-widest text-outline">
                  Detection strip
                </div>
                <div className="font-display font-bold text-on-surface">
                  Jaljyoti paper strip test
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Page body. Lives inside <SiteShell> so it can reach the enquiry dialog. */
function ProductMain() {
  const { openGetStarted } = useGetStarted();

  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const heroCopyRef = useRef(null);
  const heroArtRef = useRef(null);
  const processRef = useRef(null);

  /**
   * Scrub target for the walkthrough. A plain object rather than state so
   * ScrollTrigger can write to it every frame without re-rendering React — the
   * r3f frame loop reads the value directly.
   */
  // Only the walkthrough is scroll-scrubbed now; the hero scene runs its own
  // timeline (see TestKitScene's `loop`).
  const walkProgress = useRef({ value: 0 });

  /**
   * Scroll choreography, all GSAP ScrollTrigger. Lenis drives the same ticker
   * (see SmoothScroll), so these stay locked to the scroll position instead of
   * drifting a frame behind it.
   *
   * `gsap.matchMedia` is GSAP's own responsive/reduced-motion gate: everything
   * registered inside a query is created when it matches and reverted when it
   * stops, so the pin never applies on phones and nothing animates at all for
   * someone who asked for reduced motion.
   */
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The hero recedes as the page takes over: copy lifts and dims while
        // the droplet sinks and shrinks slightly, so the two layers separate.
        gsap.to(heroCopyRef.current, {
          y: -70,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(heroArtRef.current, {
          y: 70,
          scale: 0.88,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      /**
       * The product walkthrough — the Creality pattern, in live 3D.
       *
       * The section pins, and scroll scrubs a single value from 0 to 1. The
       * camera rig inside the canvas reads that value and flies between its
       * five waypoints, while each step's copy fades in as the camera settles
       * on the part it describes and fades out again as it leaves.
       *
       * Desktop only. On a phone the pin would trap the viewport for five
       * screens of scroll on a canvas too small to read, so the section falls
       * back to the plain stacked list.
       */
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const steps = gsap.utils.toArray("[data-step]");
          const tracks = gsap.utils.toArray("[data-step-track]");
          if (!steps.length || !processRef.current) return;

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: processRef.current,
              start: "top top",
              end: `+=${steps.length * 420}`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
            },
          });

          timeline.to(
            walkProgress.current,
            { value: 1, ease: "none", duration: steps.length - 1 },
            0
          );

          // Each panel owns one waypoint's worth of the timeline, cross-fading
          // with its neighbours so there is never a gap with no copy on screen.
          steps.forEach((step, index) => {
            const enterAt = Math.max(0, index - 0.18);

            timeline.fromTo(
              step,
              { opacity: 0, y: 26 },
              { opacity: 1, y: 0, duration: 0.34, ease: "power2.out" },
              enterAt
            );

            // The icon tile builds itself as its step arrives: the conic halo
            // sweeps a full turn while the chip pops in behind it, so the
            // marker reads as instrumentation coming online rather than a
            // static glyph fading up.
            const halo = step.querySelector("[data-step-halo]");
            const chip = step.querySelector("[data-step-icon]");

            if (halo) {
              timeline.fromTo(
                halo,
                { rotate: -180, scale: 0.75, opacity: 0 },
                {
                  rotate: 0,
                  scale: 1,
                  opacity: 0.7,
                  duration: 0.55,
                  ease: "power3.out",
                },
                enterAt
              );
            }

            if (chip) {
              timeline.fromTo(
                chip,
                { scale: 0.55, rotate: -22 },
                {
                  scale: 1,
                  rotate: 0,
                  duration: 0.5,
                  ease: "back.out(2.4)",
                },
                enterAt + 0.08
              );
            }
            // Time-track segment for this step. `fromTo` rather than `to` so
            // the bar has a defined width at every scrub position, including
            // when the visitor scrolls back up through the section.
            if (tracks[index]) {
              timeline.fromTo(
                tracks[index],
                { scaleX: 0 },
                { scaleX: 1, duration: 0.45, ease: "power2.out" },
                enterAt
              );
            }

            if (index < steps.length - 1) {
              timeline.to(
                step,
                { opacity: 0, y: -22, duration: 0.34, ease: "power2.in" },
                index + 0.5
              );
            }
          });
        }
      );

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <main className="pt-20" ref={rootRef}>
      {/* Hero */}
      {/* `isolate` matters here: Aceternity's Spotlight puts its beams at z-40
          and the hero copy has to sit above them, but the site header is a
          fixed z-50 bar. Without a stacking context on this section, the hero's
          z-50 content competes with the header directly and wins on DOM order,
          so scrolled copy paints over the nav. Isolating the section keeps that
          whole z-range local. */}
      <section
        ref={heroRef}
        className="relative isolate flex min-h-[88vh] items-center overflow-hidden py-16 md:py-20"
      >
        {/* React Bits Aurora — the WebGL base wash, masked so it dissolves
            into the page instead of ending on a hard edge. */}
        <div className="pointer-events-none absolute inset-0 opacity-25 [mask-image:linear-gradient(to_bottom,black,black_30%,transparent_85%)]">
          <Aurora
            colorStops={["#0f766e", "#5bb8fe", "#80d5cb"]}
            amplitude={0.75}
            blend={0.75}
            speed={0.45}
          />
        </div>

        {/* Aceternity Spotlight. Upstream's default gradients are mixed for a
            near-black hero — pale and barely-there. These are the same three
            gradients re-mixed for a light surface: more saturation, much less
            lightness, so the beams actually read against #faf8ff. */}
        <Spotlight
          gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(176, 90%, 32%, .18) 0, hsla(176, 90%, 28%, .06) 50%, hsla(176, 90%, 25%, 0) 80%)"
          gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(199, 100%, 42%, .13) 0, hsla(199, 100%, 38%, .04) 80%, transparent 100%)"
          gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(187, 100%, 32%, .10) 0, hsla(187, 100%, 28%, .03) 80%, transparent 100%)"
          translateY={-260}
          duration={9}
          xOffset={70}
        />

        {/* Above Spotlight's own z-40 beams. */}
        <div className="relative z-50 mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-16 px-margin-mobile md:px-margin-desktop lg:grid-cols-2">
          <div ref={heroCopyRef}>
            <LoadReveal
              as="span"
              variant="pop"
              delay={0}
              className="mb-[clamp(0.75rem,2vh,1.5rem)] inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-1.5 font-body text-label-md uppercase tracking-widest text-primary"
            >
              <span className="jj-pulse-dot" aria-hidden="true" />
              Next-gen water testing
            </LoadReveal>

            <LoadReveal
              as="h1"
              variant="wipe"
              delay={100}
              className="mb-[clamp(0.75rem,2vh,1.5rem)] font-display text-display-sm leading-[1.1] text-on-surface md:text-display-lg"
            >
              Know if water is <span className="italic text-primary">safe</span>{" "}
              within just <span className="text-secondary">5 minutes.</span>
            </LoadReveal>

            <LoadReveal
              as="p"
              variant="blur"
              delay={260}
              className="mb-[clamp(1.25rem,3.2vh,2.5rem)] max-w-xl font-body text-body-lg text-on-surface-variant"
            >
              A smart paper-based test built at IIT Jodhpur. No labs, no
              transport delays, no compromises — precision biotechnology in the
              palm of your hand.
            </LoadReveal>

            <LoadReveal as="div" variant="pop" delay={380} className="flex flex-wrap gap-4">
              <Magnetic>
                <button
                  type="button"
                  onClick={() => openGetStarted("Book a demo")}
                  className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-display font-bold text-on-primary shadow-lg transition-colors hover:bg-primary-container active:scale-[0.98]"
                >
                  Request demo
                  <ArrowRightIcon size={20} />
                </button>
              </Magnetic>
              <a
                href="#how-it-works"
                className="rounded-xl border border-outline-variant bg-white/60 px-8 py-4 font-display font-bold text-on-surface transition-colors hover:bg-surface-container"
              >
                How it works
              </a>
            </LoadReveal>

            <LoadReveal as="div" variant="blur" delay={480} className="mt-[clamp(1rem,2.4vh,2rem)]">
              <FilmModal />
            </LoadReveal>

            <LoadReveal
              as="dl"
              variant="blur"
              delay={600}
              className="mt-[clamp(1rem,2.4vh,2rem)] grid grid-cols-3 gap-4 border-t border-outline-variant/40 pt-[clamp(1rem,2.4vh,2rem)]"
            >
              {HERO_FACTS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="group">
                  <Icon
                    size={20}
                    play="view"
                    className="mb-2 text-primary/60 transition-colors duration-300 group-hover:text-primary"
                  />
                  <dt className="font-display text-headline-md text-primary">
                    {value}
                  </dt>
                  <dd className="font-body text-body-sm text-on-surface-variant">
                    {label}
                  </dd>
                </div>
              ))}
            </LoadReveal>
          </div>

          {/* Hero object — @react-three/drei.
              This replaces the placeholder product shot that used to sit here.
              IMAGES.hero is deliberately left defined: it is still the slot
              waiting on the real studio photograph, and that shot belongs in a
              product section rather than competing with the 3D object. */}
          <div
            ref={heroArtRef}
            className="relative flex items-center justify-center"
          >
            {/* Brand glow behind the canvas, so the droplet sits in light
                instead of floating on flat white. */}
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_42%,rgba(0,92,85,0.20),transparent_70%)]"
              aria-hidden="true"
            />

            <LoadReveal
              as="div"
              variant="image"
              delay={220}
              className="relative w-full max-w-lg"
            >
              {/* Self-driving: rebuilds itself, performs the five steps, holds,
                  then does it again. It no longer reads the scroll position —
                  a hero that only moves while you scroll is dead the moment you
                  stop, which is exactly when someone is actually looking at it. */}
              <TestKitScene
                className="h-[24rem] w-full sm:h-[28rem] lg:h-[min(34rem,62vh)]"
                assemble
                loop
              />

              {/* Magic UI BorderBeam traces this card's edge — the detail that
                  makes it read as an instrument readout rather than a div. */}
              <div className="jj-glass relative -mt-6 overflow-hidden rounded-2xl p-5">
                <p className="mb-1 font-body text-label-md uppercase tracking-widest text-primary">
                  Result window
                </p>
                <p className="font-display text-body-lg font-bold text-on-surface">
                  Colour shift readable by eye — no instrument required.
                </p>
                <BorderBeam
                  size={55}
                  duration={8}
                  colorFrom="#0f766e"
                  colorTo="#5bb8fe"
                  borderWidth={1}
                />
              </div>
            </LoadReveal>
          </div>
        </div>
      </section>

      {/* Trust markers */}
      <section className="relative overflow-hidden border-y border-outline-variant/20 bg-surface-container-low py-[clamp(3rem,7vh,5rem)]">
        {/* Soft centred wash + a hairline "light beam" marking the section,
            instead of a flat border — the considered-luxury touch a plain
            row of icons was missing. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(0,92,85,0.06),transparent)]" />
        <div className="pointer-events-none absolute top-0 left-1/2 h-px w-48 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="relative mx-auto max-w-[1280px] px-margin-mobile md:px-margin-desktop">
          <Reveal className="mb-14 text-center">
            <p className="font-body text-label-md uppercase tracking-[0.3em] text-outline">
              Developed and demonstrated with
            </p>
          </Reveal>

          {/* Magic UI Marquee. Four credentials is too few to fill the row on a
              wide screen and too many to stack cleanly on a narrow one; as a
              continuous ticker it reads well at every width. The edge mask is
              what stops it looking like the items are being clipped. */}
          <Reveal>
            <Marquee
              pauseOnHover
              className="[--duration:38s] [--gap:3rem] [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
            >
              {TRUST_MARKERS.map(({ icon: Icon, label, detail }) => (
                <div
                  key={label}
                  className="group flex items-center gap-4 px-6"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-transparent ring-1 ring-primary/10 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:from-primary/20 group-hover:shadow-[0_10px_24px_rgba(0,92,85,0.18)] group-hover:ring-primary/30">
                    <Icon
                      size={26}
                      play="view"
                      className="text-primary/55 transition-colors duration-500 group-hover:text-primary"
                    />
                  </div>
                  <div className="whitespace-nowrap">
                    <div className="font-display text-body-lg font-bold tracking-tight text-on-surface">
                      {label}
                    </div>
                    <div className="font-body text-body-sm text-on-surface-variant">
                      {detail}
                    </div>
                  </div>
                </div>
              ))}
            </Marquee>
          </Reveal>
        </div>
      </section>

      {/* Problem statement */}
      <section className="relative overflow-hidden py-[clamp(2.5rem,6vh,5.5rem)]">
        {/* Depth. A flat white panel is what made this section read as a
            wireframe; two soft washes and the shared grain give it a surface. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_50%_at_6%_0%,rgba(186,26,26,0.07),transparent_62%),radial-gradient(55%_48%_at_96%_100%,rgba(0,92,85,0.08),transparent_62%)]" />
        <div className="jj-grain" />

        <div className="relative mx-auto max-w-[1280px] px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 items-center gap-[clamp(2rem,4vh,3.5rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-[clamp(2.5rem,4vw,5rem)]">
            <Reveal>
              <span className="mb-[clamp(0.6rem,1.8vh,1.25rem)] inline-flex items-center gap-2.5 rounded-full border border-error/15 bg-error/5 px-4 py-1.5 font-body text-label-md uppercase tracking-[0.25em] text-error">
                <span className="jj-dot-error" aria-hidden="true" />
                The problem
              </span>

              <h2 className="mb-[clamp(0.6rem,1.6vh,1rem)] font-display text-headline-lg text-on-surface">
                Water safety is a race{" "}
                <span className="text-error">against time.</span>
              </h2>
              <p className="mb-[clamp(1rem,2.6vh,1.75rem)] max-w-xl font-body text-body-md text-on-surface-variant">
                By the time a sample reaches a lab and gets processed,
                contaminated water has already been consumed. We change the
                timeline from days to minutes.
              </p>

              <ul className="space-y-[clamp(0.5rem,1.4vh,0.85rem)]">
                {PROBLEM_STATS.map(
                  ({
                    icon: Icon,
                    accent,
                    count,
                    decimals,
                    suffix,
                    headline,
                    label,
                    source,
                    bar,
                    pair,
                    barNote,
                  }) => (
                    <li
                      key={source}
                      className="jj-stat group relative overflow-hidden rounded-3xl border border-outline-variant/40 bg-surface-container-lowest/80 p-[clamp(0.7rem,1.9vh,1.15rem)] transition-all duration-500 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_18px_44px_rgba(15,23,42,0.12)]"
                    >
                      {/* Accent wash + a hairline that draws across the top. */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                          background: `linear-gradient(120deg, ${accent.from}14, transparent 55%)`,
                        }}
                      />
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
                        style={{
                          background: `linear-gradient(to right, transparent, ${accent.from}, transparent)`,
                        }}
                      />

                      <div className="relative flex items-start gap-4">
                        {/* Icon tile — conic halo behind a glass chip, the same
                            language as the walkthrough steps. */}
                        <span className="relative h-[clamp(2.4rem,5.2vh,3rem)] w-[clamp(2.4rem,5.2vh,3rem)] shrink-0">
                          <span
                            aria-hidden="true"
                            className="absolute -inset-0.5 rounded-[1.15rem] opacity-55 blur-[5px] transition-opacity duration-500 group-hover:opacity-90"
                            style={{
                              background: `conic-gradient(from 0deg, ${accent.from}, ${accent.to}, ${accent.from})`,
                            }}
                          />
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 rounded-2xl"
                            style={{
                              background: `linear-gradient(140deg, ${accent.from}, ${accent.to})`,
                            }}
                          />
                          <span className="absolute inset-[2.5px] flex items-center justify-center rounded-[0.8rem] bg-surface-container-lowest">
                            <Icon size={21} play="always" className={accent.text} />
                          </span>
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-2.5">
                            <span
                              className={`font-display text-[clamp(1.45rem,3.4vh,1.85rem)] leading-none font-extrabold tracking-tight tabular-nums ${accent.text}`}
                            >
                              <StatCounter
                                value={count}
                                decimals={decimals}
                                suffix={suffix}
                              />
                            </span>
                            <span className="font-display text-body-lg font-bold text-on-surface">
                              {headline}
                            </span>
                          </div>

                          <p className="mt-1.5 font-body text-body-sm text-on-surface-variant">
                            {label}{" "}
                            <span className="text-outline/70">— {source}</span>
                          </p>

                          {/* Magnitude bar. Where a stat is really a before/after,
                              `pair` draws the after-state over it — the length
                              difference makes the point faster than the words do. */}
                          <div className="mt-[clamp(0.45rem,1.3vh,0.75rem)] flex items-center gap-3">
                            <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-outline-variant/25">
                              <span
                                aria-hidden="true"
                                className="jj-stat-bar absolute inset-y-0 left-0 rounded-full"
                                style={{
                                  width: `${bar * 100}%`,
                                  background:
                                    pair !== undefined
                                      ? "rgba(110,121,119,0.35)"
                                      : `linear-gradient(to right, ${accent.from}, ${accent.to})`,
                                }}
                              />
                              {pair !== undefined ? (
                                <span
                                  aria-hidden="true"
                                  className="jj-stat-bar absolute inset-y-0 left-0 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.9)]"
                                  style={{
                                    width: `${pair * 100}%`,
                                    background: `linear-gradient(to right, ${accent.from}, ${accent.to})`,
                                    transitionDelay: "0.6s",
                                  }}
                                />
                              ) : null}
                            </span>
                            <span className="shrink-0 font-body text-[11px] uppercase tracking-widest text-outline">
                              {barNote}
                            </span>
                          </div>

                        </div>
                      </div>
                    </li>
                  )
                )}
              </ul>
            </Reveal>

            {/* Credential image. Framed rather than dropped in: corner brackets,
                a glass award chip and a caption that sits on the photograph. */}
            <Reveal className="relative">
              <span
                aria-hidden="true"
                className="absolute -top-3 -left-3 h-20 w-20 rounded-tl-[30px] border-t-2 border-l-2 border-primary/25"
              />
              <span
                aria-hidden="true"
                className="absolute -right-3 -bottom-3 h-20 w-20 rounded-br-[30px] border-r-2 border-b-2 border-primary/25"
              />

              <div className="jj-frame group relative aspect-[4/5] max-h-[min(58vh,30rem)] w-full overflow-hidden rounded-[34px] shadow-[0_30px_70px_rgba(15,23,42,0.20)] ring-1 ring-white/50 sm:aspect-[5/4] lg:aspect-[4/5]">
                <MediaFrame
                  src={IMAGES.impact.src}
                  alt={IMAGES.impact.alt}
                  label={IMAGES.impact.label}
                  hint={IMAGES.impact.hint}
                  objectPosition={IMAGES.impact.objectPosition}
                  sizes="(max-width: 1024px) 100vw, 620px"
                  imageClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
                  className="h-full w-full"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a1020]/82 via-[#0a1020]/12 to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(255,212,121,0.16),transparent_60%)]" />

                <div className="absolute top-5 left-5 flex items-center gap-2.5 rounded-full border border-white/25 bg-white/15 px-4 py-2 backdrop-blur-md">
                  <AwardIcon size={18} play="always" className="text-[#ffd479]" />
                  <span className="font-body text-label-md uppercase tracking-widest text-white">
                    Recognised work
                  </span>
                </div>

                <div className="absolute right-5 bottom-5 left-5 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
                  <p className="mb-1.5 flex items-center gap-2 font-body text-label-md uppercase tracking-widest text-primary-fixed">
                    <SparkleIcon size={14} play="always" />
                    National innovation challenge
                  </p>
                  <p className="font-display text-body-lg font-bold leading-snug text-white">
                    An award presented to the Jaljyoti team for the paper-strip
                    test — taken out of the lab and into the field.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Detection cycle — one comparison, two columns, nothing else.
          Sized entirely in clamp/vh so it compresses rather than overflows. */}
      <section className="relative overflow-hidden bg-surface-container-low py-[clamp(2.25rem,6vh,5.5rem)]">
        {/* One soft wash. The grid and grain that used to sit here were noise
            behind content that is already dense enough. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_0%,rgba(0,92,85,0.07),transparent_65%)]" />

        <div className="relative mx-auto max-w-[1080px] px-margin-mobile md:px-margin-desktop">
          <Reveal className="mb-[clamp(1.5rem,4vh,3rem)] text-center">
            <span className="mb-3 inline-block font-body text-label-md uppercase tracking-[0.3em] text-outline">
              The detection cycle
            </span>
            <h2 className="font-display text-headline-lg text-on-surface">
              Two routes to the same answer
            </h2>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-1 gap-[clamp(1.5rem,4vh,2.5rem)] md:grid-cols-2 md:gap-0">
              {ROUTES.map((route, index) => {
                const brand = route.key === "jaljyoti";
                return (
                  <div
                    key={route.key}
                    className={`relative flex flex-col ${
                      index === 1
                        ? "md:border-l md:border-outline-variant/50 md:pl-[clamp(1.75rem,4vw,3.5rem)]"
                        : "md:pr-[clamp(1.75rem,4vw,3.5rem)]"
                    }`}
                  >
                    <p
                      className={`mb-[clamp(0.75rem,2.2vh,1.5rem)] font-body text-label-md uppercase tracking-[0.25em] ${
                        brand ? "text-primary" : "text-outline"
                      }`}
                    >
                      {route.label}
                    </p>

                    {/* The hook: the two durations, set at the same size. */}
                    <p className="flex items-baseline gap-2.5">
                      {route.approx ? (
                        <span
                          aria-hidden="true"
                          className="font-display text-[clamp(1.2rem,3vh,1.7rem)] leading-none font-semibold text-primary/45"
                        >
                          ~
                        </span>
                      ) : null}
                      <span
                        className={`font-display text-[clamp(2.6rem,7vh,4rem)] leading-none font-extrabold tracking-[-0.03em] tabular-nums ${
                          brand ? "text-primary" : "text-outline/70"
                        }`}
                      >
                        <span className="sr-only">{route.approx ? "about " : ""}</span>
                        {route.value}
                      </span>
                      <span
                        className={`font-display text-body-lg font-bold ${
                          brand ? "text-on-surface" : "text-outline"
                        }`}
                      >
                        {route.unit}
                      </span>
                    </p>

                    {/* One hairline carries the proportion. */}
                    <span
                      aria-hidden="true"
                      className="mt-[clamp(0.6rem,1.8vh,1.1rem)] mb-[clamp(0.9rem,2.6vh,1.75rem)] block h-0.5 max-w-[22rem] overflow-hidden rounded-full bg-outline-variant/30"
                    >
                      <span
                        className={`jj-lane block h-full rounded-full ${
                          brand ? "bg-primary" : "bg-outline/45"
                        }`}
                        style={{ width: `${route.weight}%` }}
                      />
                    </span>

                    <ol className="space-y-[clamp(0.4rem,1.3vh,0.7rem)]">
                      {route.steps.map((step, i) => (
                        <li key={step} className="flex items-baseline gap-3">
                          <span
                            className={`font-body text-[11px] tabular-nums ${
                              brand ? "text-primary/70" : "text-outline/60"
                            }`}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`font-body text-body-sm ${
                              brand ? "text-on-surface" : "text-outline"
                            }`}
                          >
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>

                    <p
                      className={`mt-auto pt-[clamp(0.9rem,2.6vh,1.75rem)] font-display text-body-md font-bold ${
                        brand ? "text-primary" : "text-outline/80"
                      }`}
                    >
                      {route.verdict}
                    </p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <Simulator />

      {/* Five-step process. Pinned on desktop by the ScrollTrigger timeline
          above, which lights each step up in turn; `min-h-screen` and the
          centred content are what make the pinned frame look intentional
          rather than like the page has jammed. */}
      <section
        id="how-it-works"
        ref={processRef}
        className="flex scroll-mt-24 items-center overflow-hidden bg-surface py-[clamp(3.5rem,9vh,8rem)] md:h-screen md:py-8"
      >
        <div className="mx-auto w-full max-w-[1280px] px-margin-mobile md:px-margin-desktop">
          <Reveal className="mb-12 md:mb-5">
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
              <div>
                <h2 className="mb-2 font-display text-headline-lg text-on-surface">
                  Five steps, one visit
                </h2>
                <p className="max-w-2xl font-body text-body-md text-on-surface-variant">
                  The entire workflow runs where the water is.
                </p>
              </div>

              {/* The section's actual argument, stated once up top and then
                  proved by the time track underneath the walkthrough. */}
              <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3">
                <ClockIcon size={22} play="view" className="text-primary" />
                <p className="font-body text-body-sm text-on-surface-variant">
                  <span className="font-display font-bold text-on-surface">
                    Under a minute
                  </span>{" "}
                  of hands-on work
                </p>
              </div>
            </div>
          </Reveal>

          {/* Walkthrough stage. The canvas holds the frame while the copy
              panels are stacked on top of one another in the same grid cell,
              so only the active step is visible and nothing reflows as the
              timeline cross-fades between them. */}
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div className="relative">
              <TestKitScene
                className="h-[22rem] w-full sm:h-[26rem] md:h-[min(22rem,42vh)] lg:h-[min(26rem,44vh)]"
                progress={walkProgress}
                choreograph
              />
            </div>

            {/* Desktop: cross-faded panels driven by the pinned timeline. */}
            <div className="relative hidden min-h-[16rem] md:grid">
              {PROCESS_STEPS.map(
                (
                  { icon: Icon, title, body, detail, needs, takes, mode },
                  index
                ) => (
                <div
                  key={title}
                  data-step
                  className="col-start-1 row-start-1 self-center"
                >
                  {/* Icon tile: a rotating conic halo behind a glass chip, so
                      the icon reads as live instrumentation rather than a flat
                      glyph. The halo only spins while its step is active. */}
                  <div className="relative mb-6 h-20 w-20">
                    <span
                      data-step-halo
                      aria-hidden="true"
                      className="absolute -inset-1 rounded-[1.4rem] opacity-70 blur-[6px]"
                      style={{
                        background: `conic-gradient(from 0deg, ${STEP_ACCENTS[index].from}, ${STEP_ACCENTS[index].to}, ${STEP_ACCENTS[index].from})`,
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `linear-gradient(140deg, ${STEP_ACCENTS[index].from}, ${STEP_ACCENTS[index].to})`,
                      }}
                    />
                    <span
                      data-step-icon
                      className="absolute inset-[3px] flex items-center justify-center rounded-[0.85rem] bg-surface-container-lowest/90 backdrop-blur-sm"
                    >
                      <Icon
                        size={30}
                        play="always"
                        className={STEP_ACCENTS[index].text}
                      />
                    </span>
                  </div>

                  {/* Progress pips — which of the five you are on, at a glance. */}
                  <div className="mb-3 flex items-center gap-2">
                    {PROCESS_STEPS.map((pip, pipIndex) => (
                      <span
                        key={pip.title}
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                          width: pipIndex === index ? "1.75rem" : "0.375rem",
                          background:
                            pipIndex === index
                              ? STEP_ACCENTS[index].from
                              : "var(--color-outline-variant)",
                        }}
                      />
                    ))}
                    <span className="ml-2 font-body text-label-md uppercase tracking-[0.3em] text-outline">
                      {index + 1} / {PROCESS_STEPS.length}
                    </span>
                  </div>

                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-headline-md text-on-surface">
                      {title}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-1 font-body text-[11px] font-bold uppercase tracking-wider ${
                        mode === "Unattended"
                          ? "bg-secondary/10 text-secondary"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {mode}
                    </span>
                  </div>

                  <p className="max-w-md font-body text-body-lg text-on-surface-variant">
                    {body}
                  </p>
                  <p className="mt-3 max-w-md font-body text-body-sm text-outline">
                    {detail}
                  </p>

                  <dl className="mt-6 grid max-w-md grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest/70 p-4">
                      <dt className="mb-1 font-body text-label-md uppercase tracking-widest text-outline">
                        Takes
                      </dt>
                      <dd className="font-display text-body-md font-bold text-on-surface">
                        {takes}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest/70 p-4">
                      <dt className="mb-1 font-body text-label-md uppercase tracking-widest text-outline">
                        You need
                      </dt>
                      <dd className="font-display text-body-md font-bold text-on-surface">
                        {needs}
                      </dd>
                    </div>
                  </dl>
                </div>
                )
              )}
            </div>

            {/* Mobile: the original stacked list. Pinning five screens of
                scroll on a phone would trap the viewport, so the walkthrough
                degrades to the plain sequence it always was. */}
            <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:hidden">
              {PROCESS_STEPS.map(
                ({ icon: Icon, title, body, detail, needs, takes, mode }) => (
                  <li
                    key={title}
                    className="group flex items-start gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest/60 p-4"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface-container-highest text-primary">
                      <Icon size={26} play="view" />
                    </div>
                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-body-lg font-bold text-on-surface">
                          {title}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider ${
                            mode === "Unattended"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {mode}
                        </span>
                      </div>
                      <p className="font-body text-body-sm text-on-surface-variant">
                        {body}
                      </p>
                      <p className="mt-2 font-body text-body-sm text-outline">
                        {detail}
                      </p>
                      <p className="mt-3 font-body text-label-md uppercase tracking-widest text-outline">
                        {takes} · {needs}
                      </p>
                    </div>
                  </li>
                )
              )}
            </ol>
          </div>

          {/* Time track. Four narrow segments and one wide one is the whole
              argument of this section in a single graphic: the work is over in
              seconds and the wait runs itself. Widths come from `span`, which
              is a drawing ratio — the only duration the site commits to is the
              roughly five-minute reaction, so every label stays qualitative.
              The fill bars are driven by the same pinned timeline as the
              panels (see the ScrollTrigger block above). */}
          <div className="mt-6 hidden md:block">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="font-body text-label-md uppercase tracking-[0.3em] text-outline">
                Time on site
              </span>
              <span className="font-body text-body-sm text-on-surface-variant">
                Four steps take seconds. The fifth is a wait nobody has to
                supervise.
              </span>
            </div>

            <ol className="flex items-stretch gap-1.5">
              {PROCESS_STEPS.map((step, index) => (
                <li
                  key={step.title}
                  style={{ flexGrow: step.span }}
                  className="min-w-0 basis-0"
                >
                  <div className="relative h-1.5 overflow-hidden rounded-full bg-outline-variant/30">
                    <span
                      data-step-track
                      aria-hidden="true"
                      className="absolute inset-0 origin-left rounded-full"
                      style={{
                        background: `linear-gradient(to right, ${STEP_ACCENTS[index].from}, ${STEP_ACCENTS[index].to})`,
                      }}
                    />
                  </div>
                  <p className="mt-2 truncate font-body text-label-md uppercase tracking-wider text-outline">
                    {step.title}
                  </p>
                  <p className="truncate font-body text-body-sm text-on-surface-variant">
                    {step.takes}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-surface-container-low py-[clamp(3.5rem,9vh,8rem)]">
        <div className="mx-auto max-w-[1280px] px-margin-mobile md:px-margin-desktop">
          <Reveal className="mb-16 text-center">
            <h2 className="font-display text-headline-lg text-on-surface">
              Efficiency comparison
            </h2>
          </Reveal>

          <Reveal className="overflow-x-auto">
            <table className="w-full border-collapse">
              <caption className="sr-only">
                Traditional laboratory testing compared with the Jaljyoti paper
                strip test
              </caption>
              <thead>
                <tr className="border-b border-outline-variant">
                  <th
                    scope="col"
                    className="px-4 py-6 text-left font-body text-label-md uppercase text-outline"
                  >
                    Criteria
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-6 text-center font-display font-bold text-on-surface-variant"
                  >
                    Traditional labs
                  </th>
                  <th
                    scope="col"
                    className="rounded-t-2xl bg-primary/5 px-4 py-6 text-center font-display font-bold text-primary"
                  >
                    Jaljyoti
                  </th>
                </tr>
              </thead>
              <tbody className="font-body text-body-md">
                {COMPARISON.map((row, index) => (
                  <tr
                    key={row.criteria}
                    className={
                      index < COMPARISON.length - 1
                        ? "border-b border-outline-variant/30"
                        : ""
                    }
                  >
                    <th
                      scope="row"
                      className="px-4 py-6 text-left font-display font-bold text-on-surface"
                    >
                      {row.criteria}
                    </th>
                    <td className="px-4 py-6 text-center text-on-surface-variant">
                      {row.traditional}
                    </td>
                    <td
                      className={`bg-primary/5 px-4 py-6 font-bold text-primary ${
                        index === COMPARISON.length - 1 ? "rounded-b-2xl" : ""
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <CheckIcon size={18} play="view" className="text-primary/70" />
                        {row.jaljyoti}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* Applications */}
      <section id="applications" className="scroll-mt-24 py-[clamp(3.5rem,9vh,8rem)]">
        <div className="mx-auto max-w-[1280px] px-margin-mobile md:px-margin-desktop">
          <Reveal className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <h2 className="mb-4 font-display text-headline-lg text-on-surface">
                Versatile impact
              </h2>
              <p className="font-body text-body-md text-on-surface-variant">
                Jaljyoti is built to serve every setting that depends on clean
                water.
              </p>
            </div>
            <Link
              href="/gallery"
              className="group flex items-center gap-2 font-display font-bold text-primary"
            >
              See it in the field
              <ArrowRightIcon size={22} />
            </Link>
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-gutter md:h-[min(42rem,62vh)] md:grid-cols-6 md:grid-rows-2">
            <div className="group relative h-64 overflow-hidden rounded-[32px] md:col-span-4 md:h-auto">
              <MediaFrame
                src={IMAGES.agriculture.src}
                alt={IMAGES.agriculture.alt}
                label={IMAGES.agriculture.label}
                hint={IMAGES.agriculture.hint}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-full w-full"
                imageClassName="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/25 to-transparent p-8">
                <h3 className="font-display text-headline-md text-white">
                  Sustainable agriculture
                </h3>
                <p className="font-body text-body-sm text-white/80">
                  Check irrigation water before it reaches the crop.
                </p>
              </div>
            </div>

            <div className="group relative h-72 overflow-hidden rounded-[32px] md:order-first md:col-span-2 md:row-span-2 md:h-auto">
              <MediaFrame
                src={IMAGES.community.src}
                alt={IMAGES.community.alt}
                label={IMAGES.community.label}
                hint={IMAGES.community.hint}
                objectPosition={IMAGES.community.objectPosition}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="h-full w-full"
                imageClassName="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/30 to-transparent p-8">
                <h3 className="font-display text-headline-md text-white">
                  Schools & communities
                </h3>
                <p className="font-body text-body-sm text-white/80">
                  Anyone can run the test — no technician required.
                </p>
              </div>
            </div>

            <div className="group relative flex flex-col justify-between gap-8 overflow-hidden rounded-[32px] bg-[linear-gradient(150deg,#00413c,#005c55_45%,#0f766e)] p-8 md:col-span-2">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:26px_26px]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-14 -right-14 h-44 w-44 rounded-full bg-[radial-gradient(closest-side,rgba(155,242,232,0.4),transparent)]"
              />
              <FactoryIcon
                size={40}
                play="always"
                className="relative text-primary-fixed"
              />
              <div className="relative">
                <h3 className="mb-2 font-display text-headline-md text-white">
                  Industrial use
                </h3>
                <p className="font-body text-body-sm text-white/75">
                  Process-water monitoring without pausing the line.
                </p>
              </div>
            </div>

            <div className="group relative h-64 overflow-hidden rounded-[32px] md:col-span-2 md:h-auto">
              <MediaFrame
                src={IMAGES.municipal.src}
                alt={IMAGES.municipal.alt}
                label={IMAGES.municipal.label}
                hint={IMAGES.municipal.hint}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="h-full w-full"
                imageClassName="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/25 to-transparent p-8">
                <h3 className="font-display text-headline-md text-white">
                  Municipal supply
                </h3>
                <p className="font-body text-body-sm text-white/80">
                  Spot-check government distribution points across a district.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="px-margin-mobile py-[clamp(3.5rem,9vh,8rem)]">
        <Reveal className="relative mx-auto max-w-4xl overflow-hidden rounded-[48px] bg-primary p-12 text-center text-on-primary md:p-24">
          <SparkleIcon
            size={34}
            play="view"
            className="mx-auto mb-6 text-primary-fixed"
          />
          <h2 className="mb-8 font-display text-display-sm md:text-display-lg">
            Ready to improve water safety?
          </h2>
          <p className="mx-auto mb-12 max-w-xl font-body text-body-lg text-on-primary-container">
            Tell us where you need testing and we will get back to you with a
            pilot plan.
          </p>
          <div className="flex flex-col justify-center gap-4 md:flex-row">
            <button
              type="button"
              onClick={() => openGetStarted("Request a pilot kit")}
              className="group flex items-center justify-center gap-2 rounded-2xl bg-white px-10 py-5 font-display font-bold text-primary transition-colors hover:bg-on-primary-container active:scale-[0.98]"
            >
              Request a pilot kit
              <ArrowRightIcon size={20} />
            </button>
            <Link
              href="/team"
              className="group flex items-center justify-center gap-2 rounded-2xl border border-white/30 px-10 py-5 font-display font-bold text-white transition-colors hover:bg-white/10"
            >
              <GroupsIcon size={20} />
              Talk to a scientist
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

export default function ProductContent() {
  return (
    <SiteShell active="/">
      <ProductMain />
    </SiteShell>
  );
}
