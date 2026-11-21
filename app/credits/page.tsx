import type { Metadata } from "next";

import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Credits — Seed Archive",
  alternates: { canonical: "/credits" },
  description:
    "The players whose runs and streams taught Seed Archive what its guides say.",
};

// Thanks of the whole archive, one list, not split by game: a streamer plays
// many games (the owner, 2026-11-17). Released with Valheim's section.
// A game's guide links here with a plain <a>. Every link out is nofollow, so
// the archive's rank does not flow to them (the owner, 2026-11-18).
export default function CreditsPage() {
  return (
    <main className="page">
      <article className="legal">
        <h1>Credits</h1>
        <p>
          <strong>Who taught us?</strong> The players below: their runs and
          streams shaped what the guides say.
        </p>

        <p>
          <a
            href="https://www.twitch.tv/absurdianin"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Absurdianin
          </a>
          , for Valheim: the speedrun and the reverse run are learned from his
          runs. He holds second place in the world, and we sincerely hope to
          see him first.
        </p>
        <p>
          <a
            href="https://www.twitch.tv/lexxrus85"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            LexxRus85
          </a>
          , for Valheim: a true hardcore player, who plays the no-death run.
        </p>
        <p>
          <a
            href="https://www.twitch.tv/disnof"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Disnof
          </a>
          , for Valheim and RimWorld.
        </p>
      </article>
      <Footer />
    </main>
  );
}
