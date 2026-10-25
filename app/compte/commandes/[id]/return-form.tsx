"use client";

import { useActionState, useState } from "react";
import { inputClass, primaryButton } from "@/components/field";
import { RETURN_REASONS } from "@/lib/validation";
import { requestReturn, type ReturnState } from "./actions";

export function ReturnForm({ orderItemId }: { orderItemId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ReturnState, FormData>(requestReturn, {});

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 cursor-pointer items-center text-sm font-semibold text-matcha-ink hover:underline">
        Retourner cet article
      </button>
    );
  }

  return (
    <form action={action} className="mt-3 grid max-w-[26rem] gap-4 bg-steel-2 p-4 text-sm">
      <input type="hidden" name="order_item_id" value={orderItemId} />
      <label className="grid gap-2 font-medium">
        Motif du retour
        <select name="reason" required defaultValue="" className={`${inputClass} h-12`}>
          <option value="" disabled>
            Choisissez un motif
          </option>
          {Object.entries(RETURN_REASONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 font-medium">
        Précision (facultatif)
        <textarea name="comment" rows={2} maxLength={500} className={inputClass} />
      </label>
      {state.error && (
        <p role="alert" className="text-danger">
          {state.error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={primaryButton}>
          {pending ? "Envoi…" : "Demander le retour"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-fog hover:text-ink">
          Annuler
        </button>
      </div>
    </form>
  );
}
