# Seed Archive: architecture and the reasons for it

Written by the coordinating session on 2026-11-14, from the decisions the owner made that day. Every decision lists
what was chosen, why, what was rejected and why, and what it costs. A short form of the same rules is kept where the
working sessions load it on every turn; this file is the reasoning behind it. When a decision changes, change it here
first and say why.

## Where this started

The No Man's Sky generator computes, from a galactic address, what the game will place there — stars, planets,
buildings, ships, multi-tools, creatures — and checks it against hundreds of recordings made in the game. Atlas Archive
was the site that published its results, at `atlas-archive-tau.vercel.app`, from the repository
`seed-archive/atlas-archive`.

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

## D11. Names that match

The game's slug is the same everywhere: the path `/<slug>/`, the `basePath`, the schema (short form allowed: `nms`), the
folder and repository names (`<slug>`, `<slug>-site`).

## State on 2026-11-14 and the order of the move

- **A. The release with the domain.** Zone `seedarchive.gg` active; records to Vercel in place; the branch
  `wip-seedarchive-domain` of the site rebased on `dev` and building clean; waiting for the game's data, then
  the release `dev` → `main` and the switch. The owner adds `https://seedarchive.gg` to the Google sign-in origins.
- **B. The renames.** the generator's repository → `no-mans-sky` (the game's session), `atlas-archive` → `no-mans-sky-site` (the
  coordinator, then the signal "folder renamed" to the game's session). The Vercel project keeps its name: its old
  address must keep redirecting.
- **C. The portal**, when Valheim has a site. Then decide D3's deferred question, move the migrations to the portal,
  and move the domain from the No Man's Sky project to the portal.
