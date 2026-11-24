import type { MetadataRoute } from "next";

import { DEFAULT_LOCALE, PORTAL_PAGES, PUBLISHED } from "@/lib/languages";

// How often each of the portal's own pages changes, and its weight among them.
const PAGES: Record<
  (typeof PORTAL_PAGES)[number],
  Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority">
> = {
  "": { changeFrequency: "monthly", priority: 1 },
  "/release-notes": { changeFrequency: "weekly", priority: 0.5 },
  "/credits": { changeFrequency: "monthly", priority: 0.3 },
  "/privacy": { changeFrequency: "yearly", priority: 0.1 },
  "/terms": { changeFrequency: "yearly", priority: 0.1 },
  "/support": { changeFrequency: "yearly", priority: 0.2 },
};

// The portal's own pages in every published language, each with its
// translations; each game's section has its own sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:5001";

  return PORTAL_PAGES.flatMap((page) =>
    PUBLISHED.map((lang) => ({
      url: `${base}/${lang}${page}`,
      ...PAGES[page],
      alternates: {
        languages: {
          ...Object.fromEntries(
            PUBLISHED.map((one) => [one, `${base}/${one}${page}`]),
          ),
          "x-default": `${base}/${DEFAULT_LOCALE}${page}`,
        },
      },
    })),
  );
}
