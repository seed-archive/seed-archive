import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

import { GAMES } from "./lib/games";

// The portal's own production alias and its Vercel Analytics path.
const PORTAL = "https://seed-archive-theta.vercel.app";
const PORTAL_ANALYTICS = "933b9afd1a52216d";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // Each game's section is answered by the game's own deployment.
      afterFiles: GAMES.flatMap((game) => [
        // A segment prefetch (headers rsc, next-router-prefetch and
        // next-router-segment-prefetch): Vercel has already turned the path
        // into /<path>.segments/<segment>.segment.rsc here, and the headers
        // travel on to the game, whose own deployment turns the path a second
        // time and answers 404. So the game gets the page's own path and finds
        // the segment itself from the headers.
        {
          source: `/${game.slug}.segments/:segment(.+)\\.segment\\.rsc`,
          destination: `${game.zone}/${game.slug}`,
        },
        {
          source: `/${game.slug}/:page(.+?)\\.segments/:segment(.+)\\.segment\\.rsc`,
          destination: `${game.zone}/${game.slug}/:page`,
        },
        // A client navigation to the section's root (as after sign-in):
        // Vercel adds ".rsc" to the destination of an RSC request, and the
        // game keeps the data of its root page at /<slug>/index.rsc, not at
        // /<slug>.rsc. So that request goes to /<slug>/index.
        {
          source: `/${game.slug}`,
          has: [{ type: "header" as const, key: "rsc" }],
          destination: `${game.zone}/${game.slug}/index`,
        },
        { source: `/${game.slug}`, destination: `${game.zone}/${game.slug}` },
        {
          source: `/${game.slug}/:path+`,
          destination: `${game.zone}/${game.slug}/:path+`,
        },
        // A game's old Vercel Analytics path (see lib/games.ts): Vercel
        // still writes it into the game's build, so the game's views arrive
        // here; they go to the portal's own counter, the one count for the
        // domain (docs/analytics.md), through the portal's production alias.
        ...(game.analytics
          ? [
              {
                source: `/${game.analytics}/:path*`,
                destination: `${PORTAL}/${PORTAL_ANALYTICS}/:path*`,
              },
            ]
          : []),
      ]),
      // Any other path the portal has no page for: the old links of No Man's
      // Sky, from before its section (/guides/…, /statistics/…). Its own
      // deployment knows where each one moved and answers with one 308 to the
      // final page, so the portal hands the path over instead of redirecting
      // it a first time itself. Revisit when a second game arrives.
      fallback: [
        { source: "/:path+", destination: `${GAMES[0].zone}/:path+` },
      ],
    };
  },
};

// Source maps go to the portal's Sentry project when the deploy has its token
// (docs/monitoring.md); without it the build only skips the upload.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  webpack: { automaticVercelMonitors: false },
});
