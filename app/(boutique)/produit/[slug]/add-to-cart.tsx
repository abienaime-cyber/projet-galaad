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
        <legend className="text-[15px] font-semibold">Choisissez votre taille</legend>
        <div className="mt-4 grid grid-cols-4 gap-2">
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
                className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-card px-3 text-[15px] font-semibold tabular-nums shadow-[inset_0_0_0_1px_var(--color-border)] transition-[background-color,box-shadow,color] duration-200 hover:shadow-[inset_0_0_0_1px_var(--color-input)] peer-checked:bg-primary peer-checked:text-on-primary peer-checked:shadow-none peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring peer-disabled:cursor-default peer-disabled:bg-transparent peer-disabled:font-normal peer-disabled:text-muted-foreground peer-disabled:line-through group-data-[state=chosen]:ring-2 group-data-[state=chosen]:ring-accent group-data-[state=chosen]:ring-offset-2 group-data-[state=chosen]:ring-offset-background`}
              >
                {size.label}
              </span>
              <span className="sr-only">
                {size.inStock ? STATE_HINT[size.state] : ", épuisé"}
              </span>
            </label>
          ))}
        </div>
        <p className="mt-3 text-[13px] text-muted-foreground">Cerclée d’or : votre taille estimée. Barrée : épuisée.</p>
      </fieldset>

      <div className="mt-8 grid gap-3">
        <button type="submit" disabled={pending || !anyInStock} className={`${primaryButton} w-full`}>
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
        <p aria-live="polite" className="text-[14px]">
          {state.added && (
            <>
              <span className="font-semibold text-success">Ajouté au panier en {state.added}.</span>{" "}
              <Link href="/panier" className="inline-flex min-h-11 items-center font-semibold underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground">
                Voir le panier
              </Link>
            </>
          )}
          {state.error && <span className="text-destructive">{state.error}</span>}
        </p>
      </div>
    </form>
  );
}
