import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCook, getDish } from "@/lib/data";

export default async function DishPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dish = await getDish(slug);
  if (!dish) notFound();
  const cook = await getCook(dish.cookSlug);

  return (
    <>
      <Header />
      <main className="page-shell">
        <div className="detail-layout">
          <Image
            className="detail-image"
            src={dish.image}
            alt={dish.name}
            width={1000}
            height={1000}
            priority
          />
          <div className="detail-copy">
            <div className="eyebrow">
              {dish.category} · {dish.prepTime}
            </div>
            <h1>{dish.name}</h1>
            <div className="dish-meta">
              <span className="detail-price">${dish.price}</span>
              <span className="rating">
                ★ {dish.rating} · {dish.reviewCount} reviews
              </span>
            </div>
            <p>{dish.description}</p>
            {cook && (
              <div className="cook-meta">
                <Image className="avatar" src={cook.avatar} alt="" width={120} height={120} />
                <div>
                  <span className="muted">Made by</span>
                  <br />
                  <Link className="text-link" href={`/cook/${cook.slug}`}>
                    {cook.name} →
                  </Link>
                </div>
              </div>
            )}
            <div className="hero-actions" style={{ marginTop: 30 }}>
              <button className="button button-primary" type="button">
                Request this dish
              </button>
              <Link className="button button-light" href="/browse">
                Back to browse
              </Link>
            </div>
          </div>
        </div>
        <section className="story">
          <div className="eyebrow">A note from the kitchen</div>
          <h2>Made for sharing.</h2>
          <p>
            This dish is prepared in small batches and made available on the day shown above.
            Message the cook with questions about ingredients, pickup, or the next menu.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
