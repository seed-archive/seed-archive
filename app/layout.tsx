import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { GAMES } from "@/lib/games";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  ),
  title: "Seed Archive — where the best finds of game worlds are",
  description:
    "Game worlds grown from a seed, taken apart: which places hold the best finds, and why. Starting with No Man's Sky.",
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        {/* The header every app of the archive shares (D15): the name leads to
            the portal's root; a game's site adds its own name and menu. */}
        <header className="bar">
          <a className="brand" href="/">
            Seed Archive
          </a>
        </header>
        {children}
        {/* One count for the whole domain: the portal's views go to the same
            Vercel Analytics as No Man's Sky's (docs/analytics.md), through the
            path the portal already forwards to that project. */}
        <Analytics
          scriptSrc={`/${GAMES[0].analytics}/script.js`}
          endpoint={`/${GAMES[0].analytics}`}
        />
      </body>
    </html>
  );
}
