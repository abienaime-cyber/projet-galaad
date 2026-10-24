"use client";

import { useEffect } from "react";
import { primaryButton } from "@/components/field";

// Erreur imprévue (base injoignable, panne réseau) : on le dit, et on propose de réessayer.
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[1180px] px-4 pt-24 pb-32 text-center sm:px-8">
      <h1 className="text-[36px] md:text-[48px]">Cette page n’a pas pu se charger.</h1>
      <p className="mx-auto mt-4 max-w-[30rem] text-[19px] text-label-2">
        Le service ne répond pas pour le moment. Votre panier et vos mensurations sont conservés.
      </p>
      <button type="button" onClick={() => retry()} className={`${primaryButton} mt-8`}>
        Réessayer
      </button>
    </div>
  );
}
