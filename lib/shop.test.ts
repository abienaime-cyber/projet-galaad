import { describe, expect, it } from "vitest";
import type { TasteProfile } from "./reco";
import { forMe, minPrice, price, rateAll, variantFigures, type CatalogProduct } from "./shop";

const product = (slug: string, over: Partial<CatalogProduct>): CatalogProduct => ({
  id: slug,
  slug,
  name: slug,
  description: "",
  category: "tool",
  toolKind: "chasen",
  grade: null,
  intensity: null,
  material: "Bambou",
  model: "chasen",
  image: null,
  variants: [{ id: `${slug}-v`, label: "Unique", priceCents: 2200, matchaGrams: null, stock: 5 }],
  contents: [],
  separatePriceCents: null,
  ...over,
});

const profile: TasteProfile = { cupsPerWeek: 7, drink: "pur", taste: "doux", experience: "decouverte", owned: ["chawan"], cafePriceCents: null };

describe("forMe", () => {
  it("écarte ce que le client possède déjà et ce qui est épuisé", () => {
    const rated = rateAll(
      [
        product("fouet", {}),
        product("bol", { toolKind: "chawan" }),
        product("tamis-epuise", { toolKind: "furui", variants: [{ id: "t", label: "Unique", priceCents: 1200, matchaGrams: null, stock: 0 }] }),
      ],
      profile,
    );
    expect(forMe(rated).map((r) => r.product.slug)).toEqual(["fouet"]);
  });

  it("classe le mieux noté en premier", () => {
    const rated = rateAll([product("verre", { toolKind: "glass" }), product("bouilloire", { toolKind: "kettle" }), product("fouet", {})], profile);
    expect(forMe(rated).map((r) => r.product.slug)).toEqual(["fouet", "bouilloire"]);
  });

  it("ne note rien sans profil de goût", () => {
    expect(rateAll([product("fouet", {})], null)[0].match).toBeNull();
  });
});

describe("prix", () => {
  it("affiche des euros sans centimes quand le prix est rond", () => {
    expect(price(4900).replace(/\s/g, " ")).toBe("49 €");
    expect(price(160).replace(/\s/g, " ")).toBe("1,60 €");
  });

  it("donne le prix du plus petit format", () => {
    const tin = product("matcha", {
      variants: [
        { id: "a", label: "100 g", priceCents: 6900, matchaGrams: 100, stock: 1 },
        { id: "b", label: "30 g", priceCents: 2400, matchaGrams: 30, stock: 1 },
      ],
    });
    expect(minPrice(tin)).toBe(2400);
  });
});

describe("variantFigures", () => {
  const tin = product("matcha", {
    category: "matcha",
    toolKind: null,
    grade: "quotidien",
    intensity: 3,
    variants: [{ id: "a", label: "30 g", priceCents: 1600, matchaGrams: 30, stock: 9 }],
  });

  it("compte les tasses et le prix de la tasse sans profil", () => {
    expect(variantFigures(tin, tin.variants[0], null).map((f) => f.value.replace(/\s/g, " "))).toEqual(["15 purs ou 10 lattes", "1,07 € pur · 1,60 € latte"]);
  });

  it("calcule la durée, le prix de la tasse et l'économie au rythme du client", () => {
    const p: TasteProfile = { cupsPerWeek: 5, drink: "latte", taste: "intense", experience: "decouverte", owned: [], cafePriceCents: 650 };
    expect(variantFigures(tin, tin.variants[0], p).map((f) => `${f.label} : ${f.value}`.replace(/\s/g, " "))).toEqual([
      "30 g de matcha : 10 tasses · 2 semaines",
      "Votre tasse : 1,60 €, matcha seul",
      "Économie : 106 € par mois",
    ]);
  });
});
