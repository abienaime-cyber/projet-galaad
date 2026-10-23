import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "../auth-form";
import { AuthShell } from "../auth-shell";

export const metadata: Metadata = { title: "Se connecter" };

export default function SignInPage() {
  return (
    <AuthShell active="connexion" title="Bon retour chez Carrure">
      <Suspense fallback={<div className="mt-8 h-72" />}>
        <AuthForm mode="signin" />
      </Suspense>
    </AuthShell>
  );
}
