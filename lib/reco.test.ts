import { describe, expect, it } from "vitest";
import {
  costPerCupCents,
  cupsPerTin,
  match,
  monthlySavingsCents,
  paybackCups,
  pickBest,
  suggestFormat,
  weeksOfUse,
  type RecoProduct,
  type TasteProfile,
} from "./reco";

const profile = (over: Partial<TasteProfile> = {}): TasteProfile => ({
  cupsPerWeek: 7,
  drink: "pur",
  taste: "doux",
  experience: "decouverte",
  owned: [],
  cafePriceCents: null,
  ...over,
});

const matcha = (slug: string, grade: RecoProduct["grade"], intensity: number): RecoProduct => ({
  slug,
  category: "matcha",
  toolKind: null,
  grade,
  intensity,
  contents: [],
});
const tool = (slug: string, toolKind: RecoProduct["toolKind"]): RecoProduct => ({ slug, category: "tool", toolKind, grade: null, intensity: null, contents: [] });
const item = (toolKind: RecoProduct["toolKind"]) => ({ toolKind, grade: null, intensity: null });
const kit = (slug: string, contents: RecoProduct["contents"]): RecoProduct => ({ slug, category: "kit", toolKind: null, grade: null, intensity: null, contents });

const ceremonie = matcha("ceremonie", "ceremonie", 2);
const quotidien = matcha("quotidien", "quotidien", 3);
const latte = matcha("latte", "latte", 4);

describe("matcha", () => {
  it("conseille le grade Cérémonie à qui boit pur et doux", () => {
    expect(pickBest([latte, quotidien, ceremonie], profile())?.best.product.slug).toBe("ceremonie");
  });

  it("conseille le grade Latte à qui le boit au lait et intense", () => {
    expect(pickBest([ceremonie, quotidien, latte], profile({ drink: "latte", taste: "intense" }))?.best.product.slug).toBe("latte");
  });

  it("donne une confiance faible et une alternative quand deux matchas se valent", () => {
    const pick = pickBest([ceremonie, quotidien, latte], profile({ drink: "les_deux", taste: "equilibre" }))!;
    expect(pick.best.product.slug).toBe("quotidien");
    expect(pick.confidence).toBe("high");
    const close = pickBest([matcha("a", "quotidien", 3), matcha("b", "quotidien", 3)], profile({ drink: "les_deux", taste: "equilibre" }))!;
    expect(close.confidence).toBe("low");
    expect(close.alternative?.product.slug).toBe("b");
  });

  it("explique le grade et l'intensité", () => {
    expect(match(ceremonie, profile()).reasons).toEqual([
      "Grade Cérémonie : fait pour un matcha pur, à l’eau.",
      "Intensité 2/5 pour un goût doux : proche de ce que vous aimez.",
    ]);
  });
});

describe("ustensiles", () => {
  it("met un ustensile déjà possédé tout en bas", () => {
    expect(match(tool("bol", "chawan"), profile({ owned: ["chawan"] })).score).toBe(20);
  });

  it("le bol est indispensable pour le matcha pur, pas pour le latte", () => {
    expect(match(tool("bol", "chawan"), profile()).score).toBe(95);
    expect(match(tool("bol", "chawan"), profile({ drink: "latte" })).score).toBe(75);
  });
});

describe("kits", () => {
  const essentiel = kit("essentiel", [item("chasen"), item("chashaku"), item("furui"), { toolKind: null, grade: "quotidien", intensity: 3 }]);
  const complet = kit("complet", [item("chawan"), item("chasen"), item("kusenaoshi"), item("chashaku"), item("furui"), { toolKind: null, grade: "ceremonie", intensity: 2 }]);

  it("préfère le kit complet à qui n'a rien et boit pur", () => {
    expect(pickBest([essentiel, complet], profile())?.best.product.slug).toBe("complet");
  });

  it("préfère le kit essentiel à qui a déjà un bol", () => {
    expect(pickBest([essentiel, complet], profile({ owned: ["chawan"], drink: "les_deux", taste: "equilibre" }))?.best.product.slug).toBe("essentiel");
  });

  it("dit ce qui manquera", () => {
    expect(match(essentiel, profile()).reasons[0]).toBe("Il vous manquera : bol.");
  });
});

describe("consommation", () => {
  it("compte les tasses par boîte avec les doses Ippodo", () => {
    expect(cupsPerTin(30, "pur")).toBe(15);
    expect(cupsPerTin(30, "latte")).toBe(10);
  });

  it("calcule la durée d'une boîte au rythme du client", () => {
    expect(weeksOfUse(30, profile({ cupsPerWeek: 5 }))).toBe(3);
    expect(weeksOfUse(100, profile({ cupsPerWeek: 7, drink: "latte" }))).toBe(5);
  });

  it("calcule le prix de revient d'une tasse", () => {
    expect(costPerCupCents(2400, 30, "pur")).toBe(160);
  });

  it("calcule l'économie et le remboursement du kit seulement si le prix du café est connu", () => {
    expect(monthlySavingsCents(profile(), 100)).toBeNull();
    const p = profile({ cupsPerWeek: 3, cafePriceCents: 600 });
    expect(monthlySavingsCents(p, 100)).toBe(6500);
    expect(paybackCups(4900, p, 100)).toBe(10);
    expect(paybackCups(4900, profile({ cafePriceCents: 100 }), 150)).toBeNull();
  });

  it("conseille la grande boîte quand la petite ne tient pas trois semaines", () => {
    const variants = [
      { label: "100 g", matchaGrams: 100, stock: 4 },
      { label: "30 g", matchaGrams: 30, stock: 9 },
    ];
    expect(suggestFormat(variants, profile({ cupsPerWeek: 3 }))?.label).toBe("30 g");
    expect(suggestFormat(variants, profile({ cupsPerWeek: 14 }))?.label).toBe("100 g");
    expect(suggestFormat([{ label: "30 g", matchaGrams: 30, stock: 0 }], profile())).toBeNull();
  });
});
