import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "CGU et mentions légales",
  description: "Conditions d’utilisation du site de démonstration USUCHA et mentions légales.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Conditions d’utilisation" updated="25 octobre 2026">
      <h2 id="objet">Objet</h2>
      <p>
        USUCHA est un site de démonstration réalisé dans le cadre d’un projet étudiant. Il ne vend rien : le paiement est simulé,
        aucune carte n’est demandée, aucun article n’est expédié. Les produits et leurs prix sont fictifs.
      </p>

      <h2 id="compte">Compte</h2>
      <p>
        La création d’un compte est gratuite. Vous êtes responsable de la confidentialité de votre mot de passe et des réponses de
        votre profil de goût.
      </p>

      <h2 id="recommandation">Recommandation calculée</h2>
      <p>
        Le score affiché sur chaque article vient d’un calcul fait à partir de votre profil de goût. C’est une aide au choix, pas une
        garantie : le goût reste personnel. Les durées et prix par tasse utilisent les doses publiées par la maison Ippodo (2 g pour un
        matcha pur, 3 g pour un latte) et les prix de la boutique ; le lait n’est pas compté.
      </p>

      <h2 id="ia">Conseiller IA</h2>
      <p>
        Le conseiller explique le score calculé et propose des rituels avec les articles du catalogue. Il ne change pas le score. Ses textes sont
        générés automatiquement et peuvent contenir des erreurs.
      </p>

      <h2 id="avis">Avis</h2>
      <p>
        Seuls les clients qui ont commandé un article peuvent le noter. Les avis injurieux, diffamatoires ou sans rapport avec l’article
        peuvent être supprimés.
      </p>

      <h2 id="visuels">Visuels</h2>
      <p>
        Les photos du site viennent de Pexels, sous licence Pexels (usage gratuit). Elles montrent du matériel du commerce, pas les articles vendus. La liste des photos et de leurs auteurs est dans le fichier CREDITS.md du projet. Les polices Barlow,
        Barlow Condensed et Fragment Mono sont publiées sous licence SIL Open Font License.
      </p>

      <h2 id="donnees">Données personnelles</h2>
      <p>
        Voir la page <Link href="/confidentialite">Confidentialité</Link>.
      </p>

      <h2 id="droit">Droit applicable</h2>
      <p>Ces conditions sont soumises au droit français.</p>

      <h2 id="mentions">Mentions légales</h2>
      <ul>
        <li>Éditeur : l’équipe du projet étudiant USUCHA, à titre non commercial.</li>
        <li>
          Hébergeur : Vercel Inc., États-Unis (<a href="https://vercel.com">vercel.com</a>).
        </li>
        <li>
          Base de données : Supabase Inc. (<a href="https://supabase.com">supabase.com</a>).
        </li>
      </ul>
    </LegalPage>
  );
}
