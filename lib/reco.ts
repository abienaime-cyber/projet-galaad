// Recommandation déterministe à partir du profil de goût. Aucune IA ici : le conseiller reçoit ce résultat.

export type Category = "kit" | "matcha" | "tool";
export type ToolKind = "chawan" | "chasen" | "chashaku" | "furui" | "kusenaoshi" | "kettle" | "tin" | "glass";
export type Grade = "ceremonie" | "quotidien" | "latte";
export type Drink = "pur" | "latte" | "les_deux";
export type Taste = "doux" | "equilibre" | "intense";
export type Experience = "decouverte" | "habitue";
export type Confidence = "high" | "medium" | "low";

export type TasteProfile = {
  cupsPerWeek: number;
  drink: Drink;
  taste: Taste;
  experience: Experience;
  owned: ToolKind[];
  cafePriceCents: number | null;
};

export type RecoItem = { toolKind: ToolKind | null; grade: Grade | null; intensity: number | null };

export type RecoProduct = RecoItem & {
  slug: string;
  category: Category;
  // Pour un kit : ce qu'il contient (ustensiles et matcha).
  contents: RecoItem[];
};

export type Match = { score: number; reasons: string[] };

// Doses de la maison Ippodo (Kyoto) : 2 g pour un matcha pur (usucha), 3 g pour un latte.
export const DOSE_G: Record<Drink, number> = { pur: 2, latte: 3, les_deux: 2.5 };

const GRADE_FIT: Record<Drink, Record<Grade, number>> = {
  pur: { ceremonie: 0, quotidien: -15, latte: -40 },
  latte: { latte: 0, quotidien: -10, ceremonie: -30 },
  les_deux: { quotidien: 0, ceremonie: -12, latte: -12 },
};

const TARGET_INTENSITY: Record<Taste, number> = { doux: 1.5, equilibre: 3, intense: 4.5 };

export const GRADE_LABEL: Record<Grade, string> = { ceremonie: "Cérémonie", quotidien: "Quotidien", latte: "Latte" };
export const DRINK_LABEL: Record<Drink, string> = { pur: "pur, à l’eau", latte: "en latte", les_deux: "pur et en latte" };
export const TASTE_LABEL: Record<Taste, string> = { doux: "doux", equilibre: "équilibré", intense: "intense" };

export const TOOL_LABEL: Record<ToolKind, string> = {
  chawan: "bol",
  chasen: "fouet",
  chashaku: "cuillère",
  furui: "tamis",
  kusenaoshi: "support de fouet",
  kettle: "bouilloire",
  tin: "boîte hermétique",
  glass: "verre à latte",
};

// Sans fouet, cuillère et tamis, pas de matcha. Le bol est indispensable dès qu'on le boit pur.
export function essentials(p: TasteProfile): ToolKind[] {
  const base: ToolKind[] = ["chasen", "chashaku", "furui"];
  return p.drink === "latte" ? base : ["chawan", ...base];
}

const clamp = (n: number) => Math.round(Math.min(100, Math.max(0, n)));

function matchMatcha(item: RecoItem, p: TasteProfile): Match {
  const fit = GRADE_FIT[p.drink][item.grade!];
  const gap = Math.abs(item.intensity! - TARGET_INTENSITY[p.taste]);
  const reasons = [
    `Grade ${GRADE_LABEL[item.grade!]} : ${fit === 0 ? "fait pour" : "pas le plus adapté à"} un matcha ${DRINK_LABEL[p.drink]}.`,
    `Intensité ${item.intensity}/5 pour un goût ${TASTE_LABEL[p.taste]}${gap <= 1 ? " : proche de ce que vous aimez." : "."}`,
  ];
  return { score: clamp(100 + fit - 8 * gap), reasons };
}

function matchTool(kind: ToolKind, p: TasteProfile): Match {
  if (p.owned.includes(kind)) return { score: 20, reasons: [`Vous avez déjà un ${TOOL_LABEL[kind]}.`] };
  if (essentials(p).includes(kind)) return { score: 95, reasons: [`Indispensable, et vous n’en avez pas encore.`] };
  const useful: Partial<Record<ToolKind, number>> = {
    chawan: 75,
    kettle: p.drink === "pur" ? 80 : 65,
    kusenaoshi: 65,
    tin: p.cupsPerWeek >= 7 ? 70 : 55,
    glass: p.drink === "pur" ? 40 : 85,
  };
  const score = useful[kind] ?? 50;
  return { score, reasons: [score >= 70 ? "Utile pour votre façon de boire le matcha." : "Pas indispensable pour votre façon de le boire."] };
}

