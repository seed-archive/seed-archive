# Branches and releases

How work moves from a change to seedarchive.gg, for every repository of the archive. Decided by the owner on
2026-11-15; who owns what is in `architecture.md` (D4, D10).

## Branches

| Repository | Works on | `main` is | Who merges into `main` |
|---|---|---|---|
| a game's generator (private) | `main` | the generator itself | its session, on the owner's word |
| a game's site | `dev` | production (Vercel deploys `main`) | the coordinator, on the owner's word |
| the portal, `seed-archive` | `dev` | production (deployed from the CLI) | the coordinator, on the owner's word |
| `renovate-config` | `main` | the presets Renovate reads | the coordinator, on the owner's word |

- **Only generators and `renovate-config` commit to `main`.** Neither is deployed, so there is nothing to protect;
  `renovate-config` is written once and rarely touched again.
- **Everything else goes into `dev`**: a session's commits, every pull request, Renovate's too. Merging into `dev`
  deploys nothing.
- **`dev` is the default branch on GitHub** of every site and the portal, so a pull request opens against it, and
  Renovate, which reads its configuration from the default branch, opens its own there too; `renovate.json` needs no
  `baseBranchPatterns`. Production is set apart explicitly: a site's Vercel project deploys `main` (its production
  branch), and the portal is deployed only from a checkout of `main`.
- A change starts on a branch of its own off `dev` and comes back through a pull request into `dev`, or is committed
  on `dev` directly by the session that owns the repository.
- Every commit and merge needs the owner's word, unless he gave a session standing permission.

## A release

A release is **the coordinator merging `dev` into `main`** and putting that on production. It happens only on the
owner's word in the coordinator's own conversation; a session quoting the owner is not that word.

1. **Ready.** The session that owns the repository says what is in `dev` for this release and that its build passes.
2. **Release notes.** A release a visitor can see gets its lines, under the archive's next version, in the portal's
   `content/release-notes/<slug>.md` (D16), committed to the portal's `dev` with it. The portal is released together
   with the game, or right after, so the notes appear with the change.
3. **Review.** The check before a release in `seo.md` (titles, links, redirects, robots and sitemap), on the built
   app: `next start` on the app's built port (`.claude/rules/architecture.md`, Local ports).
4. **Merge.** A pull request from `dev` to `main`, titled with what a visitor gets; merged with a merge commit, so
   `main` and `dev` keep the same history.
5. **Deploy.**
   - A site: Vercel deploys `main` by itself; a site with migrations applies them through its CI on the same push.
   - The portal: `vercel deploy --prod` from a checkout of `main`, never from `dev` or a branch.
6. **Check on production.** The changed pages answer `200` on seedarchive.gg, old addresses redirect in one hop, the
   release notes show the release, and Sentry shows no new error from the release.

## Version

One version for the whole archive (the owner, 2026-11-16), since the release notes are one list: every release is
`Seed Archive <major>.<minor>`, whatever it carries.

- A release raises the minor number: 1.0, 1.1, 1.2.
- Opening a new game's section raises the major: Valheim opens as 2.0.
- Every section released on one day shares that day's number; each writes it in its own file's heading
  (`## 16 November 2026: version 1.1`), and the portal refuses to build if one number sits on two days.
- A game has no version of its own. Its releases from before the archive's 1.0 keep their dates, without numbers.

The coordinator gives the number when the release is called, in step 2 below.

## Order between repositories

- When a change spans the portal and a game (a page moving between them, a redirect, the shared header), the side
  that **receives** goes first: the portal's page is live before the game's site redirects to it.
- One release, one cause: a database migration that moves tables, a domain change, or a rename goes out alone.
- The coordinator sets the order when several repositories release at once.
