import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/commerce";
import { price } from "@/lib/shop";
import { RETURN_REASONS } from "@/lib/validation";

export const metadata: Metadata = { title: "Tableau de bord", robots: { index: false } };

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-[980px] px-4 pt-10 pb-24 sm:px-[22px] md:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-[40px] font-semibold md:text-5xl">Tableau de bord</h1>
        <Link href="/admin/produits" className="inline-flex min-h-11 items-center text-link hover:underline">
          Fiches produit ›
        </Link>
      </div>
      <Suspense fallback={<div aria-busy className="mt-10 h-[32rem] rounded-[28px] bg-tile" />}>
        <Dashboard />
      </Suspense>
    </div>
  );
}

const pct = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
const CATEGORY = { suit: "Costume", shirt: "Chemise" } as const;

async function Dashboard() {
  const { supabase } = await requireAdmin();
  // Tous les calculs se font en SQL (vues admin_*) : la page ne fait qu'afficher.
  const [{ data: kpis }, { data: top }, { data: sizes }, { data: reasons }] = await Promise.all([
    supabase.from("admin_kpis").select("*").single(),
    supabase.from("admin_top_products").select("*").limit(5),
    supabase.from("admin_sizes_sold").select("*").limit(8),
    supabase.from("admin_returns_by_reason").select("*"),
  ]);
  if (!kpis) return <p className="mt-10 text-danger">Les indicateurs n’ont pas pu être lus.</p>;

  const figures = [
    { label: "Chiffre d’affaires", value: price(kpis.revenue_cents), note: `${kpis.orders_count} commandes` },
    { label: "Panier moyen", value: price(kpis.average_basket_cents), note: `${kpis.units_sold} articles vendus` },
    {
      label: "Retours pour mauvaise taille",
      value: `${pct.format(kpis.wrong_size_return_rate)} %`,
      note: `${kpis.wrong_size_returns} articles trop petits ou trop grands`,
    },
    { label: "Nouveaux clients", value: String(kpis.new_customers_30d), note: "sur les 30 derniers jours" },
  ];

  return (
    <>
      <p className="mt-3 text-sm text-label-2">Commandes annulées exclues. Les données du seed sont fictives.</p>
      <dl className="mt-8 grid gap-px overflow-hidden rounded-[18px] bg-separator sm:grid-cols-2 lg:grid-cols-4">
        {figures.map((f) => (
          <div key={f.label} className="bg-tile p-6">
            <dt className="text-sm text-label-2">{f.label}</dt>
            <dd className="figures mt-2 text-[32px] leading-none">{f.value}</dd>
            <dd className="mt-2 text-xs text-label-2">{f.note}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <Table
          title="Meilleures ventes"
          head={["Article", "Vendus", "CA"]}
          rows={(top ?? []).map((p) => [
            <Link key={p.slug} href={`/produit/${p.slug}`} className="hover:underline">
              {p.name}
            </Link>,
            p.units,
            price(p.revenue_cents),
          ])}
        />
        <Table
          title="Tailles les plus vendues"
          head={["Catégorie", "Taille", "Vendus"]}
          rows={(sizes ?? []).map((s) => [CATEGORY[s.category as keyof typeof CATEGORY], s.size_label, s.units])}
        />
        <Table
          title="Retours par motif"
          head={["Motif", "Retours", "Articles"]}
          rows={(reasons ?? []).map((r) => [RETURN_REASONS[r.reason as keyof typeof RETURN_REASONS], r.returns, r.units])}
        />
      </div>
    </>
  );
}

function Table({ title, head, rows }: { title: string; head: string[]; rows: React.ReactNode[][] }) {
  return (
    <section>
      <h2 className="text-[21px] font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-label-2">Aucune donnée pour le moment.</p>
      ) : (
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-separator text-left text-label-2">
              {head.map((h, i) => (
                <th key={h} scope="col" className={`py-2 font-normal ${i > 0 ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className="border-b border-separator">
                {row.map((cell, i) => (
                  <td key={i} className={`py-2.5 ${i > 0 ? "text-right tabular-nums" : "min-w-0 [overflow-wrap:anywhere]"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
