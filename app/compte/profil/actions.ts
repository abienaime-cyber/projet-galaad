"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/commerce";
import { parseTaste, type TasteErrors } from "@/lib/taste";

export type TasteState = { errors?: TasteErrors; error?: string };

export async function saveTaste(_prev: TasteState, formData: FormData): Promise<TasteState> {
  const parsed = parseTaste(
    (name) => String(formData.get(name) ?? ""),
    (name) => formData.getAll(name).map(String),
  );
  if ("errors" in parsed) return { errors: parsed.errors };

  const { supabase, user } = await requireUser("/compte/profil");
  const p = parsed.data;
  const { error } = await supabase.from("taste_profiles").upsert({
    user_id: user.id,
    cups_per_week: p.cupsPerWeek,
    drink: p.drink,
    taste: p.taste,
    experience: p.experience,
    owned: p.owned,
    cafe_price_cents: p.cafePriceCents,
  });
  if (error) return { error: "L’enregistrement a échoué. Réessayez dans un instant." };
  // Le profil est prêt : le client arrive directement sur la boutique classée pour lui.
  redirect("/boutique");
}

export async function deleteTaste() {
  const { supabase, user } = await requireUser("/compte/profil");
  await supabase.from("taste_profiles").delete().eq("user_id", user.id);
  refresh();
}
