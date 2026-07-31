"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { Header } from "@/components/Header";
import { dishes as seedDishes, Dish } from "@/lib/data";

export default function ManageDishesPage() {
  const [menu, setMenu] = useState<Dish[]>(seedDishes.filter((dish) => dish.cookSlug === "marisol-hernandez"));
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  function addDish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !price) return;
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    setMenu((current) => [...current, {
      slug, name, description: description || "A homemade favorite from my kitchen.",
      price: Number(price), category: "Homemade", image: seedDishes[0].image,
      cookSlug: "marisol-hernandez", rating: 0, reviewCount: 0, prepTime: "Set availability", tags: [],
    }]);
    setName("");
    setPrice("");
    setDescription("");
  }

  return (
    <>
      <Header />
      <main className="page-shell">
        <div className="manage-grid">
          <section className="manage-panel">
            <div className="eyebrow">Cook dashboard</div>
            <h1 style={{ fontSize: 40 }}>Your menu</h1>
            <p className="muted">Add a dish to share what&apos;s cooking this week.</p>
            <form onSubmit={addDish}>
              <label className="form-label" htmlFor="dish-name">Dish name</label>
              <input className="form-input" id="dish-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Chilaquiles" required />
              <label className="form-label" htmlFor="dish-price">Price</label>
              <input className="form-input" id="dish-price" type="number" min="1" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="12.00" required />
              <label className="form-label" htmlFor="dish-description">Description</label>
              <textarea className="form-input" id="dish-description" rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Tell hungry neighbors what makes it special." />
              <button className="button button-primary" style={{ marginTop: 18, width: "100%" }} type="submit">Add to menu</button>
            </form>
          </section>
          <section>
            <div className="section-heading">
              <div>
                <div className="eyebrow">Marisol&apos;s kitchen</div>
                <h2>Current listings</h2>
              </div>
              <span className="muted">{menu.length} dishes</span>
            </div>
            <div className="manage-list">
              {menu.map((dish) => (
                <article className="manage-item" key={dish.slug}>
                  <Image className="manage-item-image" src={dish.image} alt="" width={170} height={140} />
                  <div style={{ flex: 1 }}>
                    <strong>{dish.name}</strong>
                    <div className="muted">${dish.price} · {dish.category}</div>
                  </div>
                  <button className="small-button" type="button" onClick={() => setMenu((current) => current.filter((item) => item.slug !== dish.slug))}>Remove</button>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
