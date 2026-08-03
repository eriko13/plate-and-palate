"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FormEvent, useTransition } from "react";

type CatalogFiltersProps = {
  categories: string[];
};

export function CatalogFilters({ categories }: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "All dishes";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "All dishes") params.delete(key);
      else params.set(key, value);
    });
    startTransition(() => {
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    updateParams({
      q: String(form.get("q") ?? ""),
      category: String(form.get("category") ?? "All dishes"),
      minPrice: String(form.get("minPrice") ?? ""),
      maxPrice: String(form.get("maxPrice") ?? ""),
    });
  }

  return (
    <form className="filter-row" onSubmit={onSubmit}>
      <label className="search-input">
        <span className="sr-only">Search dishes</span>
        <input
          name="q"
          defaultValue={q}
          placeholder="Search dishes or cooks..."
          style={{ border: 0, outline: 0, width: "100%" }}
        />
      </label>
      <label>
        <span className="sr-only">Filter by category</span>
        <select
          className="select-input"
          name="category"
          defaultValue={category}
          onChange={(event) => updateParams({ category: event.target.value })}
        >
          <option>All dishes</option>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Minimum price</span>
        <input
          className="select-input price-input"
          name="minPrice"
          type="number"
          min="0"
          step="1"
          defaultValue={minPrice}
          placeholder="Min $"
        />
      </label>
      <label>
        <span className="sr-only">Maximum price</span>
        <input
          className="select-input price-input"
          name="maxPrice"
          type="number"
          min="0"
          step="1"
          defaultValue={maxPrice}
          placeholder="Max $"
        />
      </label>
      <button className="button button-light" type="submit" disabled={pending}>
        {pending ? "Filtering…" : "Apply"}
      </button>
    </form>
  );
}
