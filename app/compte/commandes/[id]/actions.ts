"use server";

import { refresh } from "next/cache";
import { requireUser } from "@/lib/commerce";
import { parseForm, returnSchema } from "@/lib/validation";

export type ReturnState = { error?: string; done?: boolean };

export async function requestReturn(_prev: ReturnState, formData: FormData): Promise<ReturnState> {
  const parsed = parseForm(returnSchema, formData, { orderItemId: "order_item_id", reason: "reason", comment: "comment" });
  if (parsed.errors) return { error: Object.values(parsed.errors)[0] };
  const { supabase, user } = await requireUser("/compte/commandes");
  const { orderItemId, reason, comment } = parsed.data;
  const { data: item } = await supabase.from("order_items").select("quantity").eq("id", orderItemId).maybeSingle();
  if (!item) return { error: "Article introuvable dans vos commandes." };

  const { error } = await supabase
    .from("returns")
    .insert({ order_item_id: orderItemId, user_id: user.id, reason, comment, quantity: item.quantity });
  if (error) return { error: error.code === "23505" ? "Un retour est déjà en cours pour cet article." : "La demande de retour a échoué. Réessayez dans un instant." };
  refresh();
  return { done: true };
}
