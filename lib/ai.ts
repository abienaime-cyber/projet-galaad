import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import type { Measurements } from "./sizing";

// Appels IA : uniquement côté serveur (actions serveur), la clé ne quitte jamais le serveur.
// L'IA n'a jamais le dernier mot sur une taille : elle reçoit le résultat du calcul et l'explique.

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
  failed: "Le conseiller est indisponible pour le moment. Votre taille calculée reste valable.",
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
  "Tu écris pour Carrure, boutique en ligne de chemises et de costumes pour homme. Ton : celui d'un tailleur. Vouvoiement, phrases courtes, précis, poli, sans superlatifs ni familiarité. Tu écris en français.";

// --- Conseiller taille et style ------------------------------------------------

const AdviceSchema = z.object({
  explanation: z.string().describe("2 à 4 phrases qui expliquent la taille calculée à partir des faits fournis."),
  outfits: z
    .array(
      z.object({
        title: z.string().describe("Nom court de la tenue, 2 à 5 mots."),
        slugs: z.array(z.string()).describe("Slugs exacts, pris dans la liste des articles disponibles."),
        why: z.string().describe("Une phrase : l'occasion et pourquoi ces pièces vont ensemble."),
      }),
    )
    .describe("1 à 3 tenues."),
});

export type AdviceInput = {
  product: { slug: string; name: string; category: string; fit: string; color: string; material: string };
  // Résultat de recommendSize() : estimated vaut vrai quand un tour a été déduit de la taille et du poids.
  sizing: { size: string; alternative: string | null; confidence: string; estimated: boolean; chestCm: number; waistCm: number };
  measurements: Measurements;
  candidates: { slug: string; name: string; category: string; color: string; size: string }[];
};

export function adviseSize(input: AdviceInput) {
  const system = `${VOICE}
Ton rôle : expliquer au client la taille que notre calcul a déjà choisie, puis proposer des tenues.
Règles :
- La taille est calculée par un algorithme déterministe. Tu ne la recalcules pas, tu ne la contestes pas, tu n'en proposes pas d'autre. Tu l'expliques avec les chiffres fournis.
- Si les tours sont estimés (estimated vrai), dis-le, et suggère de le mesurer pour un résultat plus sûr.
- Le niveau de confiance et la taille voisine, s'il y en a une, doivent apparaître dans l'explication.
- Tenues : uniquement des articles de la liste "candidates", par leur slug exact, en incluant l'article consulté. N'invente aucun article, aucune matière, aucun chiffre.`;
  return ask(AdviceSchema, system, JSON.stringify(input));
}

// --- Fiche produit (admin) -------------------------------------------------------

const CopySchema = z.object({
  description: z.string().describe("Description de 2 ou 3 phrases, 380 caractères au maximum."),
});

export type CopyInput = { name: string; category: string; fit: string; color: string; material: string; currentDescription: string; notes: string };

export function writeProductCopy(input: CopyInput) {
  const system = `${VOICE}
Ton rôle : rédiger la description d'une fiche produit, qu'un administrateur relira avant publication.
Règles :
- 2 ou 3 phrases, 380 caractères au maximum : la matière, la coupe, l'occasion.
- N'utilise que les faits fournis (nom, catégorie, coupe, couleur, matière, notes de l'administrateur). N'invente ni provenance, ni label, ni grammage, ni promesse d'entretien.
- Pas de superlatifs, pas de point d'exclamation.`;
  return ask(CopySchema, system, JSON.stringify(input));
}
