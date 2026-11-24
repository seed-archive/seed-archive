// The archive's languages (docs/architecture.md, D20; chosen by the owner,
// docs/languages.md). Kept free of imports, so next.config.ts can read it.

export const LOCALES = ["en", "ru", "es", "de"] as const;
export type Locale = (typeof LOCALES)[number];

// English is the one every address without a language goes to, and the
// x-default of hreflang.
export const DEFAULT_LOCALE: Locale = "en";

// The languages the portal's own pages are published in. Another language of
// LOCALES answers 307 to English until it is added here (next.config.ts).
export const PUBLISHED: readonly Locale[] = ["en"];

// The portal's own pages, by their path without a language ("" the home page).
export const PORTAL_PAGES = [
  "",
  "/release-notes",
  "/credits",
  "/privacy",
  "/terms",
  "/support",
] as const;
