import Image from "next/image";
import Link from "next/link";
import { Dish, getCook } from "@/lib/data";

export function DishCard({ dish }: { dish: Dish }) {
  const cook = getCook(dish.cookSlug);

  return (
    <article className="dish-card">
      <Link href={`/dishes/${dish.slug}`}>
        <Image className="dish-image" src={dish.image} alt={dish.name} width={1000} height={700} />
      </Link>
      <div className="dish-card-body">
        <div className="dish-meta">
          <h3><Link href={`/dishes/${dish.slug}`}>{dish.name}</Link></h3>
          <span className="price">${dish.price}</span>
        </div>
        <p>{dish.description}</p>
        <div className="dish-meta">
          <Link className="muted text-link" href={`/cook/${cook?.slug}`}>{cook?.name}</Link>
          <span className="rating">★ {dish.rating} ({dish.reviewCount})</span>
        </div>
      </div>
    </article>
  );
}
