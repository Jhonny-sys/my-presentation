"use client";

import Image from "next/image";
import { useState } from "react";

type OrbProps = {
  label: string;
  subtitle: string;
  href?: string;
  imageSrc?: string;
  accent: string;
  delay?: string;
  onClick?: () => void;
};

export function Orb({
  label,
  subtitle,
  href,
  imageSrc,
  accent,
  delay = "0s",
  onClick,
}: OrbProps) {
  const [hovered, setHovered] = useState(false);

  const content = (
    <div
      className="orb group relative flex h-44 w-44 cursor-pointer items-center justify-center sm:h-52 sm:w-52"
      style={{ animationDelay: delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div
        className="orb-glow absolute inset-0 rounded-full opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)` }}
      />
      <div
        className="orb-core relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-transform duration-500 group-hover:scale-105"
        style={{
          boxShadow: hovered
            ? `0 0 60px ${accent}66, inset 0 0 30px ${accent}22`
            : `0 0 30px ${accent}33, inset 0 0 20px ${accent}11`,
        }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={label}
            fill
            className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
            sizes="208px"
          />
        ) : (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white/90"
            style={{ background: `${accent}33` }}
          >
            {label.charAt(0)}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-5 pt-10 text-center">
          <p className="text-sm font-semibold tracking-wide text-white">{label}</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}

type OrbFieldProps = {
  imageUrl: string;
  cvUrl: string;
  letterUrl: string;
};

export function OrbField({ imageUrl, cvUrl, letterUrl }: OrbFieldProps) {
  return (
    <div className="relative flex min-h-[420px] w-full max-w-4xl items-center justify-center">
      <div className="grid w-full grid-cols-1 items-center justify-items-center gap-10 md:grid-cols-3 md:gap-6">
        <Orb
          label="Perfil"
          subtitle="Imagen"
          imageSrc={imageUrl || undefined}
          href={imageUrl || undefined}
          accent="#22d3ee"
          delay="0s"
        />
        <Orb
          label="Hoja de vida"
          subtitle="PDF"
          href={cvUrl || undefined}
          accent="#34d399"
          delay="0.4s"
        />
        <Orb
          label="Carta"
          subtitle="Presentación"
          href={letterUrl || undefined}
          accent="#818cf8"
          delay="0.8s"
        />
      </div>
    </div>
  );
}
