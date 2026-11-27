# Distributed search: visitors compute seeds for the archive

**Status:** draft, 2026-11-27. The owner's idea and two rounds of his decisions the same day; the three games'
answers are below. The parts marked Open wait on a game session or on the owner. **Deferred** (the owner,
2026-11-27): set aside, behind a flag and out of releases; what was built and on which branches is in
[work-in-progress.md](work-in-progress.md).

**Computing is in the browser** (the owner, 2026-11-27): every portion is computed and confirmed by visitors'
browsers. The owner's machine is not part of the scheme; what it runs, if anything, is his own business. The server
only issues tickets, compares answers, decodes candidates and keeps the books.

## The idea

A visitor lends the archive his processor, as SETI@home's volunteers did (BOINC): the site hands him small portions
of a seed search, his browser computes them in the background, and the archive's top lists (No Man's Sky's best
items, Valheim's best worlds, RimWorld's best maps) grow from what comes back. For each confirmed portion he earns
points, one balance for the whole archive, which he spends in any game on a search of his own (his fighter, his
world).

## Who owns what

The line is the same as everywhere in the archive: what every game shares belongs to the coordinator, what depends
on a game's seed belongs to that game.

| Part | Owner | Where |
|---|---|---|
| The contract every game follows: the module's call, the protocol, the tables (below) | coordinator, agreed with the games | this document |
| The compute core: worker pool, download manager, its panel, automatic batches, the protocol's client | the UI session (the owner, 2026-11-27) | `@seed-archive/compute` in `packages` |
| A game's plugin: names its module, its schema and its searches, decodes nothing | the UI session, from what the game gives | `@seed-archive/compute-<slug>` in `packages` (`compute-valheim`, `compute-nms`), naming the core as its peer |
| The points ledger and each visitor's statistics (`public`) | coordinator | migrations in the repository that applies all migrations |
| A game's searches, portions, tickets, answers and their confirmations; the cursor | the game | its schema (`nms`, `valheim`, `rimworld`), in the shape this document fixes |
| The search kernel in WebAssembly | the game | built by its generator into its site's `public/wasm/`, as the map's |
| What a result means: decoding, scoring, the top list | the game | its generator; the top list in its schema |
| The announcement of a confirmed find in Discord | Marketing | later, once the Discord channel is ready |

One core and a plugin a game, as the globe is (the owner, 2026-11-27): the core knows tickets, workers and the
server, never a game; a plugin knows its game's module and searches, never the server. A visitor's browser loads the
core once and the plugins of the games he computes for.

The game's work stays in the game's schema, the visitor's money in the portal's (the owner): the portions, who
computed each and how many answers agree are the game's; the balance is the portal's.

## In the browser

- **Cores.** The page reads `navigator.hardwareConcurrency` and lets the visitor choose how many cores to lend. The
  package starts that many Web Workers, each with its own instance of the game's module and its own ticket. Portions
  are independent, so no shared memory, no threaded WebAssembly and no cross-origin isolation headers (which would
  break the Google sign-in) are needed. Pause and stop are always at hand; a hidden tab or a sleeping phone simply
  stops, and an unfinished ticket expires on the server.
- **Download manager.** Every module the visitor takes is kept in the browser's Cache Storage, and the panel lists
  them: the game, the search, its size, delete. `navigator.storage.estimate()` shows the space used,
  `navigator.storage.persist()` asks the browser not to clear it. Every section of seedarchive.gg is one origin, so a
  module taken on one game's page is seen from every other.
- **Shared code.** Each game's module is compiled on its own and WebAssembly cannot share code between two of them
  today; what is shared is the package's JavaScript (the pool, the manager, the protocol), loaded once. A game's
  module holds only its own search.
- **Automatic mode** (the owner, 2026-11-27): once a batch of four tickets is answered, the next is taken at once,
  without a click, until the visitor pauses; without it, one batch a click.
