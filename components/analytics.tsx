"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

// Mesure d'audience Vercel, sans cookie. Le numéro de commande ne part jamais dans l'URL mesurée.
export function Analytics() {
  return <VercelAnalytics beforeSend={(event) => ({ ...event, url: event.url.replace(/\/compte\/commandes\/[^/?#]+/, "/compte/commandes/[id]") })} />;
}
