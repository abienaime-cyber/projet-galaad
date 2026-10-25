"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { Field, primaryButton } from "@/components/field";
import { Spinner } from "@/components/spinner";
import { signIn, signUp, type AuthState } from "./actions";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const searchParams = useSearchParams();
  const [state, formAction, pending] = useActionState<AuthState, FormData>(mode === "signin" ? signIn : signUp, {});
  const linkError = searchParams.get("erreur") === "lien";

  if (state.notice) {
    return (
      <div role="status" className="mt-8 bg-steel p-6 text-center">
        <p className="display text-[32px]">Vérifiez votre boîte de réception</p>
        <p className="mt-2 text-fog [overflow-wrap:anywhere]">{state.notice}</p>
      </div>
    );
  }

  const error = state.error ?? (linkError ? "Ce lien de confirmation n'est plus valable. Connectez-vous ou recréez votre compte." : undefined);
  const submitLabel = mode === "signin" ? "Se connecter" : "Créer mon compte";

  return (
    <form action={formAction} className="mt-8 grid gap-5" noValidate>
      {error && (
        <p role="alert" className="bg-danger/10 px-4 py-3 text-[15px] text-danger">
          {error}
        </p>
      )}
      <input type="hidden" name="next" value={searchParams.get("suite") ?? ""} />
      {/* Pot de miel : invisible pour un humain, rempli par les robots qui remplissent tout. */}
      {mode === "signup" && (
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] size-px opacity-0" />
      )}
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
      <button type="submit" disabled={pending} className={`${primaryButton} mt-3 w-full`}>
        {pending && <Spinner className="mr-2" />}
        {pending ? "Un instant…" : submitLabel}
      </button>
    </form>
  );
}
