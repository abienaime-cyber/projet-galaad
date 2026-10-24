import { WarningCircle } from "@phosphor-icons/react/ssr";
import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  unit?: string;
  hint?: string;
  error?: string;
};

// Champ du MASTER : bordure 1 px, rayon 8 px, texte 16 px, anneau de 3 px au focus.
export const inputClass =
  "w-full rounded-lg border border-input bg-card px-4 py-3 text-[16px] text-foreground transition-[border-color,box-shadow] duration-200 focus:border-ring focus:shadow-[0_0_0_3px_rgb(28_25_23/0.13)] focus:outline-none aria-[invalid=true]:border-destructive";

// Libellé toujours visible au-dessus du champ, aide et erreur juste en dessous.
export function Field({ name, label, unit, hint, error, className, ...input }: FieldProps) {
  const describedBy = [hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block text-[14px] font-medium text-foreground">
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
          <span aria-hidden className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[15px] text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-2 flex items-start gap-1.5 text-[13px] text-destructive">
          <WarningCircle aria-hidden size={16} className="mt-px shrink-0" />
          {error}
        </p>
      )}
      {hint && (
        <p id={`${name}-hint`} className="mt-2 text-[13px] text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

// Boutons du MASTER : action principale or (#A16207), secondaire au filet de 2 px, rayon 8 px, 600.
const button =
  "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg px-6 text-[15px] font-semibold transition-[background-color,color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px active:translate-y-0 disabled:cursor-default disabled:opacity-50 disabled:hover:translate-y-0";

export const primaryButton = `${button} bg-accent text-on-accent shadow-sm hover:bg-accent-hover hover:shadow-md`;

export const secondaryButton = `${button} text-primary shadow-[inset_0_0_0_2px_var(--color-primary)] hover:bg-primary hover:text-on-primary`;

// Lien de texte souligné : « Tout voir », « Modifier ».
export const textLink =
  "inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-foreground underline decoration-foreground/30 underline-offset-[6px] transition-colors duration-200 hover:decoration-foreground";
