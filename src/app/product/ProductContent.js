"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import BiotechIcon from "@mui/icons-material/Biotech";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ColorizeIcon from "@mui/icons-material/Colorize";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FactoryIcon from "@mui/icons-material/Factory";
import GroupsIcon from "@mui/icons-material/Groups";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SchoolIcon from "@mui/icons-material/School";
import ScienceIcon from "@mui/icons-material/Science";
import TimerIcon from "@mui/icons-material/Timer";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AmbientBackground from "@/components/site/AmbientBackground";
import CursorSpotlight from "@/components/site/CursorSpotlight";
import FilmModal from "@/components/site/FilmModal";
import { useGetStarted } from "@/components/site/GetStarted";
import LoadReveal from "@/components/site/LoadReveal";
import Magnetic from "@/components/site/Magnetic";
import MediaFrame from "@/components/site/MediaFrame";
import Reveal from "@/components/site/Reveal";
import SiteShell from "@/components/site/SiteShell";
import TiltCard from "@/components/site/TiltCard";

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
    src: "/bg-1.webp",
    alt: "Macro illustration of glowing microorganisms in water, evoking biological contamination at a cellular scale",
    label: "Product kit hero",
    hint: "Studio shot of the Jaljyoti kit — vial, reagent, strip, colour chart. 4:5 portrait, ~1200×1500.",
  },
  impact: {
    src: "/img7.jpg",
    alt: "The Jaljyoti team demonstrating the paper-strip test at a research exhibition",
    label: "Field demonstration",
    hint: "Square crop of a real demonstration or deployment, ~1200×1200.",
    objectPosition: "center 30%",
  },
  agriculture: {
    src: "/bg4.webp",
    alt: "Irrigation watering a field of young crops",
    label: "Agriculture",
    hint: "Landscape, ~1600×900.",
  },
  community: {
    src: "/img9.jpg",
    alt: "Students and residents testing water with the Jaljyoti kit in a village",
    label: "Schools & communities",
    hint: "Landscape crop of a school or community deployment, ~1600×900.",
    objectPosition: "center 25%",
  },
  municipal: {
    src: "/bg3.webp",
    alt: "Clean treated water flowing from a supply outlet",
    label: "Municipal supply",
    hint: "Landscape shot of a treatment plant or municipal supply point, ~2000×900.",
  },
};

/** Three numbers that carry the pitch, shown under the hero call to action. */
const HERO_FACTS = [
  { value: "~5 min", label: "Time to a readable result" },
  { value: "0", label: "Lab instruments needed" },
  { value: "On-site", label: "Tested where the water is" },
];

/**
 * Credentials the repo can actually back up (team affiliations in Team.js and
 * the exhibition captions in Gallary.js). Add a row only when it is verifiable —
 * certification badges belong here only once the certificate exists.
 */
const TRUST_MARKERS = [
  { icon: SchoolIcon, label: "IIT Jodhpur", detail: "Research home" },
  {
    icon: EmojiEventsIcon,
    label: "NIH Roorkee",
    detail: "First poster award, PSD test",
  },
  {
    icon: BiotechIcon,
    label: "CETSD",
    detail: "Emerging tech for sustainability",
  },
  {
    icon: GroupsIcon,
    label: "Field tested",
    detail: "Rural deployments across India",
  },
];

const PROBLEM_STATS = [
  {
    icon: CrisisAlertIcon,
    tone: "error",
    value: "2.2 Billion",
    body: "People worldwide lack safely managed drinking water (WHO/UNICEF Joint Monitoring Programme).",
  },
  {
    icon: ScheduleIcon,
    tone: "secondary",
    value: "72 hours → 5 minutes",
    body: "Standard lab incubation takes up to three days. The Jaljyoti strip answers at the water source.",
  },
];

const TIMELINE = [
  {
    step: "01",
    title: "Collection",
    aside: "Standard start",
    body: "Traditional: remote samples travel for hours before anyone looks at them. Jaljyoti: test at the source.",
    highlight: false,
  },
  {
    step: "02",
    title: "Biotech reaction",
    aside: "Jaljyoti advantage",
    body: "Enzymatic biomarkers react with contaminants on the paper strip and produce a visible colour shift.",
    highlight: true,
  },
  {
    step: "03",
    title: "Decision point",
    aside: "Instant output",
    body: "Read the result in about five minutes instead of waiting three days to learn the water was unsafe.",
    highlight: false,
  },
];

