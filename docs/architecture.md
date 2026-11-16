# Seed Archive: architecture and the reasons for it

Written by the coordinating session on 2026-11-14, from the decisions the owner made that day. Every decision lists
what was chosen, why, what was rejected and why, and what it costs. A short form of the same rules is kept where the
working sessions load it on every turn; this file is the reasoning behind it. When a decision changes, change it here
first and say why.

## Where this started

The No Man's Sky generator computes, from a galactic address, what the game will place there — stars, planets,
buildings, ships, multi-tools, creatures — and checks it against hundreds of recordings made in the game. Atlas Archive
was the site that published its results, at `atlas-archive-tau.vercel.app`, from the repository
`seed-archive/atlas-archive` (now `seed-archive/no-mans-sky-site`).

In November 2026 the owner looked for a second game to take apart, and Valheim was chosen. The site therefore had to
become a home for several games, and on 2026-11-14 it became **Seed Archive**, at `seedarchive.gg`.

Internal working names are never shown to a visitor. A visitor reads "Seed Archive" and the game's own name.

## D1. One domain: seedarchive.gg

**Chosen.** `seedarchive.gg`, registered at Porkbun, DNS in Cloudflare.

**Why.** Players read `.gg` as a gaming address at a glance (it is Guernsey's country code, adopted by players for
"good game"); trust at the moment of the click on Reddit or in the Steam Workshop is the point. `seedarchive.com` and
`seedarchive.io` were taken. Cloudflare and Google Cloud Domains do not register `.gg`, so the registrar is Porkbun and
the nameservers point at Cloudflare, where the owner's other domain already lives.

**Rejected.** `.info` (reads as spam), `.net` (dated), a hyphenated `seed-archive.com` (lost when spoken aloud),
`.games` at Google (unknown to players).

**Costs.** About $52 a year against about $10 for a `.com`. Details and the commands: the `seed-archive-domain` skill.

## D2. Games are sections of the domain, not subdomains

**Chosen.** `seedarchive.gg/no-mans-sky/…`, `seedarchive.gg/valheim/…`.

**Why.** Search engines usually treat a subdomain as a separate site that starts with no standing of its own, while
sections of one domain pool it. Being found is the project's whole unsolved problem: the finished No Man's Sky site
has drawn very few visitors so far. A section also keeps one sign-in and one set of cookies for free.

**Rejected.** `nms.seedarchive.gg` and the like. Vercel's free plan would have allowed them (50 domains a project); the
reason is search, not cost.

## D3. Each game is its own Next.js app; a portal routes between them (Multi-Zones)

**Chosen.** Next.js Multi-Zones. Each game is an app of its own with `basePath` equal to its slug and its own Vercel
project. The portal, `seed-archive`, is a small app that owns the domain's root, the list of games, the shared pages,
and the rules that hand `/<slug>/*` to each game's project. The portal is built only when a second game has a site;
until then the domain points straight at the No Man's Sky project and its `/` redirects into its section.

**Why.**
- **A game owns its pages.** Its generator writes its data and texts into its own site, never into a site shared with
  other games. The owner's words: each game does its own work, and only finished pages reach the portal.
- **Sessions stop colliding.** On 2026-11-14 the coordinating session and the No Man's Sky session spent the day
  arranging who touches which file in one checkout. With one repository a game, each game has its own `dev`, its own
  releases, its own pace.
- **Failures stay local.** A broken deploy of one game does not take the others down.
- **The first step was free.** `basePath /no-mans-sky` was needed for the domain move anyway, and it is exactly what a
  zone is.

**Rejected.**
- **One Next.js app with every game inside.** Every game's code in one shared repository: the collisions above,
  coupled releases, and one game's deploy able to break all of them.
- **Static pages produced by each generator.** The sites are not static: sign-in, likes, ship builders, finders, the
  luck calculator and the database need a running app.

