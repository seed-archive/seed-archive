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
  // The game's official key art from its press kit, served by the portal
  // (public/games/<slug>.jpg) and credited to its owner on the card.
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
      "https://no-mans-sky-site-ethberrys-projects.vercel.app",
    cover: "/games/no-mans-sky.jpg",
    analytics: "a1110995d7968c05",
    owner: "Hello Games",
  },
];

// A game whose section is not out yet: shown on the root page as coming soon,
// with no link and no forwarding. It moves into GAMES on its release.
export type ComingGame = Pick<Game, "slug" | "name" | "pitch" | "cover" | "owner">;

export const COMING: ComingGame[] = [
  {
    slug: "valheim",
    name: "Valheim",
    pitch: "Seeds, maps and guides for the Viking survival game.",
    cover: "/games/valheim.jpg",
    owner: "Iron Gate",
  },
];
