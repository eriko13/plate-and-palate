"use client";

import { useActionState } from "react";
import { saveReviewAction, type ReviewFormState } from "@/app/actions/reviews";

type ReviewFormProps = {
  dishSlug: string;
  existingReview?: { rating: number; body: string };
};

const initialState: ReviewFormState = {};

export function ReviewForm({ dishSlug, existingReview }: ReviewFormProps) {
  const [state, formAction, pending] = useActionState(saveReviewAction, initialState);

  return (
    <form action={formAction} className="review-form">
      <input name="slug" type="hidden" value={dishSlug} />
      <fieldset className="rating-fieldset">
        <legend className="form-label">Your rating</legend>
        <div className="star-picker">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} title={`${rating} star${rating === 1 ? "" : "s"}`}>
              <input
                defaultChecked={(existingReview?.rating ?? 0) === rating}
                name="rating"
                required
                type="radio"
                value={rating}
              />
              <span aria-hidden="true">★</span>
              <span className="sr-only">{rating} star{rating === 1 ? "" : "s"}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="form-label" htmlFor="review-body">
        Your review
      </label>
      <textarea
        className="form-input review-textarea"
        defaultValue={existingReview?.body}
        id="review-body"
        maxLength={1000}
        minLength={10}
        name="body"
        placeholder="What did you enjoy about this dish?"
        required
        rows={5}
      />
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      {state.success && <p className="form-success" role="status">{state.success}</p>}
      <button className="button button-primary" disabled={pending} type="submit">
        {pending ? "Saving…" : existingReview ? "Update review" : "Post review"}
      </button>
    </form>
  );
}
