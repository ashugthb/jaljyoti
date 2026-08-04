// Single source of truth for the facts shared by the /product and /team pages.
// Values are taken from the existing site (Footer.js, Team.js, Gallary.js) — keep
// them here so a change to a phone number or an award never has to be hunted for.

export const COMPANY = {
  name: "JALJYOTI",
  legalName: "Jaljyoti Prosense Pvt. Ltd.",
  tagline: "Biotechnology for a cleaner tomorrow.",
  institution: "IIT Jodhpur",
  logo: "/logo.jpg",
};

export const CONTACT = {
  phone: "+91 8303277418",
  email: "jaljyotiprosense@gmail.com",
};

// `action: "get-started"` opens the enquiry dialog instead of navigating.
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Team", href: "/team" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", action: "get-started" },
];
