"use client";

import { useActionState } from "react";
import { inputClass, secondaryButton } from "@/components/field";
import { FIT_FEEDBACK } from "@/lib/validation";
import { addReview, type ReviewState } from "./actions";

const selectClass = `${inputClass} h-12`;

export function ReviewForm({ productId, slug }: { productId: string; slug: string }) {
  const [state, action, pending] = useActionState<ReviewState, FormData>(addReview, {});
  if (state.done) return <p className="mt-4 text-[14px] font-semibold text-success">Merci, votre avis est publié.</p>;

  return (
    <form action={action} className="card mt-6 grid max-w-[32rem] gap-5 p-5 sm:p-6">
      <p className="font-display text-[24px] font-semibold">Vous avez acheté cet article. Votre avis ?</p>
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="slug" value={slug} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-[14px] font-medium">
          Note
          <select name="rating" defaultValue="5" className={selectClass} aria-invalid={state.errors?.rating ? true : undefined}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} sur 5
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-[14px] font-medium">
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
      <label className="grid gap-2 text-[14px] font-medium">
        Commentaire (facultatif)
        <textarea
          name="comment"
          rows={3}
          maxLength={1000}
          className={`${inputClass} resize-none`}
        />
      </label>
      {(state.error || state.errors) && (
        <p role="alert" className="text-[14px] text-destructive">
          {state.error ?? Object.values(state.errors ?? {})[0]}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${secondaryButton} justify-self-start`}>
        {pending ? "Publication…" : "Publier mon avis"}
      </button>
    </form>
  );
}
