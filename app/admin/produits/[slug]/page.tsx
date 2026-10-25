import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/commerce";
import { GRADE_LABEL, TOOL_LABEL, type Grade, type ToolKind } from "@/lib/reco";
import { CopyEditor } from "./copy-editor";
import { Chevron } from "@/components/chevron";

export const metadata: Metadata = { title: "Rédiger une fiche", robots: { index: false } };

export default function AdminProductPage({ params }: PageProps<"/admin/produits/[slug]">) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-6 pb-24 sm:px-6 md:pt-10">
      <Link href="/admin/produits" className="inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-fog hover:text-ink">
        <Chevron back /> Fiches produit
      </Link>
      <Suspense fallback={<div aria-busy className="mt-6 h-96 bg-steel-2" />}>
        {params.then(({ slug }) => (
          <Editor slug={slug} />
        ))}
      </Suspense>
    </div>
  );
}

async function Editor({ slug }: { slug: string }) {
  const { supabase } = await requireAdmin();
  const { data: p } = await supabase.from("products").select("id, name, category, tool_kind, grade, material, description, image_url").eq("slug", slug).maybeSingle();
  if (!p) notFound();

  return (
    <div className="mt-4 grid gap-10 md:grid-cols-[14rem_minmax(0,1fr)]">
      {p.image_url && <Image src={p.image_url} alt="" width={448} height={448} className="steel-light aspect-square w-full object-contain p-2" />}
      <div className="min-w-0">
        <h1 className="display text-[52px] sm:text-[64px]">{p.name}</h1>
        <p className="mt-2 text-sm text-fog">
          {p.grade ? `Matcha ${GRADE_LABEL[p.grade as Grade]}` : p.tool_kind ? TOOL_LABEL[p.tool_kind as ToolKind] : "Kit"} · {p.material}
        </p>
        <CopyEditor productId={p.id} current={p.description} />
      </div>
    </div>
  );
}
