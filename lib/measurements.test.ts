import { describe, expect, it } from "vitest";
import { parseDecimal, parseMeasurements } from "./measurements";

const reader = (values: Record<string, string>) => (name: string) => values[name] ?? "";
const valid = { height_cm: "180", weight_kg: "75", age: "30" };

describe("parseDecimal", () => {
  it("accepte la virgule décimale", () => expect(parseDecimal(" 97,5 ")).toBe(97.5));
  it("renvoie null pour un champ vide", () => expect(parseDecimal("  ")).toBeNull());
  it("refuse le texte et les négatifs", () => {
    expect(parseDecimal("abc")).toBeNaN();
    expect(parseDecimal("-3")).toBeNaN();
  });
});

describe("parseMeasurements", () => {
  it("accepte les champs obligatoires seuls", () => {
    expect(parseMeasurements(reader(valid))).toEqual({
      data: { heightCm: 180, weightKg: 75, age: 30, chestCm: null, waistCm: null, preferredFit: null },
    });
  });

  it("lit les champs facultatifs et la coupe", () => {
    const r = parseMeasurements(reader({ ...valid, chest_cm: "101,25", waist_cm: "88", preferred_fit: "slim" }));
    expect(r).toEqual({
      data: { heightCm: 180, weightKg: 75, age: 30, chestCm: 101.3, waistCm: 88, preferredFit: "slim" },
    });
  });

  it("signale chaque champ obligatoire manquant", () => {
    const r = parseMeasurements(reader({}));
    expect(r).toEqual({
      errors: {
        heightCm: "Indiquez votre taille, entre 140 et 220 cm.",
        weightKg: "Indiquez votre poids, entre 40 et 200 kg.",
        age: "Indiquez votre âge, entre 16 et 100 ans.",
      },
    });
  });

  it("refuse les valeurs hors bornes, un âge décimal et une coupe inconnue", () => {
    const r = parseMeasurements(reader({ ...valid, height_cm: "250", age: "30,5", preferred_fit: "baggy" }));
    expect(r).toEqual({
      errors: {
        heightCm: "La valeur doit être entre 140 et 220 cm.",
        age: "Indiquez un nombre entier, entre 16 et 100 ans.",
        preferredFit: "Choisissez une coupe dans la liste.",
      },
    });
  });
});
