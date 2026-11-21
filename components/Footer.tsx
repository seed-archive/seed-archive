// The portal's footer: what concerns the whole archive (D12). A game's own
// footer links back to these pages with a plain <a>.
export function Footer() {
  return (
    <footer className="footer">
      <a href="/release-notes">Release notes</a>
      <a href="/credits">Credits</a>
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
    </footer>
  );
}
