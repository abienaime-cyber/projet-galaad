import Link from "next/link";
import { textLink } from "@/components/field";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1180px] px-4 pt-24 pb-32 text-center sm:px-8">
      <h1 className="text-[36px] md:text-[48px]">Cette page est introuvable.</h1>
      <p className="mx-auto mt-4 max-w-[30rem] text-[19px] text-label-2">L’article a peut-être été retiré de la boutique.</p>
      <Link href="/costumes" className={`${textLink} mt-8`}>
        Voir les costumes
      </Link>
    </div>
  );
}
