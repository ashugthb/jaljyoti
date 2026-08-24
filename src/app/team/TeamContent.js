"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircleIcon, ChevronDownIcon, CloseIcon } from "@/components/icons";
import AmbientBackground from "@/components/site/AmbientBackground";
import { useGetStarted } from "@/components/site/GetStarted";
import Reveal from "@/components/site/Reveal";
import SiteShell from "@/components/site/SiteShell";

/**
 * ---------------------------------------------------------------------------
 * IMAGES — drop new files in /public and change only the strings below.
 * `null` renders the neutral placeholder, sized exactly like the real photo.
 * Portraits look best square (1:1) and at least 480×480.
 * ---------------------------------------------------------------------------
 */
const PORTRAITS = {
  meenu: "/Prof.MeenuChhabra.jpg",
  jyoti: "/Ms.JyotiGautam.jpg",
  sanjeet: "/sanjeet.jpg",
};

/**
 * Bios and highlights carry over verbatim from the existing Team section so the
 * two pages can never disagree about who does what.
 *
 * `links` and `publications` render only when non-empty — no dead "#" links.
 * Shape: links: [{ label: "LinkedIn", href: "https://…" }]
 *        publications: ["Title of the paper (2024)"]
 */
const TEAM = [
  {
    id: "meenu",
    name: "Prof. Meenu Chhabra",
    role: "Non-executive Director",
    image: PORTRAITS.meenu,
    tags: ["Environmental Microbiology", "Biosensing"],
    bio: "Distinguished Professor in the Department of Bioscience at IIT Jodhpur and Head of the Center for Emerging Technologies for Sustainable Development (CETSD). Her work joins microbial technology with environmental remediation, and anchors the science behind Jaljyoti's detection chemistry.",
    highlights: [
      "Distinguished Professor, Department of Bioscience, IIT Jodhpur.",
      "Head of the Center for Emerging Technologies for Sustainable Development (CETSD).",
      "Expert in biotechnology and environmental microbiology.",
      "Research focuses on microbial technologies for environmental remediation and biosensing applications.",
      "Significant contributions through research, publications, and mentorship in bioscience and technology.",
    ],
    links: [],
    publications: [],
  },
  {
    id: "jyoti",
    name: "Ms. Jyoti Gautam",
    role: "Director",
    image: PORTRAITS.jyoti,
    tags: ["Biosensors", "Water Quality"],
    bio: "Research scholar pursuing an integrated M.Tech–Ph.D. at IIT Jodhpur, developing the advanced biosensors at the heart of the Jaljyoti kit. Her focus is making bacterial detection cheap enough and simple enough to run outside a laboratory.",
    highlights: [
      "Research scholar pursuing an integrated M.Tech-Ph.D. at IIT Jodhpur.",
      "Focused on developing advanced biosensors for water quality management.",
      "Specializes in cost-effective and user-friendly bacterial detection techniques.",
      "Committed to bridging scientific innovation with real-world applications for safe and sustainable water resources.",
    ],
    links: [],
    publications: [],
  },
  {
    id: "sanjeet",
    name: "Sanjeet Athawale",
    role: "Product Manager",
    image: PORTRAITS.sanjeet,
    tags: ["Product Management", "User Research"],
    bio: "Final-year B.Tech student in Electrical Engineering at IIT Jodhpur. He turns laboratory results into a product people can actually use in the field, coordinating research, design, and delivery.",
    highlights: [
      "B.Tech 4th year student at IIT Jodhpur.",
      "Pursuing a major in Electrical Engineering.",
      "Experienced in product management and development.",
      "Skilled in market research, user experience design, and project coordination.",
    ],
    links: [],
    publications: [],
  },
];

/** Must match the `gap-gutter` (24px) used by the card grid. */
const GRID_GAP = 24;

/**
 * Column count of the card grid, so the pointer under the expanded panel can be
 * centred on the card that opened it. These numbers must stay in step with the
 * `sm:grid-cols-2 lg:grid-cols-3` on the grid itself — Tailwind needs literal
 * class names, so the count cannot be derived from one place.
 */
function useGridColumns() {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const medium = window.matchMedia("(min-width: 640px)");

    const sync = () => setColumns(wide.matches ? 3 : medium.matches ? 2 : 1);
    sync();

    wide.addEventListener("change", sync);
    medium.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      medium.removeEventListener("change", sync);
    };
  }, []);

  return columns;
}

