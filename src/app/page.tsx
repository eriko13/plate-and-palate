import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DishCard } from "@/components/DishCard";
import { getCooks, getDishes } from "@/lib/data";

const steps = [
  {
    title: "Browse nearby kitchens",
    copy: "Scan homemade dishes from cooks in Rexburg and nearby towns.",
  },
  {
    title: "Request what you crave",
    copy: "Message a cook to arrange pickup — no full checkout required.",
  },
  {
    title: "Share the table",
    copy: "Leave a rating after you try a dish so neighbors know what’s good.",
  },
];

export default async function Home() {
  const [dishes, cooks] = await Promise.all([getDishes(), getCooks()]);
  const featured = dishes.slice(0, 3);
  const featuredCook = cooks[0];

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
              <Link
                className="button button-hero-secondary"
                href={featuredCook ? `/cook/${featuredCook.slug}` : "/browse"}
              >
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
              <Link className="text-link" href="/browse">
                View all dishes →
              </Link>
            </div>
            <div className="dish-grid">
              {featured.map((dish) => {
                const cook = cooks.find((item) => item.slug === dish.cookSlug);
                return <DishCard key={dish.slug} dish={dish} cookName={cook?.name} />;
              })}
            </div>
          </section>

          <section className="section how-it-works">
            <div className="section-heading">
              <div>
                <div className="eyebrow">How it works</div>
                <h2>Three steps to a homemade meal</h2>
              </div>
            </div>
            <ol className="steps-grid">
              {steps.map((step, index) => (
                <li className="step-item" key={step.title}>
                  <span className="step-number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </li>
              ))}
            </ol>
          </section>

          {featuredCook && (
            <section className="cook-strip">
              <div className="cook-meta">
                <Image
                  className="avatar"
                  src={featuredCook.avatar}
                  alt=""
                  width={120}
                  height={120}
                />
                <div>
                  <strong>Meet {featuredCook.name.split(" ")[0]}</strong>
                  <p>
                    {featuredCook.specialty} · {featuredCook.location}
                  </p>
                </div>
              </div>
              <Link className="text-link" href={`/cook/${featuredCook.slug}`}>
                Read their story →
              </Link>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
