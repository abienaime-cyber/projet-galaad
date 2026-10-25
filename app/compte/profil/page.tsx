import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { signOut } from "@/app/(auth)/actions";
import { getProducts, toTasteProfile } from "@/lib/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { deleteTaste } from "./actions";
import { TasteForm } from "./taste-form";

export const metadata: Metadata = { title: "Profil de goût" };

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-8 pb-24 sm:px-6 md:pt-12">
      <h1 className="display text-[64px] sm:text-[96px]">Profil de goût</h1>
      <p className="mt-3 max-w-[44rem] text-[18px] text-fog">
        Six réponses. Elles servent seulement à classer la boutique pour vous et à calculer ce que coûte votre tasse. Vous pouvez les effacer à tout moment.
      </p>
      <Suspense fallback={<div aria-busy className="mt-10 h-[32rem] bg-steel-2" />}>
        <ProfileSection />
      </Suspense>
    </div>
  );
}

async function ProfileSection() {
  if (!isSupabaseConfigured) {
    return (
      <p role="alert" className="mt-10 max-w-prose bg-danger/10 p-5 text-danger">
        La base de données n’est pas encore branchée. Renseignez <code>NEXT_PUBLIC_SUPABASE_URL</code> et <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans{" "}
        <code>.env.local</code>, puis relancez le serveur.
      </p>
    );
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/connexion?suite=/compte/profil");

  const [{ data: row }, products] = await Promise.all([supabase.from("taste_profiles").select("*").eq("user_id", auth.user.id).maybeSingle(), getProducts()]);
  const profile = row ? toTasteProfile(row) : null;

  return (
    <>
      <div className="mono mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-fog">
        <span className="min-w-0 [overflow-wrap:anywhere]">Connecté : {auth.user.email}</span>
        <form action={signOut}>
          <button type="submit" className="inline-flex min-h-11 cursor-pointer items-center uppercase text-ink hover:underline">
            Se déconnecter
          </button>
        </form>
        {profile && (
          <form action={deleteTaste}>
            <button type="submit" className="inline-flex min-h-11 cursor-pointer items-center uppercase text-danger hover:underline">
              Effacer mon profil
            </button>
          </form>
        )}
      </div>
      {/* Le calcul en direct n'a besoin que des articles en stock et de leurs prix. */}
      <TasteForm initial={profile} products={products} />
    </>
  );
}
