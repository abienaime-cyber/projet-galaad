import { describe, expect, it } from "vitest";
import { fitAll, forMe, price, type CatalogProduct } from "./shop";
import type { Fit } from "./sizing";

const sizes = [
  { label: "48", chestMin: 94, chestMax: 98, waistMin: 82, waistMax: 86 },
  { label: "50", chestMin: 98, chestMax: 102, waistMin: 86, waistMax: 90 },
  { label: "52", chestMin: 102, chestMax: 106, waistMin: 90, waistMax: 94 },
];

const suit = (slug: string, fit: Fit, stock: Record<string, number>): CatalogProduct => ({
  slug,
  name: slug,
  description: "",
  category: "suit",
  fit,
  color: "Bleu marine",
  material: "Laine",
  priceCents: 39900,
  sizes,
  stock,
});

const measured = { heightCm: 180, weightKg: 78, age: 35, chestCm: 100, waistCm: 88, preferredFit: null };

describe("forMe", () => {
  it("garde seulement les articles en stock dans la taille calculée", () => {
    const fitted = fitAll([suit("en-stock", "regular", { "50": 3 }), suit("epuise", "regular", { "50": 0, "52": 4 })], measured);
    expect(forMe(fitted, null).map((f) => f.product.slug)).toEqual(["en-stock"]);
  });

  it("classe les tailles les plus sûres en premier", () => {
    // Coupe ample : le tour de poitrine tombe à la limite du 50, la confiance baisse.
    const fitted = fitAll([suit("ample", "loose", { "48": 1, "50": 1 }), suit("classique", "regular", { "50": 1 })], measured);
    expect(forMe(fitted, null).map((f) => f.product.slug)).toEqual(["classique", "ample"]);
  });

  it("place la coupe préférée en premier à confiance égale", () => {
    const likesLoose = { ...measured, preferredFit: "loose" as const };
    const fitted = fitAll([suit("ajuste", "slim", { "52": 1 }), suit("ample", "loose", { "50": 1 })], likesLoose);
    expect(forMe(fitted, "loose").map((f) => f.product.slug)).toEqual(["ample", "ajuste"]);
  });

  it("ne recommande rien sans mensurations", () => {
    const [f] = fitAll([suit("a", "regular", { "50": 1 })], null);
    expect(f.rec).toBeNull();
    expect(f.inStock).toBe(false);
  });
});

describe("price", () => {
  it("affiche des euros sans centimes", () => {
    expect(price(39900).replace(/\s/g, " ")).toBe("399 €");
  });
});
