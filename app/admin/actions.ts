"use server";

import { updateTag } from "next/cache";
import { AI_ERROR_MESSAGE, AI_QUOTA_MESSAGE, AiError, writeProductCopy } from "@/lib/ai";
import { CATALOG_TAG } from "@/lib/catalog";
import { requireAdmin } from "@/lib/commerce";
import { GRADE_LABEL, TOOL_LABEL, type Grade, type ToolKind } from "@/lib/reco";
import { parseForm, productCopySchema } from "@/lib/validation";

export type CopyState = { draft?: string; error?: string; saved?: boolean };

// Propose un texte ; rien n'est publié tant que l'admin n'a pas relu et cliqué sur « Publier ».
export async function generateCopy(_prev: CopyState, formData: FormData): Promise<CopyState> {
  const { supabase } = await requireAdmin();
  const { data: p } = await supabase
    .from("products")
    .select("name, category, tool_kind, grade, intensity, material, description")
    .eq("id", String(formData.get("product_id") ?? ""))
    .maybeSingle();
  if (!p) return { error: "Produit introuvable." };
  const { data: allowed } = await supabase.rpc("consume_ai_quota");
  if (!allowed) return { error: AI_QUOTA_MESSAGE };
  try {
    const { description } = await writeProductCopy({
      name: p.name,
      category: { kit: "kit", matcha: "matcha", tool: "ustensile" }[p.category as "kit" | "matcha" | "tool"],
      details: p.grade ? `grade ${GRADE_LABEL[p.grade as Grade]}, intensité ${p.intensity}/5` : p.tool_kind ? TOOL_LABEL[p.tool_kind as ToolKind] : "",
      material: p.material,
      currentDescription: p.description,
      notes: String(formData.get("notes") ?? "").slice(0, 500),
    });
    return { draft: description };
  } catch (error) {
    return { error: AI_ERROR_MESSAGE[error instanceof AiError ? error.kind : "failed"] };
  }
}

export async function publishCopy(_prev: CopyState, formData: FormData): Promise<CopyState> {
  const parsed = parseForm(productCopySchema, formData, { productId: "product_id", description: "description" });
  if (parsed.errors) return { error: Object.values(parsed.errors)[0] };
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").update({ description: parsed.data.description }).eq("id", parsed.data.productId);
  if (error) return { error: "La publication a échoué." };
  updateTag(CATALOG_TAG);
  return { saved: true };
}
