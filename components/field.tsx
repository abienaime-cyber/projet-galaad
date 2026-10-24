import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  unit?: string;
  hint?: string;
  error?: string;
};

// Champ souligné à libellé flottant : le libellé monte quand on saisit, la ligne s'épaissit au focus.
export function Field({ name, label, unit, hint, error, className, ...input }: FieldProps) {
  const describedBy = [hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <div className="relative">
        <input
          id={name}
          name={name}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`peer h-14 w-full border-b pt-[18px] text-[17px] text-label transition-[border-color] duration-150 ease-[ease] focus:border-label focus:shadow-[0_1px_0_var(--color-label)] focus:outline-none ${
            error ? "border-danger" : "border-control"
          } ${unit ? "pr-10" : ""}`}
          {...input}
        />
        <label
          htmlFor={name}
          className="pointer-events-none absolute top-7 left-0 origin-left -translate-y-1/2 text-[17px] leading-none text-label-2 transition-[translate,scale] duration-150 ease-out motion-reduce:transition-none peer-focus:-translate-y-[calc(50%+10px)] peer-focus:scale-[0.7] peer-[:not(:placeholder-shown)]:-translate-y-[calc(50%+10px)] peer-[:not(:placeholder-shown)]:scale-[0.7]"
        >
          {label}
        </label>
        {unit && (
          <span aria-hidden className="pointer-events-none absolute right-0 bottom-[9px] text-[17px] text-label-2">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-2 flex items-start gap-1.5 text-xs text-danger">
          <svg aria-hidden viewBox="0 0 16 16" className="mt-px size-3.5 shrink-0">
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8 4.5v4.5M8 11.2v.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
      {hint && (
        <p id={`${name}-hint`} className="mt-2 text-xs text-label-2">
          {hint}
        </p>
      )}
    </div>
  );
}

// Boutons rectangulaires en capitales espacées : noir plein pour l'action principale, filet noir pour la secondaire.
export const primaryButton =
  "eyebrow inline-flex h-12 cursor-pointer items-center justify-center gap-2 bg-accent px-8 text-on-accent transition-[background-color,transform] duration-150 ease-out hover:bg-accent-hover active:scale-[0.98] disabled:cursor-default disabled:opacity-50 disabled:active:scale-100";

export const secondaryButton =
  "eyebrow inline-flex h-12 cursor-pointer items-center justify-center gap-2 px-7 text-label shadow-[inset_0_0_0_1px_var(--color-label)] transition-[background-color,color,transform] duration-150 ease-out hover:bg-accent hover:text-on-accent active:scale-[0.98] disabled:cursor-default";

// Lien de texte en capitales, souligné : « Tout voir », « Modifier ».
export const textLink =
  "eyebrow inline-flex min-h-11 items-center gap-2 text-label underline decoration-label/40 underline-offset-[6px] transition-colors duration-150 hover:decoration-label";
