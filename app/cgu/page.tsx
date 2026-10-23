import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "CGU et mentions légales",
  description: "Conditions d’utilisation du site de démonstration Carrure et mentions légales.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Conditions d’utilisation" updated="23 octobre 2026">
      <h2 id="objet">Objet</h2>
      <p>
        Carrure est un site de démonstration réalisé dans le cadre d’un projet étudiant. Il ne vend rien : le paiement est simulé,
        aucune carte n’est demandée, aucun article n’est expédié.
      </p>

      <h2 id="compte">Compte</h2>
      <p>
        La création d’un compte est gratuite. Vous êtes responsable de la confidentialité de votre mot de passe et de l’exactitude des
        mensurations saisies.
      </p>

      <h2 id="taille">Taille calculée</h2>
      <p>
        La taille affichée est une estimation, calculée à partir de vos mensurations et du tableau de tailles de chaque article. Quand
        un tour est déduit de la taille et du poids, la confiance est plus faible et le site le signale. Aucune taille n’est garantie.
      </p>

      <h2 id="ia">Conseiller IA</h2>
      <p>
        Le conseiller explique la taille calculée et propose des tenues du catalogue. Il ne choisit pas la taille. Ses textes sont
        générés automatiquement et peuvent contenir des erreurs.
      </p>

      <h2 id="avis">Avis</h2>
      <p>
        Seuls les clients qui ont commandé un article peuvent le noter. Les avis injurieux, diffamatoires ou sans rapport avec l’article
        peuvent être supprimés.
      </p>

      <h2 id="photos">Photos</h2>
      <p>
        Les photos des articles proviennent de Pexels, sous licence Pexels. Les personnes photographiées n’ont aucun lien avec Carrure
        et ne recommandent pas ses produits.
      </p>

      <h2 id="donnees">Données personnelles</h2>
      <p>
        Voir la page <Link href="/confidentialite">Confidentialité</Link>.
      </p>

      <h2 id="droit">Droit applicable</h2>
      <p>Ces conditions sont soumises au droit français.</p>

      <h2 id="mentions">Mentions légales</h2>
      <ul>
        <li>Éditeur : l’équipe du projet étudiant Carrure, à titre non commercial.</li>
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
