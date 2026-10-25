import type { Drink, Experience, Taste, TasteProfile, ToolKind } from "./reco";

export type TasteErrors = Partial<Record<keyof TasteProfile, string>>;

// Mêmes bornes que les contraintes check de la table taste_profiles.
export const CUPS = { min: 1, max: 28 };
export const CAFE_PRICE = { min: 1, max: 20 };

export const DRINKS: { value: Drink; label: string; hint: string }[] = [
  { value: "pur", label: "Pur", hint: "Fouetté à l’eau, sans lait" },
  { value: "latte", label: "Latte", hint: "Avec du lait, chaud ou glacé" },
  { value: "les_deux", label: "Les deux", hint: "Selon l’humeur" },
];

export const TASTES: { value: Taste; label: string; hint: string }[] = [
  { value: "doux", label: "Doux", hint: "Peu d’amertume" },
  { value: "equilibre", label: "Équilibré", hint: "Un peu des deux" },
  { value: "intense", label: "Intense", hint: "Franc, un peu amer" },
];

export const EXPERIENCES: { value: Experience; label: string }[] = [
  { value: "decouverte", label: "Je découvre" },
  { value: "habitue", label: "J’en prépare déjà" },
];

// Ce que le client peut déjà avoir : la boîte et le verre comptent peu, on ne les demande pas.
export const OWNABLE: ToolKind[] = ["chawan", "chasen", "chashaku", "furui", "kusenaoshi", "kettle"];

function parseNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(",", ".");
  if (trimmed === "") return null;
  return /^\d+(\.\d+)?$/.test(trimmed) ? Number(trimmed) : NaN;
}

const oneOf = <T extends string>(options: { value: T }[], raw: string) => options.find((o) => o.value === raw)?.value ?? null;

export function parseTaste(read: (name: string) => string, readAll: (name: string) => string[]): { data: TasteProfile } | { errors: TasteErrors } {
  const errors: TasteErrors = {};

  const cups = parseNumber(read("cups_per_week"));
  if (cups === null || Number.isNaN(cups) || !Number.isInteger(cups) || cups < CUPS.min || cups > CUPS.max) {
    errors.cupsPerWeek = `Indiquez un nombre entier de tasses, entre ${CUPS.min} et ${CUPS.max} par semaine.`;
  }
  const drink = oneOf(DRINKS, read("drink"));
  if (!drink) errors.drink = "Choisissez comment vous buvez votre matcha.";
  const taste = oneOf(TASTES, read("taste"));
  if (!taste) errors.taste = "Choisissez le goût que vous préférez.";
  const experience = oneOf(EXPERIENCES, read("experience")) ?? "decouverte";

  const owned = readAll("owned");
  if (owned.some((k) => !OWNABLE.includes(k as ToolKind))) errors.owned = "Cochez des ustensiles de la liste.";

  // Prix saisi en euros (virgule acceptée), stocké en centimes.
  const cafe = parseNumber(read("cafe_price"));
  if (cafe !== null && (Number.isNaN(cafe) || cafe < CAFE_PRICE.min || cafe > CAFE_PRICE.max)) {
    errors.cafePriceCents = `Indiquez un prix entre ${CAFE_PRICE.min} et ${CAFE_PRICE.max} €, ou laissez vide.`;
  }

  if (Object.keys(errors).length > 0) return { errors };
  return {
    data: {
      cupsPerWeek: cups!,
      drink: drink!,
      taste: taste!,
      experience,
      owned: [...new Set(owned)] as ToolKind[],
      cafePriceCents: cafe === null ? null : Math.round(cafe * 100),
    },
  };
}