**Deferred: separate repositories or one monorepo.** When the second site is started, choose between one repository
per app (as now) and one monorepo with `apps/portal`, `apps/<game>`, `packages/ui`, still deployed as separate Vercel
projects. The deciding question is how much is shared. Much shared (header, theme, sign-in, likes, search) favours the
monorepo, where it is shared without publishing a package; little shared favours separate repositories, which keep the
games' branches and releases apart.

**Costs.** Shared parts — header, footer, theme, sign-in — have to live in one package used by every app, or they drift.
Moving between games is a full page load. More than one Vercel project (paid per seat, not per project).

## D4. A game's generator and its site are two repositories

**Chosen.** `no-mans-sky` (the generator) and `no-mans-sky-site` (the app, was `atlas-archive`), side
by side; the same pair for every game.

**Why.** The two have different branch models. The generator commits straight to `main`. The site works on `dev`, and
a merge to its `main` deploys production and runs the database migrations. In one repository every generator commit
would land on the branch that deploys the site.

**Rejected.** Putting the site into the generator's repository as a folder, which would have kept one game in one
place, for the reason above.

## D5. How the No Man's Sky app sits under /no-mans-sky

**Chosen.** `lib/site.ts` holds `BASE_PATH = "/no-mans-sky"`; `next.config.ts` sets `basePath` from it. No page moved
into a folder. Next.js prefixes its own links (`next/link`, `redirect`, the router). Three redirects run before all
others, with `basePath: false`:
- the old host `atlas-archive-tau.vercel.app/*` → `https://seedarchive.gg/no-mans-sky/*`, permanent, built in only when
  the deploy sets `LEGACY_HOST_REDIRECT`, so the old address keeps working until the new one answers;
- `/` → `/no-mans-sky`, temporary, because the root becomes the portal;
- any other path without the prefix → the same path with it, permanent. This one carries every old bookmark, the 469
  links written into the Markdown texts, the pictures named by plain paths in HTML, CSS and the statistics data,
  `/robots.txt` and `/favicon.ico`.

`NEXT_PUBLIC_BASE_URL` carries the section (`https://seedarchive.gg/no-mans-sky`): Next.js joins the path of
`metadataBase` with relative URLs, so canonical addresses, the sitemap, robots and the breadcrumb data come out right
without code. `/_vercel/` (Vercel Web Analytics) is never redirected.

**Why redirects and not rewrites for the root files.** Next.js 16 forbids internal rewrites with `basePath: false`
(`rewrites.md` in its docs).

**Why a catch-all and not fixing every path.** The site has no `next/image`; every picture is a plain path, and so are
the Markdown links. Fixing them at the source means touching files the game's session was editing that day. The
catch-all ships the move with no such edits; the cost is one extra request for each unprefixed link or picture.

**Later.** The game's session removes that hop at the source — a `walkTokens` hook in `lib/archive/content.ts`, the
generator writing prefixed paths, the plain paths in the components. The catch-all stays as the net for old links.

## D6. One database, one Postgres schema per game

**Chosen.** One Supabase project. A game's tables live in a schema named by its slug (`nms` for No Man's Sky,
`valheim`); tables of the site itself stay in `public`. Which tables are shared is decided per table when the second
game arrives.

**Why.** A schema is the namespace Postgres already has, and it works on Supabase's free plan. A prefix on table names
would imitate it badly.

**Rejected.** Prefixes (`nms_systems`); a Supabase project per game (cross-game sign-in and likes would break, and the
free plan limits projects).

**Constraint that shapes the repositories.** Supabase keeps one migration history per project, so exactly one
repository applies migrations: the No Man's Sky site today, the portal once it exists. A game's migrations for its own
schema go through that repository.

**Not yet done.** Every table is still in `public`. Moving No Man's Sky's into `nms` is a release of its own, after the
domain move and never bundled with another change, so a failure has one cause. Exposing a new schema to the API on
production is the owner's action in the Supabase dashboard; no command touches the remote database. The steps are in
the site's `.claude/rules/repository.md`.

## D7. Generators are private; sites and the portal are public

