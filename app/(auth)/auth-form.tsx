"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { Field, primaryButton } from "@/components/field";
import { signIn, signUp, type AuthState } from "./actions";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const searchParams = useSearchParams();
  const [state, formAction, pending] = useActionState<AuthState, FormData>(mode === "signin" ? signIn : signUp, {});
  const linkError = searchParams.get("erreur") === "lien";

  if (state.notice) {
    return (
      <div role="status" className="mt-6 border-t-2 border-ok pt-4">
        <p className="font-semibold">Vérifiez votre boîte de réception</p>
        <p className="mt-1 text-ink-2 [overflow-wrap:anywhere]">{state.notice}</p>
      </div>
    );
  }

  const error = state.error ?? (linkError ? "Ce lien de confirmation n'est plus valable. Connectez-vous ou recréez votre compte." : undefined);
  const submitLabel = mode === "signin" ? "Se connecter" : "Créer mon compte";

  return (
    <form action={formAction} className="mt-6 grid gap-5" noValidate>
      {error && (
        <p role="alert" className="text-sm text-tape-red">
          {error}
        </p>
      )}
      <input type="hidden" name="next" value={searchParams.get("suite") ?? ""} />
      {mode === "signup" && <Field name="full_name" label="Nom (facultatif)" autoComplete="name" maxLength={120} />}
      <Field name="email" label="Adresse e-mail" type="email" autoComplete="email" required defaultValue={state.email} />
      <Field
        name="password"
        label="Mot de passe"
        type="password"
        required
        minLength={mode === "signup" ? 8 : undefined}
        autoComplete={mode === "signin" ? "current-password" : "new-password"}
        hint={mode === "signup" ? "8 caractères au minimum." : undefined}
      />
      <button type="submit" disabled={pending} className={`${primaryButton} mt-1 w-full`}>
        {pending ? "Un instant…" : submitLabel}
      </button>
    </form>
  );
}
