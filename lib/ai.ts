import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import type { TasteProfile } from "./reco";

// Appels IA : uniquement côté serveur (actions serveur), la clé ne quitte jamais le serveur.
// L'IA n'a jamais le dernier mot sur une recommandation : elle reçoit le résultat du calcul et l'explique.

const MODEL = "claude-opus-5-5";
const TIMEOUT_MS = 25_000;

export type AiErrorKind = "not_configured" | "timeout" | "rate_limited" | "refused" | "failed";

export class AiError extends Error {
  constructor(readonly kind: AiErrorKind) {
    super(kind);
  }
}

export const AI_QUOTA_MESSAGE = "Vous avez atteint la limite de 20 demandes par heure. Réessayez plus tard.";

export const AI_ERROR_MESSAGE: Record<AiErrorKind, string> = {
  not_configured: "Le conseiller n’est pas activé sur ce site : la clé ANTHROPIC_API_KEY manque côté serveur.",
  timeout: "Le conseiller a mis trop de temps à répondre. Réessayez dans un instant.",
  rate_limited: "Le conseiller reçoit trop de demandes en ce moment. Réessayez dans une minute.",
  refused: "Le conseiller n’a pas pu répondre à cette demande.",
  failed: "Le conseiller est indisponible pour le moment. Le calcul affiché reste valable.",
};

let client: Anthropic | null = null;

async function ask<T extends z.ZodType>(schema: T, system: string, prompt: string): Promise<z.infer<T>> {
  if (!process.env.ANTHROPIC_API_KEY) throw new AiError("not_configured");
  client ??= new Anthropic({ timeout: TIMEOUT_MS, maxRetries: 1 });
  try {
    const response = await client.beta.messages.parse({
      model: MODEL,
      max_tokens: 4000,
      // Si le modèle décline, l'API rejoue la demande sur le modèle de repli recommandé.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system,
      messages: [{ role: "user", content: prompt }],
      output_config: { effort: "low", format: betaZodOutputFormat(schema) },
    });
    if (response.stop_reason === "refusal") throw new AiError("refused");
    if (!response.parsed_output) throw new AiError("failed");
    return response.parsed_output;
  } catch (error) {
    if (error instanceof AiError) throw error;
    if (error instanceof Anthropic.APIConnectionTimeoutError) throw new AiError("timeout");
    if (error instanceof Anthropic.RateLimitError) throw new AiError("rate_limited");
    console.error("Appel IA en échec", error);
    throw new AiError("failed");
  }
}

const VOICE =
  "Tu écris pour Contrebande, boutique en ligne de kits pour préparer le matcha chez soi. Ton : direct et sobre, celui d'un bon caviste. Vouvoiement, phrases courtes, précis, sans superlatifs, sans familiarité, sans promesse de santé. Tu écris en français.";

// Faits de préparation, sourcés : méthode de la maison Ippodo (Kyoto).
const PREPARATION_FACTS = "Matcha pur : 2 g de matcha tamisé, 60 ml d'eau à 80 °C, fouetter 15 secondes en M. Latte : 3 g de matcha, 100 ml d'eau à 80 °C, fouetter, puis 100 ml de lait chaud ou moussé.";

// --- Conseiller matcha ------------------------------------------------------------

const AdviceSchema = z.object({
  explanation: z.string().describe("2 à 4 phrases qui expliquent le score et les raisons fournies, à partir des seuls faits donnés."),
  rituals: z
    .array(
      z.object({
        title: z.string().describe("Nom court du rituel, 2 à 5 mots (ex. : « Le latte du matin »)."),
        slugs: z.array(z.string()).describe("Slugs exacts, pris dans la liste des articles disponibles."),
        why: z.string().describe("Une phrase : quand et comment ces pièces servent ensemble."),
      }),
    )
    .describe("1 ou 2 rituels."),
});

export type AdviceInput = {
  product: { slug: string; name: string; category: string; details: string };
  // Résultat de match() : le score et ses raisons viennent du calcul, pas de l'IA.
  match: { score: number; reasons: string[] };
  profile: TasteProfile;
  // Chiffres calculés : durée d'une boîte, prix de revient d'une tasse, économie mensuelle.
  figures: string[];
  candidates: { slug: string; name: string; category: string }[];
};

export function adviseMatcha(input: AdviceInput) {
  const system = `${VOICE}
Ton rôle : expliquer au client pourquoi notre calcul lui conseille (ou non) cet article, puis proposer des rituels.
Règles :
- Le score et les raisons viennent d'un algorithme déterministe. Tu ne les recalcules pas, tu ne les contestes pas. Tu les expliques avec les faits fournis.
- Tu peux citer les chiffres de "figures" tels quels. N'en invente aucun autre.
- Pour la préparation, n'utilise que ces faits : ${PREPARATION_FACTS}
- Rituels : uniquement des articles de la liste "candidates", par leur slug exact, en incluant l'article consulté. N'invente aucun article, aucune origine, aucun bienfait.`;
  return ask(AdviceSchema, system, JSON.stringify(input));
}

// --- Fiche produit (admin) -------------------------------------------------------

const CopySchema = z.object({
  description: z.string().describe("Description de 2 ou 3 phrases, 380 caractères au maximum."),
});

export type CopyInput = { name: string; category: string; details: string; material: string; currentDescription: string; notes: string };

export function writeProductCopy(input: CopyInput) {
  const system = `${VOICE}
Ton rôle : rédiger la description d'une fiche produit, qu'un administrateur relira avant publication.
Règles :
- 2 ou 3 phrases, 380 caractères au maximum : à quoi sert l'article, comment on s'en sert, pour qui.
- N'utilise que les faits fournis (nom, catégorie, détails, matière, notes de l'administrateur). N'invente ni provenance, ni récolte, ni label, ni bienfait pour la santé.
- Pas de superlatifs, pas de point d'exclamation.`;
  return ask(CopySchema, system, JSON.stringify(input));
}
