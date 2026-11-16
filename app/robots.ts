import type { MetadataRoute } from "next";

import { GAMES } from "@/lib/games";

// robots.txt of the whole domain: it lives at the root, so the portal serves
// it, and it names every section's sitemap.
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:5001";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/no-mans-sky/likes"],
    },
    sitemap: [
      `${base}/sitemap.xml`,
      ...GAMES.map((game) => `${base}/${game.slug}/sitemap.xml`),
    ],
  };
}
