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
    <div className="mx-auto max-w-[1180px] px-4 pt-10 sm:px-8 md:pt-16">
      <h1 className="text-[40px] md:text-[54px]">Votre panier</h1>
      <Suspense fallback={<div aria-busy className="mt-10 h-80 rounded-xl bg-muted" />}>
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
      <div className="card mt-10 px-6 py-14 text-center sm:px-12">
        <h2 className="text-[28px]">Votre panier est vide.</h2>
        <p className="mt-3 text-muted-foreground">Les articles que vous ajoutez restent ici, même si vous changez d’appareil.</p>
        <Link href="/costumes" className={`${primaryButton} mt-6`}>
          Voir les costumes
        </Link>
      </div>
    );
  }

  const blocked = lines.some(lineProblem);

  return (
    <>
      <ul className="card mt-10 divide-y divide-border px-5 sm:px-6">
        {lines.map((line) => {
          const problem = lineProblem(line);
          return (
            <li key={line.variantId} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 py-6 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:gap-6">
              <Link href={`/produit/${line.product.slug}`} tabIndex={-1} aria-hidden className="block self-start overflow-hidden rounded-lg bg-muted">
                {line.product.image && (
                  <Image src={line.product.image} alt="" width={256} height={320} sizes="128px" className="aspect-[4/5] w-full object-cover" />
                )}
              </Link>
              <div className="min-w-0">
                <h2 className="font-sans text-[16px] font-semibold">
                  <Link href={`/produit/${line.product.slug}`} className="inline-block py-1 hover:underline">
                    {line.product.name}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {line.product.color} · Taille <span className="font-semibold text-foreground tabular-nums">{line.size}</span>
                </p>
                {problem && <p className="mt-2 text-sm text-destructive">{problem}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <form action={updateQuantity} className="flex flex-wrap items-center gap-x-2">
                    <input type="hidden" name="variant_id" value={line.variantId} />
                    <label htmlFor={`q-${line.variantId}`} className="text-sm text-muted-foreground">
                      Quantité
                    </label>
                    <select
                      id={`q-${line.variantId}`}
                      name="quantity"
                      defaultValue={line.quantity}
                      className={`${inputClass} h-11 w-auto py-0 tabular-nums`}
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="inline-flex min-h-11 cursor-pointer items-center text-sm whitespace-nowrap text-foreground hover:underline">
                      Mettre à jour
                    </button>
                  </form>
                  <form action={removeLine}>
                    <input type="hidden" name="variant_id" value={line.variantId} />
                    <button type="submit" className="inline-flex min-h-11 cursor-pointer items-center text-sm text-foreground hover:underline">
                      Retirer
                    </button>
                  </form>
                </div>
              </div>
              <p className="col-start-2 text-[17px] font-semibold tabular-nums sm:col-start-3 sm:text-right">
                {price(line.product.priceCents * line.quantity)}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="card mt-6 ml-auto flex max-w-[24rem] flex-col items-end gap-2 p-6">
        <p className="text-[21px] font-semibold">
          Total <span className="ml-3 tabular-nums">{price(cartTotal(lines))}</span>
        </p>
        <p className="text-sm text-muted-foreground">Livraison offerte.</p>
        {blocked ? (
          <p className="mt-2 text-sm text-destructive">Corrigez les lignes signalées pour passer commande.</p>
        ) : (
          <Link href="/commande" className={`${primaryButton} mt-4`}>
            Passer commande
          </Link>
        )}
      </div>
    </>
  );
}
