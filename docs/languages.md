# Languages: which ones the archive's guides could be translated into

Gathered 2026-11-24 for the owner's question of which languages to translate the guides into.

**Decided** (the owner, 2026-11-24): English, Russian, Spanish and German. Portuguese is left for later: Brazilian
players read Spanish fairly well, though they search in Portuguese. German is taken for search: Germans read English,
but they search in German, where the archive meets fewer rivals. Simplified Chinese is left out: its players search
Baidu and Bilibili, not Google. How the addresses carry the language is D20 in `docs/architecture.md`.

**How a translation is made and checked** (the owner, 2026-11-24):
- Everything the game itself has in a language (names, terms, labels, phrases) is taken from the game's own
  translation tables, as much as they hold, looked up by the game's key, and **before** any text is translated, so
  translators find the game's terms in place (the owner, 2026-11-24).
- Agents translate the rest literally, a page each, and the game's session reads every page.
- The reader is addressed as the game's own voice addresses the player in that language (the coordinator,
  2026-11-24, the owner leaving it to her): counted in the game's tables over tips, objectives and interface, not
  characters' speech. Russian is «вы» in both No Man's Sky (tips 106 «вы» to 1 «ты») and Valheim (Hugin's
  tutorials 22 to 5); German and Spanish by the same count. An earlier choice of «ты»/«du»/«tú» for every
  language is replaced. "Seed" is «сид» in Russian, as players write it, even where the game says «Зерно мира»; any
  other term a player sees in the game takes the game's form, since a word that differs from the game makes him
  doubt the numbers too.
- For Spanish and German, a separate agent translates each page back into English, and the result is compared with
  the original for changes of meaning.
- The owner reads the Russian himself. No one is hired for Spanish and German; their quality is the coordinator's,
  who reads each finished part.
- Work goes in parts, a group of pages at a time, since no session's context holds every page at once.
- One release for all of it (the owner, 2026-11-24, replacing the earlier plan of releasing the `/en/` addresses
  first): the package's language switcher, the portal's `/en/` pages, and each game's addresses with its
  translations go out together. Nothing goes out urgently before it (the owner, 2026-11-24): the release waits for the
  finished translations, the two globes (No Man's Sky's and RimWorld's) and the portal's new support page.

## Steam Hardware & Software Survey, October 2026: Language

Source: https://store.steampowered.com/hwsurvey/Steam-Hardware-Software-Survey-Welcome-to-Steam, read 2026-11-24.
The share of Steam users by the language of their Steam client.

| Language | Share |
|---|---|
| English | 39.04% |
| Simplified Chinese | 21.98% (−9.41 on September; the share swings a lot from month to month) |
| Russian | 10.14% |
| Spanish (Spain) | 4.83% |
| Portuguese (Brazil) | 4.46% |
| German | 2.89% |
| Japanese | 2.47% |
| French | 2.41% |
| Polish | 1.73% |
| Korean | 1.36% |
| Turkish | 1.35% |
| Traditional Chinese | 1.30% |
| Spanish (Latin America) | 0.89% |

## Review language in the archive's games

Sources: each game's store page opened with a language parameter, for example
`https://store.steampowered.com/app/275850/?l=russian`, which shows that language's review count; the all-language
total is from SteamSpy (`https://steamspy.com/api.php?request=appdetails&appid=<id>`, positive plus negative).
Read 2026-11-24. The fifteen languages that were read add up to 97–99% of each total. Steam's own review API
(`/appreviews/<id>?json=1`) returned the store's front page and could not be used.

Shares of all reviews:

| Language | No Man's Sky | Valheim | RimWorld | Oxygen Not Included | The four together |
|---|---|---|---|---|---|
| English | 58.8% | 56.6% | 57.0% | 36.5% | 54.9% |
| Simplified Chinese | 14.7% | 4.0% | 12.8% | 34.3% | 12.2% |
| Russian | 7.1% | 13.4% | 9.4% | 8.5% | 10.3% |
| Spanish (Spain + Latin America) | 4.4% | 4.3% | 2.8% | 2.2% | 3.8% |
| Portuguese (Brazil) | 3.8% | 3.9% | 2.2% | 3.6% | 3.5% |
| German | 3.2% | 4.1% | 3.0% | 2.2% | 3.4% |
| French | 2.3% | 2.8% | 2.0% | 1.6% | 2.4% |
| Korean | 0.8% | 1.5% | 3.8% | 3.4% | 2.0% |
| Polish | 0.7% | 2.3% | 1.5% | 1.0% | 1.6% |
| Turkish | 0.6% | 2.2% | 1.3% | 1.8% | 1.5% |
| Traditional Chinese | 0.9% | 0.7% | 1.3% | 1.6% | 1.0% |

## What limits the reading

- A review's language is the language a player writes in, not necessarily the one he reads guides in; German,
  Polish and Scandinavian players often read English.
- The archive is found through Google. Google is blocked in mainland China, where players search Baidu and Bilibili,
  so a Simplified Chinese translation would reach few readers through the archive's own search work (`docs/seo.md`).
