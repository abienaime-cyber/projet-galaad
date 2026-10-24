"use client";

import { useActionState, useState } from "react";
import { primaryButton, secondaryButton } from "@/components/field";
import { Spinner } from "@/components/spinner";
import { generateCopy, publishCopy, type CopyState } from "../../actions";

const fieldClass =
  "w-full border border-control bg-field p-3 text-[17px] focus:border-label focus:shadow-[0_0_0_1px_var(--color-label)] focus:outline-none";

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
      <form action={draftAction} className="grid gap-3 bg-tile p-5">
        <input type="hidden" name="product_id" value={productId} />
        <label className="grid gap-1.5 text-sm">
          Notes pour l’IA (facultatif) : occasion, détail de coupe, ton
          <input name="notes" maxLength={500} className={`${fieldClass} h-11 py-0`} placeholder="Ex. : mariage d’été, veste déstructurée" />
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
          <p role="alert" className="text-sm text-danger">
            {draft.error}
          </p>
        )}
        {draft.draft && <p className="text-sm text-label-2">Proposition insérée ci-dessous. Relisez-la avant de publier.</p>}
      </form>

      <form action={publishAction} className="grid gap-3">
        <input type="hidden" name="product_id" value={productId} />
        <label className="grid gap-1.5 text-sm">
          Description publiée sur la fiche
          <textarea name="description" rows={6} maxLength={1200} value={text} onChange={(e) => setText(e.target.value)} className={fieldClass} />
        </label>
        <p className="text-xs text-label-2 tabular-nums">{text.length} / 1200 caractères</p>
        {published.error && (
          <p role="alert" className="text-sm text-danger">
            {published.error}
          </p>
        )}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={publishing || text.trim() === current.trim()} className={primaryButton}>
            {publishing ? "Publication…" : "Publier"}
          </button>
          {published.saved && <p className="text-sm text-ok">Description publiée.</p>}
        </div>
      </form>
    </div>
  );
}
