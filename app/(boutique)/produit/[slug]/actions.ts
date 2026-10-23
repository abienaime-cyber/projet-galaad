"use server";

import { refresh } from "next/cache";
import { AI_ERROR_MESSAGE, AI_QUOTA_MESSAGE, AiError, adviseSize } from "@/lib/ai";
import { getProduct, getProducts, getShopper } from "@/lib/catalog";
import { requireUser } from "@/lib/commerce";
import { createClient } from "@/lib/supabase/server";
import { fitAll, FIT_LABEL, forMe, price } from "@/lib/shop";
import { parseForm, reviewSchema, type FieldErrors } from "@/lib/validation";

export type Outfit = { title: string; why: string; items: { slug: string; name: string; image: string | null; price: string }[] };
export type AdviceState = { explanation?: string; outfits?: Outfit[]; error?: string };

export async function askAdvisor(_prev: AdviceState, formData: FormData): Promise<AdviceState> {
  const slug = String(formData.get("slug") ?? "");
  const [product, products, { measurements }] = await Promise.all([getProduct(slug), getProducts(), getShopper()]);
  if (!product) return { error: "Article introuvable." };
  if (!measurements) return { error: "Saisissez d’abord vos mensurations : le conseiller explique votre taille calculée." };

  // La taille vient du calcul déterministe, jamais de l'IA.
  const [{ rec }] = fitAll([product], measurements);
  if (!rec?.size) return { error: "Vos mensurations sortent du tableau de tailles de cet article." };

  // Le conseiller ne pioche que dans les articles en stock dans la taille du client.
  const available = forMe(fitAll(products, measurements), measurements.preferredFit);
  const bySlug = new Map(available.map((f) => [f.product.slug, f]));
  bySlug.set(product.slug, { product, rec, inStock: true });

  const { data: allowed } = await (await createClient()).rpc("consume_ai_quota");
  if (!allowed) return { error: AI_QUOTA_MESSAGE };

  try {
    const advice = await adviseSize({
      product: { slug, name: product.name, category: product.category, fit: FIT_LABEL[product.fit], color: product.color, material: product.material },
      sizing: { ...rec, size: rec.size },
      measurements,
      candidates: [...bySlug.values()].slice(0, 30).map((f) => ({
        slug: f.product.slug,
        name: f.product.name,
        category: f.product.category,
        color: f.product.color,
        size: f.rec!.size!,
      })),
    });
    // Un slug inventé est écarté : seules les fiches réelles s'affichent.
    const outfits = advice.outfits
      .map((o) => ({
        title: o.title,
        why: o.why,
        items: o.slugs.flatMap((s) => {
          const f = bySlug.get(s);
          return f ? [{ slug: s, name: f.product.name, image: f.product.image, price: price(f.product.priceCents) }] : [];
        }),
      }))
      .filter((o) => o.items.length > 0)
      .slice(0, 3);
    return { explanation: advice.explanation, outfits };
  } catch (error) {
    return { error: AI_ERROR_MESSAGE[error instanceof AiError ? error.kind : "failed"] };
  }
}

export type ReviewState = { errors?: FieldErrors; error?: string; done?: boolean };

export async function addReview(_prev: ReviewState, formData: FormData): Promise<ReviewState> {
  const parsed = parseForm(reviewSchema, formData, { productId: "product_id", rating: "rating", fitFeedback: "fit_feedback", comment: "comment" });
  if (parsed.errors) return { errors: parsed.errors };
  const { supabase, user } = await requireUser(`/produit/${formData.get("slug")}`);
  const { productId, rating, fitFeedback, comment } = parsed.data;
  const { error } = await supabase.from("reviews").insert({ product_id: productId, user_id: user.id, rating, fit_feedback: fitFeedback, comment });
  // 42501 : la RLS refuse l'avis d'un non-acheteur. 23505 : un avis existe déjà.
  if (error) return { error: error.code === "23505" ? "Vous avez déjà donné votre avis sur cet article." : "Seuls les clients qui ont acheté cet article peuvent le noter." };
  refresh();
  return { done: true };
}
