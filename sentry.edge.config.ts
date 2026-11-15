import * as Sentry from "@sentry/nextjs";

// Sentry runs on the production deploy only: never locally, never on a
// preview (docs/monitoring.md). Vercel sets NEXT_PUBLIC_VERCEL_ENV at build.
const dsn =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? process.env.NEXT_PUBLIC_SENTRY_DSN
    : undefined;

if (dsn) {
  Sentry.init({ dsn, tracesSampleRate: 1, debug: false });
}
