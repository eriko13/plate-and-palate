import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DishCard } from "@/components/DishCard";
import { CatalogFilters } from "@/components/CatalogFilters";
import { getCategories, getCooks, getDishes } from "@/lib/data";

type BrowsePageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const [dishes, categories, cooks] = await Promise.all([
    getDishes({
      q: params.q,
      category: params.category,
      minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    }),
    getCategories(),
    getCooks(),
  ]);

  const cookNames = new Map(cooks.map((cook) => [cook.slug, cook.name]));

  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="catalog-header">
          <div className="eyebrow">The neighborhood menu</div>
          <h1>Find something delicious.</h1>
          <p>Small-batch dishes, made by people who live around you. Filter by cuisine or budget.</p>
        </section>
        <Suspense fallback={<div className="filter-row muted">Loading filters…</div>}>
          <CatalogFilters categories={categories} />
        </Suspense>
        <div className="dish-grid">
          {dishes.map((dish) => (
            <DishCard
              key={dish.slug}
              dish={dish}
              cookName={cookNames.get(dish.cookSlug)}
            />
          ))}
        </div>
        {!dishes.length && (
          <p className="muted">No dishes match those filters. Try a wider price range or another category.</p>
        )}
      </main>
      <Footer />
    </>
  );
}
