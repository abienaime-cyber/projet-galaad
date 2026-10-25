import {
  costPerCupCents,
  cupsPerTin,
  match,
  monthlySavingsCents,
  paybackCups,
  pickBest,
  weeksOfUse,
  type Category,
  type Confidence,
  type Grade,
  type Match,
  type RecoItem,
  type TasteProfile,
  type ToolKind,
} from "./reco";

export type Variant = { id: string; label: string; priceCents: number; matchaGrams: number | null; stock: number };

// priceCents et matchaGrams : la pièce achetée seule, dans son premier format.
export type KitItem = RecoItem & { slug: string; name: string; quantity: number; priceCents: number; matchaGrams: number | null };

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  toolKind: ToolKind | null;
  grade: Grade | null;
  intensity: number | null;
  material: string;
  model: string;
  image: string | null;
  variants: Variant[];
  contents: KitItem[];
  // Pour un kit : le prix des pièces achetées une à une.
  separatePriceCents: number | null;
};

export type Rated = { product: CatalogProduct; match: Match | null };

export const CATEGORIES: { value: Category; slug: string; label: string; one: string }[] = [
  { value: "kit", slug: "kits", label: "Kits", one: "kit" },
  { value: "matcha", slug: "matcha", label: "Matcha", one: "matcha" },
  { value: "tool", slug: "ustensiles", label: "Ustensiles", one: "ustensile" },
];

export const categoryOf = (value: Category) => CATEGORIES.find((c) => c.value === value)!;

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: "choix net",
  medium: "choix assez net",
  low: "choix serré",
};

const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const eurosCents = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });

// Prix rond sans décimales ; les centimes ne s'affichent que s'il y en a.
export const price = (cents: number) => (cents % 100 === 0 ? euros : eurosCents).format(cents / 100);

export const dateFr = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export const minPrice = (p: CatalogProduct) => Math.min(...p.variants.map((v) => v.priceCents));
export const isAvailable = (p: CatalogProduct) => p.variants.some((v) => v.stock > 0);
export const hasRange = (p: CatalogProduct) => new Set(p.variants.map((v) => v.priceCents)).size > 1;

// Les vignettes ne sont notées que si le client a un profil de goût.
export function rateAll(products: CatalogProduct[], profile: TasteProfile | null): Rated[] {
  return products.map((product) => ({ product, match: profile ? match(product, profile) : null }));
}

export const FOR_ME_MIN_SCORE = 70;

// « Pour moi » : ce qui va avec le profil et reste en stock, le mieux noté d'abord. À égalité, l'ordre du catalogue.
export function forMe(rated: Rated[]): Rated[] {
  return rated
    .filter((r) => r.match && r.match.score >= FOR_ME_MIN_SCORE && isAvailable(r.product))
    .sort((a, b) => b.match!.score - a.match!.score);
}

// Le choix du calcul dans une catégorie, parmi ce qui est en stock.
export const bestOf = (products: CatalogProduct[], category: Category, profile: TasteProfile) =>
  pickBest(
    products.filter((p) => p.category === category && isAvailable(p)),
    profile,
  );

// --- Relevé chiffré d'un format ---------------------------------------------------
// Que des calculs sur les prix du catalogue et les réponses du client ; les doses sont celles d'Ippodo.

export type Figure = { label: string; value: string };

const weeksText = (w: number) => `${String(w).replace(".", ",")} semaine${w > 1 ? "s" : ""}`;

export function variantFigures(product: CatalogProduct, variant: Variant, profile: TasteProfile | null): Figure[] {
  const grams = variant.matchaGrams;
  if (!grams) return [];
  // Le matcha d'un kit se rachète seul : la tasse se compte au prix de sa boîte.
  const refill = product.category === "kit" ? product.contents.find((c) => c.grade) : null;
  const unit = refill?.matchaGrams ? { price: refill.priceCents, grams: refill.matchaGrams } : { price: variant.priceCents, grams };

  if (!profile) {
    return [
      { label: `${grams} g de matcha`, value: `${cupsPerTin(grams, "pur")} purs ou ${cupsPerTin(grams, "latte")} lattes` },
      { label: "La tasse", value: `${price(costPerCupCents(unit.price, unit.grams, "pur"))} pur · ${price(costPerCupCents(unit.price, unit.grams, "latte"))} latte` },
    ];
  }

  const cup = costPerCupCents(unit.price, unit.grams, profile.drink);
  const figures: Figure[] = [
    { label: `${grams} g de matcha`, value: `${cupsPerTin(grams, profile.drink)} tasses · ${weeksText(weeksOfUse(grams, profile))}` },
    { label: "Votre tasse", value: `${price(cup)}, matcha seul` },
  ];
  const savings = monthlySavingsCents(profile, cup);
  if (savings !== null && savings > 0) figures.push({ label: "Économie", value: `${price(Math.round(savings / 100) * 100)} par mois` });
  const payback = product.category === "kit" ? paybackCups(variant.priceCents, profile, cup) : null;
  if (payback !== null) figures.push({ label: "Kit remboursé", value: `après ${payback} tasses` });
  return figures;
}
