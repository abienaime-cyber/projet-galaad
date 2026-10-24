// Squelette affiché pendant la navigation, le temps que la page serveur arrive.
export default function Loading() {
  return (
    <div aria-busy aria-label="Chargement" className="mx-auto max-w-[1180px] px-4 pt-10 sm:px-8 md:pt-16">
      <div className="mx-auto h-16 w-2/3 max-w-md bg-tile" />
      <div className="mt-10 h-[28rem] bg-tile" />
    </div>
  );
}
