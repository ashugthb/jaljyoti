"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useGetStarted } from "./GetStarted";
import { COMPANY, NAV_LINKS } from "./siteMeta";

/**
 * Fixed glass top bar. `active` is the href of the current route so the tab
 * underline is honest. Links flagged with an action open the enquiry dialog.
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

  const linkClass = (isActive, mobile) =>
    mobile
      ? `rounded-lg px-2 py-3 text-left font-body text-body-md transition-colors ${
          isActive ? "text-primary" : "text-on-surface-variant hover:text-primary"
        }`
      : `border-b-2 py-1 font-body text-body-md transition-all duration-300 ease-out ${
          isActive
            ? "border-primary text-primary"
            : "border-transparent text-on-surface-variant hover:text-primary"
        }`;

  const renderLink = (link, mobile) => {
    const isActive = link.href === active;

    if (link.action === "get-started") {
      return (
        <button
          key={link.label}
          type="button"
          onClick={() => {
            setMenuOpen(false);
            openGetStarted();
          }}
          className={linkClass(false, mobile)}
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
        className={linkClass(isActive, mobile)}
      >
        {link.label}
      </Link>
    );
  };

  // A near-opaque bar with a light blur: the header sits over the animating
  // ambient layer, and a heavy backdrop-filter would re-blur that whole strip
  // every frame. This reads the same and costs a fraction as much.
  return (
    <header
      className={`fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/92 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={COMPANY.logo}
            alt={`${COMPANY.legalName} logo`}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="font-display text-headline-md tracking-tight text-primary">
            {COMPANY.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => renderLink(link, false))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openGetStarted()}
            className="hidden rounded-full bg-primary px-6 py-2.5 font-display text-label-md uppercase text-on-primary shadow-md transition-all duration-300 hover:bg-primary-container active:scale-95 sm:inline-block"
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
          className="border-t border-outline-variant/30 bg-surface/95 backdrop-blur-xl md:hidden"
        >
          <nav className="mx-auto flex max-w-[1280px] flex-col px-margin-mobile py-4">
            {NAV_LINKS.map((link) => renderLink(link, true))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
