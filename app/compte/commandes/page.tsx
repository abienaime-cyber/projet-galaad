import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { primaryButton } from "@/components/field";
import { ORDER_STATUS, requireUser, type OrderStatus } from "@/lib/commerce";
import { dateFr, price } from "@/lib/shop";

export const metadata: Metadata = { title: "Vos commandes" };

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-[1180px] px-4 pt-10 pb-24 sm:px-8 md:pt-12">
      <h1 className="text-[44px] md:text-[60px]">Vos commandes</h1>
      <Suspense fallback={<div aria-busy className="mt-10 h-64 bg-tile" />}>
        <Orders />
      </Suspense>
    </div>
  );
}

async function Orders() {
  const { supabase } = await requireUser("/compte/commandes");
  const { data: orders } = await supabase
    .from("orders")
    .select("id, number, status, total_cents, created_at, order_items(quantity)")
    .order("created_at", { ascending: false });

  if (!orders || orders.length === 0) {
    return (
      <div className="mt-10 bg-tile px-6 py-12 text-center sm:px-12">
        <h2 className="text-[28px]">Aucune commande pour le moment.</h2>
        <p className="mt-3 text-label-2">Vos commandes et leurs retours apparaîtront ici.</p>
        <Link href="/costumes" className={`${primaryButton} mt-6`}>
          Voir les costumes
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-10 divide-y divide-separator border-y border-separator">
      {orders.map((o) => {
        const units = o.order_items.reduce((s, i) => s + i.quantity, 0);
        return (
          <li key={o.id}>
            <Link href={`/compte/commandes/${o.id}`} className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 py-5">
              <span className="font-semibold group-hover:underline">Commande n° {o.number}</span>
              <span className="text-right font-semibold tabular-nums">{price(o.total_cents)}</span>
              <span className="text-sm text-label-2">
                {dateFr.format(new Date(o.created_at))} · {units} article{units > 1 ? "s" : ""}
              </span>
              <span className="text-right text-sm text-label-2">{ORDER_STATUS[o.status as OrderStatus]}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
