import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { DishCard } from "@/components/DishCard";
import { getCook, getCookDishes } from "@/lib/data";

export default async function CookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cook = getCook(slug);
  if (!cook) notFound();
  const cookDishes = getCookDishes(cook.slug);

  return (
    <>
      <Header />
      <main className="page-shell cook-profile">
        <section className="profile-intro">
          <Image className="avatar avatar-large" src={cook.avatar} alt={cook.name} width={280} height={280} priority />
          <div>
            <div className="eyebrow">{cook.specialty}</div>
            <h1>{cook.name}</h1>
            <p>{cook.location} · {cook.handle}<br />{cook.bio}</p>
          </div>
        </section>
        <section className="story">
          <div className="eyebrow">Her kitchen, her story</div>
          <p>{cook.story}</p>
        </section>
        <div className="section-heading">
          <h2>From this kitchen</h2>
          <span className="muted">{cookDishes.length} dishes</span>
        </div>
        <div className="dish-grid">
          {cookDishes.map((dish) => <DishCard key={dish.slug} dish={dish} />)}
        </div>
      </main>
    </>
  );
}
