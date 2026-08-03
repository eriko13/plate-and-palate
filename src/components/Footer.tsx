import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-inner">
        <div className="footer-brand">
          <Link className="wordmark" href="/">
            Plate &amp; Palate
          </Link>
          <p>Homemade food from kitchens around the block.</p>
        </div>
        <nav aria-label="Footer" className="footer-nav">
          <Link href="/browse">Browse dishes</Link>
          <Link href="/login">Sign in</Link>
          <Link href="/register">Join as a cook</Link>
        </nav>
        <p className="footer-meta">BYU-I WDD 430 · Plate &amp; Palate</p>
      </div>
    </footer>
  );
}
