import { GAMES } from "@/lib/games";

// The root of seedarchive.gg: what the archive is, and a door into each game.
// A link into a game's section is a plain <a>: the section is another app, so
// moving into it is a full page load (Next.js Multi-Zones).
export default function Home() {
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
            <a className="game" href={`/${game.slug}`}>
              <img className="cover" src={game.cover} alt="" />
              <span className="caption">
                <span className="name">{game.name}</span>
                <span className="pitch">{game.pitch}</span>
                <span className="enter">
                  Open <span aria-hidden="true">→</span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <footer className="footer">
        <a href="/no-mans-sky/about">About</a>
        <a href="/no-mans-sky/privacy">Privacy</a>
        <a href="/no-mans-sky/terms">Terms</a>
      </footer>
    </main>
  );
}
