import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { GAMES } from "@/lib/games";

// The release notes of the whole archive (docs/architecture.md, D16): one
// Markdown file per section in content/release-notes, merged by date.
// A file holds releases written by hand, each a heading
// "## <day Month year>: version <n>" (the version may be missing), an
// optional line of text, and a list; inline links are the only markup.

const DIRECTORY = path.join(process.cwd(), "content", "release-notes");

// The section of the portal itself, beside the games' slugs.
const PORTAL = { slug: "seed-archive", name: "Seed Archive" };

export type Inline = { text: string; href?: string };

export type Release = {
  // The anchor of the release on the page: section and date, unique.
  id: string;
  section: string;
  date: Date;
  // As written in the heading: "14 November 2026".
  day: string;
  version?: string;
  intro: Inline[][];
  items: Inline[][];
};

const HEADING = /^## (\d{1,2} [A-Z][a-z]+ \d{4})(?:: version (\S+))?$/;
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

function inline(line: string): Inline[] {
  const parts: Inline[] = [];
  let last = 0;
  for (const match of line.matchAll(LINK)) {
    if (match.index > last) parts.push({ text: line.slice(last, match.index) });
    parts.push({ text: match[1], href: match[2] });
    last = match.index + match[0].length;
  }
  if (last < line.length) parts.push({ text: line.slice(last) });
  return parts;
}

function sectionName(slug: string): string {
  if (slug === PORTAL.slug) return PORTAL.name;
  const game = GAMES.find((one) => one.slug === slug);
  if (!game) throw new Error(`release notes for an unknown section: ${slug}`);
  return game.name;
}

function parse(slug: string, source: string): Release[] {
  const section = sectionName(slug);
  const releases: Release[] = [];
  for (const raw of source.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const heading = HEADING.exec(line);
    if (heading) {
      const date = new Date(`${heading[1]} UTC`);
      if (Number.isNaN(date.getTime())) {
        throw new Error(`${slug}: a date that does not parse: ${line}`);
      }
      releases.push({
        id: `${slug}-${date.toISOString().slice(0, 10)}`,
        section,
        date,
        day: heading[1],
        version: heading[2],
        intro: [],
        items: [],
      });
      continue;
    }
    const release = releases.at(-1);
    if (!release) throw new Error(`${slug}: text before the first release`);
    if (line.startsWith("- ")) release.items.push(inline(line.slice(2)));
    else release.intro.push(inline(line));
  }
  return releases;
}

// Every release of every section, newest first; on one day the portal's
// release comes before a game's.
export async function readReleases(): Promise<Release[]> {
  const files = (await readdir(DIRECTORY)).filter((name) =>
    name.endsWith(".md"),
  );
  const all = await Promise.all(
    files.map(async (name) =>
      parse(
        name.slice(0, -".md".length),
        await readFile(path.join(DIRECTORY, name), "utf8"),
      ),
    ),
  );
  return all
    .flat()
    .sort(
      (a, b) =>
        b.date.getTime() - a.date.getTime() ||
        Number(b.section === PORTAL.name) - Number(a.section === PORTAL.name),
    );
}

// The heading of a release as a visitor reads it: "No Man's Sky 2.4".
export function releaseTitle(release: Release): string {
  return release.version
    ? `${release.section} ${release.version}`
    : release.section;
}
