import { createClient as createPublicClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import type { CatalogProduct } from "./shop";
import type { Category, Measurements, SizeRow } from "./sizing";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./supabase/config";
import { createClient } from "./supabase/server";

type ChartRow = { label: string; sort_order: number; chest_min: number; chest_max: number; waist_min: number | null; waist_max: number | null };

export const toSizeRows = (rows: ChartRow[]): SizeRow[] =>
  [...rows]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((r) => ({
      label: r.label,
      chestMin: Number(r.chest_min),
      chestMax: Number(r.chest_max),
      waistMin: r.waist_min === null ? null : Number(r.waist_min),
      waistMax: r.waist_max === null ? null : Number(r.waist_max),
    }));

const PRODUCT_COLUMNS =
  "id, slug, name, description, category, fit, color, material, price_cents, image_url, size_charts(size_chart_rows(label, sort_order, chest_min, chest_max, waist_min, waist_max)), product_variants(id, size_label, stock)";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  fit: CatalogProduct["fit"];
  color: string;
  material: string;
  price_cents: number;
  image_url: string | null;
  size_charts: { size_chart_rows: ChartRow[] } | null;
  product_variants: { id: string; size_label: string; stock: number }[];
};

const toProduct = (row: ProductRow): CatalogProduct => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  description: row.description,
  category: row.category,
  fit: row.fit,
  color: row.color,
  material: row.material,
  priceCents: row.price_cents,
  image: row.image_url,
  sizes: toSizeRows(row.size_charts?.size_chart_rows ?? []),
  stock: Object.fromEntries(row.product_variants.map((v) => [v.size_label, v.stock])),
  variantIds: Object.fromEntries(row.product_variants.map((v) => [v.size_label, v.id])),
});

// Une commande ou une fiche modifiée invalide ce tag : stock et textes sont relus aussitôt.
export const CATALOG_TAG = "catalogue";

// Le catalogue est public (RLS : produits actifs) : lu sans cookie, il peut être mis en cache pour tous.
export async function getProducts(category?: Category): Promise<CatalogProduct[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CATALOG_TAG);
  if (!isSupabaseConfigured) return [];
  let query = createPublicClient(supabaseUrl!, supabaseKey!).from("products").select(PRODUCT_COLUMNS).order("name");
  if (category) query = query.eq("category", category);
  const { data } = await query;
  return ((data ?? []) as unknown as ProductRow[]).map(toProduct);
}

export async function getProduct(slug: string): Promise<CatalogProduct | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export type Shopper = { signedIn: boolean; measurements: Measurements | null };

export async function getShopper(): Promise<Shopper> {
  if (!isSupabaseConfigured) return { signedIn: false, measurements: null };
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { signedIn: false, measurements: null };
  const { data: m } = await supabase.from("measurements").select("*").eq("user_id", auth.user.id).maybeSingle();
  return {
    signedIn: true,
    measurements: m && {
      heightCm: Number(m.height_cm),
      weightKg: Number(m.weight_kg),
      age: m.age,
      chestCm: m.chest_cm === null ? null : Number(m.chest_cm),
      waistCm: m.waist_cm === null ? null : Number(m.waist_cm),
      preferredFit: m.preferred_fit,
    },
  };
}
