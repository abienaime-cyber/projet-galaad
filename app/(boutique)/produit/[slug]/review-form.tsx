"use client";

import { useActionState } from "react";
import { secondaryButton } from "@/components/field";
import { FIT_FEEDBACK } from "@/lib/validation";
import { addReview, type ReviewState } from "./actions";

const selectClass =
  "h-11 w-full border border-control bg-field px-3 text-[17px] focus:border-brass focus:shadow-[0_0_0_1px_var(--color-brass)] focus:outline-none";

export function ReviewForm({ productId, slug }: { productId: string; slug: string }) {
  const [state, action, pending] = useActionState<ReviewState, FormData>(addReview, {});
  if (state.done) return <p className="mt-4 text-sm text-ok">Merci, votre avis est publié.</p>;

  return (
    <form action={action} className="mt-6 grid max-w-[30rem] gap-5 border border-separator p-5 sm:p-6">
      <p className="font-display text-[21px]">Vous avez acheté cet article. Votre avis ?</p>
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="slug" value={slug} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          Note
          <select name="rating" defaultValue="5" className={selectClass} aria-invalid={state.errors?.rating ? true : undefined}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} sur 5
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm">
          La taille
          <select name="fit_feedback" defaultValue="" className={selectClass}>
            <option value="">Je ne sais pas</option>
            {Object.entries(FIT_FEEDBACK).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="grid gap-1.5 text-sm">
        Commentaire (facultatif)
        <textarea
          name="comment"
          rows={3}
          maxLength={1000}
          className="border border-control bg-field p-3 text-[17px] focus:border-brass focus:shadow-[0_0_0_1px_var(--color-brass)] focus:outline-none"
        />
      </label>
      {(state.error || state.errors) && (
        <p role="alert" className="text-sm text-danger">
          {state.error ?? Object.values(state.errors ?? {})[0]}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${secondaryButton} justify-self-start`}>
        {pending ? "Publication…" : "Publier mon avis"}
      </button>
    </form>
  );
}
