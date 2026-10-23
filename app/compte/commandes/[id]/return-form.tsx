"use client";

import { useActionState, useState } from "react";
import { RETURN_REASONS } from "@/lib/validation";
import { requestReturn, type ReturnState } from "./actions";

export function ReturnForm({ orderItemId }: { orderItemId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ReturnState, FormData>(requestReturn, {});

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 cursor-pointer items-center text-sm text-link hover:underline">
        Retourner cet article
      </button>
    );
  }

  return (
    <form action={action} className="mt-3 grid max-w-[26rem] gap-3 rounded-[14px] bg-tile p-4 text-sm">
      <input type="hidden" name="order_item_id" value={orderItemId} />
      <label className="grid gap-1.5">
        Motif du retour
        <select name="reason" required defaultValue="" className="h-11 rounded-xl border border-control bg-white px-3 text-[17px]">
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
      <label className="grid gap-1.5">
        Précision (facultatif)
        <textarea name="comment" rows={2} maxLength={500} className="rounded-xl border border-control bg-white p-3 text-[17px]" />
      </label>
      {state.error && (
        <p role="alert" className="text-danger">
          {state.error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 cursor-pointer items-center rounded-full bg-accent px-5 text-white transition-[background-color,transform] duration-150 ease-out hover:bg-accent-hover active:scale-[0.97] disabled:opacity-60"
        >
          {pending ? "Envoi…" : "Demander le retour"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="inline-flex min-h-11 cursor-pointer items-center text-link hover:underline">
          Annuler
        </button>
      </div>
    </form>
  );
}
