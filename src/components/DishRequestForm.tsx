"use client";

import { useActionState } from "react";
import { saveDishRequestAction, type RequestFormState } from "@/app/actions/requests";

type DishRequestFormProps = {
  dishSlug: string;
};

const initialState: RequestFormState = {};

export function DishRequestForm({ dishSlug }: DishRequestFormProps) {
  const [state, formAction, pending] = useActionState(saveDishRequestAction, initialState);

  return (
    <form action={formAction} className="request-form">
      <input name="slug" type="hidden" value={dishSlug} />
      <label className="form-label" htmlFor="request-message">
        Message the cook
      </label>
      <textarea
        className="form-input request-textarea"
        id="request-message"
        maxLength={1000}
        minLength={10}
        name="message"
        placeholder="Hi! I would like to request this dish. When would pickup be available?"
        required
        rows={4}
      />
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      {state.success && <p className="form-success" role="status">{state.success}</p>}
      <button className="button button-primary" disabled={pending} type="submit">
        {pending ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
