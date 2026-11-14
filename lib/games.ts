// The games of Seed Archive. Each is its own Next.js app (a zone) whose
// basePath is its slug; the portal forwards /<slug>/* to the zone's own
// deployment (next.config.ts). See docs/architecture.md, D3 and D5.
export type Game = {
  slug: string;
  name: string;
  // One line under the name on the root page.
  pitch: string;
  // Where the portal forwards the section; a production alias of the zone's
  // Vercel project. Never the zone's old public address: that one redirects
  // to seedarchive.gg, and forwarding to it would loop.
  zone: string;
  // A picture served by the zone itself, under its own section.
  cover: string;
  // The path at the deployment's root where Vercel Analytics of the zone's
  // project serves its script and takes its events (/<id>/script.js,
  // /<id>/view). On the shared domain that root is the portal, so the portal
  // forwards it to the zone, or the game's visits are lost.
  analytics: string;
  // Who owns the game, its names and images (the terms of service).
  owner: string;
};

export const GAMES: Game[] = [
  {
    slug: "no-mans-sky",
    name: "No Man's Sky",
    pitch:
      "Multi-tools, ships and creatures: which systems hold the best ones, and why.",
    zone:
      process.env.NO_MANS_SKY_ZONE ??
      "https://atlas-archive-ethberrys-projects.vercel.app",
    cover: "/no-mans-sky/assets/img/galaxies/0.jpg",
    analytics: "a1110995d7968c05",
    owner: "Hello Games",
  },
];