**Chosen.** Every generator repository is private. Every site repository and the portal are public.

**Why the generators are private.** They are what cannot be copied: the method, and the recordings made in the game
behind every check. The search of 2026-11-13 showed that decompiling a game is no longer a moat — three other games
already had their generators ported by someone else — so what the owner's hours produced is the asset to keep.

**Why the sites are public.** Two reasons, either of them enough:
1. Vercel's free plan does not deploy private repositories owned by a GitHub organisation; that needs Pro. Making a site
   private on the free plan stops its deploys.
2. A site holds nothing secret. Its data is what the site shows to every visitor anyway.

**The rule that follows.** A public repository never names a generator's internals: no file paths, file or function
names, or methods of a private repository, in code, comments or docs. It refers to "the No Man's Sky generator" and
nothing more. The No Man's Sky session cleans the comments that still name the generator's paths.

**Revisit when** the team moves to Vercel Pro (D8). Even then the default stays public; a site goes private only for a
reason of its own.

## D8. Vercel's free plan until the site earns money

Vercel's Hobby plan is for **non-commercial** use only. The first advertisement or affiliate link means Pro, $20 a seat
a month, or a move. Cloudflare Pages allows commercial use on its free plan (100 domains a project, 500 builds a
month), but Next.js server features run there on Workers quotas, so moving costs work. Google Cloud would be a step
backwards in convenience at this size.

## D9. Sites keep a lock file

**Chosen.** `package-lock.json` is committed in every site; `package-lock=false` is gone from `.npmrc`.

**Why.** Direct dependencies are pinned (`save-exact`), but without a lock file every Vercel build resolved the
transitive ones afresh, so the same commit could build today and fail tomorrow for no reason of ours. The owner's
`@ethberry` libraries leave the lock file out on purpose; a deployed application should not.

## D10. Who does what

One coordinating session and one session per game.
- **A game's session** owns its generator and its site: pages, texts, data, pictures, components, its schema's
  migrations, and its commits.
- **The coordinator** owns what the games share: the domain and DNS, the Vercel projects, their environment and their
  link to repositories, the redirects of old addresses, the zone contract (`basePath` equals the slug; shared domain
  and sign-in), the database conventions, the portal, and the order of releases while things move between
  repositories.
- Each tells the other before touching what the other owns. Commits and merges need the owner's word unless he has
  given that session standing permission.
- **Branches and releases** (the owner, 2026-11-15): only generators and `renovate-config` commit to `main`; every
  site and the portal work on `dev`, and a release is the coordinator merging `dev` into `main` on the owner's word.
  The steps are in `releases.md`.

## D11. Names that match

The game's slug is the same everywhere: the path `/<slug>/`, the `basePath`, the schema (short form allowed: `nms`), the
folder and repository names (`<slug>`, `<slug>-site`).

## D12. Legal pages belong to the portal; each footer speaks for its own site

**Chosen.** The owner, 2026-11-14:
- **Privacy policy and terms of service are global**: they belong to Seed Archive as a whole, live in the portal, and
  keep their old addresses without a game's prefix — `seedarchive.gg/privacy`, `seedarchive.gg/terms`.
- **"How it works" (`/about`) stays with the game**: it explains that game's generator and data, so it remains
  `seedarchive.gg/no-mans-sky/about`.
- **Two kinds of footer.** The portal's footer, on the root page, shows the global pages (privacy, terms) and whatever
  else concerns the whole archive. Each game's footer is about that game — its sections, its "How it works" — and
  links to the global privacy and terms on the portal.

**Why.** The legal pages describe the site and its owner, not one game: with a second game they would otherwise exist
twice and drift apart. Their old addresses carried no prefix, and a legal page is linked from outside (sign-in
consent, app stores, search), so it keeps the address it had.

**The work it needs** (not done yet):
1. The portal gets `app/privacy` and `app/terms`, moved from the No Man's Sky site. The texts may change: they now speak
   for Seed Archive, not for one game's site — the owner decides the wording.
