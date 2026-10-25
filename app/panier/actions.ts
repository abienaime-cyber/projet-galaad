"use server";

import { refresh } from "next/cache";
import { requireUser } from "@/lib/commerce";
import { cartLineSchema } from "@/lib/validation";

export type AddState = { error?: string; added?: string };

export async function addToCart(_prev: AddState, formData: FormData): Promise<AddState> {
  const slug = String(formData.get("slug") ?? "");
  const parsed = cartLineSchema.safeParse({ variantId: formData.get("variant_id") ?? "", quantity: 1 });
  if (!parsed.success) return { error: "Choisissez un format." };

  const { supabase } = await requireUser(`/produit/${slug}`);
  const { data: variant } = await supabase.from("product_variants").select("label, stock, products(name)").eq("id", parsed.data.variantId).maybeSingle();
  if (!variant) return { error: "Ce format n’existe plus." };
  if (variant.stock === 0) return { error: "Ce format vient d’être épuisé." };

  const { error } = await supabase.rpc("add_to_cart", { p_variant_id: parsed.data.variantId, p_quantity: 1 });
  if (error) return { error: "L’ajout au panier a échoué. Réessayez dans un instant." };
  refresh();
  const productName = (variant.products as unknown as { name: string }).name;
  return { added: variant.label === "Unique" ? productName : `${productName}, ${variant.label}` };
}

export async function updateQuantity(formData: FormData) {
  const parsed = cartLineSchema.safeParse({ variantId: formData.get("variant_id") ?? "", quantity: formData.get("quantity") ?? "" });
  if (!parsed.success) return;
  const { supabase } = await requireUser("/panier");
  await supabase.from("cart_items").update({ quantity: parsed.data.quantity }).eq("variant_id", parsed.data.variantId);
  refresh();
}

export async function removeLine(formData: FormData) {
  const parsed = cartLineSchema.safeParse({ variantId: formData.get("variant_id") ?? "", quantity: 1 });
  if (!parsed.success) return;
  const { supabase } = await requireUser("/panier");
  await supabase.from("cart_items").delete().eq("variant_id", parsed.data.variantId);
  refresh();
}
