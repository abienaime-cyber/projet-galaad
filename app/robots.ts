import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Les pages privées (compte, panier, commande, admin) n'ont rien à faire dans un moteur de recherche.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/compte", "/panier", "/commande", "/auth"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
