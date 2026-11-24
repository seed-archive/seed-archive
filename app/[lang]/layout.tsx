import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { alternates, type LangProps, pageLang, PUBLISHED } from "@/lib/locales";

import "../globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:5001",
  ),
  title: "Seed Archive — where the best finds of game worlds are",
  description:
    "Game worlds grown from a seed, taken apart: which places hold the best finds, and why. Starting with No Man's Sky.",
  alternates: alternates("en", ""),
};

// Only the published languages are pages; any other first segment is not one
// of the portal's (an unpublished language is redirected in next.config.ts).
export const dynamicParams = false;

export function generateStaticParams() {
  return PUBLISHED.map((lang) => ({ lang }));
}

export default async function RootLayout(
  props: PropsWithChildren<LangProps>,
) {
  const { children } = props;
  const lang = await pageLang(props);
  return (
    <html lang={lang} className={manrope.variable}>
      <body>
        {/* The header every app of the archive shares (D15): the name leads to
            the portal's root; a game's site adds its own name and menu. */}
        <header className="bar">
          <a className="brand" href={`/${lang}`}>
            Seed Archive
          </a>
        </header>
        {children}
        {/* The one count for the whole domain lives in the portal's own
            project: every game's app sends its views here too
            (docs/analytics.md). Production only: its script exists only on
            Vercel, and a local or preview visit is not a visitor. */}
        {process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? (
          <Analytics />
        ) : null}
      </body>
    </html>
  );
}
