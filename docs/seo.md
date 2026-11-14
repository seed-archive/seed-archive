# Search: what every section of Seed Archive shares

The rules of search that hold for the whole domain, seedarchive.gg, and for every game's section under it. A game keeps
its own semantic core, its menu, and its link map in its site repository (`docs/seo.md` there) and opens that document
with a link to this one. The No Man's Sky section's is `docs/seo.md` of its site repository.

## The domain and the sections

- One domain, one section a game: `seedarchive.gg/<slug>/` (D2, D5). The portal serves the root and the shared pages;
  each game's app serves its section under `basePath` `/<slug>`.
- Every path a game writes as text into HTML or CSS (Markdown links and pictures, sprites, renders, placeholders, data
  files read by the browser) takes the section's prefix from the app's `BASE_PATH`. Next.js prefixes only its own
  links (`next/link`, `redirect`, the router).
- A link from a game's page to the portal (the header's "Seed Archive", the shared legal pages) is a plain
  `<a href="/…">`: `next/link` would add the game's prefix.

## Titles, descriptions, and the game's name

- A page's `<title>` ends `— Seed Archive`. A game's own page names the game once, in its `<title>` (`<title> in No
  Man's Sky — Seed Archive`); its bold opening question, its headings, and its description do not repeat the name.
- A page's description is the answer to its own question, in 160 characters or fewer.
- Internal working names of repositories (Crimson Orb, Atlas Archive) never appear in what a visitor or a crawler reads.

## Header and footer

- One header for the whole archive (D15): "Seed Archive", a plain link to the domain's root, then the game's name, a
  link to its section's home, then the game's own menu.
- A game's footer speaks for its game (D12): its sections, guides, and tools. The legal pages and anything about the
  archive itself belong to the portal's footer.

## Links

- A link stands inside a sentence, and its anchor text appears on the page it opens (its `<h1>`, lead, or title). No
  "See also" or "See more" rows.
- No page links to itself in its own text; the header and the footer are the only exception.
- No links to Reddit (they leak rank). External links only where a page cites a rule.
- Every page of a game is reached from at least two other pages by a link in their text.
- Every heading `h2` to `h4` of a text has an id from its words, unique on the page, so any section can be linked.

## Crawling and indexing

- `robots.txt` at the domain's root lists every section's sitemap and disallows the pages that are private to a user
  (a game's likes). Each section serves its own `sitemap.xml` under its prefix, with absolute `https://seedarchive.gg/
  <slug>/…` addresses.
- Every page states its canonical address on seedarchive.gg, whatever host served it.
- Search Console: one domain property, `seedarchive.gg`, verified by a DNS TXT record in Cloudflare (keep the record);
  each section's sitemap is submitted to it. An old address of a game keeps its own property until Google has moved
  it: "Change of address" from that property to `seedarchive.gg`, once the old host answers every path with a
  permanent redirect.

## Redirects

- A moved page answers with a permanent redirect (308), in one step from any old address: the old host, the domain's
  root without the prefix, and the section's own old paths all lead straight to the page's current address.
- The data requests of Next.js (`/<slug>.rsc` and the like) and Vercel's own paths (`/_vercel/…`, Analytics) are
  never redirected.

## Analytics

- Each game counts its own visits in its own Vercel project. Vercel Analytics loads its script and sends its events by
  a path at the deployment's root; on the shared domain that root is the portal, so the portal routes those paths to
  the game's project, or a game's views are lost.

## Visibility

- Sites and the portal are public; generators are private (D7). A public page, comment, or document never names a
  generator's files, functions, scripts, or methods, nor names read from a game's binary; it says "the <Game>
  generator" and stops there.

## Review before a release

1. Read the served HTML, not the source: `curl -s localhost:3000/<slug>/<path>` shows what a crawler gets (the
   `<title>`, the `<h1>`, the links).
2. No link or picture of the served HTML starts with a bare `/` outside `/<slug>/`, except the header's "Seed Archive"
   and the shared legal pages (`curl … | grep -oE '(href|src)="/[^"]*"'`).
3. Count the incoming links from text of each page that changed: none below two.
4. Check each changed page against its row in the game's semantic core: the primary query in the title, the lead, and
   the description.
5. After the deploy: the section's `sitemap.xml` answers with every new page, old paths answer 308 in one step, and the
   analytics of the game's project show the visits of that day.
