import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DishRequestForm } from "@/components/DishRequestForm";
import { ReviewForm } from "@/components/ReviewForm";
import { auth } from "@/auth";
import { getCook, getDish, getDishReviews } from "@/lib/data";

export default async function DishPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dish = await getDish(slug);
  if (!dish) notFound();
  const [cook, reviews, session] = await Promise.all([getCook(dish.cookSlug), getDishReviews(slug), auth()]);
  const ownReview = reviews.find((review) => review.userId === session?.user?.id);

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
            <div className="request-panel">
              {session?.user?.role === "BUYER" ? (
                <DishRequestForm dishSlug={dish.slug} />
              ) : session?.user ? (
                <p className="muted">Cook accounts cannot request dishes. Switch to a buyer account to contact this cook.</p>
              ) : (
                <p className="muted"><Link className="text-link" href={`/login?callbackUrl=/dishes/${dish.slug}`}>Sign in</Link> as a buyer to request this dish.</p>
              )}
            </div>
            <div className="hero-actions" style={{ marginTop: 18 }}>
              <Link className="button button-light" href="/browse">Back to browse</Link>
            </div>
          </div>
        </div>
        <section className="reviews-section" aria-labelledby="reviews-heading">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Community feedback</div>
              <h2 id="reviews-heading">Reviews</h2>
            </div>
            <span className="rating">★ {dish.rating.toFixed(1)} / 5</span>
          </div>
          {session?.user ? (
            <div className="review-panel">
              <h3>{ownReview ? "Update your review" : "Share your experience"}</h3>
              <ReviewForm dishSlug={dish.slug} existingReview={ownReview} />
            </div>
          ) : (
            <p className="review-signin"><Link className="text-link" href={`/login?callbackUrl=/dishes/${dish.slug}`}>Sign in</Link> to leave a rating and review.</p>
          )}
          <div className="review-list">
            {reviews.length ? reviews.map((review) => (
              <article className="review-item" key={review.id}>
                <div className="review-heading"><strong>{review.author}</strong><span className="rating">★ {review.rating}.0</span></div>
                <p>{review.body}</p>
                <time dateTime={review.createdAt.toISOString()}>{review.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</time>
              </article>
            )) : <p className="muted">No reviews yet. Be the first to share your experience.</p>}
          </div>
        </section>
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
