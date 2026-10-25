import Link from "next/link";
import { Suspense } from "react";
import { AccountNav } from "@/components/account-nav";
import { isAdmin } from "@/lib/commerce";
import { Chevron } from "@/components/chevron";

export default function AccountLayout({ children }: LayoutProps<"/compte">) {
  return (
    <>
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 pt-8 sm:px-6">
        <AccountNav />
        <Suspense fallback={null}>
          <AdminLink />
        </Suspense>
      </div>
      {children}
    </>
  );
}

// Sur mobile, le lien Admin quitte la barre du haut et se retrouve ici.
async function AdminLink() {
  if (!(await isAdmin())) return null;
  return (
    <Link href="/admin" className="inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-ink hover:underline sm:hidden">
      Tableau de bord <Chevron />
    </Link>
  );
}
