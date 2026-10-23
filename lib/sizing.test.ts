import { describe, expect, it } from "vitest";
import { estimateChest, estimateWaist, recommendSize, type Product } from "./sizing";

const shirt: Product = {
  category: "shirt",
  fit: "regular",
  sizes: [
    { label: "S", chestMin: 88, chestMax: 96 },
    { label: "M", chestMin: 96, chestMax: 104 },
    { label: "L", chestMin: 104, chestMax: 112 },
    { label: "XL", chestMin: 112, chestMax: 120 },
  ],
};

const suit: Product = {
  category: "suit",
  fit: "regular",
  sizes: [
    { label: "46", chestMin: 90, chestMax: 94, waistMin: 78, waistMax: 82 },
    { label: "48", chestMin: 94, chestMax: 98, waistMin: 82, waistMax: 86 },
    { label: "50", chestMin: 98, chestMax: 102, waistMin: 86, waistMax: 90 },
    { label: "52", chestMin: 102, chestMax: 106, waistMin: 90, waistMax: 94 },
  ],
};

const base = { heightCm: 180, weightKg: 75, age: 30 };

describe("estimations", () => {
  it("donne des tours plausibles pour un adulte moyen", () => {
    expect(estimateChest(180, 75)).toBe(97.7);
    expect(estimateWaist(180, 75, 30)).toBe(84);
  });

  it("borne l'effet de l'âge", () => {
    expect(estimateWaist(180, 75, 90)).toBe(estimateWaist(180, 75, 70));
  });
});

describe("recommendSize", () => {
  it("utilise les mesures saisies avec une confiance haute", () => {
    const r = recommendSize({ ...base, chestCm: 100 }, shirt);
    expect(r).toMatchObject({ size: "M", alternative: null, confidence: "high", estimated: false });
  });

  it("signale une estimation quand la poitrine manque", () => {
    const r = recommendSize(base, shirt);
    expect(r.size).toBe("M");
    expect(r.estimated).toBe(true);
    expect(r.confidence).toBe("medium");
  });

  it("propose la taille voisine près d'une limite", () => {
    const r = recommendSize({ ...base, chestCm: 103.5 }, shirt);
    expect(r).toMatchObject({ size: "M", alternative: "L", confidence: "medium" });
  });

  it("une coupe ajustée demande plus d'aisance", () => {
    expect(recommendSize({ ...base, chestCm: 102.5 }, { ...shirt, fit: "slim" }).size).toBe("L");
  });

  it("la préférence du client décale la taille", () => {
    expect(recommendSize({ ...base, chestCm: 103, preferredFit: "loose" }, shirt).size).toBe("L");
    expect(recommendSize({ ...base, chestCm: 97, preferredFit: "slim" }, shirt).size).toBe("S");
  });

  it("ne recommande rien hors du tableau", () => {
    const r = recommendSize({ ...base, chestCm: 140 }, shirt);
    expect(r.size).toBeNull();
    expect(r.confidence).toBe("low");
  });

  it("tient compte du tour de taille pour un costume", () => {
    const r = recommendSize({ ...base, chestCm: 100, waistCm: 88 }, suit);
    expect(r).toMatchObject({ size: "50", confidence: "high" });
  });

  it("baisse la confiance si poitrine et taille divergent", () => {
    const r = recommendSize({ ...base, chestCm: 99, waistCm: 96 }, suit);
    expect(r.confidence).toBe("low");
  });

  it("un costume sans tour de taille saisi reste une estimation", () => {
    expect(recommendSize({ ...base, chestCm: 99 }, suit).estimated).toBe(true);
  });
});
