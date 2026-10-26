"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ghostButton } from "./field";

const KEY = "usucha-cookies-vu";
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
    <div role="region" aria-label="Cookies" data-theme="dark" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-[640px] bg-ink p-5 text-paper shadow-[0_18px_40px_rgb(0_0_0/0.35)] sm:flex sm:items-center sm:gap-6">
      <p className="text-[15px] text-paper/75">
        USUCHA ne dépose que les cookies nécessaires à votre connexion. La mesure d’audience se fait sans cookie.{" "}
        <Link href="/confidentialite#cookies" className="text-paper underline underline-offset-4">
          En savoir plus
        </Link>
      </p>
      <button type="button" onClick={close} className={`${ghostButton} mt-3 h-11 shrink-0 text-[17px] sm:mt-0`}>
        J’ai compris
      </button>
    </div>
  );
}
