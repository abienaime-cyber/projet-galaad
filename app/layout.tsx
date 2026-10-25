import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, Fragment_Mono } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { CookieNotice } from "@/components/cookie-notice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OPEN_GRAPH, SITE_URL } from "@/lib/site";
import "./globals.css";

// Polices retenues avec UI UX Pro Max (domaine typography : Barlow Condensed pour les titres, Barlow pour le texte),
// plus une mono pour les doses, les prix et les étiquettes.
const condensed = Barlow_Condensed({ variable: "--font-barlow-condensed", subsets: ["latin"], weight: ["600", "700", "800"] });
const barlow = Barlow({ variable: "--font-barlow", subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = Fragment_Mono({ variable: "--font-fragment-mono", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Contrebande, le kit pour faire son matcha chez soi", template: "%s · Contrebande" },
  description:
    "Fouet, cuillère, tamis, bol et matcha : le kit pour préparer chez vous le matcha du coffee shop. Un profil de goût calcule le kit et le format qui vous conviennent.",
  openGraph: OPEN_GRAPH,
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0b0c0d" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${condensed.variable} ${barlow.variable} ${mono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {/* Le pied de page démarre sous la ligne de flottaison : il ne saute pas quand le contenu arrive en streaming. */}
        <main id="contenu" className="min-h-[calc(100svh-3.5rem)] flex-1">
          {children}
        </main>
        <SiteFooter />
        <CookieNotice />
        {/* Le script d'audience n'existe que sur Vercel : ailleurs, il ne ferait qu'une erreur 404. */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
