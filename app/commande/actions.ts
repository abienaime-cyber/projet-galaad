"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CATALOG_TAG } from "@/lib/catalog";
import { requireUser } from "@/lib/commerce";
import { addressSchema, parseForm, type FieldErrors } from "@/lib/validation";

export type CheckoutState = { errors?: FieldErrors; error?: string };

const ADDRESS_FIELDS = { recipient: "recipient", line1: "line1", line2: "line2", postalCode: "postal_code", city: "city" };

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const parsed = parseForm(addressSchema, formData, ADDRESS_FIELDS);
  if (parsed.errors) return { errors: parsed.errors };
  const { supabase, user } = await requireUser("/commande");
  const a = parsed.data;

  // L'adresse saisie devient l'adresse par défaut du client.
  const { data: existing } = await supabase.from("addresses").select("id").eq("user_id", user.id).eq("is_default", true).maybeSingle();
  const row = { recipient: a.recipient, line1: a.line1, line2: a.line2, postal_code: a.postalCode, city: a.city, country: "FR" };
  const { data: address, error: addressError } = existing
    ? await supabase.from("addresses").update(row).eq("id", existing.id).select("id").single()
    : await supabase.from("addresses").insert({ ...row, user_id: user.id, is_default: true }).select("id").single();
  if (addressError || !address) return { error: "L’adresse n’a pas pu être enregistrée. Réessayez dans un instant." };

  // Paiement simulé : place_order() vérifie et décrémente le stock dans une seule transaction.
  const { data: orderId, error } = await supabase.rpc("place_order", { p_address_id: address.id });
  if (error) {
    if (error.code === "P0001") return { error: `${error.message}. Votre panier n’a pas été débité ; ajustez-le puis réessayez.` };
    if (error.code === "P0002") return { error: "Votre panier est vide." };
    return { error: "La commande a échoué. Rien n’a été débité. Réessayez dans un instant." };
  }
  updateTag(CATALOG_TAG);
  redirect(`/compte/commandes/${orderId}?merci=1`);
}