function TeamCard({ member, expanded, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(member.id)}
      aria-expanded={expanded}
      aria-controls="team-detail-panel"
      aria-label={`${expanded ? "Hide" : "Show"} the full profile of ${member.name}, ${member.role}`}
      className={`group jj-card relative flex h-full cursor-pointer flex-col rounded-[24px] p-6 text-left transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary xl:p-8 ${expanded
          ? "-translate-y-2 shadow-[0_16px_40px_rgba(15,23,42,0.12)] ring-2 ring-primary"
          : "hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
        }`}
    >
      <div
        className={`relative mx-auto mb-8 h-40 w-40 overflow-hidden rounded-full border-4 transition-all duration-500 xl:h-48 xl:w-48 ${expanded
            ? "scale-105 border-primary"
            : "border-surface-container-high group-hover:scale-105"
          }`}
      >
        {member.image ? (
          <Image
            src={member.image}
            alt={`Portrait of ${member.name}`}
            fill
            sizes="192px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-container-highest text-center font-display text-body-sm text-on-surface-variant">
            Photo
            <br />
            pending
          </div>
        )}
      </div>

      <div className="text-center">
        {/* min-h reserves two lines so names, roles, and chips line up across
            cards regardless of how long a name is */}
        <h3 className="mb-1 flex min-h-[2.6em] items-center justify-center font-display text-headline-md text-on-surface">
          {member.name}
        </h3>
        <p className="mb-4 font-body text-label-md uppercase tracking-wider text-secondary">
          {member.role}
        </p>

        {/* Chips reveal on hover, but only where hovering is possible — on touch
            screens (including wide tablets) they stay visible. Once a card is
            expanded its chips stay up regardless. */}
        <div
          className={`flex min-h-14 flex-wrap content-start justify-center gap-2 transition-all duration-500 ${expanded
              ? "translate-y-0 opacity-100"
              : "md:[@media(hover:hover)]:translate-y-2 md:[@media(hover:hover)]:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100"
            }`}
        >
          {member.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface-container-low px-3 py-1 text-[11px] font-bold text-on-secondary-container"
            >
              {tag}
            </span>
          ))}
        </div>

        <span
          className={`mt-4 inline-flex items-center gap-1 font-body text-body-sm transition-colors ${expanded ? "text-primary" : "text-outline group-hover:text-primary"
            }`}
        >
          {expanded ? "Hide profile" : "Read profile"}
          <ChevronDownIcon
            size={18}
            className={`transition-transform duration-500 ${expanded ? "rotate-180" : ""}`}
          />
        </span>
      </div>
    </button>
  );
}