2. The portal's catch-all redirect (`next.config.ts`) must exclude `/privacy` and `/terms`, which the portal now
   answers itself; today it sends them to `/no-mans-sky/privacy`.
3. The No Man's Sky site removes its own `app/privacy` and `app/terms`, redirects `/no-mans-sky/privacy` and
   `/no-mans-sky/terms` to `/privacy` and `/terms` with `basePath: false`, and its footer
   (`components/archive/ArchiveShell.tsx`) links to them as plain `<a href="/privacy">` — a link into another zone
   is a full page load, and `next/link` would add the game's prefix.
4. The old host's redirect (`LEGACY_HOST_REDIRECT`) must send `/privacy` and `/terms` to `seedarchive.gg/privacy` and
   `seedarchive.gg/terms`, not into the game's section.
5. The portal's footer drops its temporary links into `/no-mans-sky/about`, `/no-mans-sky/privacy` and
   `/no-mans-sky/terms`, and links to its own privacy and terms.
6. Google's consent screen (Google Cloud → Google Auth Platform → Branding) holds the home page, privacy and terms
   links of the old host, `atlas-archive-tau.vercel.app`. The domain changes, not the paths: the owner points them at
   `seedarchive.gg`, `seedarchive.gg/privacy` and `seedarchive.gg/terms`, and adds `seedarchive.gg` to the
   authorised domains. The sign-in itself is the whole archive's (D13), not one game's.

Items 1, 2, 4 and 5 are the coordinator's (the portal and the redirects); item 3 is the No Man's Sky session's (its
site); item 6 is the owner's.

## D13. Sign-in belongs to the whole archive

**Chosen.** The owner, 2026-11-14: one sign-in at the top level of `seedarchive.gg`. The portal and every game's site
support it, and a visitor signed in on one page is signed in everywhere.

**How it already holds.** The No Man's Sky site signs in with Google's button (Google Identity Services) and hands the
token to Supabase (`signInWithIdToken`); `@supabase/ssr` keeps the session in cookies on the path `/`. Google checks
only the page's origin, and on one domain every zone has the same origin `https://seedarchive.gg` and the same cookies.
So the sign-in is not tied to `/no-mans-sky`: the one origin in Google is enough for every game, and a new game adds
nothing in Google.

**The work it needs** (not done yet):
1. The owner adds `https://seedarchive.gg` to the authorised JavaScript origins of the Google client (before
   `LEGACY_HOST_REDIRECT` is turned on), and the consent links of D12 item 6.
