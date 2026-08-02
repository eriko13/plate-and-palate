import Link from "next/link";
import { auth } from "@/auth";
import { signOutAction } from "@/app/actions/auth";

type HeaderProps = {
  overlay?: boolean;
};

export async function Header({ overlay = false }: HeaderProps) {
  const session = await auth();

  return (
    <header className={overlay ? "site-header site-header-overlay" : "site-header"}>
      <div className="header-inner">
        <div className="brand-lockup">
          <Link className="wordmark" href="/">
            Plate &amp; Palate
          </Link>
          {!overlay && <span className="wordmark-note">food from around the block</span>}
        </div>
        <nav aria-label="Main navigation" className="nav">
          <Link href="/browse">Browse dishes</Link>
          <Link href="/cook/marisol-hernandez">Meet the cooks</Link>
          {session?.user ? (
            <>
              {session.user.role === "COOK" && (
                <Link href="/cook/manage">Your menu</Link>
              )}
              <form action={signOutAction}>
                <button className="button button-primary" type="submit">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">Sign in</Link>
              <Link className="button button-primary" href="/register">
                Sell your food
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
