import type { Metadata } from "next";

import { LegalDocument, LegalSection } from "@/components/Legal";
import { GAMES } from "@/lib/games";

export const metadata: Metadata = {
  title: "Terms of service — Seed Archive",
  alternates: { canonical: "/terms" },
  description:
    "Seed Archive is an unofficial fan site about game worlds whose information is provided as is.",
};

export default function TermsPage() {
  return (
    <LegalDocument title="Terms of service" updated="15 November 2026">
      <p>
        By using Seed Archive you accept these terms. If you do not accept them,
        do not use the site.
      </p>

      <LegalSection title="A fan site">
        <p>
          Seed Archive is an unofficial fan site and is not affiliated with or
          endorsed by the makers of the games it covers. Each game and its names
          and images belong to their owners:
        </p>
        <ul>
          {GAMES.map((game) => (
            <li key={game.slug}>
              {game.name} — {game.owner}.
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="As is">
        <p>
          Everything on the site is information provided as is, with no
          warranty that it is accurate, complete, or available. To the fullest
          extent the law allows, there is no liability for anything shown on
          the site or for relying on it.
        </p>
      </LegalSection>

      <LegalSection title="Use of the site">
        <p>
          Do not interfere with the site, overload it, or use an account that
          is not yours.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          The site and these terms may change at any time; the date above is
          the date of this version.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
