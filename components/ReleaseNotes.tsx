import type { Inline } from "@/lib/releaseNotes";

// A line of a release note. Every link is a plain <a>: most lead into a
// game's section, which is another app (Next.js Multi-Zones).
export function Line(props: { parts: Inline[] }) {
  return props.parts.map((part, index) =>
    part.href ? (
      <a key={index} href={part.href}>
        {part.text}
      </a>
    ) : (
      part.text
    ),
  );
}
