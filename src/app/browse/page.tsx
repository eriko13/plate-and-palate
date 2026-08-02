"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { DishCard } from "@/components/DishCard";
import { dishes } from "@/lib/data";

export default function BrowsePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All dishes");
  const categories = ["All dishes", ...new Set(dishes.map((dish) => dish.category))];
  const filtered = useMemo(() => dishes.filter((dish) => {
    const matchesCategory = category === "All dishes" || dish.category === category;
    const text = `${dish.name} ${dish.description}`.toLowerCase();
    return matchesCategory && text.includes(query.toLowerCase());
  }), [category, query]);

  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="catalog-header">
          <div className="eyebrow">The neighborhood menu</div>
          <h1>Find something delicious.</h1>
          <p>Small-batch dishes, made by people who live around you.</p>
        </section>
        <div className="filter-row">
          <label className="search-input">
            <span className="sr-only">Search dishes</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search dishes..." style={{ border: 0, outline: 0, width: "100%" }} />
          </label>
          <label>
            <span className="sr-only">Filter by category</span>
            <select className="select-input" value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
        <div className="dish-grid">
          {filtered.map((dish) => <DishCard key={dish.slug} dish={dish} />)}
        </div>
        {!filtered.length && <p className="muted">No dishes match that search. Try a different craving.</p>}
      </main>
    </>
  );
}
