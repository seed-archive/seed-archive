import type { NextConfig } from "next";

import { GAMES } from "./lib/games";

// The portal's own paths: the root page and the files Next.js serves for it.
const OWN = ["_next/", "_vercel/", "robots\\.txt$", "sitemap\\.xml$", "favicon\\.ico$", "apple-icon"];

const nextConfig: NextConfig = {
  async rewrites() {
    // Each game's section is answered by the game's own deployment.
    return GAMES.flatMap((game) => [
      { source: `/${game.slug}`, destination: `${game.zone}/${game.slug}` },
      {
        source: `/${game.slug}/:path+`,
        destination: `${game.zone}/${game.slug}/:path+`,
      },
    ]);
  },
  async redirects() {
    // No Man's Sky's pages still name their own links and pictures by plain
    // paths (/guides/…, /render/…), which reach the portal, not the section.
    // While No Man's Sky is the only game, every such path belongs to it.
    // Drop this when the zone writes prefixed paths at the source
    // (docs/architecture.md, D5) or when a second game arrives.
    const games = GAMES.map((game) => `${game.slug}(?:/|$)`);
    return [
      {
        source: `/:path((?!${[...games, ...OWN].join("|")}).+)`,
        destination: `/${GAMES[0].slug}/:path`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