function DetailPanel({ member, onClose, onEnquire }) {
  return (
    <article
      key={member.id}
      className="jj-card jj-fade-up overflow-hidden rounded-[28px] p-8 md:p-12"
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-2xl sm:block">
            {member.image ? (
              <Image
                src={member.image}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-surface-container-highest" />
            )}
          </div>
          <div>
            <p className="mb-1 font-body text-label-md uppercase tracking-widest text-secondary">
              {member.role}
            </p>
            <h3 className="font-display text-headline-lg text-on-surface">
              {member.name}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${member.name}'s profile`}
          className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
        >
          <CloseIcon size={22} />
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <p
            className="jj-fade-up font-body text-body-lg leading-relaxed text-on-surface-variant"
            style={{ animationDelay: "60ms" }}
          >
            {member.bio}
          </p>

          <h4
            className="jj-fade-up mt-10 mb-5 font-display text-body-lg font-bold text-on-surface"
            style={{ animationDelay: "120ms" }}
          >
            Focus areas
          </h4>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {member.highlights.map((highlight, index) => (
              <li
                key={highlight}
                className="jj-fade-up flex items-start gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4"
                style={{ animationDelay: `${160 + index * 60}ms` }}
              >
                <CheckCircleIcon
                  size={20}
                  play="always"
                  className="mt-0.5 shrink-0 text-primary"
                />
                <span className="font-body text-body-sm text-on-surface-variant">
                  {highlight}
                </span>
              </li>
            ))}
          </ul>

          {member.publications.length > 0 ? (
            <>
              <h4 className="mt-10 mb-5 font-display text-body-lg font-bold text-on-surface">
                Recent publications
              </h4>
              <ul className="space-y-3">
                {member.publications.map((publication) => (
                  <li
                    key={publication}
                    className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 font-body text-body-md italic text-on-surface-variant"
                  >
                    {publication}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <aside
          className="jj-fade-up flex h-fit flex-col gap-6 rounded-2xl bg-surface-container-low p-7"
          style={{ animationDelay: "200ms" }}
        >
          <div>
            <p className="mb-3 font-body text-label-md uppercase tracking-widest text-on-surface-variant">
              Expertise
            </p>
            <div className="flex flex-wrap gap-2">
              {member.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white px-3 py-1.5 font-body text-body-sm font-semibold text-on-secondary-container"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {member.links.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {member.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-4 py-2 font-body text-body-sm text-primary transition-colors hover:bg-primary hover:text-on-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onEnquire}
            className="w-full rounded-xl bg-primary py-4 font-display font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-[0.99]"
          >
            Book a consultation
          </button>
        </aside>
      </div>
    </article>
  );
}

function TeamMain() {
  const [activeId, setActiveId] = useState(null);
  const columns = useGridColumns();
  const panelRef = useRef(null);
  const { openGetStarted } = useGetStarted();

  const activeIndex = TEAM.findIndex((entry) => entry.id === activeId);
  const member = activeIndex >= 0 ? TEAM[activeIndex] : null;
  const isOpen = member !== null;

  const toggle = useCallback((id) => {
    setActiveId((current) => (current === id ? null : id));
  }, []);

  // Keep the panel in view when it opens, without yanking the page around.
  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 320);
    return () => window.clearTimeout(timer);
  }, [isOpen, activeId]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Centre of the active card. Column width is (100% - gaps) / columns, so the
  // gaps have to be part of the maths or the pointer drifts off the card.
  const column = activeIndex >= 0 ? activeIndex % columns : 0;
  const pointerLeft =
    activeIndex < 0 || columns === 1
      ? "50%"
      : `calc((100% - ${(columns - 1) * GRID_GAP}px) / ${columns} * ${column + 0.5} + ${column * GRID_GAP
      }px)`;

  return (
    <main className="pt-[clamp(3.5rem,9vh,8rem)] pb-[clamp(3.5rem,9vh,8rem)]">
      <section className="relative mb-20">
        <AmbientBackground variant="subtle" />
        <div className="relative z-10 mx-auto max-w-[1280px] px-margin-mobile text-center md:px-margin-desktop">
          <Reveal>
            <span className="mb-6 inline-block rounded-full bg-secondary-container/20 px-4 py-1 font-body text-label-md uppercase tracking-widest text-secondary">
              Scientific Stewardship
            </span>
            <h1 className="mb-6 font-display text-display-sm text-on-surface md:text-display-lg">
              Humanist Intelligence.
              <br />
              Precision Biotech.
            </h1>
            <p className="mx-auto max-w-2xl font-body text-body-lg text-on-surface-variant">
              Meet the scientists, researchers, and builders behind Jaljyoti — a
              team from IIT Jodhpur turning laboratory-grade water diagnostics
              into a five-minute test anyone can run.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((entry, index) => (
            <Reveal key={entry.id} delay={index * 80} className="h-full">
              <TeamCard
                member={entry}
                expanded={entry.id === activeId}
                onToggle={toggle}
              />
            </Reveal>
          ))}
        </div>

        {/* The panel expands in place: grid-template-rows animates from 0fr to
            1fr, so the cards above simply move up or down with it. */}
        <div
          ref={panelRef}
          id="team-detail-panel"
          role="region"
          aria-live="polite"
          aria-label="Selected profile"
          className={`relative grid transition-[grid-template-rows,margin] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isOpen ? "mt-8 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]"
            }`}
        >
          {/* Pointer sits under whichever card is open */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -top-3 h-4 w-8 -translate-x-1/2 transition-all duration-500 ${isOpen ? "opacity-100" : "opacity-0"
              }`}
            style={{ left: pointerLeft }}
          >
            <div className="mx-auto h-4 w-4 origin-center rotate-45 rounded-[3px] border-t border-l border-[#e2e8f0] bg-white" />
          </div>

          <div className="overflow-hidden">
            {member ? (
              <DetailPanel
                member={member}
                onClose={() => setActiveId(null)}
                onEnquire={() => openGetStarted("Research collaboration")}
              />
            ) : null}
          </div>
        </div>

        {!isOpen ? (
          <p className="mt-10 text-center font-body text-body-sm text-outline">
            Select a profile to read the full background.
          </p>
        ) : null}
      </section>
    </main>
  );
}

export default function TeamContent() {
  return (
    <SiteShell active="/team">
      <TeamMain />
    </SiteShell>
  );
}
