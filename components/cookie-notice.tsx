"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { secondaryButton } from "./field";

const KEY = "carrure-cookies-vu";
const noSubscribe = () => () => {};

function readSeen() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return true;
  }
}

// Pas de consentement à recueillir : le site ne dépose que des cookies nécessaires à la connexion,
// exemptés par la CNIL. Le bandeau informe, une fois, puis se retire.
export function CookieNotice() {
  const seen = useSyncExternalStore(noSubscribe, readSeen, () => true);
  const [closed, setClosed] = useState(false);
  if (seen || closed) return null;

  function close() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setClosed(true);
  }

  return (
    <div role="region" aria-label="Cookies" className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-[640px] rounded-xl bg-card p-5 shadow-xl sm:flex sm:items-center sm:gap-6">
      <p className="text-sm text-muted-foreground">
        Carrure ne dépose que les cookies nécessaires à votre connexion. La mesure d’audience se fait sans cookie.{" "}
        <Link href="/confidentialite#cookies" className="font-semibold text-foreground underline underline-offset-4">
          En savoir plus
        </Link>
      </p>
      <button type="button" onClick={close} className={`${secondaryButton} mt-3 shrink-0 sm:mt-0`}>
        J’ai compris
      </button>
    </div>
  );
}
