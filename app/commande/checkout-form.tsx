"use client";

import { useActionState } from "react";
import { Field, primaryButton } from "@/components/field";
import { Spinner } from "@/components/spinner";
import { placeOrder, type CheckoutState } from "./actions";

type Address = { recipient: string; line1: string; line2: string; postal_code: string; city: string };

export function CheckoutForm({ address, total }: { address: Address; total: string }) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});
  const errors = state.errors ?? {};

  return (
    <form action={action} noValidate className="grid gap-4">
      <Field name="recipient" label="Nom du destinataire" autoComplete="name" defaultValue={address.recipient} error={errors.recipient} maxLength={120} required />
      <Field name="line1" label="Adresse" autoComplete="address-line1" defaultValue={address.line1} error={errors.line1} maxLength={200} required />
      <Field name="line2" label="Complément (facultatif)" autoComplete="address-line2" defaultValue={address.line2} error={errors.line2} maxLength={200} />
      <div className="grid gap-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
        <Field name="postal_code" label="Code postal" autoComplete="postal-code" inputMode="numeric" defaultValue={address.postal_code} error={errors.postal_code} maxLength={10} required />
        <Field name="city" label="Ville" autoComplete="address-level2" defaultValue={address.city} error={errors.city} maxLength={100} required />
      </div>

      <div className="mt-4 bg-tile p-5 text-sm">
        <p className="font-semibold">Paiement simulé</p>
        <p className="mt-1 text-label-2">
          Site de démonstration : aucune carte n’est demandée et rien n’est débité. La commande est enregistrée et le stock
          décrémenté comme pour un vrai achat.
        </p>
      </div>

      {state.error && (
        <p role="alert" className="bg-danger-tint p-4 text-sm text-danger">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={`${primaryButton} mt-2 w-full sm:w-auto sm:justify-self-start`}>
        {pending ? (
          <>
            <Spinner />
            <span className="ml-2">Commande en cours…</span>
          </>
        ) : (
          `Payer ${total}`
        )}
      </button>
    </form>
  );
}
