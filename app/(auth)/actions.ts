"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { safeNextPath } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; notice?: string; email?: string };

const field = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = field(formData, "email");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: String(formData.get("password") ?? "") });
  if (error) return { error: "E-mail ou mot de passe incorrect.", email };
  // Sans destination demandée : la boutique si les mensurations sont connues, sinon leur saisie.
  const { data: measured } = await supabase.from("measurements").select("user_id").eq("user_id", data.user.id).maybeSingle();
  redirect(safeNextPath(formData.get("next"), measured ? "/costumes" : "/compte/mensurations"));
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = field(formData, "email");
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "Choisissez un mot de passe d'au moins 8 caractères.", email };

  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: field(formData, "full_name") || null },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });
  if (error) return { error: "La création du compte a échoué. Vérifiez l'adresse e-mail, ou connectez-vous si vous avez déjà un compte.", email };
  if (!data.session) return { notice: `Un e-mail de confirmation vient d'être envoyé à ${email}. Ouvrez le lien qu'il contient pour activer votre compte.` };
  redirect("/compte/mensurations");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
