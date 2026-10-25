import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return [
    ...["/", "/boutique", "/boutique?rayon=kits", "/boutique?rayon=matcha", "/boutique?rayon=ustensiles", "/confidentialite", "/cgu"].map((path) => ({ url: `${SITE_URL}${path}` })),
    ...products.map((p) => ({ url: `${SITE_URL}/produit/${p.slug}` })),
  ];
}
