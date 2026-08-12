import Image from "next/image";
import Link from "next/link";

type Props = {
  cvUrl: string;
  letterUrl: string;
  imageUrl: string;
  name: string;
};

export function ProfileAssets({ cvUrl, letterUrl, imageUrl, name }: Props) {
  return (
    <div className="flex items-center gap-3">
      {cvUrl && (
        <a
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-200 transition hover:bg-emerald-400/20"
        >
          CV
        </a>
      )}

      {letterUrl && (
        <a
          href={letterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-indigo-400/25 bg-indigo-400/10 px-3 py-1.5 text-xs font-medium text-indigo-200 transition hover:bg-indigo-400/20"
        >
          Carta
        </a>
      )}

      {imageUrl && (
        <Link
          href="/login"
          title="Iniciar sesión"
          className="relative h-11 w-11 overflow-hidden rounded-full border border-cyan-400/30 ring-2 ring-cyan-400/10 transition hover:scale-105 hover:ring-cyan-400/40"
        >
          <Image src={imageUrl} alt={name} fill className="object-cover" sizes="44px" />
        </Link>
      )}
    </div>
  );
}
