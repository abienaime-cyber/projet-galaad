import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { SizeRow } from "@/lib/sizing";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/actions";
import { MeasurementsForm, type Charts } from "./measurements-form";

export const metadata: Metadata = { title: "Vos mensurations" };

export default function MeasurementsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <h1 className="text-3xl font-semibold">Vos mensurations</h1>
      <p className="mt-2 max-w-prose text-ink-2">
        Elles servent uniquement à calculer votre taille pour chaque chemise et chaque costume. Le calcul reste une
        estimation : il vous dit à quel point il est sûr de lui.
      </p>
      <Suspense fallback={<div aria-busy className="mt-10 h-[28rem] rounded-[3px] bg-paper-2/60" />}>
        <MeasurementsSection />
      </Suspense>
    </div>
  );
}

type ChartRow = { label: string; sort_order: number; chest_min: number; chest_max: number; waist_min: number | null; waist_max: number | null };

const toSizeRows = (rows: ChartRow[]): SizeRow[] =>
  [...rows]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((r) => ({
      label: r.label,
      chestMin: Number(r.chest_min),
      chestMax: Number(r.chest_max),
      waistMin: r.waist_min === null ? null : Number(r.waist_min),
      waistMax: r.waist_max === null ? null : Number(r.waist_max),
    }));

// Affichage français : virgule décimale, champ vide si la valeur manque.
const fr = (n: number | null | undefined) => (n == null ? "" : String(n).replace(".", ","));

async function MeasurementsSection() {
  if (!isSupabaseConfigured) {
    return (
      <p role="alert" className="mt-10 max-w-prose border-t-2 border-tape-red pt-4">
        La base de données n’est pas encore branchée. Renseignez <code>NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
        <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans <code>.env.local</code>, puis relancez le serveur.
      </p>
    );
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/connexion?suite=/compte/mensurations");

  const [{ data: m }, { data: chartData }] = await Promise.all([
    supabase.from("measurements").select("*").eq("user_id", auth.user.id).maybeSingle(),
    supabase.from("size_charts").select("category, size_chart_rows(label, sort_order, chest_min, chest_max, waist_min, waist_max)"),
  ]);

  const charts: Charts = { shirt: [], suit: [] };
  for (const chart of chartData ?? []) {
    charts[chart.category as keyof Charts] = toSizeRows(chart.size_chart_rows as ChartRow[]);
  }

  const initial = {
    height_cm: fr(m?.height_cm),
    weight_kg: fr(m?.weight_kg),
    age: fr(m?.age),
    chest_cm: fr(m?.chest_cm),
    waist_cm: fr(m?.waist_cm),
    preferred_fit: m?.preferred_fit ?? "",
  };

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-2">
        <span className="min-w-0 break-all">Connecté avec {auth.user.email}</span>
        <form action={signOut}>
          <button type="submit" className="inline-flex min-h-11 cursor-pointer items-center text-navy underline decoration-rule underline-offset-4 hover:decoration-navy">
            Se déconnecter
          </button>
        </form>
      </div>
      <MeasurementsForm initial={initial} charts={charts} />
    </>
  );
}
