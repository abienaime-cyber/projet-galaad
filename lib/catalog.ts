import { createClient as createPublicClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import type { Category, Drink, Experience, Grade, Taste, TasteProfile, ToolKind } from "./reco";
import type { CatalogProduct } from "./shop";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./supabase/config";
import { createClient } from "./supabase/server";

// kit_items a deux clés vers products : le nom de la contrainte lève l'ambiguïté pour PostgREST.
const PRODUCT_COLUMNS = `id, slug, name, description, category, tool_kind, grade, intensity, material, model, image_url,
  product_variants(id, label, price_cents, matcha_grams, stock, sort_order),
  kit_items!kit_items_kit_id_fkey(quantity, sort_order, item:products!kit_items_item_id_fkey(slug, name, tool_kind, grade, intensity, product_variants(price_cents, matcha_grams, sort_order)))`;

type ItemVariant = { price_cents: number; matcha_grams: number | null; sort_order: number };

type VariantRow = { id: string; label: string; price_cents: number; matcha_grams: number | null; stock: number; sort_order: number };

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  tool_kind: ToolKind | null;
  grade: Grade | null;
  intensity: number | null;
  material: string;
  model: string;
  image_url: string | null;
  product_variants: VariantRow[];
  kit_items: {
    quantity: number;
    sort_order: number;
    item: { slug: string; name: string; tool_kind: ToolKind | null; grade: Grade | null; intensity: number | null; product_variants: ItemVariant[] };
  }[];
};

const bySortOrder = (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order;

// Une pièce achetée seule : son premier format.
const firstVariant = (variants: ItemVariant[]) => [...variants].sort(bySortOrder)[0];

const toProduct = (row: ProductRow): CatalogProduct => {
  const items = [...row.kit_items].sort(bySortOrder);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    category: row.category,
    toolKind: row.tool_kind,
    grade: row.grade,
    intensity: row.intensity,
    material: row.material,
    model: row.model,
    image: row.image_url,
    variants: [...row.product_variants].sort(bySortOrder).map((v) => ({
      id: v.id,
      label: v.label,
      priceCents: v.price_cents,
      matchaGrams: v.matcha_grams,
      stock: v.stock,
    })),
    contents: items.map(({ quantity, item }) => ({
      slug: item.slug,
      name: item.name,
      quantity,
      toolKind: item.tool_kind,
      grade: item.grade,
      intensity: item.intensity,
      priceCents: firstVariant(item.product_variants)?.price_cents ?? 0,
      matchaGrams: firstVariant(item.product_variants)?.matcha_grams ?? null,
    })),
    separatePriceCents: items.length ? items.reduce((sum, { quantity, item }) => sum + quantity * (firstVariant(item.product_variants)?.price_cents ?? 0), 0) : null,
  };
};

// Une commande ou une fiche modifiée invalide ce tag : stock et textes sont relus aussitôt.
export const CATALOG_TAG = "catalogue";

const CATEGORY_ORDER: Record<Category, number> = { kit: 0, matcha: 1, tool: 2 };

// Le catalogue est public (RLS : produits actifs) : lu sans cookie, il peut être mis en cache pour tous.
export async function getProducts(): Promise<CatalogProduct[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CATALOG_TAG);
  if (!isSupabaseConfigured) return [];
  const { data } = await createPublicClient(supabaseUrl!, supabaseKey!).from("products").select(PRODUCT_COLUMNS).order("created_at").order("slug");
  return ((data ?? []) as unknown as ProductRow[]).map(toProduct).sort((a, b) => CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category]);
}

export async function getProduct(slug: string): Promise<CatalogProduct | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export type Shopper = { signedIn: boolean; profile: TasteProfile | null };

type ProfileRow = {
  cups_per_week: number;
  drink: Drink;
  taste: Taste;
  experience: Experience;
  owned: ToolKind[];
  cafe_price_cents: number | null;
};

export const toTasteProfile = (row: ProfileRow): TasteProfile => ({
  cupsPerWeek: row.cups_per_week,
  drink: row.drink,
  taste: row.taste,
  experience: row.experience,
  owned: row.owned,
  cafePriceCents: row.cafe_price_cents,
});

export async function getShopper(): Promise<Shopper> {
  if (!isSupabaseConfigured) return { signedIn: false, profile: null };
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { signedIn: false, profile: null };
  const { data } = await supabase.from("taste_profiles").select("*").eq("user_id", auth.user.id).maybeSingle();
  return { signedIn: true, profile: data && toTasteProfile(data as ProfileRow) };
}
