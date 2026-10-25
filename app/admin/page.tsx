import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/commerce";
import { price } from "@/lib/shop";
import { RETURN_REASONS } from "@/lib/validation";
import { Chevron } from "@/components/chevron";

export const metadata: Metadata = { title: "Tableau de bord", robots: { index: false } };

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-8 pb-24 sm:px-6 md:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-[60px] sm:text-[88px]">Tableau de bord</h1>
        <Link href="/admin/produits" className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink hover:underline">
          Fiches produit <Chevron />
        </Link>
      </div>
      <Suspense fallback={<div aria-busy className="mt-10 h-[32rem] bg-steel-2" />}>
        <Dashboard />
      </Suspense>
    </div>
  );
}

const pct = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
const CATEGORY = { kit: "Kit", matcha: "Matcha", tool: "Ustensile" } as const;

async function Dashboard() {
  const { supabase } = await requireAdmin();
  // Tous les calculs se font en SQL (vues admin_*) : la page ne fait qu'afficher.
  const [{ data: kpis }, { data: top }, { data: sizes }, { data: reasons }] = await Promise.all([
    supabase.from("admin_kpis").select("*").single(),
    supabase.from("admin_top_products").select("*").limit(5),
    supabase.from("admin_variants_sold").select("*").limit(8),
    supabase.from("admin_returns_by_reason").select("*"),
  ]);
  if (!kpis) return <p className="mt-10 text-danger">Les indicateurs n’ont pas pu être lus.</p>;

  const figures = [
    { label: "Chiffre d’affaires", value: price(kpis.revenue_cents), note: `${kpis.orders_count} commandes` },
    { label: "Panier moyen", value: price(kpis.average_basket_cents), note: `${kpis.units_sold} articles vendus` },
    {
      label: "Retours pour casse",
      value: `${pct.format(kpis.damaged_return_rate)} %`,
      note: `${kpis.damaged_returns} articles arrivés abîmés`,
    },
    { label: "Clients avec un profil de goût", value: `${pct.format(kpis.taste_profile_rate)} %`, note: `${kpis.new_customers_30d} nouveaux clients sur 30 jours` },
  ];

  return (
    <>
      <p className="mt-3 text-sm text-fog">Commandes annulées exclues. Les données du seed sont fictives.</p>
      <dl className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {figures.map((f) => (
          <div key={f.label} className="bg-paper/60 shadow-[inset_0_0_0_1px_var(--color-line)] p-6">
            <dt className="text-sm text-fog">{f.label}</dt>
            <dd className="display mt-3 text-[52px] leading-none">{f.value}</dd>
            <dd className="mt-2 text-xs text-fog">{f.note}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Table
          title="Meilleures ventes"
          head={["Article", "Vendus", "CA"]}
          rows={(top ?? []).map((p) => [
            <Link key={p.slug} href={`/produit/${p.slug}`} className="inline-block py-0.5 hover:underline">
              {p.name}
            </Link>,
            p.units,
            price(p.revenue_cents),
          ])}
        />
        <Table
          title="Formats les plus vendus"
          head={["Rayon", "Format", "Vendus"]}
          rows={(sizes ?? []).map((s) => [CATEGORY[s.category as keyof typeof CATEGORY], s.variant_label, s.units])}
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
    <section className="bg-paper/60 shadow-[inset_0_0_0_1px_var(--color-line)] p-5 sm:p-6">
      <h2 className="display text-[34px]">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-fog">Aucune donnée pour le moment.</p>
      ) : (
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-fog">
              {head.map((h, i) => (
                <th key={h} scope="col" className={`py-2 font-medium ${i > 0 ? "pl-4 text-right whitespace-nowrap" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className="border-b border-line last:border-b-0">
                {row.map((cell, i) => (
                  <td key={i} className={`py-2.5 ${i > 0 ? "pl-4 text-right whitespace-nowrap figures" : "min-w-0 [overflow-wrap:anywhere]"}`}>
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
