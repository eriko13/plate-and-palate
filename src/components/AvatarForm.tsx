"use client";

import { useActionState } from "react";
import { saveAvatarAction, type DishFormState } from "@/app/actions/dishes";

const initialState: DishFormState = {};

export function AvatarForm() {
  const [state, formAction, pending] = useActionState(saveAvatarAction, initialState);

  return (
    <form action={formAction} className="avatar-form">
      <label className="form-label" htmlFor="avatar-upload">
        New profile photo
      </label>
      <input accept="image/*" className="form-input" id="avatar-upload" name="avatar" type="file" />
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      {state.success && <p className="form-success" role="status">{state.success}</p>}
      <button className="button button-light" disabled={pending} type="submit">
        {pending ? "Uploading…" : "Update photo"}
      </button>
    </form>
  );
}
