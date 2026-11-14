import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";

// The frame of a legal page of the archive: the title, the date of this
// version, and its sections (docs/architecture.md, D12).
export function LegalDocument(props: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="page">
      <article className="legal">
        <h1>{props.title}</h1>
        <p className="updated">Last updated: {props.updated}</p>
        {props.children}
      </article>
      <Footer />
    </main>
  );
}

export function LegalSection(props: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2>{props.title}</h2>
      {props.children}
    </section>
  );
}
