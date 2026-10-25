import { WarningCircle } from "@phosphor-icons/react/ssr";
import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  unit?: string;
  hint?: string;
  error?: string;
};

// Champ carré, filet 1 px, fond papier ; le focus ajoute un anneau vert.
export const inputClass =
  "w-full rounded-none border border-ink/45 bg-paper px-4 py-3 text-[17px] text-ink transition-[border-color,box-shadow] duration-200 focus:border-ink focus:shadow-[0_0_0_3px_var(--color-matcha)] focus:outline-none aria-[invalid=true]:border-danger";

// Libellé toujours visible au-dessus du champ, aide et erreur juste en dessous.
export function Field({ name, label, unit, hint, error, className, ...input }: FieldProps) {
  const describedBy = [hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-[15px] font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${inputClass} h-12 ${unit ? "pr-12" : ""}`}
          {...input}
        />
        {unit && (
          <span aria-hidden className="mono pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-fog">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-2 flex items-start gap-1.5 text-[14px] text-danger">
          <WarningCircle aria-hidden size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
      {hint && (
        <p id={`${name}-hint`} className="mt-2 text-[14px] text-fog">
          {hint}
        </p>
      )}
    </div>
  );
}

// Boutons : capitales condensées, angles droits. Le vert est réservé à l'action principale.
const button =
  "inline-flex h-13 cursor-pointer items-center justify-center gap-3 px-6 font-display text-[19px] font-bold tracking-[0.02em] uppercase transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.98] disabled:cursor-default disabled:opacity-45 disabled:active:scale-100";

export const primaryButton = `${button} bg-matcha text-ink hover:bg-matcha-hover`;

// Sur fond clair : filet noir, se remplit au survol.
export const secondaryButton = `${button} text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)] hover:bg-ink hover:text-paper`;

// Sur fond noir : filet blanc.
export const ghostButton = `${button} text-paper shadow-[inset_0_0_0_1.5px_rgb(255_255_255/0.7)] hover:bg-paper hover:text-ink`;

// Lien de texte souligné : « Tout voir », « Modifier ».
export const textLink =
  "inline-flex min-h-11 items-center gap-2 text-[16px] font-medium underline decoration-current/35 underline-offset-[6px] transition-colors duration-200 hover:decoration-current";
