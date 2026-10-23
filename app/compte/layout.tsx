import Link from "next/link";
import { Suspense } from "react";
import { AccountNav } from "@/components/account-nav";
import { isAdmin } from "@/lib/commerce";

export default function AccountLayout({ children }: LayoutProps<"/compte">) {
  return (
    <>
      <div className="mx-auto flex max-w-[980px] flex-wrap items-center justify-between gap-x-4 px-4 pt-8 sm:px-[22px]">
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
    <Link href="/admin" className="inline-flex min-h-11 items-center text-sm text-link hover:underline sm:hidden">
      Tableau de bord ›
    </Link>
  );
}
