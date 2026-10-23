import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[980px] px-4 pt-24 pb-32 text-center sm:px-[22px]">
      <h1 className="text-[40px] font-semibold md:text-5xl">Cette page est introuvable.</h1>
      <p className="mx-auto mt-4 max-w-[30rem] text-[19px] text-label-2">L’article a peut-être été retiré de la boutique.</p>
      <Link href="/costumes" className="mt-6 inline-flex min-h-11 items-center text-[17px] text-link hover:underline">
        Voir les costumes ›
      </Link>
    </div>
  );
}
