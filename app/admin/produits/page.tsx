import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/commerce";
import { price } from "@/lib/shop";
import { Chevron } from "@/components/chevron";

export const metadata: Metadata = { title: "Fiches produit", robots: { index: false } };

export default function AdminProductsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-6 pb-24 sm:px-6 md:pt-10">
      <Link href="/admin" className="inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-fog hover:text-ink">
        <Chevron back /> Tableau de bord
      </Link>
      <h1 className="display mt-4 text-[60px] sm:text-[88px]">Fiches produit</h1>
      <p className="mt-3 max-w-[40rem] text-fog">
        L’IA propose une description à partir des caractéristiques du produit. Vous la relisez, la corrigez, puis la
        publiez.
      </p>
      <Suspense fallback={<div aria-busy className="mt-10 h-96 bg-steel-2" />}>
        <Products />
      </Suspense>
    </div>
  );
}

async function Products() {
  const { supabase } = await requireAdmin();
  const { data: products } = await supabase.from("products").select("slug, name, image_url, is_active, category, product_variants(price_cents)").order("category").order("name");

  return (
    <ul className="bg-paper/60 shadow-[inset_0_0_0_1px_var(--color-line)] mt-10 divide-y divide-line px-5 sm:px-6">
      {(products ?? []).map((p) => (
        <li key={p.slug}>
          <Link href={`/admin/produits/${p.slug}`} className="group flex items-center gap-4 py-3">
            {p.image_url && <Image src={p.image_url} alt="" width={96} height={96} className="steel-light aspect-square w-12 shrink-0 object-contain" />}
            <span className="min-w-0 flex-1 group-hover:underline">{p.name}</span>
            {!p.is_active && <span className="text-xs text-fog">Hors ligne</span>}
            <span className="text-sm text-fog figures">{price(Math.min(...p.product_variants.map((v) => v.price_cents)))}</span>
            <span className="text-ink"><Chevron /></span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
