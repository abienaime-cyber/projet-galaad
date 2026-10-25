import { describe, expect, it } from "vitest";
import { parseTaste } from "./taste";

const form = (values: Record<string, string>, owned: string[] = []) =>
  parseTaste(
    (name) => values[name] ?? "",
    (name) => (name === "owned" ? owned : []),
  );

const valid = { cups_per_week: "5", drink: "latte", taste: "equilibre" };

describe("parseTaste", () => {
  it("accepte les champs obligatoires seuls", () => {
    expect(form(valid)).toEqual({
      data: { cupsPerWeek: 5, drink: "latte", taste: "equilibre", experience: "decouverte", owned: [], cafePriceCents: null },
    });
  });

  it("convertit le prix du café en centimes, virgule acceptée", () => {
    expect(form({ ...valid, cafe_price: "6,50" })).toMatchObject({ data: { cafePriceCents: 650 } });
  });

  it("garde les ustensiles possédés sans doublon", () => {
    expect(form(valid, ["chawan", "chawan", "kettle"])).toMatchObject({ data: { owned: ["chawan", "kettle"] } });
  });

  it("explique chaque erreur en français", () => {
    expect(form({ cups_per_week: "40", drink: "café", taste: "" }, ["cafetière"])).toEqual({
      errors: {
        cupsPerWeek: "Indiquez un nombre entier de tasses, entre 1 et 28 par semaine.",
        drink: "Choisissez comment vous buvez votre matcha.",
        taste: "Choisissez le goût que vous préférez.",
        owned: "Cochez des ustensiles de la liste.",
      },
    });
  });

  it("refuse un nombre de tasses décimal et un prix hors bornes", () => {
    expect(form({ ...valid, cups_per_week: "2,5", cafe_price: "45" })).toEqual({
      errors: {
        cupsPerWeek: "Indiquez un nombre entier de tasses, entre 1 et 28 par semaine.",
        cafePriceCents: "Indiquez un prix entre 1 et 20 €, ou laissez vide.",
      },
    });
  });
});
