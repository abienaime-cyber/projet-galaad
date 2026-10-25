import type { Metadata } from "next";
import { Cormorant, Montserrat } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { CookieNotice } from "@/components/cookie-notice";
import { MotionProvider } from "@/components/motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OPEN_GRAPH, SITE_URL } from "@/lib/site";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});
const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Carrure, chemises et costumes", template: "%s · Carrure" },
  description: "Chemises et costumes pour homme, avec une taille calculée pour chaque article à partir de vos mensurations.",
  openGraph: OPEN_GRAPH,
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* Sans JavaScript, les blocs animés restent visibles. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <MotionProvider>
          <SiteHeader />
          {/* Le pied de page démarre sous la ligne de flottaison : il ne saute pas quand le contenu arrive en streaming. */}
          <main className="min-h-[calc(100svh-4rem)] flex-1">{children}</main>
          <SiteFooter />
        </MotionProvider>
        <CookieNotice />
        {/* Le script d'audience n'existe que sur Vercel : ailleurs, il ne ferait qu'une erreur 404. */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
