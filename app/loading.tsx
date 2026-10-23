// Squelette affiché pendant la navigation, le temps que la page serveur arrive.
export default function Loading() {
  return (
    <div aria-busy aria-label="Chargement" className="mx-auto max-w-[980px] px-4 pt-10 sm:px-[22px] md:pt-16">
      <div className="h-12 w-2/3 max-w-md rounded-full bg-tile" />
      <div className="mt-10 h-[28rem] rounded-[28px] bg-tile" />
    </div>
  );
}
