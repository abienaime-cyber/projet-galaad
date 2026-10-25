import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { cartTotal, getCart, lineProblem, requireUser } from "@/lib/commerce";
import { price } from "@/lib/shop";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Commande" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-8 pb-24 sm:px-6 md:pt-12">
      <h1 className="display text-[60px] sm:text-[88px]">Livraison et paiement</h1>
      <Suspense fallback={<div aria-busy className="mt-10 h-96 bg-steel-2" />}>
        <Checkout />
      </Suspense>
    </div>
  );
}

async function Checkout() {
  const { supabase, user } = await requireUser("/commande");
  const [lines, { data: address }] = await Promise.all([
    getCart(),
    supabase.from("addresses").select("recipient, line1, line2, postal_code, city").eq("user_id", user.id).eq("is_default", true).maybeSingle(),
  ]);

  const empty = lines.length === 0;
  if (empty || lines.some(lineProblem)) {
    return (
      <p className="mt-10 text-[17px]">
        {empty ? "Votre panier est vide." : "Certaines lignes de votre panier ne sont plus disponibles."}{" "}
        <Link href={empty ? "/boutique" : "/panier"} className="text-ink underline underline-offset-4">
          {empty ? "Voir la boutique" : "Revoir le panier"}
        </Link>
      </p>
    );
  }

  const total = price(cartTotal(lines));
  return (
    <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section aria-labelledby="ship-title">
        <h2 id="ship-title" className="display mb-5 text-[32px]">
          Adresse de livraison
        </h2>
        <CheckoutForm
          total={total}
          address={{
            recipient: address?.recipient ?? user.user_metadata.full_name ?? "",
            line1: address?.line1 ?? "",
            line2: address?.line2 ?? "",
            postal_code: address?.postal_code ?? "",
            city: address?.city ?? "",
          }}
        />
      </section>
      <aside aria-labelledby="summary-title" className="bg-paper/60 shadow-[inset_0_0_0_1px_var(--color-line)] self-start p-6 lg:sticky lg:top-24">
        <h2 id="summary-title" className="display text-[28px]">
          Récapitulatif
        </h2>
        <ul className="mt-4 grid gap-3 text-[15px]">
          {lines.map((l) => (
            <li key={l.variantId} className="flex justify-between gap-4">
              <span className="min-w-0">
                {l.product.name} <span className="text-fog">{l.label !== "Unique" && `· ${l.label} `}· ×{l.quantity}</span>
              </span>
              <span className="mono shrink-0">{price(l.priceCents * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-line pt-4 font-semibold">
          Total <span className="figures">{total}</span>
        </p>
        <Link href="/panier" className="mt-2 inline-flex min-h-11 items-center text-sm text-ink hover:underline">
          Modifier le panier
        </Link>
      </aside>
    </div>
  );
}
