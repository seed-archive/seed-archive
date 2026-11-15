import { captureRouterTransitionStart, init } from "@sentry/nextjs";

// Sentry runs on the production deploy only: never locally, never on a
// preview (docs/monitoring.md). Vercel sets NEXT_PUBLIC_VERCEL_ENV at build.
const dsn =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? process.env.NEXT_PUBLIC_SENTRY_DSN
    : undefined;

// The portal has no forms and no sign-in yet: errors only, no replays and no
// feedback button (a game's app adds those).
if (dsn) {
  init({ dsn, tracesSampleRate: 1, debug: false });
}

export const onRouterTransitionStart = captureRouterTransitionStart;
