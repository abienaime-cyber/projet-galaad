import type { Fit } from "./sizing";

export type MeasurementsInput = {
  heightCm: number;
  weightKg: number;
  age: number;
  chestCm: number | null;
  waistCm: number | null;
  preferredFit: Fit | null;
};

type NumericField = Exclude<keyof MeasurementsInput, "preferredFit">;
export type MeasurementErrors = Partial<Record<keyof MeasurementsInput, string>>;

// Mêmes bornes que les contraintes check de la table measurements.
export const MEASUREMENT_FIELDS: Record<
  NumericField,
  { name: string; label: string; unit: string; min: number; max: number; required: boolean; integer?: boolean }
> = {
  heightCm: { name: "height_cm", label: "Taille", unit: "cm", min: 140, max: 220, required: true },
  weightKg: { name: "weight_kg", label: "Poids", unit: "kg", min: 40, max: 200, required: true },
  age: { name: "age", label: "Âge", unit: "ans", min: 16, max: 100, required: true, integer: true },
  chestCm: { name: "chest_cm", label: "Tour de poitrine", unit: "cm", min: 70, max: 160, required: false },
  waistCm: { name: "waist_cm", label: "Tour de taille", unit: "cm", min: 55, max: 160, required: false },
};

export const FITS: { value: Fit; label: string }[] = [
  { value: "slim", label: "Ajustée" },
  { value: "regular", label: "Classique" },
  { value: "loose", label: "Ample" },
];

// Accepte la virgule décimale française ; renvoie NaN pour une saisie qui n'est pas un nombre.
export function parseDecimal(raw: string): number | null {
  const trimmed = raw.trim().replace(",", ".");
  if (trimmed === "") return null;
  return /^\d+(\.\d+)?$/.test(trimmed) ? Number(trimmed) : NaN;
}

export function parseMeasurements(
  read: (name: string) => string,
): { data: MeasurementsInput } | { errors: MeasurementErrors } {
  const errors: MeasurementErrors = {};
  const values: Partial<Record<NumericField, number>> = {};

  for (const [key, field] of Object.entries(MEASUREMENT_FIELDS) as [NumericField, (typeof MEASUREMENT_FIELDS)[NumericField]][]) {
    const value = parseDecimal(read(field.name));
    const range = `entre ${field.min} et ${field.max} ${field.unit}`;
    if (value === null) {
      if (field.required) errors[key] = `Indiquez votre ${field.label.toLowerCase()}, ${range}.`;
    } else if (Number.isNaN(value) || (field.integer && !Number.isInteger(value))) {
      errors[key] = field.integer ? `Indiquez un nombre entier, ${range}.` : `Indiquez un nombre, ${range}.`;
    } else if (value < field.min || value > field.max) {
      errors[key] = `La valeur doit être ${range}.`;
    } else {
      values[key] = Math.round(value * 10) / 10;
    }
  }

  const fit = read("preferred_fit");
  const preferredFit = FITS.some((f) => f.value === fit) ? (fit as Fit) : null;
  if (fit !== "" && preferredFit === null) errors.preferredFit = "Choisissez une coupe dans la liste.";

  if (Object.keys(errors).length > 0) return { errors };
  return {
    data: {
      heightCm: values.heightCm!,
      weightKg: values.weightKg!,
      age: values.age!,
      chestCm: values.chestCm ?? null,
      waistCm: values.waistCm ?? null,
      preferredFit,
    },
  };
}
