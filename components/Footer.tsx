import type { Locale } from "@/lib/locales";

// The portal's footer: what concerns the whole archive (D12). A game's own
// footer links back to these pages with a plain <a>.
export function Footer(props: { lang: Locale }) {
  const { lang } = props;
  return (
    <footer className="footer">
      <a href={`/${lang}/release-notes`}>Release notes</a>
      <a href={`/${lang}/credits`}>Credits</a>
      <a href={`/${lang}/privacy`}>Privacy</a>
      <a href={`/${lang}/terms`}>Terms</a>
      <a href={`/${lang}/support`}>Support the archive</a>
    </footer>
  );
}