const PROCESS_STEPS = [
  {
    icon: WaterDropIcon,
    title: "Collect",
    body: "Take a small sample from any source.",
  },
  {
    icon: ScienceIcon,
    title: "Add reagent",
    body: "Add the enzyme reagent to the sample.",
  },
  {
    icon: ColorizeIcon,
    title: "Dip",
    body: "Place the paper strip into the solution.",
  },
  {
    icon: TimerIcon,
    title: "Wait",
    body: "Allow about five minutes for the reaction.",
  },
  {
    icon: DoneAllIcon,
    title: "Compare",
    body: "Read the result against the colour chart.",
  },
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

const TONE_CLASSES = {
  error: { ring: "bg-error/10", text: "text-error" },
  secondary: { ring: "bg-secondary/10", text: "text-secondary" },
};

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
      icon: WarningAmberIcon,
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

function Simulator() {
  const [purity, setPurity] = useState(98);
  const reading = useMemo(() => readingFor(purity), [purity]);
  const ResultIcon = reading.icon;

  return (
    <section className="py-24 md:py-32">
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
                  <ResultIcon
                    sx={{ fontSize: 40 }}
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
            <div className="jj-panel relative flex aspect-[1/2] w-full max-w-sm flex-col items-center justify-between rounded-[60px] p-8 shadow-2xl">
              <div className="mb-12 h-4 w-24 rounded-full bg-outline-variant/20" />
              <div className="relative h-80 w-20 overflow-hidden rounded-full border-8 border-white bg-surface-container shadow-inner">
                <div
                  className="absolute bottom-0 w-full transition-all duration-700 ease-out"
                  style={{
                    height: `${100 - purity}%`,
                    backgroundColor: reading.color,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5" />
              </div>
              <div className="mt-12 text-center">
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

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden py-20">
        <AmbientBackground variant="hero" />
        <CursorSpotlight className="absolute inset-0" />

        <div className="relative z-10 mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-16 px-margin-mobile md:px-margin-desktop lg:grid-cols-2">
          <div>
            <LoadReveal
              as="span"
              variant="pop"
              delay={0}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-1.5 font-body text-label-md uppercase tracking-widest text-primary"
            >
              <span className="jj-pulse-dot" aria-hidden="true" />
              Next-gen water testing
            </LoadReveal>

            <LoadReveal
              as="h1"
              variant="wipe"
              delay={100}
              className="mb-6 font-display text-display-sm leading-[1.1] text-on-surface md:text-display-lg"
            >
              Know if water is <span className="italic text-primary">safe</span>{" "}
              within just <span className="text-secondary">5 minutes.</span>
            </LoadReveal>

            <LoadReveal
              as="p"
              variant="blur"
              delay={260}
              className="mb-10 max-w-xl font-body text-body-lg text-on-surface-variant"
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
                  <ArrowForwardIcon
                    sx={{ fontSize: 20 }}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </Magnetic>
              <a
                href="#how-it-works"
                className="rounded-xl border border-outline-variant bg-white/60 px-8 py-4 font-display font-bold text-on-surface transition-colors hover:bg-surface-container"
              >
                How it works
              </a>
            </LoadReveal>

            <LoadReveal as="div" variant="blur" delay={480} className="mt-8">
              <FilmModal />
            </LoadReveal>

            <LoadReveal
              as="dl"
              variant="blur"
              delay={600}
              className="mt-8 grid grid-cols-3 gap-4 border-t border-outline-variant/40 pt-8"
            >
              {HERO_FACTS.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-display text-headline-md text-primary">
                    {fact.value}
                  </dt>
                  <dd className="font-body text-body-sm text-on-surface-variant">
                    {fact.label}
                  </dd>
                </div>
              ))}
            </LoadReveal>
          </div>

          {/* Float starts only once the entrance below has settled (delay
              matches LoadReveal's 220ms start + ~1.1s duration). */}
          <div className="jj-float relative flex items-center justify-center" style={{ animationDelay: "1.3s" }}>
            <LoadReveal
              as="div"
              variant="image"
              delay={220}
              className="relative w-full max-w-md"
            >
              <div className="jj-image-glow" aria-hidden="true" />
              <TiltCard>
                <MediaFrame
                  src={IMAGES.hero.src}
                  alt={IMAGES.hero.alt}
                  label={IMAGES.hero.label}
                  hint={IMAGES.hero.hint}
                  priority
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="aspect-[4/5] w-full rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,92,85,0.4)]"
                />
                {/* Cinematic gradient so the glass card below stays legible
                    and the image reads as lit rather than flat. */}
                <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                <div className="jj-glass absolute right-4 bottom-6 left-4 rounded-2xl p-5">
                  <p className="mb-1 font-body text-label-md uppercase tracking-widest text-primary">
                    Result window
                  </p>
                  <p className="font-display text-body-lg font-bold text-on-surface">
                    Colour shift readable by eye — no instrument required.
                  </p>
                </div>
              </TiltCard>
            </LoadReveal>
          </div>
        </div>
      </section>

      {/* Trust markers */}
      <section className="relative overflow-hidden border-y border-outline-variant/20 bg-surface-container-low py-20">
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

          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 md:grid-cols-4 md:gap-y-0">
            {TRUST_MARKERS.map(({ icon: Icon, label, detail }, index) => (
              <Reveal key={label} delay={index * 100}>
                <div className="group flex items-center gap-4 md:justify-center md:border-l md:border-outline-variant/25 md:px-6 md:first:border-l-0">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-transparent ring-1 ring-primary/10 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:from-primary/20 group-hover:shadow-[0_10px_24px_rgba(0,92,85,0.18)] group-hover:ring-primary/30">
                    <Icon
                      sx={{ fontSize: 26 }}
                      className="text-primary/55 transition-colors duration-500 group-hover:text-primary"
                    />
                  </div>
                  <div>
                    <div className="font-display text-body-lg font-bold tracking-tight text-on-surface">
                      {label}
                    </div>
                    <div className="font-body text-body-sm text-on-surface-variant">
                      {detail}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Problem statement */}
      <section className="overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
            <Reveal>
              <h2 className="mb-8 font-display text-headline-lg text-on-surface">
                Water safety is a race{" "}
                <span className="text-error">against time.</span>
              </h2>
              <p className="mb-12 font-body text-body-lg text-on-surface-variant">
                Traditional water testing is broken. By the time a sample
                reaches a lab and gets processed, contaminated water has already
                been consumed. We change the timeline from days to minutes.
              </p>
              <div className="space-y-8">
                {PROBLEM_STATS.map(({ icon: Icon, tone, value, body }) => (
                  <div key={value} className="group flex items-start gap-6">
                    <div
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110 ${TONE_CLASSES[tone].ring}`}
                    >
                      <Icon
                        sx={{ fontSize: 30 }}
                        className={TONE_CLASSES[tone].text}
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-headline-md text-on-surface">
                        {value}
                      </h3>
                      <p className="font-body text-body-md text-on-surface-variant">
                        {body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="relative">
              <div className="relative aspect-square overflow-hidden rounded-[40px] shadow-2xl">
                <MediaFrame
                  src={IMAGES.impact.src}
                  alt={IMAGES.impact.alt}
                  label={IMAGES.impact.label}
                  hint={IMAGES.impact.hint}
                  objectPosition={IMAGES.impact.objectPosition}
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="h-full w-full"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                <div className="jj-glass absolute right-8 bottom-8 left-8 rounded-2xl p-6">
                  <p className="mb-2 font-body text-label-md uppercase tracking-widest text-primary">
                    Impact highlight
                  </p>
                  <p className="font-display text-body-lg font-bold text-on-surface">
                    Taken out of the lab and into the field — demonstrated to
                    researchers, officials, and rural households.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Detection cycle */}
      <section className="bg-surface-container-highest py-24">
        <div className="mx-auto mb-20 max-w-[1280px] px-margin-mobile text-center md:px-margin-desktop">
          <Reveal>
            <h2 className="mb-4 font-display text-headline-lg text-on-surface">
              Redefining the detection cycle
            </h2>
            <p className="mx-auto max-w-2xl font-body text-body-md text-on-surface-variant">
              Jaljyoti collapses the traditional laboratory workflow into a
              single, seamless interaction.
            </p>
          </Reveal>
        </div>

        <Reveal className="relative mx-auto max-w-4xl px-margin-mobile">
          <div className="relative flex flex-col gap-12">
            <div className="absolute top-4 bottom-4 left-[22px] w-1 bg-outline-variant/30" />
            {TIMELINE.map(({ step, title, aside, body, highlight }) => (
              <div
                key={step}
                className="relative flex items-center gap-8 md:gap-16"
              >
                <div
                  className={`z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display font-bold ${
                    highlight
                      ? "animate-pulse bg-primary text-on-primary shadow-[0_0_20px_rgba(0,106,99,0.4)]"
                      : "bg-outline-variant text-on-surface"
                  }`}
                >
                  {step}
                </div>
                <div
                  className={`jj-panel relative flex-1 overflow-hidden rounded-2xl border-l-4 p-6 transition-all ${
                    highlight
                      ? "border-l-primary"
                      : "border-l-outline-variant hover:border-l-primary"
                  }`}
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <h3
                      className={`font-display text-body-lg font-bold ${
                        highlight ? "text-primary" : "text-on-surface"
                      }`}
                    >
                      {title}
                    </h3>
                    {highlight ? (
                      <span className="rounded-full bg-primary/10 px-3 py-1 font-body text-[11px] font-bold text-primary">
                        {aside}
                      </span>
                    ) : (
                      <span className="font-body text-body-sm italic text-outline">
                        {aside}
                      </span>
                    )}
                  </div>
                  <p className="font-body text-body-sm text-on-surface-variant">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <Simulator />

      {/* Five-step process */}
      <section id="how-it-works" className="scroll-mt-24 bg-surface py-24">
        <div className="mx-auto max-w-[1280px] px-margin-mobile md:px-margin-desktop">
          <Reveal className="mb-16 text-center">
            <h2 className="mb-4 font-display text-headline-lg text-on-surface">
              Five steps, one visit
            </h2>
            <p className="mx-auto max-w-2xl font-body text-body-md text-on-surface-variant">
              The entire workflow runs where the water is.
            </p>
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-5">
            {PROCESS_STEPS.map(({ icon: Icon, title, body }, index) => (
              <div
                key={title}
                className="group flex flex-col items-center text-center"
              >
                <div
                  className={`relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-container-highest text-on-surface transition-all duration-500 group-hover:bg-primary group-hover:text-white ${
                    index < PROCESS_STEPS.length - 1 ? "jj-step-line" : ""
                  }`}
                >
                  <Icon sx={{ fontSize: 30 }} />
                </div>
                <h3 className="mb-2 font-display text-body-lg font-bold text-on-surface">
                  {title}
                </h3>
                <p className="font-body text-body-sm text-on-surface-variant">
                  {body}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-surface-container-low py-24 md:py-32">
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
                      className={`bg-primary/5 px-4 py-6 text-center font-bold text-primary ${
                        index === COMPARISON.length - 1 ? "rounded-b-2xl" : ""
                      }`}
                    >
                      {row.jaljyoti}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* Applications */}
      <section id="applications" className="scroll-mt-24 py-24 md:py-32">
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
              <ArrowRightAltIcon
                sx={{ fontSize: 22 }}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-gutter md:h-[700px] md:grid-cols-6 md:grid-rows-2">
            <div className="group relative h-64 overflow-hidden rounded-[32px] md:col-span-3 md:h-auto">
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

            <div className="group relative h-64 overflow-hidden rounded-[32px] md:col-span-3 md:h-auto">
              <MediaFrame
                src={IMAGES.community.src}
                alt={IMAGES.community.alt}
                label={IMAGES.community.label}
                hint={IMAGES.community.hint}
                objectPosition={IMAGES.community.objectPosition}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-full w-full"
                imageClassName="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/25 to-transparent p-8">
                <h3 className="font-display text-headline-md text-white">
                  Schools & communities
                </h3>
                <p className="font-body text-body-sm text-white/80">
                  Anyone can run the test — no technician required.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-8 rounded-[32px] bg-secondary-container p-8 md:col-span-2">
              <FactoryIcon
                sx={{ fontSize: 40 }}
                className="text-on-secondary-container"
              />
              <div>
                <h3 className="mb-2 font-display text-headline-md text-on-secondary-container">
                  Industrial use
                </h3>
                <p className="font-body text-body-sm text-on-secondary-container/80">
                  Process-water monitoring without pausing the line.
                </p>
              </div>
            </div>

            <div className="group relative h-64 overflow-hidden rounded-[32px] md:col-span-4 md:h-auto">
              <MediaFrame
                src={IMAGES.municipal.src}
                alt={IMAGES.municipal.alt}
                label={IMAGES.municipal.label}
                hint={IMAGES.municipal.hint}
                sizes="(max-width: 768px) 100vw, 66vw"
                className="h-full w-full"
                imageClassName="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/25 to-transparent p-8">
                <h3 className="font-display text-headline-md text-white">
                  Municipal & government supply
                </h3>
                <p className="font-body text-body-sm text-white/80">
                  Spot-check distribution points across a whole district.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="px-margin-mobile py-24 md:py-32">
        <Reveal className="relative mx-auto max-w-4xl overflow-hidden rounded-[48px] bg-primary p-12 text-center text-on-primary md:p-24">
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
              className="rounded-2xl bg-white px-10 py-5 font-display font-bold text-primary transition-colors hover:bg-on-primary-container active:scale-[0.98]"
            >
              Request a pilot kit
            </button>
            <Link
              href="/team"
              className="rounded-2xl border border-white/30 px-10 py-5 font-display font-bold text-white transition-colors hover:bg-white/10"
            >
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
