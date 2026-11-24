import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Line } from "@/components/ReleaseNotes";
import { alternates, type LangProps, pageLang } from "@/lib/locales";
import { readReleases, releaseTitle } from "@/lib/releaseNotes";

export async function generateMetadata(props: LangProps): Promise<Metadata> {
  return {
    title: "Release notes — Seed Archive",
    alternates: alternates(await pageLang(props), "/release-notes"),
    description:
      "What changed on Seed Archive and in each game's section, release by release.",
  };
}

// One list for the whole archive, newest first (docs/architecture.md, D16).
export default async function ReleaseNotesPage(props: LangProps) {
  const lang = await pageLang(props);
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
                <Line parts={parts} lang={lang} />
              </p>
            ))}
            {release.items.length > 0 && (
              <ul>
                {release.items.map((parts, index) => (
                  <li key={index}>
                    <Line parts={parts} lang={lang} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>
      <Footer lang={lang} />
    </main>
  );
}
