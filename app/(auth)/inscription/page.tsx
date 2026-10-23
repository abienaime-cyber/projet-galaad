import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "../auth-form";
import { AuthShell } from "../auth-shell";

export const metadata: Metadata = { title: "Créer un compte" };

export default function SignUpPage() {
  return (
    <AuthShell active="inscription" title="Créer votre compte">
      <Suspense fallback={<div className="mt-8 h-72" />}>
        <AuthForm mode="signup" />
      </Suspense>
    </AuthShell>
  );
}
