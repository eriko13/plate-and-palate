import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { DishCard } from "@/components/DishCard";
import { dishes, cooks } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Header overlay />
      <main>
        <section className="hero">
          <Image
            className="hero-photo"
            src="https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=2000&q=80"
            alt="Birria tacos with onion, cilantro, and lime from a Rexburg kitchen"
            fill
            priority
            sizes="100vw"
          />
          <div className="hero-scrim" aria-hidden="true" />
          <div className="hero-content">
            <p className="hero-brand">Plate &amp; Palate</p>
            <h1>Cooked next door. Ready for you.</h1>
            <p className="hero-copy">
              Homemade dishes from Rexburg kitchens — order today, pick up Saturday.
            </p>
            <div className="hero-actions">
              <Link className="button button-hero-primary" href="/browse">
                Explore dishes
              </Link>
              <Link className="button button-hero-secondary" href="/cook/marisol-hernandez">
                Meet a cook
              </Link>
            </div>
          </div>
        </section>

        <div className="page-shell">
          <section className="section">
            <div className="section-heading">
              <div>
                <h2>What&apos;s cooking nearby</h2>
              </div>
              <Link className="text-link" href="/browse">View all dishes →</Link>
            </div>
            <div className="dish-grid">
              {dishes.slice(0, 3).map((dish) => <DishCard key={dish.slug} dish={dish} />)}
            </div>
          </section>
          <section className="cook-strip">
            <div className="cook-meta">
              <Image className="avatar" src={cooks[0].avatar} alt="" width={120} height={120} />
              <div>
                <strong>Meet Marisol</strong>
                <p>{cooks[0].specialty} · {cooks[0].location}</p>
              </div>
            </div>
            <Link className="text-link" href={`/cook/${cooks[0].slug}`}>Read her story →</Link>
          </section>
        </div>
      </main>
    </>
  );
}
