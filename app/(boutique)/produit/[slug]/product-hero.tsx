"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { primaryButton } from "@/components/field";
import { Spinner } from "@/components/spinner";
import { ProductViewer } from "@/components/three/product-viewer";
import { addToCart, type AddState } from "@/app/panier/actions";
import { price, type Figure, type Variant } from "@/lib/shop";

type Props = {
  slug: string;
  name: string;
  model: string;
  image: string | null;
  kicker: string;
  choiceLabel: string;
  variants: Variant[];
  defaultVariantId: string | null;
  // Relevé chiffré de chaque format, calculé côté serveur.
  figures: Record<string, Figure[]>;
  children: React.ReactNode;
};

// Haut de fiche : le modèle 3D à gauche, le choix du format et l'ajout au panier à droite.
// Le format choisi change le prix, le relevé chiffré et, pour le bol, la couleur du modèle.
export function ProductHero({ slug, name, model, image, kicker, choiceLabel, variants, defaultVariantId, figures, children }: Props) {
  const [variantId, setVariantId] = useState(defaultVariantId ?? variants.find((v) => v.stock > 0)?.id ?? variants[0].id);
  const [state, action, pending] = useActionState<AddState, FormData>(addToCart, {});
  const variant = variants.find((v) => v.id === variantId)!;
  const choose = variants.length > 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
      <div className="lg:sticky lg:top-20 lg:self-start">
        <ProductViewer model={model} variant={variant.label} image={image} name={name} />
      </div>

      <div className="min-w-0">
        <p className="mono text-fog uppercase">{kicker}</p>
        <h1 className="display mt-2 text-[56px] sm:text-[76px]">{name}</h1>
        <p className="figures mt-4 text-[28px]" aria-live="polite">
          {price(variant.priceCents)}
        </p>

        {children}

        <form action={action} className="mt-8">
          <input type="hidden" name="slug" value={slug} />
          {choose ? (
            <fieldset>
              <legend className="mono uppercase">{choiceLabel}</legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {variants.map((v) => (
                  <label key={v.id} className="relative">
                    <input
                      type="radio"
                      name="variant_id"
                      value={v.id}
                      checked={v.id === variantId}
                      onChange={() => setVariantId(v.id)}
                      disabled={v.stock === 0}
                      className="peer sr-only"
                    />
                    <span className="flex min-h-14 cursor-pointer flex-col justify-center px-4 py-2 shadow-[inset_0_0_0_1px_var(--color-ink)] transition-colors duration-150 peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink peer-disabled:cursor-default peer-disabled:text-fog peer-disabled:shadow-[inset_0_0_0_1px_var(--color-line)]">
                      <span className="font-medium">{v.label}</span>
                      <span className="mono text-[12px] opacity-75">{v.stock === 0 ? "Épuisé" : price(v.priceCents)}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : (
            <input type="hidden" name="variant_id" value={variant.id} />
          )}

          {figures[variant.id]?.length > 0 && (
            <dl className="mt-6 border-t border-line">
              {figures[variant.id].map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-6 border-b border-line py-2.5">
                  <dt className="text-fog">{f.label}</dt>
                  <dd className="mono text-right text-[14px]">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6 grid gap-3">
            <button type="submit" disabled={pending || variant.stock === 0} className={`${primaryButton} w-full`}>
              {pending ? (
                <>
                  <Spinner />
                  <span className="sr-only">Ajout en cours</span>
                </>
              ) : variant.stock === 0 ? (
                "Épuisé"
              ) : (
                "Ajouter au panier"
              )}
            </button>
            {variant.stock > 0 && variant.stock <= 3 && <p className="mono text-center text-fog">Plus que {variant.stock} en stock.</p>}
            <p aria-live="polite" className="text-[15px]">
              {state.added && (
                <>
                  <span className="font-medium text-matcha-ink">Ajouté au panier : {state.added}.</span>{" "}
                  <Link href="/panier" className="inline-flex min-h-11 items-center underline underline-offset-4">
                    Voir le panier
                  </Link>
                </>
              )}
              {state.error && <span className="text-danger">{state.error}</span>}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
