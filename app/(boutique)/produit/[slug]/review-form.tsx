"use client";

import { useActionState } from "react";
import { inputClass, secondaryButton } from "@/components/field";
import { addReview, type ReviewState } from "./actions";

export function ReviewForm({ productId, slug }: { productId: string; slug: string }) {
  const [state, action, pending] = useActionState<ReviewState, FormData>(addReview, {});
  if (state.done) return <p className="mt-4 font-medium text-matcha-ink">Merci, votre avis est publié.</p>;

  return (
    <form action={action} className="mt-8 grid max-w-[34rem] gap-5 bg-paper/60 p-5 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-6">
      <p className="display text-[30px]">Vous l’avez acheté. Votre avis ?</p>
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="slug" value={slug} />
      <label className="grid gap-2 text-[15px] font-medium">
        Note
        <select name="rating" defaultValue="5" className={`${inputClass} h-12 py-0`} aria-invalid={state.errors?.rating ? true : undefined}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} sur 5
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-[15px] font-medium">
        Commentaire (facultatif)
        <textarea name="comment" rows={3} maxLength={1000} className={`${inputClass} resize-none`} />
      </label>
      {(state.error || state.errors) && (
        <p role="alert" className="text-[15px] text-danger">
          {state.error ?? Object.values(state.errors ?? {})[0]}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${secondaryButton} justify-self-start`}>
        {pending ? "Publication…" : "Publier mon avis"}
      </button>
    </form>
  );
}
