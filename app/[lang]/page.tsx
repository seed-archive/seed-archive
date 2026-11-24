import { Footer } from "@/components/Footer";
import { COMING, GAMES } from "@/lib/games";
import { type LangProps, localize, pageLang } from "@/lib/locales";
import { readReleases, releaseTitle } from "@/lib/releaseNotes";

// How many releases the root page shows; the rest are on /release-notes.
const LATEST = 3;

// The root of seedarchive.gg: what the archive is, and a door into each game.
// A link into a game's section is a plain <a>: the section is another app, so
// moving into it is a full page load (Next.js Multi-Zones).
export default async function Home(props: LangProps) {
  const lang = await pageLang(props);
  const latest = (await readReleases()).slice(0, LATEST);
  return (
    <main className="page">
      <header className="masthead">
        <h1>Seed Archive</h1>
        <p className="lead">
          Some game worlds grow from a seed. We take the generator apart, so you
          know where the best finds are before you fly there.
        </p>
      </header>

      <ul className="games">
        {GAMES.map((game) => (
          <li key={game.slug}>
            <a className="game" href={localize(`/${game.slug}`, lang)}>
              <img className="cover" src={game.cover} alt="" />
              <span className="caption">
                <span className="name">{game.name}</span>
                <span className="pitch">{game.pitch}</span>
                <span className="enter">
                  Open <span aria-hidden="true">→</span>
                </span>
                <span className="credit">Art © {game.owner}</span>
              </span>
            </a>
          </li>
        ))}
        {COMING.map((game) => (
          <li key={game.slug}>
            <div className="game soon">
              <img className="cover" src={game.cover} alt="" />
              <span className="caption">
                <span className="name">{game.name}</span>
                <span className="pitch">{game.pitch}</span>
                <span className="badge">Coming soon</span>
                <span className="credit">Art © {game.owner}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>

      <section className="latest">
        <h2>Latest releases</h2>
        <ul>
          {latest.map((release) => (
            <li key={release.id}>
              <a href={`/${lang}/release-notes#${release.id}`}>
                <span className="title">{releaseTitle(release)}</span>
                <span className="day">{release.day}</span>
              </a>
            </li>
          ))}
        </ul>
        <a className="all" href={`/${lang}/release-notes`}>
          All release notes <span aria-hidden="true">→</span>
        </a>
      </section>

      <p className="support">
        The archive is free, with no ads.{" "}
        <a href={`/${lang}/support`}>Support it</a> if it saved you time.
      </p>

      <Footer lang={lang} />
    </main>
  );
}
