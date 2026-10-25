import { describe, expect, it } from "vitest";
import { addressSchema, cartLineSchema, parseForm, returnSchema, reviewSchema } from "./validation";

const form = (entries: Record<string, string>) => {
  const data = new FormData();
  for (const [k, v] of Object.entries(entries)) data.set(k, v);
  return data;
};

const UUID = "3f1c2b7e-8d4a-4c1e-9f2a-1b2c3d4e5f60";

describe("parseForm", () => {
  it("accepte une adresse valide et met à null le complément vide", () => {
    const result = parseForm(
      addressSchema,
      form({ recipient: " Jean Dupont ", line1: "1 rue de la Paix", line2: "", postal_code: "75002", city: "Paris" }),
      { recipient: "recipient", line1: "line1", line2: "line2", postalCode: "postal_code", city: "city" },
    );
    expect(result.data).toEqual({ recipient: "Jean Dupont", line1: "1 rue de la Paix", line2: null, postalCode: "75002", city: "Paris" });
  });

  it("renvoie un message par champ, sous le nom du champ du formulaire", () => {
    const result = parseForm(addressSchema, form({ recipient: "", line1: "x", postal_code: "!", city: "Paris" }), {
      recipient: "recipient",
      line1: "line1",
      line2: "line2",
      postalCode: "postal_code",
      city: "city",
    });
    expect(result.errors).toMatchObject({ recipient: "Indiquez le nom du destinataire.", postal_code: "Indiquez un code postal valide." });
  });
});

describe("schémas", () => {
  it("borne la quantité du panier entre 1 et 10", () => {
    expect(cartLineSchema.safeParse({ variantId: UUID, quantity: "3" }).success).toBe(true);
    expect(cartLineSchema.safeParse({ variantId: UUID, quantity: "11" }).success).toBe(false);
    expect(cartLineSchema.safeParse({ variantId: "pas-un-uuid", quantity: "1" }).success).toBe(false);
  });

  it("refuse un motif de retour inconnu", () => {
    expect(returnSchema.safeParse({ orderItemId: UUID, reason: "taste", comment: "" }).success).toBe(true);
    expect(returnSchema.safeParse({ orderItemId: UUID, reason: "autre", comment: "" }).success).toBe(false);
  });

  it("accepte un avis sans commentaire, refuse une note de 6", () => {
    expect(reviewSchema.parse({ productId: UUID, rating: "4", comment: "" }).comment).toBeNull();
    expect(reviewSchema.safeParse({ productId: UUID, rating: "6", comment: "" }).success).toBe(false);
  });
});
