"use client";

import Link from "next/link";
import { useActionState } from "react";
import { primaryButton } from "@/components/field";
import { Spinner } from "@/components/spinner";
import { addToCart, type AddState } from "@/app/panier/actions";

type Size = { label: string; variantId: string; inStock: boolean; state: "chosen" | "alternative" | "idle" };

const STATE_HINT: Record<Size["state"], string> = { chosen: ", votre taille", alternative: ", taille voisine", idle: "" };

// Le choix de taille et la disponibilité ne font qu'un : une taille épuisée ne se choisit pas.
export function AddToCart({ slug, sizes, defaultSize }: { slug: string; sizes: Size[]; defaultSize: string | null }) {
  const [state, action, pending] = useActionState<AddState, FormData>(addToCart, {});
  const anyInStock = sizes.some((s) => s.inStock);

  return (
    <form action={action} className="mt-8">
      <input type="hidden" name="slug" value={slug} />
      <fieldset>
        <legend className="text-[17px] font-semibold">Taille</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((size) => (
            <label key={size.label} data-state={size.state} className="group relative">
              <input
                type="radio"
                name="variant_id"
                value={size.variantId}
                defaultChecked={size.label === defaultSize}
                disabled={!size.inStock}
                required
                className="peer sr-only"
              />
              <span
                className={`inline-flex h-11 min-w-12 cursor-pointer items-center justify-center rounded-full px-3 text-sm font-semibold tabular-nums shadow-[inset_0_0_0_1px_var(--color-separator)] transition-[background-color,box-shadow,color] duration-150 ease-[ease] peer-checked:bg-label peer-checked:text-white peer-checked:shadow-none peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent peer-disabled:cursor-default peer-disabled:text-label-2 peer-disabled:line-through peer-disabled:shadow-none peer-disabled:bg-tile group-data-[state=chosen]:ring-2 group-data-[state=chosen]:ring-accent group-data-[state=chosen]:ring-offset-2`}
              >
                {size.label}
              </span>
              <span className="sr-only">
                {size.inStock ? STATE_HINT[size.state] : ", épuisé"}
              </span>
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-label-2">Cerclée de bleu : votre taille estimée. Barrée : épuisée.</p>
      </fieldset>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button type="submit" disabled={pending || !anyInStock} className={`${primaryButton} min-w-56`}>
          {pending ? (
            <>
              <Spinner />
              <span className="sr-only">Ajout en cours</span>
            </>
          ) : anyInStock ? (
            "Ajouter au panier"
          ) : (
            "Épuisé"
          )}
        </button>
        <p aria-live="polite" className="text-sm">
          {state.added && (
            <>
              <span className="text-ok">Ajouté au panier en {state.added}.</span>{" "}
              <Link href="/panier" className="inline-flex min-h-11 items-center text-link hover:underline">
                Voir le panier ›
              </Link>
            </>
          )}
          {state.error && <span className="text-danger">{state.error}</span>}
        </p>
      </div>
    </form>
  );
}
