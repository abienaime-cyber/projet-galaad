"use client";

import { useActionState, useState } from "react";
import { inputClass, primaryButton, secondaryButton } from "@/components/field";
import { Spinner } from "@/components/spinner";
import { generateCopy, publishCopy, type CopyState } from "../../actions";

export function CopyEditor({ productId, current }: { productId: string; current: string }) {
  const [text, setText] = useState(current);
  const [draft, draftAction, generating] = useActionState<CopyState, FormData>(async (prev, data) => {
    const next = await generateCopy(prev, data);
    if (next.draft) setText(next.draft);
    return next;
  }, {});
  const [published, publishAction, publishing] = useActionState<CopyState, FormData>(publishCopy, {});

  return (
    <div className="mt-8 grid gap-8">
      <form action={draftAction} className="grid gap-4 rounded-xl bg-muted p-5">
        <input type="hidden" name="product_id" value={productId} />
        <label className="grid gap-2 text-sm font-medium">
          Notes pour l’IA (facultatif) : occasion, détail de coupe, ton
          <input name="notes" maxLength={500} className={`${inputClass} h-12 py-0`} placeholder="Ex. : mariage d’été, veste déstructurée" />
        </label>
        <button
          type="submit"
          disabled={generating}
          className={`${secondaryButton} justify-self-start`}
        >
          {generating && <Spinner />}
          {generating ? "Rédaction…" : "Proposer une description"}
        </button>
        {draft.error && (
          <p role="alert" className="text-sm text-destructive">
            {draft.error}
          </p>
        )}
        {draft.draft && <p className="text-sm text-muted-foreground">Proposition insérée ci-dessous. Relisez-la avant de publier.</p>}
      </form>

      <form action={publishAction} className="grid gap-3">
        <input type="hidden" name="product_id" value={productId} />
        <label className="grid gap-2 text-sm font-medium">
          Description publiée sur la fiche
          <textarea name="description" rows={6} maxLength={1200} value={text} onChange={(e) => setText(e.target.value)} className={inputClass} />
        </label>
        <p className="text-xs text-muted-foreground tabular-nums">{text.length} / 1200 caractères</p>
        {published.error && (
          <p role="alert" className="text-sm text-destructive">
            {published.error}
          </p>
        )}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={publishing || text.trim() === current.trim()} className={primaryButton}>
            {publishing ? "Publication…" : "Publier"}
          </button>
          {published.saved && <p className="text-sm font-semibold text-success">Description publiée.</p>}
        </div>
      </form>
    </div>
  );
}
