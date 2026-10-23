import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/commerce";
import { price } from "@/lib/shop";

export const metadata: Metadata = { title: "Fiches produit", robots: { index: false } };

export default function AdminProductsPage() {
  return (
    <div className="mx-auto max-w-[980px] px-4 pt-6 pb-24 sm:px-[22px] md:pt-10">
      <Link href="/admin" className="inline-flex min-h-11 items-center text-sm text-link hover:underline">
        ‹ Tableau de bord
      </Link>
      <h1 className="mt-4 text-[40px] font-semibold md:text-5xl">Fiches produit</h1>
      <p className="mt-3 max-w-[40rem] text-label-2">
        L’IA propose une description à partir des caractéristiques du produit. Vous la relisez, la corrigez, puis la
        publiez.
      </p>
      <Suspense fallback={<div aria-busy className="mt-10 h-96 rounded-[28px] bg-tile" />}>
        <Products />
      </Suspense>
    </div>
  );
}

async function Products() {
  const { supabase } = await requireAdmin();
  const { data: products } = await supabase.from("products").select("slug, name, price_cents, image_url, is_active, category").order("category").order("name");

  return (
    <ul className="mt-10 divide-y divide-separator border-y border-separator">
      {(products ?? []).map((p) => (
        <li key={p.slug}>
          <Link href={`/admin/produits/${p.slug}`} className="group flex items-center gap-4 py-3">
            {p.image_url && <Image src={p.image_url} alt="" width={96} height={120} className="aspect-[4/5] w-12 shrink-0 rounded-[8px] object-cover" />}
            <span className="min-w-0 flex-1 group-hover:underline">{p.name}</span>
            {!p.is_active && <span className="text-xs text-label-2">Hors ligne</span>}
            <span className="text-sm text-label-2 tabular-nums">{price(p.price_cents)}</span>
            <span className="text-link">›</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
