import { captureRouterTransitionStart, init } from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// The portal has no forms and no sign-in yet: errors only, no replays and no
// feedback button (a game's app adds those).
if (dsn) {
  init({ dsn, tracesSampleRate: 1, debug: false });
}

export const onRouterTransitionStart = captureRouterTransitionStart;
