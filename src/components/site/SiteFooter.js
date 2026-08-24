"use client";

import Link from "next/link";
import { MailIcon, PhoneIcon } from "@/components/icons";
import { useGetStarted } from "./GetStarted";
import { COMPANY, CONTACT } from "./siteMeta";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Our Team", href: "/team" },
      { label: "Gallery", href: "/gallery" },
      { label: "Classic site", href: "/classic" },
    ],
  },
  {
    title: "Applications",
    links: [
      { label: "Drinking Water", href: "/#applications" },
      { label: "Agriculture", href: "/#applications" },
      { label: "Schools & Communities", href: "/#applications" },
      { label: "Industry", href: "/#applications" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, "")}` },
      { label: CONTACT.email, href: `mailto:${CONTACT.email}` },
      { label: "Request a demo", action: "get-started" },
    ],
  },
];

export default function SiteFooter() {
  const { openGetStarted } = useGetStarted();
  const year = new Date().getFullYear();

  const renderLink = (link) => {
    const className = "text-left transition-colors hover:text-primary";

    if (link.action === "get-started") {
      return (
        <button type="button" onClick={() => openGetStarted()} className={className}>
          {link.label}
        </button>
      );
    }
    if (link.href.startsWith("/")) {
      return (
        <Link href={link.href} className={className}>
          {link.label}
        </Link>
      );
    }
    return (
      <a href={link.href} className={className}>
        {link.label}
      </a>
    );
  };

  return (
    <footer className="border-t border-outline-variant bg-surface">
      <div className="mx-auto max-w-[1280px] px-margin-mobile py-20 md:px-margin-desktop">
        <div className="mb-16 grid grid-cols-1 gap-gutter md:grid-cols-4">
          <div>
            <div className="mb-6 font-display text-headline-md text-primary">
              {COMPANY.name}
            </div>
            <p className="mb-6 font-body text-body-sm text-on-surface-variant">
              {COMPANY.tagline} Rapid, paper-based water diagnostics developed at{" "}
              {COMPANY.institution}.
            </p>
            <div className="flex gap-4">
              <a
                href={`mailto:${CONTACT.email}`}
                aria-label={`Email ${COMPANY.name}`}
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-all hover:bg-primary hover:text-on-primary"
              >
                <MailIcon size={18} />
              </a>
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                aria-label={`Call ${COMPANY.name}`}
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-all hover:bg-primary hover:text-on-primary"
              >
                <PhoneIcon size={18} />
              </a>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="mb-6 font-display text-body-md font-bold text-on-surface">
                {column.title}
              </h2>
              <ul className="flex flex-col gap-4 font-body text-body-sm text-on-surface-variant">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`} className="flex">
                    {renderLink(link)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant/30 pt-8 md:flex-row">
          <p className="font-body text-body-sm text-on-surface-variant">
            © {year} {COMPANY.legalName} Stewardship through science.
          </p>
          <span className="font-body text-body-sm text-outline">
            Built at {COMPANY.institution}
          </span>
        </div>
      </div>
    </footer>
  );
}
