import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { toSizeRows } from "@/lib/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/actions";
import { MeasurementsForm, type Charts } from "./measurements-form";

export const metadata: Metadata = { title: "Vos mensurations" };

export default function MeasurementsPage() {
  return (
    <div className="mx-auto max-w-[1180px] px-4 pt-10 pb-20 sm:px-8 md:pt-16">
      <h1 className="text-[36px] md:text-[48px]">Vos mensurations</h1>
      <p className="mt-3 max-w-[40rem] text-[17px] leading-relaxed text-label-2">
        Elles servent uniquement à calculer votre taille pour chaque chemise et chaque costume. Le calcul reste une
        estimation : il vous dit à quel point il est sûr de lui.
      </p>
      <Suspense fallback={<div aria-busy className="mt-10 h-[28rem] bg-tile" />}>
        <MeasurementsSection />
      </Suspense>
    </div>
  );
}

// Affichage français : virgule décimale, champ vide si la valeur manque.
const fr = (n: number | null | undefined) => (n == null ? "" : String(n).replace(".", ","));

async function MeasurementsSection() {
  if (!isSupabaseConfigured) {
    return (
      <p role="alert" className="mt-10 max-w-prose bg-danger-tint p-5 text-danger">
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
    charts[chart.category as keyof Charts] = toSizeRows(chart.size_chart_rows);
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
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-label-2">
        <span className="min-w-0 [overflow-wrap:anywhere]">Connecté avec {auth.user.email}</span>
        <form action={signOut}>
          <button type="submit" className="inline-flex min-h-11 cursor-pointer items-center text-link hover:underline">
            Se déconnecter
          </button>
        </form>
        {m && (
          <Link href="/costumes" className="inline-flex min-h-11 items-center text-link hover:underline">
            Voir les costumes à ma taille
          </Link>
        )}
      </div>
      <MeasurementsForm initial={initial} charts={charts} />
    </>
  );
}
