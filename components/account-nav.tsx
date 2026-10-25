"use client";

import { usePathname } from "next/navigation";
import { SegmentedNav } from "./segmented-nav";

const TABS = [
  { href: "/compte/profil", label: "Profil de goût" },
  { href: "/compte/commandes", label: "Commandes" },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <SegmentedNav
      label="Mon compte"
      items={TABS.map((tab) => ({ ...tab, current: pathname.startsWith(tab.href) }))}
    />
  );
}
