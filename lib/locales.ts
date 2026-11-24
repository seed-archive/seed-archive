import { notFound } from "next/navigation";

import { GAMES } from "@/lib/games";
import {
  DEFAULT_LOCALE,
  type Locale,
  LOCALES,
  PUBLISHED,
} from "@/lib/languages";

export { type Locale, PUBLISHED } from "@/lib/languages";

// Every page's address names its language (docs/architecture.md, D20): the
// portal's pages as their first segment (/en/privacy), a game's right after
// its slug (/valheim/en/tools/wind).

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

// The props every page of app/[lang] gets.
export type LangProps = { params: Promise<{ lang: string }> };

// The page's language from its address; any other segment is not a page.
export async function pageLang(props: LangProps): Promise<Locale> {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();
  return lang;
}

// A link inside the archive in the given language: /privacy becomes
// /en/privacy, /valheim/tools/wind becomes /valheim/en/tools/wind. A link that
// already names a language, a link into a section not yet localized, an anchor
// or an address outside the archive stays as it is.
export function localize(href: string, lang: Locale): string {
  if (!href.startsWith("/")) return href;
  const [first, second] = href.slice(1).split(/[/?#]/);
  const game = GAMES.find((one) => one.slug === first);
  if (game) {
    if (!game.localized || (second && isLocale(second))) return href;
    const rest = href.slice(1 + first.length);
    return `/${first}/${lang}${rest}`;
  }
  if (first && isLocale(first)) return href;
  return href === "/" ? `/${lang}` : `/${lang}${href}`;
}

// A portal page's canonical address and its translations (hreflang), the
// path given without a language ("" for the home page).
export function alternates(lang: Locale, path: string) {
  return {
    canonical: `/${lang}${path}`,
    languages: {
      ...Object.fromEntries(PUBLISHED.map((one) => [one, `/${one}${path}`])),
      "x-default": `/${DEFAULT_LOCALE}${path}`,
    },
  };
}
