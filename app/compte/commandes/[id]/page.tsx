import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ORDER_STATUS, RETURN_STATUS, requireUser, type OrderStatus } from "@/lib/commerce";
import { dateFr, price } from "@/lib/shop";
import { RETURN_REASONS } from "@/lib/validation";
import { ReturnForm } from "./return-form";
import { Chevron } from "@/components/chevron";

export const metadata: Metadata = { title: "Détail de la commande" };

export default function OrderPage({ params, searchParams }: PageProps<"/compte/commandes/[id]">) {
  return (
    <div className="mx-auto max-w-[1180px] px-4 pt-6 pb-24 sm:px-8 md:pt-10">
      <Link href="/compte/commandes" className="eyebrow inline-flex min-h-11 items-center gap-2 text-label-2 hover:text-label">
        <Chevron back /> Vos commandes
      </Link>
      <Suspense fallback={<div aria-busy className="mt-6 h-96 bg-tile" />}>
        {Promise.all([params, searchParams]).then(([{ id }, { merci }]) => (
          <Order id={id} thanks={merci === "1"} />
        ))}
      </Suspense>
    </div>
  );
}

type Item = {
  id: string;
  product_name: string;
  size_label: string;
  unit_price_cents: number;
  quantity: number;
  product_variants: { products: { slug: string } };
  // order_item_id est unique dans returns : PostgREST renvoie un objet, pas une liste.
  returns: { reason: keyof typeof RETURN_REASONS; status: keyof typeof RETURN_STATUS } | null;
};

async function Order({ id, thanks }: { id: string; thanks: boolean }) {
  const { supabase } = await requireUser("/compte/commandes");
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { data: order } = await supabase
    .from("orders")
    .select(
      "number, status, total_cents, created_at, ship_recipient, ship_line1, ship_line2, ship_postal_code, ship_city, order_items(id, product_name, size_label, unit_price_cents, quantity, product_variants(products(slug)), returns(reason, status))",
    )
    .eq("id", id)
    .maybeSingle();
  if (!order) notFound();
  const items = order.order_items as unknown as Item[];
  const returnable = order.status === "delivered";

  return (
    <>
      {thanks && (
        <p role="status" className="mt-6 bg-tile p-5 text-[17px]">
          <span className="font-semibold text-ok">Merci, votre commande est enregistrée.</span> Le stock a été réservé
          pour vous.
        </p>
      )}
      <h1 className="mt-6 text-[36px] md:text-[48px]">Commande n° {order.number}</h1>
      <p className="mt-3 text-label-2">
        {dateFr.format(new Date(order.created_at))} · {ORDER_STATUS[order.status as OrderStatus]}
      </p>

      <ul className="mt-10 divide-y divide-separator border-y border-separator">
        {items.map((item) => {
          const ret = item.returns;
          return (
            <li key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 py-5">
              <div className="min-w-0">
                <Link href={`/produit/${item.product_variants.products.slug}`} className="inline-block py-0.5 font-semibold hover:underline">
                  {item.product_name}
                </Link>
                <p className="text-sm text-label-2">
                  Taille <span className="font-semibold text-label tabular-nums">{item.size_label}</span> · ×{item.quantity}
                </p>
                {ret ? (
                  <p className="mt-2 text-sm text-label-2">
                    {RETURN_STATUS[ret.status]} · {RETURN_REASONS[ret.reason]}
                  </p>
                ) : (
                  returnable && <ReturnForm orderItemId={item.id} />
                )}
              </div>
              <p className="tabular-nums">{price(item.unit_price_cents * item.quantity)}</p>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 flex justify-end gap-6 text-[21px] font-semibold">
        Total <span className="tabular-nums">{price(order.total_cents)}</span>
      </p>

      <section aria-labelledby="ship-title" className="mt-10 text-sm">
        <h2 id="ship-title" className="text-[17px]">
          Livrée à
        </h2>
        <address className="mt-2 not-italic text-label-2 [overflow-wrap:anywhere]">
          {order.ship_recipient}
          <br />
          {order.ship_line1}
          {order.ship_line2 && (
            <>
              <br />
              {order.ship_line2}
            </>
          )}
          <br />
          {order.ship_postal_code} {order.ship_city}
        </address>
        {!returnable && order.status !== "cancelled" && (
          <p className="mt-4 text-label-2">Les retours s’ouvrent à la livraison.</p>
        )}
      </section>
    </>
  );
}
