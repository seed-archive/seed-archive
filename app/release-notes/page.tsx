import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Line } from "@/components/ReleaseNotes";
import { readReleases, releaseTitle } from "@/lib/releaseNotes";

export const metadata: Metadata = {
  title: "Release notes — Seed Archive",
  alternates: { canonical: "/release-notes" },
  description:
    "What changed on Seed Archive and in each game's section, release by release.",
};

// One list for the whole archive, newest first (docs/architecture.md, D16).
export default async function ReleaseNotesPage() {
  const releases = await readReleases();
  return (
    <main className="page">
      <article className="legal notes">
        <h1>Release notes</h1>
        {releases.map((release) => (
          <section key={release.id} id={release.id}>
            <h2>
              {releaseTitle(release)}
              <span className="day">{release.day}</span>
            </h2>
            {release.intro.map((parts, index) => (
              <p key={index}>
                <Line parts={parts} />
              </p>
            ))}
            {release.items.length > 0 && (
              <ul>
                {release.items.map((parts, index) => (
                  <li key={index}>
                    <Line parts={parts} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>
      <Footer />
    </main>
  );
}
