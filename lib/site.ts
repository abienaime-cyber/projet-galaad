// URL publique : celle de production sur Vercel (variable système, sans https://), sinon le poste local.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

// Adresse à laquelle exercer ses droits (RGPD). À renseigner avant toute mise en ligne publique.
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null;

// Champs Open Graph communs : une page qui définit ses propres images remplace tout le bloc du layout.
export const OPEN_GRAPH = { siteName: "USUCHA", locale: "fr_FR", type: "website" } as const;
