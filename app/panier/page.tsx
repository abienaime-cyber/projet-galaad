import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { inputClass, primaryButton } from "@/components/field";
import { cartTotal, getCart, lineProblem, requireUser } from "@/lib/commerce";
import { price } from "@/lib/shop";
import { removeLine, updateQuantity } from "./actions";

export const metadata: Metadata = { title: "Panier" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-8 pb-24 sm:px-6 md:pt-12">
      <h1 className="display text-[64px] sm:text-[96px]">Votre panier</h1>
      <Suspense fallback={<div aria-busy className="mt-10 h-80 bg-steel-2" />}>
        <Cart />
      </Suspense>
    </div>
  );
}

async function Cart() {
  await requireUser("/panier");
  const lines = await getCart();

  if (lines.length === 0) {
    return (
      <div className="mt-10 bg-paper/60 px-6 py-16 text-center">
        <h2 className="display text-[40px]">Le panier est vide</h2>
        <p className="mt-3 text-fog">Ce que vous ajoutez reste ici, même si vous changez d’appareil.</p>
        <Link href="/boutique?rayon=kits" className={`${primaryButton} mt-6`}>
          Voir les kits
        </Link>
      </div>
    );
  }

  const blocked = lines.some(lineProblem);

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <ul className="border-t border-ink">
        {lines.map((line) => {
          const problem = lineProblem(line);
          return (
            <li key={line.variantId} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-b border-line py-5 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:gap-6">
              <Link href={`/produit/${line.product.slug}`} tabIndex={-1} aria-hidden className="steel-light block self-start">
                {line.product.image && <Image src={line.product.image} alt="" width={256} height={256} sizes="128px" className="aspect-square w-full object-contain p-1" />}
              </Link>
              <div className="min-w-0">
                <h2 className="display text-[28px] leading-none">
                  <Link href={`/produit/${line.product.slug}`} className="hover:text-matcha-ink">
                    {line.product.name}
                  </Link>
                </h2>
                {line.label !== "Unique" && <p className="mono mt-1 text-fog">{line.label}</p>}
                {problem && <p className="mt-2 text-[15px] text-danger">{problem}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <form action={updateQuantity} className="flex flex-wrap items-center gap-x-2">
                    <input type="hidden" name="variant_id" value={line.variantId} />
                    <label htmlFor={`q-${line.variantId}`} className="text-[15px] text-fog">
                      Quantité
                    </label>
                    <select id={`q-${line.variantId}`} name="quantity" defaultValue={line.quantity} className={`${inputClass} figures h-11 w-auto py-0`}>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="inline-flex min-h-11 cursor-pointer items-center text-[15px] whitespace-nowrap underline-offset-4 hover:underline">
                      Mettre à jour
                    </button>
                  </form>
                  <form action={removeLine}>
                    <input type="hidden" name="variant_id" value={line.variantId} />
                    <button type="submit" className="inline-flex min-h-11 cursor-pointer items-center text-[15px] underline-offset-4 hover:underline">
                      Retirer
                    </button>
                  </form>
                </div>
              </div>
              <p className="mono col-start-2 text-[17px] sm:col-start-3 sm:text-right">{price(line.priceCents * line.quantity)}</p>
            </li>
          );
        })}
      </ul>

      <aside aria-label="Total" data-theme="dark" className="self-start bg-ink p-6 text-paper lg:sticky lg:top-20">
        <p className="flex items-baseline justify-between gap-4">
          <span className="display text-[32px]">Total</span>
          <span className="mono text-[22px]">{price(cartTotal(lines))}</span>
        </p>
        <p className="mono mt-1 text-fog-dark">Livraison offerte.</p>
        {blocked ? (
          <p className="mt-4 text-[15px] text-danger-dark">Corrigez les lignes signalées pour passer commande.</p>
        ) : (
          <Link href="/commande" className={`${primaryButton} mt-6 w-full`}>
            Passer commande
          </Link>
        )}
      </aside>
    </div>
  );
}
