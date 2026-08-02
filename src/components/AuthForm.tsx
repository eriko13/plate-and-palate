"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { AuthFormState } from "@/app/actions/auth";

type AuthFormProps = {
  mode: "login" | "register";
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
};

const initialState: AuthFormState = {};

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isRegister = mode === "register";

  return (
    <form action={formAction} className="auth-form">
      {isRegister && (
        <>
          <label className="form-label" htmlFor="name">
            Full name
          </label>
          <input className="form-input" id="name" name="name" required placeholder="Your name" />
        </>
      )}

      <label className="form-label" htmlFor="email">
        Email
      </label>
      <input
        className="form-input"
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
      />

      <label className="form-label" htmlFor="password">
        Password
      </label>
      <input
        className="form-input"
        id="password"
        name="password"
        type="password"
        required
        minLength={isRegister ? 8 : 1}
        autoComplete={isRegister ? "new-password" : "current-password"}
        placeholder={isRegister ? "At least 8 characters" : "Your password"}
      />

      {isRegister && (
        <>
          <fieldset className="role-fieldset">
            <legend className="form-label">I am joining as</legend>
            <label className="role-option">
              <input type="radio" name="role" value="BUYER" defaultChecked />
              Buyer — browse and request dishes
            </label>
            <label className="role-option">
              <input type="radio" name="role" value="COOK" />
              Cook — list homemade dishes
            </label>
          </fieldset>
        </>
      )}

      {state.error && <p className="form-error" role="alert">{state.error}</p>}

      <button className="button button-primary" style={{ width: "100%", marginTop: 18 }} disabled={pending} type="submit">
        {pending ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
      </button>

      <p className="auth-switch muted">
        {isRegister ? (
          <>
            Already have an account? <Link className="text-link" href="/login">Sign in</Link>
          </>
        ) : (
          <>
            New here? <Link className="text-link" href="/register">Create an account</Link>
          </>
        )}
      </p>
    </form>
  );
}
