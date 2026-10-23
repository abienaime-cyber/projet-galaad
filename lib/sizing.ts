// Calcul de taille déterministe. Aucune IA ici : le conseiller reçoit ce résultat.

export type Fit = "slim" | "regular" | "loose";
export type Category = "shirt" | "suit";
export type Confidence = "high" | "medium" | "low";

export type Measurements = {
  heightCm: number;
  weightKg: number;
  age: number;
  chestCm?: number | null;
  waistCm?: number | null;
  preferredFit?: Fit | null;
};

// Intervalles semi-ouverts [min, max) en cm de tour de corps.
export type SizeRow = {
  label: string;
  chestMin: number;
  chestMax: number;
  waistMin?: number | null;
  waistMax?: number | null;
};

export type Product = {
  category: Category;
  fit: Fit;
  sizes: SizeRow[];
};

export type SizeRecommendation = {
  size: string | null;
  alternative: string | null;
  confidence: Confidence;
  estimated: boolean;
  chestCm: number;
  waistCm: number;
};

const MAX_DISTANCE_CM = 4;
const BOUNDARY_MARGIN_CM = 1.5;

// Coupe du vêtement + coupe préférée : un vêtement ajusté demande plus de tour,
// un client qui aime l'ample aussi.
const PRODUCT_FIT_EASE: Record<Fit, number> = { slim: 2, regular: 0, loose: -2 };
export const PREFERENCE_EASE: Record<Fit, number> = { slim: -2, regular: 0, loose: 2 };

const round1 = (n: number) => Math.round(n * 10) / 10;

// Heuristique maison, non validée scientifiquement : calibrée pour donner des
// valeurs plausibles chez l'adulte. Elle ne sert que si le client n'a pas mesuré.
export function estimateChest(heightCm: number, weightKg: number): number {
  const bmi = weightKg / (heightCm / 100) ** 2;
  return round1(0.53 * heightCm + 2 * (bmi - 22));
}

export function estimateWaist(heightCm: number, weightKg: number, age: number): number {
  const bmi = weightKg / (heightCm / 100) ** 2;
  const ageEffect = 0.1 * (Math.min(Math.max(age, 20), 70) - 30);
  return round1(0.45 * heightCm + 2.6 * (bmi - 22) + ageEffect);
}

function distanceToRange(value: number, min: number, max: number): number {
  if (value < min) return min - value;
  if (value >= max) return value - max;
  return 0;
}

export function recommendSize(m: Measurements, product: Product): SizeRecommendation {
  const needsWaist = product.category === "suit";
  const chestCm = m.chestCm ?? estimateChest(m.heightCm, m.weightKg);
  const waistCm = m.waistCm ?? estimateWaist(m.heightCm, m.weightKg, m.age);
  const estimated = m.chestCm == null || (needsWaist && m.waistCm == null);

  const ease = PRODUCT_FIT_EASE[product.fit] + PREFERENCE_EASE[m.preferredFit ?? "regular"];
  const chest = chestCm + ease;
  const waist = waistCm + ease;

  const rows = [...product.sizes].sort((a, b) => a.chestMin - b.chestMin);
  const scored = rows.map((row, index) => {
    const chestDistance = distanceToRange(chest, row.chestMin, row.chestMax);
    const waistDistance =
      needsWaist && row.waistMin != null && row.waistMax != null
        ? distanceToRange(waist, row.waistMin, row.waistMax)
        : 0;
    return { row, index, score: chestDistance + 0.5 * waistDistance };
  });

  // À score égal, on prend la plus grande taille, sauf si le client aime l'ajusté.
  const preferSmaller = m.preferredFit === "slim";
  const best = scored.reduce<(typeof scored)[number] | null>((acc, s) => {
    if (!acc || s.score < acc.score) return s;
    if (s.score === acc.score && !preferSmaller) return s;
    return acc;
  }, null);

  const base = { estimated, chestCm, waistCm };
  if (!best || best.score > MAX_DISTANCE_CM) {
    return { ...base, size: null, alternative: null, confidence: "low" };
  }

  const { row, index } = best;
  const toLower = chest - row.chestMin;
  const toUpper = row.chestMax - chest;
  let alternative: string | null = null;
  if (toLower < BOUNDARY_MARGIN_CM && index > 0) alternative = rows[index - 1].label;
  else if (toUpper < BOUNDARY_MARGIN_CM && index < rows.length - 1) alternative = rows[index + 1].label;

  // Chaque doute (mesure estimée, taille limite) fait baisser la confiance d'un cran.
  const doubts = Number(estimated) + Number(alternative !== null);
  let confidence: Confidence = "high";
  if (best.score > 0 || doubts === 2) confidence = "low";
  else if (doubts === 1) confidence = "medium";

  return { ...base, size: row.label, alternative, confidence };
}
