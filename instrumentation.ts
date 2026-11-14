import { captureRequestError } from "@sentry/nextjs";

// Sentry of the portal: its own project (seed-archive); each game's app has
// its own (docs/monitoring.md).
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = captureRequestError;
