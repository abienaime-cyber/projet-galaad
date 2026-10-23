import { AccountNav } from "@/components/account-nav";

export default function AccountLayout({ children }: LayoutProps<"/compte">) {
  return (
    <>
      <div className="mx-auto max-w-[980px] px-4 pt-8 sm:px-[22px]">
        <AccountNav />
      </div>
      {children}
    </>
  );
}