function matchKit(contents: RecoItem[], p: TasteProfile): Match {
  const kinds = contents.flatMap((c) => (c.toolKind ? [c.toolKind] : []));
  const duplicates = kinds.filter((k) => p.owned.includes(k));
  const missing = essentials(p).filter((k) => !p.owned.includes(k) && !kinds.includes(k));
  const matchas = contents.filter((c) => c.grade).map((c) => matchMatcha(c, p));
  const matchaGap = matchas.length ? matchas.reduce((s, m) => s + (m.score - 100), 0) / matchas.length : 0;
  const extra = kinds.includes("kettle") && p.experience === "decouverte" && p.cupsPerWeek < 7 ? 10 : 0;

  const reasons: string[] = [];
  if (missing.length === 0) reasons.push("Avec ce kit, il ne vous manque rien pour préparer votre matcha.");
  else reasons.push(`Il vous manquera : ${missing.map((k) => TOOL_LABEL[k]).join(", ")}.`);
  if (duplicates.length > 0) reasons.push(`Vous avez déjà : ${duplicates.map((k) => TOOL_LABEL[k]).join(", ")}.`);
  if (matchas[0]) reasons.push(matchas[0].reasons[0]);
  if (extra) reasons.push("La bouilloire est un confort, pas une nécessité pour débuter.");
  return { score: clamp(100 - 15 * duplicates.length - 12 * missing.length + 0.6 * matchaGap - extra), reasons };
}

export function match(product: RecoProduct, p: TasteProfile): Match {
  if (product.category === "matcha") return matchMatcha(product, p);
  if (product.category === "tool") return matchTool(product.toolKind!, p);
  return matchKit(product.contents, p);
}

export type Ranked<T> = { product: T; match: Match };

export type BestPick<T> = { best: Ranked<T>; alternative: Ranked<T> | null; confidence: Confidence };

function confidenceOf(gap: number): Confidence {
  if (gap >= 15) return "high";
  if (gap >= 6) return "medium";
  return "low";
}

// Le meilleur choix d'une catégorie, et la confiance qu'on peut lui accorder :
// plus l'écart avec le second est faible, plus le choix est serré.
export function pickBest<T extends RecoProduct>(products: T[], p: TasteProfile): BestPick<T> | null {
  const ranked = products.map((product) => ({ product, match: match(product, p) })).sort((a, b) => b.match.score - a.match.score);
  if (ranked.length === 0) return null;
  const [best, second] = ranked;
  const gap = second ? best.match.score - second.match.score : 100;
  const confidence = confidenceOf(gap);
  return { best, alternative: confidence === "high" ? null : (second ?? null), confidence };
}

// --- Consommation et économie ---------------------------------------------------

export const cupsPerTin = (grams: number, drink: Drink) => Math.floor(grams / DOSE_G[drink]);

// Combien de semaines dure une boîte au rythme du client, arrondi à la demi-semaine.
export const weeksOfUse = (grams: number, p: TasteProfile) => Math.round((2 * grams) / (p.cupsPerWeek * DOSE_G[p.drink])) / 2;

export const costPerCupCents = (priceCents: number, grams: number, drink: Drink) => Math.round(priceCents / (grams / DOSE_G[drink]));

const WEEKS_PER_MONTH = 52 / 12;

// Économie sur le matcha seul, lait non compté. Null si le client n'a pas donné le prix de son café.
export function monthlySavingsCents(p: TasteProfile, homeCupCents: number): number | null {
  if (p.cafePriceCents == null) return null;
  return Math.round((p.cafePriceCents - homeCupCents) * p.cupsPerWeek * WEEKS_PER_MONTH);
}

// Nombre de tasses à partir duquel le kit est remboursé par rapport au coffee shop.
export function paybackCups(kitPriceCents: number, p: TasteProfile, homeCupCents: number): number | null {
  if (p.cafePriceCents == null || p.cafePriceCents <= homeCupCents) return null;
  return Math.ceil(kitPriceCents / (p.cafePriceCents - homeCupCents));
}

// Format conseillé : la grande boîte quand la petite ne tient pas trois semaines.
export function suggestFormat<V extends { matchaGrams: number | null; stock: number }>(variants: V[], p: TasteProfile): V | null {
  const inStock = variants.filter((v) => v.stock > 0 && v.matchaGrams != null).sort((a, b) => a.matchaGrams! - b.matchaGrams!);
  if (inStock.length === 0) return null;
  return inStock.find((v) => weeksOfUse(v.matchaGrams!, p) >= 3) ?? inStock.at(-1)!;
}
