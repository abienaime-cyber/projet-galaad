import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/commerce";
import { FIT_LABEL } from "@/lib/shop";
import { CopyEditor } from "./copy-editor";

export const metadata: Metadata = { title: "Rédiger une fiche", robots: { index: false } };

export default function AdminProductPage({ params }: PageProps<"/admin/produits/[slug]">) {
  return (
    <div className="mx-auto max-w-[980px] px-4 pt-6 pb-24 sm:px-[22px] md:pt-10">
      <Link href="/admin/produits" className="inline-flex min-h-11 items-center text-sm text-link hover:underline">
        ‹ Fiches produit
      </Link>
      <Suspense fallback={<div aria-busy className="mt-6 h-96 rounded-[28px] bg-tile" />}>
        {params.then(({ slug }) => (
          <Editor slug={slug} />
        ))}
      </Suspense>
    </div>
  );
}

async function Editor({ slug }: { slug: string }) {
  const { supabase } = await requireAdmin();
  const { data: p } = await supabase.from("products").select("id, name, fit, color, material, description, image_url").eq("slug", slug).maybeSingle();
  if (!p) notFound();

  return (
    <div className="mt-4 grid gap-10 md:grid-cols-[14rem_minmax(0,1fr)]">
      {p.image_url && <Image src={p.image_url} alt="" width={448} height={560} className="aspect-[4/5] w-full rounded-[18px] object-cover" />}
      <div className="min-w-0">
        <h1 className="text-[32px] font-semibold md:text-[40px]">{p.name}</h1>
        <p className="mt-2 text-sm text-label-2">
          {FIT_LABEL[p.fit as keyof typeof FIT_LABEL]} · {p.color} · {p.material}
        </p>
        <CopyEditor productId={p.id} current={p.description} />
      </div>
    </div>
  );
}