- **The panel** opens from the shared header on every section: the modules downloaded, the cores, the running
  batch, the batches computed, the balance. Each visitor's statistics (batches computed, portions closed, points
  earned) are queries over the games' answers and the ledger, never stored counts.

## Version 1 of the contract (2026-11-27)

What the UI session builds and each game follows. Changes are agreed through the coordinator.

### The module's call

A game's WebAssembly module (wasm-bindgen glue and its `.wasm`, in the site's `public/wasm/`) exports

```
searchPortion(search: u32, start: f64, count: u32, params: Float64Array) -> Uint8Array
```

- `search` is the id of the row in the game's `searches`; `start` a position (an integer below 2^53); `params` the
  ticket's numbers, as the game's search defines them.
- The result, little-endian: the digest (u64); the candidate count (u32); then each candidate: its position (u64),
  its part (u32), its value count (u32), its values (i64 each; a float travels as its bits).
- **At most 16 candidates a portion** (our own choice: a portion is about one find; the game keeps the best).
- The module never knows a ticket, a visitor or the server.

### The protocol (Supabase RPC, the visitor's session)

In the game's schema, both `security definer`, both refusing a visitor not signed in:

- `issue_batch(p_search int) returns setof ticket`: four tickets of `p_search`, two of the oldest open portions this
  visitor has not answered and two new ones from the cursor (more new when no old one waits, more old when the
  search is done), shuffled; each row `(id, search, start, count, params, expires)`, nothing saying which is new.
  A visitor may hold several batches at once (one a four cores), so a portion he holds a live ticket of is never
  issued to him again.
- `answer(p_ticket bigint, p_result bytea) returns void`: the module's bytes, as they came. Refused for a ticket that
  is not the visitor's, expired, or answered. Writes the answer; when four answers of the portion carry one digest,
  closes it, marks the answers that differ, writes the candidates into `finds` and one point a matching visitor into
  `public.points`.

In `public`:

- `points_balance() returns bigint` and `points_history(p_limit int)`: the visitor's own.

The core holds no other server calls; what a game's page shows of its finds is the game's.

### The tables

A game's schema, one shape for every game (the game's own columns beside these):

| Table | Columns |
|---|---|
| `searches` | id, name (a message key), game build, settings (jsonb, the game's), params (float8[]), count a portion, next position, open or done |
| `portions` | id, search, start, count, opened at, closed at (null while open) |
| `tickets` | id, portion, visitor, issued at, expires at (issued + 1 hour) |
| `answers` | ticket (primary key), digest (bigint), result (bytea), answered at, marked |
| `finds` | id, search, position, part, values (bigint[]), score (null until rated), portion |

A visitor reads only his own tickets and answers; `finds` are public once their portion is closed; nothing is
written except by the two functions. Counts (a portion's agreeing answers, a visitor's batches) are queries.

`public.points`: id, visitor, amount, game (the slug), reason (`portion`, `search`), reference (the portion or the
personal search), at. Written only by the games' `answer` and by a personal search's price; read by its owner.

### The core and a plugin

- `@seed-archive/compute` keeps the visitor's choice of cores (all but one by default), one worker a core, each
  with its own instance of the module and one ticket at a time; compiles a module once a page and hands it to the
  workers, as the globe's pool does.
- The download manager keeps each module in Cache Storage (`seed-archive-compute`), lists it with its size, and
  deletes it; `navigator.storage.estimate()` and `persist()`.
- The panel, from the shared header: modules, cores, the running batch, automatic mode, batches computed, balance.
- A plugin is data: the game's slug and schema, its module's URLs, and its searches' message keys.

## The search module: what was agreed with the games

A game's module exports one call:

- `searchPortion(search, start, count, params) -> Uint8Array`: computes `count` seeds of the search `search` from
  `start` and returns
  - a **digest**: a hash over every value the portion computed, the same on every machine for the same portion;
  - the **candidates**: for each seed that passes the filter in `params`, its index in the portion and its raw
    values.

`start` and `count` are positions in the game's own numbering of its seed space; how a position maps to a seed (an
address, a world name, a planet seed) is the game's. `params` is data the server sends with the ticket (thresholds
on raw values); the module applies it without knowing what the values mean.

