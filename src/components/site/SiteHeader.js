"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useGetStarted } from "./GetStarted";
import { COMPANY, NAV_LINKS } from "./siteMeta";

/**
 * Fixed top bar — a frosted-glass panel in the site's own light palette, not
 * an inverted dark bar. Every other surface on the site (the hero wash, the
 * cards, the footer) sits in the same pale teal-tinted register; a solid
 * dark nav broke that continuity and read as a bolted-on piece rather than
 * part of the same design. The "premium" upgrade here is structural instead:
 * a real frosted blur with a colour-tinted shadow, a gradient hairline
 * instead of a flat border, and a filled pill for the active link instead of
 * a plain underline.
 *
 * `active` is the href of the current route so the tab indicator is honest.
 * Links flagged with an action open the enquiry dialog instead of navigating.
 */
export default function SiteHeader({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openGetStarted } = useGetStarted();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const desktopLinkClass = (isActive) =>
    `relative rounded-full px-4 py-2 font-body text-[14.5px] font-medium transition-all duration-300 ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
    }`;

  const mobileLinkClass = (isActive) =>
    `rounded-xl px-4 py-3 text-left font-body text-body-md font-medium transition-colors ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
    }`;

  const renderLink = (link, mobile) => {
    const isActive = link.href === active;
    const className = mobile ? mobileLinkClass(isActive) : desktopLinkClass(isActive);

    if (link.action === "get-started") {
      return (
        <button
          key={link.label}
          type="button"
          onClick={() => {
            setMenuOpen(false);
            openGetStarted();
          }}
          className={className}
        >
          {link.label}
        </button>
      );
    }

    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => setMenuOpen(false)}
        aria-current={isActive ? "page" : undefined}
        className={className}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b border-outline-variant/40 bg-surface/75 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "shadow-[0_10px_30px_rgba(0,92,85,0.12)]" : "shadow-[0_4px_16px_rgba(0,92,85,0.06)]"
      }`}
    >
      {/* A gradient hairline reads as designed; a flat border reads as default. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={COMPANY.logo}
            alt={`${COMPANY.legalName} logo`}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/10"
          />
          <span className="font-display text-headline-md tracking-tight text-primary">
            {COMPANY.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => renderLink(link, false))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openGetStarted()}
            className="hidden rounded-full bg-primary px-6 py-2.5 font-display text-label-md uppercase tracking-wide text-on-primary shadow-md transition-all duration-300 hover:bg-primary-container active:scale-95 sm:inline-block"
          >
            Get Started
          </button>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container md:hidden"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="site-mobile-menu"
          className="border-t border-outline-variant/40 bg-surface/95 backdrop-blur-xl md:hidden"
        >
          <nav className="mx-auto flex max-w-[1280px] flex-col gap-1 px-margin-mobile py-4">
            {NAV_LINKS.map((link) => renderLink(link, true))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
