import Link from "next/link";

type HeaderProps = {
  overlay?: boolean;
};

export function Header({ overlay = false }: HeaderProps) {
  return (
    <header className={overlay ? "site-header site-header-overlay" : "site-header"}>
      <div className="header-inner">
        <div className="brand-lockup">
          <Link className="wordmark" href="/">Plate &amp; Palate</Link>
          {!overlay && <span className="wordmark-note">food from around the block</span>}
        </div>
        <nav aria-label="Main navigation" className="nav">
          <Link href="/browse">Browse dishes</Link>
          <Link href="/cook/marisol-hernandez">Meet the cooks</Link>
          <Link className="button button-primary" href="/cook/manage">Sell your food</Link>
        </nav>
      </div>
    </header>
  );
}