**The kernel computes, the server understands.** As far as a game's generator allows, the module carries only the
heavy inner computation (the random draws and the walk over the seed space); the game's tables and the rules of
what is good stay out of the browser, and the candidates come back as raw values that the game's generator decodes.
This keeps the method in the browser as small as possible; obfuscation is not used, since it costs the speed the
search is for. The names section and the paths are removed as in every module (`generators.md` → WebAssembly).

**The method must be split even where it does not split by itself** (the owner, 2026-11-27, of No Man's Sky, and
likely of RimWorld: a world's factions and their leaders must be generated in turn before the next part, much of it
work that never reaches the result). Ways to cut it, to be weighed with each game:

- **The server prepares, the browser computes, the server ranks.** The cheap part that needs the game's tables
  (No Man's Sky: which buildings a system has, what item stands in each and its class) runs on the server when a
  ticket is issued, and the ticket carries only its integer outcome as params: the seeds and positions to test. The
  browser runs only the expensive part that needs no private tables (No Man's Sky: the terrain under each building,
  which the globe ships already) and answers pass or fail with the digest. The server then ranks what passed. The
  cost moves to the server in proportion to what is issued, not to the seed space.
- **A kernel of generic steps driven by data.** The module holds the building blocks (the game's random generator,
  its noise, its draws) and the ticket says which to run in what order and with what constants, so the browser
  never holds the rules, only one portion's worth of them. Weaker than the first: a reader who collects many
  tickets collects the rules too.
- **Stages across tickets.** A search's chain is cut where its state is small: one ticket computes up to a cut and
  returns the state's integers, another continues from it. Only where a stage is expensive enough to be worth a
  ticket of its own.

No Man's Sky's answer (2026-11-27): the first way, cut one step later; the second rejected (its rules are data, and
collected tickets would rebuild them); the third adds nothing (its one expensive stage fits a ticket). Details in its
section below.

## Tickets

- A **portion** is a game's search, a start and a count, sized to take **one minute of one core of the reference
  machine** (the owner, 2026-11-27): a middling gaming computer, one that runs No Man's Sky, not a calculator. That
  minute is the archive's **compute unit**, the same for every game; FLOPS do not fit, since the searches are
  integer and memory work in a browser. Each game measures its search's cost a position on the reference machine
  and sets the count; the first portions' real times adjust it. The game's search table keeps the count and the
  cursor of the next new portion.
- The visitor's browser asks for **a batch of four tickets: two new portions and two computed by someone else**,
  mixed so that the browser cannot tell which is which. A ticket names the game, the search, the portion and the
  params; it never says whether it is new.
- **The old tickets are the oldest open portions** (the owner): a batch always closes the portions waiting longest,
  so the most visitors get their points soonest.
- **A ticket expires after an hour** (the owner): sixty times its expected time. An expired ticket is issued to the
  next visitor.
- One database function a game issues tickets, so two visitors never take one new portion. A ticket is issued only
  for a module the visitor has downloaded, and only to a signed-in visitor: an answer is written to his account and
  his ledger, so anonymous computing has nowhere to go (the owner, 2026-11-27).

## Confirmation

One level (the owner, 2026-11-27): **every portion is closed by four equal answers**, one computation and three
confirmations by four different visitors. The digest covers the candidates, so a closed portion's finds are
confirmed with it; there is no separate check of a find.

- An answer that differs from the others earns nothing and is marked; the portion is issued again until four
  answers agree.
- A visitor never gets the same portion twice.
- A visitor's reputation is the count of his marked answers, given by a query; a visitor with a poor one gets more
  old tickets.
- A find from a portion not yet closed is shown as unconfirmed, if shown at all, and is not announced.

The cost is four computations a portion; the owner accepts it.

## Points

- One balance for the whole archive, a ledger in `public` (a row per change: the visitor, the amount, the reason, the
  ticket); the balance is the sum, never a stored count.
- **One ticket, one point** (the owner, 2026-11-27), so a batch is worth four. A point is written only when its
  portion closes: when the fourth equal answer arrives, each of the four visitors gets one point. The first to
  compute a portion waits for three confirmations; a confirmer waits for the rest of the four. Points never come on
  submit, so an unchecked answer earns nothing.
- The ledger in `public` is written by the game's answering function when it closes a portion, a row a visitor,
  naming the game, the search and the portion.
- Points are spent on a **search of one's own** (a ship, a world): the visitor computes it on his own processor, and
  the server decodes the result for him. The archive keeps that he searched and whether he found it, not the result.
  Its price is Open.
- Even where a game's method is public (Valheim) and the browser could rate a result itself, every answer still
  goes to the server: the ledger and the confirmations need it.
- Points are not money, cannot be bought or sold, and have no value outside the site.

## Announcements

When a find is confirmed, an event is written (`public`), and Marketing's Discord bot announces it. Not before the
Discord channel is ready.

## Open

- **The reference machine**: which computer stands for "a middling gaming computer" when a game measures its minute.
  Proposed: one core of this Mac in Chrome, until a slower machine is at hand.
- **How No Man's Sky's method is split** (The search module, above), agreed with its session.
- **Where the server decodes.** The server decodes with the game's own WebAssembly, the same module or a second one
  holding the private part, so its numbers equal the browsers' (the owner, 2026-11-27). A compiled module committed
  to a public site repository is public too, so the private part cannot be deployed from there. No Man's Sky's
  decoder is its own build that only a private place may hold. Candidates: a Supabase Edge Function or a Vercel
  function deployed from a private repository; or the generator's own command on the owner's machine, filling the
  score of new finds as the generator already writes the site's tables (a find waits unrated until then). Open.
- **The price of a personal search** in points.

## What each game answered

### Valheim (2026-11-27)

- **Seed space.** A world is the text the player types, and the game's seed is that text's hash. The search's
  positions are already numbered: position `i` gives a reproducible ten-character world name, so a portion is
  `(start, count)` over `i`, about 4.29 billion positions in all. The hunt so far has covered positions 0 to
  1,853,760, which becomes the cursor. Two positions may give one hash; a find is keyed by its text.
- **Speed.** Natively about 1.4 worlds a second a core; WebAssembly not measured, expected 1.5–3× slower. A three-minute
  portion is about 128 positions in the browser until measured.
- **Filter.** The search itself filters: every boss altar within a band of the start, the band's half-width passed as
  params. About one world in 275 passes, so about one candidate a portion, often none; a candidate returns its index
  only.
- **Meaning.** Valheim's world generation is public already, so the browser may also rate a find with the site's own
  seed report (about 9 s); Valheim needs no private decoder, personal searches included.
- **Digest.** Built from each world's outcome (the bosses that passed and the bit patterns of the altars' positions),
  hashed with a fixed hash. WebAssembly's floats are deterministic across browsers. Open: whether the native digest
  equals the browser's bit for bit; one test portion decides, and if not, a native confirmation compares the find's
  outcome instead.
