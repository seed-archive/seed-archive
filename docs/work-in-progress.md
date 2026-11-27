# Work in progress

What is built but not released, across the archive's repositories: where each piece lies, what it does, and what is
left. A piece leaves this page when it is released; its design stays in its own document.

## Distributed seed search

**Status (2026-11-27):** in development; **not in any release** (the owner, 2026-11-27). Everything below is on
branches, uncommitted, and the portal shows it only behind the flag `NEXT_PUBLIC_COMPUTE=1`, which no Vercel
environment sets. The design and the contract are in [distributed-search.md](distributed-search.md).

### Branches

Each branch holds its work as a WIP commit, local only, not pushed (the owner, 2026-11-27); the main checkouts are
back on their own branches. In `no-mans-sky-site` the three branches are stacked in merge order: `wip-compute-points`
on `dev`, `wip-valheim-schema` on it, `wip-nms-search` on that.

| Repository | Branch | Local folder | Owner | What |
|---|---|---|---|---|
| `seed-archive` (portal) | `wip-compute-portal` | `seed-archive` | coordinator | the flag, the header's panel and account menu, the account page, Material UI and sign-in in the portal |
| `no-mans-sky-site` | `wip-compute-points` | `no-mans-sky-site-points` | coordinator | `public.points`, `points_balance()`, `points_history()`; regenerated types |
| `no-mans-sky-site` | `wip-valheim-schema` | `no-mans-sky-site-valheim` | Valheim | the `valheim` schema: five tables, `issue_batch`, `answer`, a rolled-back test of the whole cycle |
| `no-mans-sky-site` | `wip-nms-search` | `no-mans-sky-site-nms-search` | No Man's Sky | the `nms` schema, the same template, and the search module `public/wasm/search.js` + `search_bg.wasm` (128 KB gzipped); the item decoder is a private build, never in a site |
| `valheim-site` | `wip-distributed-search` | `valheim-site` | Valheim | the search module `public/wasm/search.js` + `search_bg.wasm` (168 KB) and its digest test |
| `packages` | `wip-compute` | `packages-compute` | UI | `@seed-archive/compute` 0.1.0 (pool, downloads, runner, protocol, panel) and `@seed-archive/compute-valheim` 0.1.0 |
| `packages` | `wip-ui-auth-wait` | `packages-ui` | UI | `@seed-archive/ui` 1.7.1: the sign-in button waits for Google's script |

### What works (checked locally, 2026-11-27)

- The module of each game gives the same digest in the browser's engine as natively (Valheim, No Man's Sky).
- The core against the local database, in Node: a batch issued, computed, answered; a second answer refused.
- The portal at `localhost:5001` with the flag on: the owner signed in with Google, downloaded Valheim's module
  (0.2 MB, kept in the browser), computed 17 portions on 17 cores in about a minute. Three local test visitors
  answered the same bytes, the portions closed, each of the four got a point a portion, five worlds were found; the
  account page showed the balance, the portions computed and closed by game, and the history.

### Not done

- Safari's engine: one portion's digest compared with Chrome's.
- Where No Man's Sky's private decoder runs (the owner's choice: the generator's own command or a function deployed
  from a private repository).
- Shop and monolith tools of No Man's Sky stay out of the browser for now (way (c) in the design).
- The packages are installed in the portal from local tarballs; before a merge they are published and the portal
  takes their versions, and its sign-in workaround (`components/AccountBar.tsx`) goes once `@seed-archive/ui` 1.7.1 is
  out.
- The account link in each game's own header menu; the panel in each game's header.
- Translations of the portal's new messages (`lib/i18n/en.json` only).
- The production database: `valheim` and `nms` added to the exposed schemas (the owner, in the dashboard).
- Announcements in Discord (Marketing), RimWorld's colony-map search.

### Local state

Cleaned on the owner's word (2026-11-27): the shared local database keeps the three migrations applied, with no
portions, tickets, answers, finds or points, no test visitors, and Valheim's cursor at 1,853,760. The stack runs
from `no-mans-sky-site-points` (its `config.toml` exposes `valheim`, a local change that leaves that branch before
its commit).
