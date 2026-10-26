import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { CookieNotice } from "@/components/cookie-notice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OPEN_GRAPH, SITE_URL } from "@/lib/site";
import "./globals.css";

// Polices choisies par l'utilisateur le 26/10/2026 : Fraunces pour les titres (serif douce, axes opsz et SOFT),
// Instrument Sans pour le texte, les prix et les doses (chiffres tabulaires).
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz", "SOFT"] });
const instrument = Instrument_Sans({ variable: "--font-instrument-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "USUCHA, le kit pour faire son matcha chez soi", template: "%s · USUCHA" },
  description:
    "Fouet, cuillère, tamis, bol et matcha : le kit pour préparer chez vous le matcha du coffee shop. Un profil de goût calcule le kit et le format qui vous conviennent.",
  openGraph: OPEN_GRAPH,
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#dfe8d0" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${instrument.variable} h-full antialiased`}>
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
