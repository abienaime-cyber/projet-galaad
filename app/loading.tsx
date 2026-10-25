// Squelette affiché pendant la navigation, le temps que la page serveur arrive.
export default function Loading() {
  return (
    <div aria-busy aria-label="Chargement" className="mx-auto max-w-[1440px] px-4 pt-10 sm:px-6 md:pt-16">
      <div className="h-16 w-2/3 max-w-md bg-steel-2" />
      <div className="mt-10 h-[28rem] bg-steel-2" />
    </div>
  );
}