- **Module.** One more export of the module the map already uses, expected tens of KB more on its 1.75 MB. Open:
  ship it as the map's module (already cached by map users) or as a smaller build without the map's parts. A search
  is tied to the game build its world generation matches; a new build is a new search.
- **Schema `valheim`.** `searches` (id, name, game build, half-width, portion size, next cursor) and `finds` (search,
  index, world name, bosses passed, score, score build, confirmations, first portion, found at; unique on search and
  world name). The top 100 is a query over `finds` by score.

### No Man's Sky's module (2026-11-27, built, not committed)

- Way (c): shop, monolith, pillar, staff and station tools stay out. Thirteen lists: two camp tools, seven ship
  kinds, the living ship, three creature lists; class S with a square only.
- `search.js` + `search_bg.wasm`, a build of its own (opt-level 3), 128 KB gzipped, with no layout data and no item
  names. Params: the galaxy, then a floor a list. A result is 12 bytes and 32–56 a candidate, at most 13.
- **60 systems a portion**, about a minute of one core in Chrome on this Mac (0.7–1 s a system), uneven.
- The digest is a 64-bit hash over integers only; native and Chrome agree on the sample, and the portion's finds
  equal the generator's own hunt's.
- **The decoder** is a third build, `decodeItem(galaxy, position, part, values)`, under a millisecond an item. It
  holds the names, so it is never in a site's `public/` or any public repository; it reads no terrain, so it cannot
  disagree with the browsers. Where it runs is Open (Where the server decodes).