2. The portal gets the sign-in too: the provider and the button move from the No Man's Sky site into code every app
   uses (the shared package of D3's costs), so the portal's header and every game's header show the same account.
3. Every zone uses the same Supabase project and the same Google client id in its environment variables (the
   coordinator's, on Vercel).

## D14. Light and dark themes, one choice for the whole archive

**Chosen.** The owner, 2026-11-14: proper light and dark themes, a switch between them, and by default the theme of the
visitor's operating system. It works the same on the portal and on every game's site: a choice made on one page holds
on every other.

**Until then** every app is light only, with the colours of the No Man's Sky site (Material UI's default light theme);
the portal follows them in `app/globals.css`.

**How.** Three modes: system (the default), light, dark.
- **One stored choice.** Material UI keeps the mode in `localStorage` under its key (`mui-mode`) and puts a class on
  `<html>` before the page draws (`InitColorSchemeScript`, `colorSchemeSelector: "class"` — both already in the No
  Man's Sky site). Every zone serves the same origin `https://seedarchive.gg`, so every zone reads the same
  `localStorage`: the choice carries across zones with no cookie and no server. Locally the zones run on different
  ports and do not share it; that is expected.
- **The same class everywhere.** An app without Material UI (the portal today) reads the same key with a small script
  in `<head>` and sets the same class, and its CSS tokens are defined per class. Once the shared package of D3 exists,
  the theme (palette, the script, the switch) lives there.
- **The switch** sits in every header, the same control in every app.

**The work it needs** (not done yet; the No Man's Sky part is that session's):
1. The palette of both themes, decided once, in the shared theme.
2. The No Man's Sky site: `colorSchemes: { light, dark }` in its theme, the switch in its header, and every colour
   written by hand moved to theme tokens — the builder (`components/archive/builder/style.ts`, `ColourTiles`),
   `ShipRender`, the grade colours of `AssetCard`, the like button, the charts' colours, and pictures that assume a
   white page.
3. The portal: dark tokens per class, the script in `<head>`, the switch.
4. A check of every page in both themes before the release that turns dark on.

## D15. One header for the whole archive; each game brings its own navigation

**Chosen.** The owner, 2026-11-14: the header carries the archive's name, **Seed Archive**, and is the same on the portal
and on every game's site. Each game keeps its own navigation inside it.

**Its parts, left to right:**
- **"Seed Archive"** — always a plain `<a href="/">` to the portal's root (another zone, so a full page load).
- **The game's name** (on a game's site only) — the game's own home, `next/link` to its `/`.
- **The game's navigation** — its own menu and drawer, as each game needs.
- **The account** (D13) and, later, the theme switch (D14) — the same in every app.

**Why.** A visitor reads one site, not several: the name and the account must not change when the path enters another
game. The menus differ because the games do.

**The game's menu** (the owner, 2026-11-16). The items differ per game, but their kinds do not:
- **A top-level item is a visitor's question, not a topic.** There are four, each with one name in every game:
  - **Catalog** — "show me what there is": the finds, one record each.
  - **Guides** — "what is best and why": text and tables, grouped by item.
  - **Tools** — "find or compute it for me": a page whose point is the result of a form (finders, calculators,
    recipe lists with a filter, Valheim's map).
  - **Quests** — "how do I pass it": quests and puzzles step by step.

  A game shows only the ones it has.
- **At most four items on a desktop.** Anything more goes into their dropdowns, never into a fifth item: a fifth
  would need a fifth question. The width agrees: at 900 px five items leave about 80 px, and a translated label is
  about a third longer than the English one; four leave room, whatever the game's name.
- **On a phone** (below `md`, 900 px) the game's whole menu lives in the side drawer; the bar holds "Seed Archive",
  the game's name, the menu button and the account.
- **About** (`/<slug>/about`) is about the site, not the game: it is in the game's footer, never in the header.

**Until the shared package of D3 exists**, every app copies the same look: Material UI's `AppBar` with a bottom divider,
`h6` for the name, 64 px high (56 on a phone). The portal follows it in plain CSS.

**The work it needs:**
1. The portal: the header with "Seed Archive" (the coordinator's; done in the portal).
2. The No Man's Sky site: "Seed Archive" link and "No Man's Sky" in its header (`ArchiveBar`), and the name "Atlas
   Archive" replaced in every title, `siteName`, the texts of `lib/i18n/` and the privacy and terms pages (that
   session's). A visitor never reads the working name.

## D16. Release notes belong to the portal

**Chosen.** The owner, 2026-11-15: the release notes are the whole archive's, at `seedarchive.gg/release-notes`, one
list for every game and the portal, newest first.

**Why.** Until now every release was No Man's Sky's, so its notes lived in its site at `/no-mans-sky/release-notes`.
From now on the work moves between games: while Valheim is built, No Man's Sky's own list would stand still and read
as a dead site. One list shows the archive alive whichever game moved last.

**How it is kept.**
- The notes are written by hand, as before: a release is a few lines of what a visitor can now do, not a generator's
  output.
- In the portal's repository, one Markdown file per section: `content/release-notes/<slug>.md` for a game,
  `content/release-notes/seed-archive.md` for the portal and what concerns the whole archive. Each release is a
  heading `## <day Month year>: version <n>` with its lines under it, as in the No Man's Sky site today.
- The page reads every file and merges the releases by date, newest first; each heading carries the game's name
  ("No Man's Sky 2.4"). A game keeps its own version numbers.
- Links inside a note are full paths with the section's prefix (`/no-mans-sky/quests/farming`): every page of a game
  is another zone for the portal.
- **A game's session writes its own file in the portal**, and only that file: the one exception to the portal being the
  coordinator's. It goes into the portal's `dev` with the game's release and reaches production with the portal's
  release (`releases.md`).

**The work it needs:**
1. The portal: `app/release-notes`, the files above with No Man's Sky's notes moved over (links prefixed), the
   footer link, the sitemap, and the newest releases on the root page (the coordinator's).
2. After the portal's page is live, the No Man's Sky site removes `app/release-notes` and its content, redirects
   `/no-mans-sky/release-notes` to `/release-notes` with `basePath: false` (as the legal pages), takes it out of its
   sitemap, and its menu links to it with a plain `<a href="/release-notes">` (that session's).
3. The old host's redirect sends `/release-notes` to `seedarchive.gg/release-notes` in one hop (the coordinator's).
4. From then on a game's release adds its lines to its file in the portal, not to its own site.

## State on 2026-11-14 and the order of the move

- **A. The release with the domain — done 2026-11-14.** `seedarchive.gg` on the portal, the No Man's Sky site under
  `/no-mans-sky`, `www` → apex, the old host → `seedarchive.gg` (308, `LEGACY_HOST_REDIRECT`), Google sign-in origin
  added, Search Console domain property verified and Change of address done.
- **B. The renames — the site done 2026-11-15:** `atlas-archive` → `no-mans-sky-site` on GitHub, on disk, and as the
  Vercel project (its alias `no-mans-sky-site-ethberrys-projects.vercel.app`, which the portal forwards to); the old
  domain `atlas-archive-tau.vercel.app` stays attached to it and keeps redirecting to seedarchive.gg. The generator's repository →
  `no-mans-sky` is the game's session's.
- **C. The portal.** Built early, on the owner's word, so the domain's root shows a page and not a redirect: the
  Vercel project `seed-archive` holds `seedarchive.gg` from the switch on. Still waiting for a second game: D3's
  deferred question, and moving the migrations to the portal.
- **D. The legal pages** move to the portal (D12), after the release; the portal gets the shared sign-in (D13).
- **The name and the header** (D15): done with the release; the portal's header is the same.
- **F. Monitoring — done 2026-11-15**: one Sentry project per app (portal `seed-archive`, No Man's Sky
  `no-mans-sky-site`), one Vercel Analytics counter for the domain in the portal's project; the recipe for a new
  game in `docs/monitoring.md`.
- **E. Themes** (D14): light, dark, the system's by default, one switch for the portal and every game; after D.
- **G. One icon for Seed Archive** (the owner, 2026-11-15). Today the portal and the No Man's Sky site both serve No
  Man's Sky's `favicon.ico` and `apple-icon.png`. Make one icon of the archive itself and serve it from the portal and
  from every game's app (`app/favicon.ico`, `app/apple-icon.png`, and the web manifest if one is added), so the tab
  reads the same on every page of the domain.
- **H. Our own event tracker** (the owner, 2026-11-15): count clicks on buttons ourselves instead of paying for
  Vercel Pro or adding Google Analytics with a consent banner (`docs/analytics.md`). Few events, so it stays simple:
  - one table of the whole archive in Supabase's `public` schema: event name, the page's path with its section's
    prefix, the time; no user, no cookie, no IP stored — so no consent banner and nothing new for the privacy policy
    beyond a line that clicks are counted anonymously;
  - a small `track(name)` in the code every app shares (D3), writing through one insert-only function or route with a
    rate limit; a game names its events by its slug (`no-mans-sky.interceptor-finder`);
  - reading the counts by a query or a page in the portal; Vercel Analytics stays the counter of visits.
  The first event is the button that measures whether to build an Interceptor finder.
- **I. Release notes move to the portal** (D16, the owner, 2026-11-15): first the portal's page with No Man's Sky's
  notes, then the No Man's Sky site's redirect and menu link.
