"use client";

import { useActionState } from "react";
import { saveDishAction, type DishFormState } from "@/app/actions/dishes";

type DishFormProps = {
  categories: string[];
  dish?: {
    id: string;
    name: string;
    description: string;
    price: number;
    prepTime: string;
    tags: string[];
    category: string;
  };
};

const initialState: DishFormState = {};

export function DishForm({ categories, dish }: DishFormProps) {
  const [state, formAction, pending] = useActionState(saveDishAction, initialState);

  return (
    <form action={formAction} className="dish-form">
      {dish && <input name="id" type="hidden" value={dish.id} />}

      <label className="form-label" htmlFor="dish-name">
        Dish name
      </label>
      <input
        className="form-input"
        defaultValue={dish?.name}
        id="dish-name"
        name="name"
        placeholder="e.g. Birria Tacos"
        required
      />

      <label className="form-label" htmlFor="dish-description">
        Description
      </label>
      <textarea
        className="form-input"
        defaultValue={dish?.description}
        id="dish-description"
        name="description"
        placeholder="What makes this dish special?"
        required
        rows={4}
      />

      <label className="form-label" htmlFor="dish-price">
        Price ($)
      </label>
      <input
        className="form-input"
        defaultValue={dish?.price}
        id="dish-price"
        min="0.01"
        name="price"
        placeholder="9.00"
        required
        step="0.01"
        type="number"
      />

      <label className="form-label" htmlFor="dish-prep-time">
        Prep time
      </label>
      <input
        className="form-input"
        defaultValue={dish?.prepTime}
        id="dish-prep-time"
        name="prepTime"
        placeholder="e.g. 45 min"
        required
      />

      <label className="form-label" htmlFor="dish-category">
        Category
      </label>
      <select className="select-input" defaultValue={dish?.category ?? ""} id="dish-category" name="category" required>
        <option disabled value="">
          Pick a category
        </option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <label className="form-label" htmlFor="dish-tags">
        Tags (comma separated)
      </label>
      <input
        className="form-input"
        defaultValue={dish?.tags.join(", ")}
        id="dish-tags"
        name="tags"
        placeholder="tacos, beef, dinner"
      />

      <label className="form-label" htmlFor="dish-image">
        Photo
      </label>
      <input accept="image/*" className="form-input" id="dish-image" name="image" type="file" />

      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      {state.success && <p className="form-success" role="status">{state.success}</p>}

      <button className="button button-primary" disabled={pending} type="submit">
        {pending ? "Saving…" : dish ? "Save changes" : "Add dish"}
      </button>
    </form>
  );
}
