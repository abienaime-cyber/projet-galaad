import { recommendSize, type Category, type Confidence, type Fit, type Measurements, type SizeRecommendation, type SizeRow } from "./sizing";

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  fit: Fit;
  color: string;
  material: string;
  priceCents: number;
  image: string | null;
  sizes: SizeRow[];
  stock: Record<string, number>;
  variantIds: Record<string, string>;
};

export type Fitted = { product: CatalogProduct; rec: SizeRecommendation | null; inStock: boolean };

export const CATEGORY_PATH: Record<Category, string> = { suit: "/costumes", shirt: "/chemises" };

export const FIT_LABEL: Record<Fit, string> = { slim: "Ajustée", regular: "Classique", loose: "Ample" };

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: "confiance élevée",
  medium: "confiance moyenne",
  low: "confiance faible",
};

const CONFIDENCE_RANK: Record<Confidence, number> = { high: 0, medium: 1, low: 2 };

const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
export const price = (cents: number) => euros.format(cents / 100);

export const dateFr = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export function fitAll(products: CatalogProduct[], m: Measurements | null): Fitted[] {
  return products.map((product) => {
    const rec = m ? recommendSize(m, product) : null;
    return { product, rec, inStock: rec?.size != null && (product.stock[rec.size] ?? 0) > 0 };
  });
}

// « Pour moi » : les articles en stock dans la taille calculée, les plus sûrs d'abord,
// puis ceux de la coupe que le client préfère. À égalité, l'ordre du catalogue.
export function forMe(fitted: Fitted[], preferredFit: Fit | null | undefined): Fitted[] {
  const rank = (f: Fitted) => CONFIDENCE_RANK[f.rec!.confidence] * 2 + Number(preferredFit != null && f.product.fit !== preferredFit);
  return fitted.filter((f) => f.inStock).sort((a, b) => rank(a) - rank(b));
}