- Every rebuild is a new file (a few bytes differ between builds of one source), and a new search if its logic
  changed.
- The `nms` schema (`20261127140000_nms_search.sql`): the five tables of the template, the first search `Euclid`,
  60 a portion, from position 100; it takes Valheim's two functions once they land.

### Valheim's pilot (2026-11-27, built, not committed)

- `searchPortion` is the export of a search build of its own, `search.js` + `search_bg.wasm`, 168 KB (the map's
  module, 1.78 MB, keeps it too); the same code as the generator's own hunt, both giving the native digest.
- Params `[1000]`, the band's half-width in metres. The digest is a 64-bit hash over each world's count of bosses
  passed; a candidate is a world with all eight, its position only.
- Speed: 2.4 worlds a second natively on one core of this Mac, 1.6–1.8 in the module under V8; **100 positions** a
  portion for one minute here. A slower gaming computer's minute comes from the first portions.
- The digest of positions 0–12 equals natively and in V8. Open: Safari's engine.
- The `valheim` schema (`20261127130000_valheim_search.sql`, with a rolled-back test of the whole cycle in
  `supabase/tests/valheim_search.sql`) follows the template; it lands after `20261127120000_points.sql`.
- **End to end on the local stack** (the UI session, 2026-11-27, `packages/compute/test/supabase.e2e.test.ts`,
  skipped unless its local addresses are set): a visitor signs up, takes a batch of four, the core computes them
  with the search build in Node and answers; the bytes round-trip, a second answer is refused, the balance stays 0
  until a portion closes. About 52 s a portion of 100 worlds on one core.

### RimWorld (2026-11-27)

**The owner, 2026-11-27: RimWorld is not a pilot and nothing waits on it.** Its search is a **colony map** that
forms a nearly closed ring, easy to defend; the rules of that are not written yet. It will still compute a whole
world and then the maps of its tiles, so it is slower than the world search below and does not split by itself.
When it comes, it may correct this design, and that is expected. Its session's first answer, kept for then:

