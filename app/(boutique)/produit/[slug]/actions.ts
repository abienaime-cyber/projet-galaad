"use server";

import { refresh } from "next/cache";
import { AI_ERROR_MESSAGE, AI_QUOTA_MESSAGE, AiError, adviseMatcha } from "@/lib/ai";
import { getProduct, getProducts, getShopper } from "@/lib/catalog";
import { requireUser } from "@/lib/commerce";
import { GRADE_LABEL, match, TOOL_LABEL } from "@/lib/reco";
import { createClient } from "@/lib/supabase/server";
import { forMe, minPrice, price, rateAll, variantFigures, type CatalogProduct } from "@/lib/shop";
import { parseForm, reviewSchema, type FieldErrors } from "@/lib/validation";

export type Ritual = { title: string; why: string; items: { slug: string; name: string; image: string | null; price: string }[] };
export type AdviceState = { explanation?: string; rituals?: Ritual[]; error?: string };

function detailsOf(product: CatalogProduct) {
  if (product.grade) return `grade ${GRADE_LABEL[product.grade]}, intensité ${product.intensity}/5`;
  if (product.toolKind) return TOOL_LABEL[product.toolKind];
  return product.contents.map((c) => c.name).join(", ");
}

export async function askAdvisor(_prev: AdviceState, formData: FormData): Promise<AdviceState> {
  const slug = String(formData.get("slug") ?? "");
  const [product, products, { profile }] = await Promise.all([getProduct(slug), getProducts(), getShopper()]);
  if (!product) return { error: "Article introuvable." };
  if (!profile) return { error: "Remplissez d’abord votre profil de goût : le conseiller explique le calcul fait à partir de lui." };

  // Le score vient du calcul déterministe, jamais de l'IA.
  const result = match(product, profile);
  // Le conseiller ne pioche que dans ce qui convient au client et reste en stock.
  const available = forMe(rateAll(products, profile));
  const bySlug = new Map(available.map((r) => [r.product.slug, r.product]));
  bySlug.set(product.slug, product);

  const { data: allowed } = await (await createClient()).rpc("consume_ai_quota");
  if (!allowed) return { error: AI_QUOTA_MESSAGE };

  try {
    const advice = await adviseMatcha({
      product: {
        slug,
        name: product.name,
        category: product.category,
        details: detailsOf(product),
      },
      match: result,
      profile,
      figures: product.variants.flatMap((v) => variantFigures(product, v, profile).map((f) => `${v.label} — ${f.label} : ${f.value}`)),
      candidates: [...bySlug.values()].slice(0, 30).map((p) => ({ slug: p.slug, name: p.name, category: p.category })),
    });
    // Un slug inventé est écarté : seules les fiches réelles s'affichent.
    const rituals = advice.rituals
      .map((r) => ({
        title: r.title,
        why: r.why,
        items: r.slugs.flatMap((s) => {
          const p = bySlug.get(s);
          return p ? [{ slug: s, name: p.name, image: p.image, price: price(minPrice(p)) }] : [];
        }),
      }))
      .filter((r) => r.items.length > 0)
      .slice(0, 2);
    return { explanation: advice.explanation, rituals };
  } catch (error) {
    return { error: AI_ERROR_MESSAGE[error instanceof AiError ? error.kind : "failed"] };
  }
}

export type ReviewState = { errors?: FieldErrors; error?: string; done?: boolean };

export async function addReview(_prev: ReviewState, formData: FormData): Promise<ReviewState> {
  const parsed = parseForm(reviewSchema, formData, { productId: "product_id", rating: "rating", comment: "comment" });
  if (parsed.errors) return { errors: parsed.errors };
  const { supabase, user } = await requireUser(`/produit/${formData.get("slug")}`);
  const { productId, rating, comment } = parsed.data;
  const { error } = await supabase.from("reviews").insert({ product_id: productId, user_id: user.id, rating, comment });
  // 42501 : la RLS refuse l'avis d'un non-acheteur. 23505 : un avis existe déjà.
  if (error) return { error: error.code === "23505" ? "Vous avez déjà donné votre avis sur cet article." : "Seuls les clients qui ont acheté cet article peuvent le noter." };
  refresh();
  return { done: true };
}
