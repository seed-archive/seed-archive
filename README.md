# Seed Archive

The portal of [seedarchive.gg](https://seedarchive.gg): a home for several games, each in its own section —
`seedarchive.gg/no-mans-sky/`, later `seedarchive.gg/valheim/`.

Each game's section is its own Next.js app in its own repository, deployed as its own Vercel project (Next.js
Multi-Zones). This repository is the portal app: the domain's root, the list of games, the pages of the whole archive (privacy,
terms), and the routing to each game's section.

| Repository | What |
|---|---|
| [`no-mans-sky-site`](https://github.com/seed-archive/no-mans-sky-site) | the No Man's Sky section (was `atlas-archive`) |
| `seed-archive` | this portal |

- [docs/architecture.md](docs/architecture.md) — every decision behind this layout: what was chosen, why, what was
  rejected, and what it costs.
- [docs/releases.md](docs/releases.md) — branches, and how a change reaches production.
- [docs/monitoring.md](docs/monitoring.md) — Sentry and analytics of every app, and how a new game's app joins.
- [docs/analytics.md](docs/analytics.md) — the choice of counter.
- [docs/seo.md](docs/seo.md) — the rules of search shared by every section.
- [docs/work-in-progress.md](docs/work-in-progress.md) — what is built but not released: branches, state, what is left.
- [docs/distributed-search.md](docs/distributed-search.md) — visitors' browsers computing seeds for the archive (in
  development).
