import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: "Les données que USUCHA collecte, pourquoi, combien de temps, et comment exercer vos droits.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Confidentialité" updated="25 octobre 2026">
      <p>
        USUCHA est un projet étudiant de démonstration. Cette page décrit ce que le site enregistre, à quoi cela sert et comment
        exercer vos droits au titre du Règlement général sur la protection des données (RGPD).
      </p>

      <h2 id="responsable">Responsable du traitement</h2>
      <p>
        L’équipe du projet USUCHA.{" "}
        {CONTACT_EMAIL ? (
          <>
            Contact : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </>
        ) : (
          "Adresse de contact à renseigner avant toute mise en ligne publique."
        )}
      </p>

      <h2 id="donnees">Données enregistrées et finalités</h2>
      <ul>
        <li>Compte : adresse e-mail, nom si vous le donnez, mot de passe chiffré. Pour vous identifier.</li>
        <li>
          Profil de goût : nombre de tasses par semaine, façon de boire le matcha, goût préféré, ustensiles déjà possédés et, si vous le
          donnez, le prix de votre matcha en coffee shop. Pour classer la boutique et calculer le prix de votre tasse. Vous pouvez le
          modifier ou l’effacer à tout moment dans <Link href="/compte/profil">votre compte</Link>.
        </li>
        <li>Adresse de livraison, panier, commandes et retours. Pour traiter vos commandes (paiement simulé).</li>
        <li>Avis : note et commentaire, publiés sur la fiche de l’article.</li>
      </ul>
      <p>
        Base légale : l’exécution du service que vous demandez (recommandation, commande). Aucune donnée n’est vendue ni utilisée à
        des fins publicitaires.
      </p>

      <h2 id="ia">Conseiller IA</h2>
      <p>
        Quand vous demandez un conseil sur une fiche produit, votre profil de goût et le score calculé sont envoyés à Anthropic, qui
        fournit le modèle d’IA. Ni votre nom ni votre e-mail ne sont transmis. Rien n’est envoyé tant que vous n’appuyez pas sur le
        bouton.
      </p>

      <h2 id="sous-traitants">Hébergement et sous-traitants</h2>
      <ul>
        <li>Supabase : base de données et authentification.</li>
        <li>Vercel : hébergement du site et mesure d’audience.</li>
        <li>Anthropic : conseiller IA, uniquement à votre demande.</li>
      </ul>

      <h2 id="duree">Durée de conservation</h2>
      <p>
        Les données sont conservées tant que votre compte existe. Une boutique réelle devrait conserver ses pièces comptables dix ans
        (article L123-22 du Code de commerce) ; ce site de démonstration n’en émet pas.
      </p>

      <h2 id="cookies">Cookies et mesure d’audience</h2>
      <p>
        Le site dépose uniquement les cookies de session nécessaires à votre connexion (préfixe <code>sb-</code>). Ils sont exemptés de
        consentement selon les lignes directrices de la CNIL. Le bandeau d’information enregistre votre lecture dans le stockage local
        de votre navigateur, pas dans un cookie.
      </p>
      <p>
        La mesure d’audience (Vercel Web Analytics) ne dépose aucun cookie : selon Vercel, le visiteur est reconnu par une empreinte de
        la requête, effacée au bout de 24 heures, et les statistiques sont agrégées. Les numéros de commande sont masqués avant envoi.
      </p>

      <h2 id="droits">Vos droits</h2>
      <p>
        Vous pouvez accéder à vos données, les rectifier, les effacer, vous opposer à leur traitement ou demander leur portabilité. Les
        réponses du profil de goût se gèrent directement dans votre compte ; pour le reste, écrivez au responsable du traitement. Vous pouvez aussi
        adresser une réclamation à la CNIL sur <a href="https://www.cnil.fr">cnil.fr</a>.
      </p>
    </LegalPage>
  );
}
