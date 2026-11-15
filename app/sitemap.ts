import type { MetadataRoute } from "next";

// The portal's own pages; each game's section has its own sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:5000";

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/release-notes`,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...["privacy", "terms"].map((page) => ({
      url: `${base}/${page}`,
      changeFrequency: "yearly" as const,
      priority: 0.1,
    })),
  ];
}
