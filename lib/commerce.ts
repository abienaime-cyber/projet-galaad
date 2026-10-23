import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "./auth";
import { createClient } from "./supabase/server";

// Données privées du client : toujours lues avec sa session, donc filtrées par la RLS.

export async function requireUser(next: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect(`/connexion?suite=${encodeURIComponent(next)}`);
  return { supabase, user: data.user };
}

// La page admin n'existe pas pour qui n'est pas admin : 404 plutôt que 403, pour ne rien révéler.
export async function requireAdmin() {
  const { supabase, user } = await requireUser("/admin");
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (data?.role !== "admin") notFound();
  return { supabase, user };
}

export async function isAdmin() {
  const user = await getCurrentUser();
  if (!user) return false;
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return data?.role === "admin";
}

export type CartLine = {
  variantId: string;
  quantity: number;
  size: string;
  stock: number;
  product: { slug: string; name: string; color: string; priceCents: number; image: string | null; isActive: boolean };
};

type CartRow = {
  variant_id: string;
  quantity: number;
  product_variants: {
    size_label: string;
    stock: number;
    products: { slug: string; name: string; color: string; price_cents: number; image_url: string | null; is_active: boolean };
  };
};

export async function getCart(): Promise<CartLine[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cart_items")
    .select("variant_id, quantity, product_variants(size_label, stock, products(slug, name, color, price_cents, image_url, is_active))")
    .order("added_at");
  return ((data ?? []) as unknown as CartRow[]).map(({ variant_id, quantity, product_variants: { size_label, stock, products: p } }) => ({
    variantId: variant_id,
    quantity,
    size: size_label,
    stock,
    product: { slug: p.slug, name: p.name, color: p.color, priceCents: p.price_cents, image: p.image_url, isActive: p.is_active },
  }));
}

export const cartTotal = (lines: CartLine[]) => lines.reduce((sum, l) => sum + l.product.priceCents * l.quantity, 0);

// Une ligne ne peut pas partir si l'article est retiré ou si le stock est passé sous la quantité.
export function lineProblem(line: CartLine): string | null {
  if (!line.product.isActive) return "Article retiré de la vente.";
  if (line.stock >= line.quantity) return null;
  return line.stock === 0 ? "Épuisé dans cette taille." : `Plus que ${line.stock} en stock.`;
}

export async function getCartCount() {
  const user = await getCurrentUser();
  if (!user) return 0;
  const supabase = await createClient();
  const { data } = await supabase.from("cart_items").select("quantity");
  return (data ?? []).reduce((sum, row) => sum + row.quantity, 0);
}

export const ORDER_STATUS = { paid: "Payée", shipped: "Expédiée", delivered: "Livrée", cancelled: "Annulée" } as const;
export const RETURN_STATUS = { requested: "Retour demandé", accepted: "Retour accepté", refused: "Retour refusé", refunded: "Remboursé" } as const;

export type OrderStatus = keyof typeof ORDER_STATUS;
