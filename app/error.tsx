"use client";

import { useEffect } from "react";
import { primaryButton } from "@/components/field";

// Erreur imprévue (base injoignable, panne réseau) : on le dit, et on propose de réessayer.
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-24 pb-24 text-center sm:px-6">
      <h1 className="display text-[56px] md:text-[88px]">Page bloquée en douane</h1>
      <p className="mx-auto mt-4 max-w-[30rem] text-[19px] text-fog">
        Le service ne répond pas pour le moment. Votre panier et votre profil de goût sont conservés.
      </p>
      <button type="button" onClick={() => retry()} className={`${primaryButton} mt-8`}>
        Réessayer
      </button>
    </div>
  );
}
