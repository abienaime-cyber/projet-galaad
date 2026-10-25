import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";

export async function getCurrentUser() {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// N'accepte qu'un chemin interne, pour qu'un lien piégé ne renvoie pas vers un autre site.
export function safeNextPath(value: unknown, fallback = "/compte/profil") {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}
