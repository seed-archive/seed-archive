# Shared components: what repeats across the sites

An inventory of 2026-11-24, made at the owner's request: which code the game sites repeat and could take from the
shared packages (`@seed-archive/ui`, `@seed-archive/map`, `@seed-archive/globe`). Read from the sources of
`no-mans-sky-site`, `valheim-site`, `rimworld-site`, `oxygen-not-included-site`, this portal and `packages`. Nothing
is decided yet; each item moves into a package only on the owner's word, by the package's own session.

## Already in the packages

- `ui`: theme, `Providers`, localization (`LocalizationProvider`, `flattenMessages`), `AuthProvider`/`useAuth`,
  `SharedAnalytics`, `PageTrail` (with `lang` on `wip-ui-languages`), `AnchorHeading(s)`, charts (`chartSpec`,
  `ChartBlock`), `numbers`, `SlotTile`, `NotFound`, and on `wip-ui-languages` the `LanguageSwitcher` and
  `LANGUAGE_KEY`. `statistics-chart.tsx` is in `src` but missing from `package.json` → `exports`.
- `map`: `Viewer`, `address`, `Card`, `MapClient`. `globe`: `Globe`, `GlobeClient`, sphere and tiles.
- The portal imports nothing from the packages.

## Candidates, most valuable first

| # | What | Sites | Lines repeated (about) | What stands in the way |
|---|---|---|---|---|
| 1 | The header `ArchiveBar`: portal link, game name, menus, account avatar (the avatar block is the same in all four) | all four | 975 | each game's menu data; a shared `MenuItem` type would carry it |
| 2 | Markdown content loader: read `content/<locale>/…`, `marked`, heading ids, links with base path and language, title and description; the `slug` function is copied three times | all four | 340 | per-game `{{holes}}` values and long-guide links, both as parameters |
| 3 | The page frame and its prose styles (the `sx` block is the same character for character in RimWorld, Oxygen Not Included and Valheim); widget, figure and chart markers inside Markdown | all four | 400 | small |
| 4 | Language helpers: the language list and path rule (D20) written three times under different names, a language-keeping `next/link` twice, `PageTrail` wrappers, canonical and `hreflang` metadata, breadcrumb structured data | all four and the portal | 300 | No Man's Sky keeps a translation list per page, Valheim one list |
| 5 | The footer `ArchiveFooter` (the game footers lack Credits, which the portal's has) | all four and the portal | 130 | the section's own links as a prop |
| 6 | Section index pages (one sentence per page); Oxygen Not Included's `SectionIndex` is already generic | all four | 300 | the menu type of item 1 |
| 7 | Map and globe screen boilerplate: lazy viewer, `MapClient` start and close, address sync, labels; candidates `useMapClient`, `LazyViewer`, `useAddressSync`, `useGlobeClient` | three (map), two (globe) | 150 | each game's cards and markers |
| 8 | Recipe tree (No Man's Sky's and Valheim's draw nodes and brackets almost line for line alike) | two | 545 | node shape and sprite lookup; a generic node with each game's own builder |
| 9 | Item icon with its name (`SlotTile` plus a label) | one, a second needs it | 35 | per-game sprite sheets |
| 10 | A data table, optionally sortable (Valheim builds about 30 tables by hand) | three | — | cells stay the game's |
| 11 | Table search by CSS `:has()` (Valheim) | one, generic | 55 | none |
| 12 | Providers wrappers; scroll padding under the sticky header added by two sites on their own | all four | 140 | a `Providers` option |
| 13 | Supabase browser client and env (`lib/db/env.ts` identical in three) | three | 30 | none |
| 14 | i18n setup: `serverMessages`, `serverFormat` identical in three | all four | 60 | none |
| 15 | Root layout: font, metadata base, the portal's analytics path copied four times | all four | 120 | `next/font` stays in each app; a metadata helper does not |
| 16 | Sitemap and robots builders; the base URL fallback repeated about ten times | three and the portal | 100 | none |
| 17 | Small wrappers that show a missing option: `AnchorHeading` copied-text, chart colours, a fixed-decimals number format | two or three | — | none |
| 18 | No Man's Sky only, others will need: likes, the language notice, sign-in prompt, catalog filters and pagination, URL-synced tabs, structured data | one | — | tied to No Man's Sky's data today |

## Found in passing

- The portal's `robots.ts` still disallows `/no-mans-sky/likes`; with D20 the address is `/no-mans-sky/<lang>/likes`.
  No Man's Sky's own robots already covers it.
- `rimworld-site` has no `robots.ts` or `sitemap.ts` yet.
- No Man's Sky's content loader adds the language to links to the portal's pages too; Valheim's excludes them.

## Suggested order

Items 2 and 3 together, then 4, then 1 and 5 (which unlock 6), then 7. Items 8 to 18 are smaller or pay off only once
a further site needs them.
