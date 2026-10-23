"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { parseMeasurements, type MeasurementErrors } from "@/lib/measurements";
import { createClient } from "@/lib/supabase/server";

export type MeasurementsState = { errors?: MeasurementErrors; error?: string };

async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/connexion?suite=/compte/mensurations");
  return { supabase, user: data.user };
}

export async function saveMeasurements(_prev: MeasurementsState, formData: FormData): Promise<MeasurementsState> {
  const parsed = parseMeasurements((name) => String(formData.get(name) ?? ""));
  if ("errors" in parsed) return { errors: parsed.errors };

  const { supabase, user } = await requireUser();
  const m = parsed.data;
  const { error } = await supabase.from("measurements").upsert({
    user_id: user.id,
    height_cm: m.heightCm,
    weight_kg: m.weightKg,
    age: m.age,
    chest_cm: m.chestCm,
    waist_cm: m.waistCm,
    preferred_fit: m.preferredFit,
  });
  if (error) return { error: "L'enregistrement a échoué. Réessayez dans un instant." };
  // Les tailles sont prêtes : le client arrive directement sur les costumes à sa taille.
  redirect("/costumes");
}

export async function deleteMeasurements() {
  const { supabase, user } = await requireUser();
  await supabase.from("measurements").delete().eq("user_id", user.id);
  refresh();
}
