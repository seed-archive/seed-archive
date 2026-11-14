# Analytics: one counter for seedarchive.gg (open question)

Gathered on 2026-11-15 for a decision the owner will make later. Nothing below has been changed yet.

## What the owner wants

- **One statistics for the whole domain** — the portal and every game together, never two counters to reconcile.
- **Clicks on buttons**, not only page views: for example, how many visitors press a button about Interceptors, to
  decide whether to build an Interceptor finder.
- No cookie-consent service bought from a third party.
- Counted visitors should not be lost to ad blockers.

## How it stands today

- Each Vercel project has its own Web Analytics: the No Man's Sky project (`atlas-archive`) is on and counts; the
  portal's project (`seed-archive`) has Web Analytics **off**, so it counts nothing.
- Vercel Analytics loads its script and sends its events by a path at the deployment's root, unique per project:
  `/<id>/script.js`, `/<id>/view`. The No Man's Sky id is `a1110995d7968c05`. On the shared domain that root is the
  portal, so the portal forwards `/<id>/*` to the game's project (`lib/games.ts` → `analytics`, `next.config.ts`).
  Views of the first minutes after the release of 2026-11-14 were lost before that forwarding existed.

## Done on 2026-11-15: one counter now, in the portal's project

The owner asked for one statistics at once, aimed at a portal and two games from the start. Web Analytics is on in
the **portal's** Vercel project (`seed-archive`, Hobby); its path at the domain's root is `/933b9afd1a52216d/`
(`script.js`, `view`). The portal's `<Analytics />` uses it as is; every game's app sends there too with
`<Analytics scriptSrc="/933b9afd1a52216d/script.js" endpoint="/933b9afd1a52216d" />`. One report shows the portal and
every game; sections by path. Still Hobby: views only, no clicks.

The switch: for a few minutes the portal sent to the No Man's Sky project's path `/a1110995d7968c05/`, which the
portal forwards there. Once the No Man's Sky site sends to the portal's path, Web Analytics is turned off in the
`atlas-archive` project and that forwarding (`analytics` in `lib/games.ts`) is removed — one source of numbers only.

## Option A — Vercel Web Analytics, one project for the domain

- Turn Web Analytics on in the portal's project; the portal and every game send to the portal's `/<id>/` path
  (`<Analytics scriptSrc=… endpoint=…>` in each app's layout). One report for all of seedarchive.gg; sections by path.
  Not tested yet: that Vercel counts events from pages of another project into the portal's (by design it should —
  the request reaches the portal's own path on the same domain). Test on one page first.
- No cookies: no consent banner, no change to the privacy policy.
- Ad blockers: the script comes from our own domain by a per-project path, not from a third-party host, so common
  block lists rarely catch it. Vercel's docs say nothing about blockers; no guarantee.
- **Plans** (vercel.com/pricing and docs, read 2026-11-15):
  - Hobby (free): 50,000 events a month for the account; when spent, collection stops after a 3-day grace until the
    next month; no extra events can be bought; reporting window 1 month; **no custom events (clicks)**. Hobby is for
    non-commercial use only, so affiliate links or any income need Pro anyway.
  - Pro: **$20 a month** per developer seat, with $20 of usage credit included. Web Analytics events $3 per 100,000
    (no included quota, paid from the credit); reporting window 12 months; **custom events (`track()`) included, 2
    properties per event** (e.g. `feature=interceptors` and the page).
  - Web Analytics Plus add-on: +$10 a month per team — 8 properties per event, 24 months, UTM parameters.
- Old No Man's Sky statistics stay in its own project; the shared one starts on the day of the switch.

## Option B — Google Analytics 4

- One GA4 property for the domain, sections by path; events (clicks) free and unlimited; links to Search Console,
  where `seedarchive.gg` is already a verified domain property.
- **Ad blockers cut it**: GA is on every common block list; a noticeable share of a gaming audience is not counted.
- **Cookies → consent banner** for visitors from the EU and the UK, and a rewritten privacy policy (what Google
  collects, why, how to withdraw consent) — part of moving privacy to the portal (D12).
- GA4 has **no banner of its own**. Google provides only Consent Mode v2 (a way to tell the tag the visitor's choice).
  A certified consent platform is required by Google only for sites showing Google ads (AdSense, Ad Manager) in the
  EU/UK; for analytics alone our own banner is allowed.
- Our own banner: one shared component ("Accept / Decline", link to `/privacy`); the choice stored in the browser,
  shared by the portal and every game on the one domain (like the theme, D14); `analytics_storage` denied by default,
  updated on "Accept".
  - Basic consent mode: GA is not loaded before consent — clean, but those who decline or ignore the banner are not
    seen at all.
  - Advanced consent mode: GA loads at once and sends cookieless pings before consent; Google models the missing
    visitors. Fuller numbers, partly estimated; the pings must be described in the privacy policy.
- **CookieYes** (the banner used on CoArt, coartmarket.com; prices from cookieyes.com/pricing, page dated 2025-12-23,
  per domain): Free $0 — 5,000 page views a month, CookieYes logo on the banner, one free plan per account; Basic
  $10/month ($100/year) — 100,000 views, then $0.30 per 1,000; Pro $25/month ($250/year) — 300,000; Ultimate
  $55/month ($550/year) — unlimited, the only plan without their logo. All support Consent Mode v2. Against it: a
  third-party script on every page, the logo, a price that grows with traffic. Our own banner is one component.

## Not both

The owner, 2026-11-15: two counters will never agree and time goes into finding the difference. One source of numbers
only; whichever is chosen, the other is removed the same day. When switching counters, numbers are not compared with
the old ones (a different way of counting, e.g. blockers), they start from the switch.

## Notes

- Speed Insights is separate (page speed, not visitors) and is on nowhere; it is not part of this choice.
- A button meant to measure demand must lead to something real (site rule: pages state only what is known, no
  "coming soon"); e.g. the existing Interceptors page, with the click counted.
- Whichever counter is chosen, it is shared by the whole domain and belongs to the coordinator (portal, banner,
  privacy); each game only adds the component its layout is told to use.
