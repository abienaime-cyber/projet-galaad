import { z } from "zod";

// Validation côté serveur de tout ce qui arrive d'un formulaire. Bornes identiques aux CHECK de la base.

const text = (label: string, max: number) =>
  z.string().trim().min(1, `Indiquez ${label}.`).max(max, `${max} caractères au maximum.`);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `${max} caractères au maximum.`)
    .transform((v) => v || null);

const quantity = z.coerce.number().int().min(1, "Quantité minimale : 1.").max(10, "Quantité maximale : 10.");

export const cartLineSchema = z.object({
  variantId: z.uuid("Choisissez une taille."),
  quantity,
});

export const addressSchema = z.object({
  recipient: text("le nom du destinataire", 120),
  line1: text("l’adresse", 200),
  line2: optionalText(200),
  postalCode: z.string().trim().regex(/^[0-9A-Za-z -]{3,10}$/, "Indiquez un code postal valide."),
  city: text("la ville", 100),
});

export const RETURN_REASONS = {
  too_small: "Trop petit",
  too_large: "Trop grand",
  not_as_described: "Différent de la description",
  damaged: "Article abîmé",
  changed_mind: "Je ne le veux plus",
} as const;

export const returnSchema = z.object({
  orderItemId: z.uuid(),
  reason: z.enum(Object.keys(RETURN_REASONS) as [keyof typeof RETURN_REASONS], "Choisissez un motif."),
  comment: optionalText(500),
});

export const FIT_FEEDBACK = { small: "Taille petit", true_to_size: "Taille normalement", large: "Taille grand" } as const;

export const reviewSchema = z.object({
  productId: z.uuid(),
  rating: z.coerce.number().int().min(1, "Choisissez une note de 1 à 5.").max(5, "Choisissez une note de 1 à 5."),
  fitFeedback: z
    .enum(Object.keys(FIT_FEEDBACK) as [keyof typeof FIT_FEEDBACK])
    .or(z.literal("").transform(() => null)),
  comment: optionalText(1000),
});

export const productCopySchema = z.object({
  productId: z.uuid(),
  description: text("une description", 1200),
});

export type FieldErrors = Record<string, string>;

// Lit un FormData avec un schéma : données propres, ou un message par champ.
export function parseForm<T extends z.ZodType>(schema: T, formData: FormData, fields: Record<string, string>) {
  const raw = Object.fromEntries(Object.entries(fields).map(([key, name]) => [key, String(formData.get(name) ?? "")]));
  const result = schema.safeParse(raw);
  if (result.success) return { data: result.data as z.infer<T> };
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0]);
    errors[fields[key] ?? key] ??= issue.message;
  }
  return { errors };
}
