"use client";

import { GetStartedProvider } from "./GetStarted";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

/**
 * Page frame for every design-system route (/, /team, /gallery): the enquiry
 * dialog provider, the fixed header, and the footer. Pages supply only <main>.
 */
export default function SiteShell({ active, children }) {
  return (
    <GetStartedProvider>
      <div className="min-h-screen bg-surface font-body text-body-md text-on-surface selection:bg-primary-container selection:text-on-primary-container">
        <SiteHeader active={active} />
        {children}
        <SiteFooter />
      </div>
    </GetStartedProvider>
  );
}
