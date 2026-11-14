import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
