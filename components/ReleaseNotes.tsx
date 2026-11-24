import { localize, type Locale } from "@/lib/locales";
import type { Inline } from "@/lib/releaseNotes";

// A line of a release note. Every link is a plain <a>: most lead into a
// game's section, which is another app (Next.js Multi-Zones). A game writes its
// links without a language; the line adds the page's own (D20).
export function Line(props: { parts: Inline[]; lang: Locale }) {
  return props.parts.map((part, index) =>
    part.href ? (
      <a key={index} href={localize(part.href, props.lang)}>
        {part.text}
      </a>
    ) : (
      part.text
    ),
  );
}
