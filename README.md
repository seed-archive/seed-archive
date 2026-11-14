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
- [docs/monitoring.md](docs/monitoring.md) — Sentry and analytics of every app, and how a new game's app joins.
- [docs/analytics.md](docs/analytics.md) — the choice of counter.
- [docs/seo.md](docs/seo.md) — the rules of search shared by every section.
