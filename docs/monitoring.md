# Monitoring: errors and visits of every app

How the portal and each game's app report errors (Sentry) and count visits (Vercel Web Analytics), and what a new
game's app (Valheim next) does to join. Set up on 2026-11-15; the reasons for the counter are in `docs/analytics.md`.

## The rule

- **Errors: one Sentry project per app.** Each app is its own build with its own source maps and releases; in one
  project the files and versions of different apps would mix, and an error of one game could point into another's
  code. Each game's session reads only its own project. Sentry's "All Projects" view still shows every app at once.
  Projects cost nothing: the plans have no limit on projects; the error quota and the users belong to the
  organization.
- **Visits: one counter for the whole domain**, in the portal's Vercel project. Every app sends its views there, each
  path with its section's prefix, so one report shows the portal and every game, and a section is a filter by path.

## What exists

| App | Sentry project (org `ethberry`) | Vercel project | Analytics |
|---|---|---|---|
| Portal | `seed-archive` | `seed-archive` | the shared counter itself, `/933b9afd1a52216d/` |
| No Man's Sky | `no-mans-sky-site` (was `atlas-archive`) | `no-mans-sky-site` (was `atlas-archive`) | sends to the shared counter; its own Web Analytics is off |
| Valheim | `valheim-site` (created 2026-11-15) | not yet: made when the site goes live | will send to the shared counter |

The Sentry organization `ethberry` is shared with Ethberry's own projects, and with them its free quota (5,000 errors
a month, 1 user, 30 days). Moving Seed Archive's projects into an organization of its own (Sentry: project settings →
Transfer project; then `SENTRY_ORG` and the token on Vercel) is an open question for the owner.

## A new game's app joins (e.g. Valheim)

### Sentry

1. Sentry → Projects → Create project → **Set up manually** (not the coding-agent handoff), platform Next.js, team
   `#ethberry`. **Check the name field**: Sentry prefills it with the platform (`javascript-nextjs…`); the slug must be
   the app's repository name, e.g. `valheim-site`. If it came out wrong, fix it in the project's settings → Slug.
2. Project settings → Client Keys → copy the DSN. A DSN is public by design (it ships in the page's code).
3. In the app: `@sentry/nextjs` at the same version as the other apps (`npm install --save-exact`), and the four
   files the portal and the No Man's Sky site use — `instrumentation.ts`, `instrumentation-client.ts`,
   `sentry.server.config.ts`, `sentry.edge.config.ts`, each initialising only when `NEXT_PUBLIC_SENTRY_DSN` is set —
   and `withSentryConfig(nextConfig, { org, project, authToken, widenClientFileUpload: true, tunnelRoute:
   "/monitoring", webpack: { automaticVercelMonitors: false } })` in `next.config.ts`. A game with forms or sign-in
   adds `replayIntegration` and `feedbackIntegration` (the Report a Bug button) on the client, as No Man's Sky does.
4. On the app's Vercel project, for production, preview and development:
   - `NEXT_PUBLIC_SENTRY_DSN` — `vercel env add NEXT_PUBLIC_SENTRY_DSN --environment <env> --type config --value
     "<dsn>" --yes` (the CLI refuses a `NEXT_PUBLIC_` value that looks like a credential unless `--type config`);
   - `SENTRY_ORG` = `ethberry`, `SENTRY_PROJECT` = the slug;
   - `SENTRY_AUTH_TOKEN` — an organization token for source maps; **the owner adds it** (a secret never passes through
     a session). Without it the build only skips the upload.
5. Check: send one event through the app's tunnel and find it in the project — e.g. an envelope `POST`ed to
   `https://seedarchive.gg/<slug>/monitoring?o=<org id>&p=<project id>&r=de` → `200`; then resolve that test issue.
6. Renaming a project later: change its slug in Sentry **and** `SENTRY_PROJECT` on Vercel, then redeploy; the build
   log must say "Successfully uploaded source maps to Sentry".

### Analytics

1. In the app's root layout, a client component around `@vercel/analytics/react`'s `<Analytics>` (as
   `components/archive/SharedAnalytics.tsx` of the No Man's Sky site) with every path of the shared counter given
   explicitly — `scriptSrc="/933b9afd1a52216d/script.js"`, `endpoint`, `viewEndpoint`, `eventEndpoint`,
   `sessionEndpoint` — because Vercel writes the app's own project endpoints into its build
   (`NEXT_PUBLIC_VERCEL_OBSERVABILITY_CLIENT_CONFIG`) and they override `endpoint` alone.
2. `path` and `route` with the section's prefix (`${BASE_PATH}${usePathname()}`): Next.js reports the pathname without
   `basePath`, and the shared report must tell `/valheim/about` from the portal's `/about`.
3. Do **not** turn Web Analytics on in the app's own Vercel project.
4. Check in a browser on seedarchive.gg: the page's script tag has `data-view-endpoint=/933b9afd1a52216d/view`, a
   `POST` to it answers `200`, and the portal project's Analytics shows the page under `/<slug>/…` within minutes.

### The portal

- `lib/games.ts`: the game's slug, name, pitch, zone (its Vercel production alias `<project>-ethberrys-projects
  .vercel.app`), cover, and owner (for the terms). The portal forwards `/<slug>` and `/<slug>/*` to the zone; the
  game's `/<slug>.rsc` data request is handled by the `has: rsc` rule in `next.config.ts`.
