import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Wallets } from "@/components/Wallets";
import { alternates, type LangProps, pageLang } from "@/lib/locales";

export async function generateMetadata(props: LangProps): Promise<Metadata> {
  return {
    title: "Support the archive — Seed Archive",
    alternates: alternates(await pageLang(props), "/support"),
    description:
      "Seed Archive is free. If it saved you hours, you can support it here.",
  };
}

// The one page of the archive that takes donations (the owner, 2026-11-24):
// every site's footer links here, so a new way to pay is added once.
export default async function SupportPage(props: LangProps) {
  const lang = await pageLang(props);
  return (
    <main className="page">
      <article className="legal">
        <h1>Support the archive</h1>
        <p className="intro">
          Seed Archive is free, with no ads. If it saved you a few hours of
          searching, you can buy us a coffee: any amount helps keep the
          generators running.
        </p>
        <Wallets />
      </article>
      <Footer lang={lang} />
    </main>
  );
}