- **What is searched.** A world, not yet a colony map (the game's map generation is not ported). A search fixes
  the world's settings (coverage, rainfall, temperature, the DLC set, pollution, landmark density); one seed is one
  world, and position `n` is the seed text written as the decimal number `n`, so a find can be typed into the game as
  is. A candidate is a **tile** of a world (a start with hills, a river or road, trading towns near).
- **Speed.** Natively, a world with terrain, rivers, landmarks, factions, towns and roads takes about 0.15 s at 30 %
  coverage and 0.4 s at 50 %; factions and roads cost most. WebAssembly not measured, expected 1.5–2.5× slower. A
  three-minute portion is about 400–700 worlds at 30 %, 150–250 at 50 %: a portion's size is the search's, set by
  its settings.
- **Meaning.** Only partly separable: world generation needs the game's tables and the towns need the factions'
  data, and both are in the browser already for the planet tool. What stays out is the rating: the module returns
  raw values per tile and applies the filter sent as data, and returns at most the best few tiles of a world, so a
  lax filter over 30,000 tiles cannot flood a portion.
- **Digest.** Over integer results only (each tile's biome and hilliness, river and road links, towns' tiles and
  factions). The math library differs between a native build and WebAssembly, so a native confirmation runs the same
  WebAssembly module, and the digest covers integers only.
- **Module.** About 0.35 MB gzipped, plus the factions' data per DLC set (0.27–0.49 MB gzipped); a terrain-only
  search is the module alone.
- **Open.** The WebAssembly speed, and which world search comes first (the planet finder's: a start on a road
  linking the early traders, with hills near).

### No Man's Sky (2026-11-27)

- **Seed space.** One seed is one star system: a galaxy and an index, up to 2^32 indices a galaxy, scattered over the
  galaxy's regions by a fixed rule; about 82 % are real stars, the rest cost nothing and give nothing. A portion is
  `(galaxy, start, count)`; the cursor is the galaxy's next index.
- **What is searched.** Every body of a system, every building on it with its item (multitools, staffs, crashed
  ships, a crash site's living ship) and every creature that can be adopted: 28 top lists, each keeping only class S
  finds with a 2×2 square of cells, ranked by a score from the base stats.
- **Speed.** Natively about 6 s a system a core, most of it the terrain under each building; a three-minute portion
  is about 28 systems natively, 10–20 in the browser (not measured). Systems differ much in cost, so portions are
  uneven.
- **Meaning.** Not separable: the buildings, the items and their classes all need the game's tables, so most of the
  generator's item generation would ship, on top of the terrain the globe ships already. Only the ranking and the
  lists stay out. The owner, 2026-11-27: item generation does not ship whole, the method is split instead (The
  search module, above). "Class S with a
  square" is not rare (about two finds a system), so the module would need each list's stat ranges and current 100th
  score as params, and return only what beats it.
- **Digest.** Over integer outcomes only (seeds, classes, cells, buildings' cells, the pass or fail of each terrain
  test), confirmed natively with the same WebAssembly module, since a building at the very edge of a test may flip
  between native and browser math.
- **The split** (its session, 2026-11-27; nothing built):
  - an item's class depends on the ground under its building, so the server cannot put items in a ticket;
  - the server walks the system with the game's tables and sends each building's footing as numbers, about 7–10 a
    building, tens of KB a portion (a few hundred buildings a system, estimated, not counted);
  - the browser computes the terrain under each building and whether it stands, with nothing the globe does not
    ship already, and answers each building's stand and height as integers (a float's bits);
  - the server, with the tables again, derives the items from those heights and ranks them;
  - what needs no terrain stays on the server alone, and a ship's site goes to the browser only once it already
    passes, for its one land test.
- **The server's share** scales with the seed space searched, not with what passes, since an item exists only after
  its height. Measured: about 6.4 core-seconds a system natively; the share of it on the server is not profiled.
- **Determinism.** Every browser runs one `.wasm` build, without relaxed SIMD, with every mathematical function
  compiled in and no fused multiply-add, and no NaN payload in the digest; then four browsers decide every threshold
  alike. **The server decodes with the same `.wasm`, never natively**: native math may differ in the last bit and
  flip an item at an edge. For the same reason a record comes from one path, browsers or native, not both.
- **Speed.** A one-minute portion is about 5–15 systems in a browser (estimated, not measured).
- **Module.** The globe's module is 485 KB raw, 78 KB gzipped, 61 KB Brotli; the stand tests add an estimated under
  10 KB compressed and no tables.
- **Rejected by the owner** (2026-11-27): the split above puts an item a standing building on the server, for every
  system issued. The server decodes **one item a list a portion**, the one the browser chose as best.
- **The scoring extract** (its session, 2026-11-27, read from the code, nothing built): the browser walks the
  system, tests the terrain, and scores each item with small tables of numbers and no names (the walk's densities,
  the class draw, the public base-stat rows, the branches that decide a tool's body); it returns the best of each
  list. The server turns that one seed into the full item in milliseconds, with no terrain. The module grows well
  under 100 KB gzipped beyond the globe's. Not traced yet: what ships' and creatures' scores pull in.
- **The one part that does not split**: a shop's or a monolith's item depends on where its terminal stands, and that
  comes from the game's layout data (152 KB gzipped). The owner's choice:
  - (a) ship only the numbers that place a terminal, without names: the module grows about 150 KB gzipped, and a
    reader could rebuild a building's footprint;
  - (b) the server places the terminals of each system issued and sends them in the ticket: a few a system, but per
    system issued;
  - (c) leave shop and monolith tools out of the browser's lists; camps, crashed and living ships and perhaps
    creatures stay.
- **Open.** The owner's choice of (a), (b) or (c); ships' and creatures' scores; buildings a system.
- **Schema `nms`.** `searches` (list or kind, galaxy, game build, portion size, next index) and `finds` (search,
  galaxy, index, locator, list, score, raw values, first portion, found at; unique on list and locator); the top 100
  is a query by score per list.

## The common contract (from the three answers)

- **A search** belongs to one game, one game build, and fixed settings (Valheim's band, RimWorld's planet
  settings, No Man's Sky's galaxy and list). A new game build is a new search.
- **A position** is an integer in the search's own space, from 0 up; the game maps it to a seed. A portion is
  `(search, start, count)`; its `count` is the search's own, set so a portion takes about three minutes in the
  browser, measured on the first portions and adjusted. No Man's Sky's portions stay uneven, and that is accepted.
- **The module's call** is `searchPortion(search, start, count, params) -> Uint8Array`, returning:
  - the digest: a fixed 64-bit hash over **integer outcomes only**, never raw floats;
  - at most a fixed number of candidates a portion, each `(position, part, values)`: `part` is the game's place
    inside the seed (a RimWorld tile, a No Man's Sky building), `values` are integers.
- **Params** are data from the server: thresholds the module applies without knowing their meaning (Valheim's band,
  RimWorld's tile filter, No Man's Sky's stat ranges and each list's current 100th score).
- **Rating**: in the browser where the game's method is public (Valheim); otherwise on the server, with the game's
  WebAssembly (Where the server decodes, Open).
- **Confirmations are counted, never stored**: a portion's answers are rows, and how many agree is a query over
  them.
- **A game's schema** holds, in one shape for every game: `searches` (settings, game build, count a portion, the
  next position), `portions` (search, start, count, closed or open), `tickets` (portion, visitor, issued, expires),
  `answers` (ticket, digest, candidates, marked or not) and `finds` (search, position, part, values, score, the
  portion); the top 100 is a query by score. The issuing and answering functions are the same code in each schema,
  and the answering one writes the portal's ledger in `public`.

## Plan

0. **Decided** (the owner, 2026-11-27): a core and a plugin a game; one ticket one point, written when four equal
   answers close the portion; batches of two new and two oldest open; a minute a ticket, an hour to expire;
   automatic batches; signing in to compute; the work in the game's schema, the ledger in the portal's; computing
   and confirming in browsers only; No Man's Sky's method is split, not shipped whole. **Still open:** the
   reference machine, where the server decodes, the price of a personal search.
1. **The ledger** (coordinator): the points ledger in `public`, and the shape of a game's tables and functions
   (Common contract) written once as the template each game's migration follows.
2. **`@seed-archive/compute` and `compute-valheim`** (the UI session): the worker pool, the download manager and its
   panel in the shared header, automatic batches, the protocol's client, the plugin interface.
3. **Valheim first**, as the pilot, since its method is public: `searchPortion` as one more export of its module,
   its tables and functions in `valheim` from the template, the cursor at the hunt's position. Measure its minute on
   the reference machine, and compare one portion's digest in two browsers.
4. **Closing and points** with Valheim alone: batches of four, four equal answers close a portion, a point to each.
5. **No Man's Sky** on the agreed split (its section): first the profile of the server's share, since the server
   then computes for every system issued; then `compute-nms`.
6. **Announcements** with Marketing, once Discord is ready.
7. **RimWorld**, once its colony-map search has rules; it may change this design.
