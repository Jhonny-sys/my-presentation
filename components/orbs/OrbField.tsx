"use client";

import { useState } from "react";

export type DbOrbId = "profile" | "experience" | "studies" | "technologies";

export type DbOrbConfig = {
  id: DbOrbId;
  label: string;
  accent: string;
  delay?: string;
};

type OrbProps = DbOrbConfig & {
  onClick: (id: DbOrbId) => void;
};

function Orb({ id, label, accent, delay = "0s", onClick }: OrbProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className="block"
      aria-label={`Abrir ${label}`}
    >
      <div
        className="orb group relative flex h-44 w-44 cursor-pointer items-center justify-center sm:h-52 sm:w-52"
        style={{ animationDelay: delay }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
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
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white/90"
            style={{ background: `${accent}33` }}
          >
            {label.charAt(0)}
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-5 pt-8 text-center">
            <p className="text-sm font-semibold tracking-wide text-white">{label}</p>
          </div>
        </div>
      </div>
    </button>
  );
}

type OrbFieldProps = {
  orbs: DbOrbConfig[];
  onOrbClick: (id: DbOrbId) => void;
};

export function OrbField({ orbs, onOrbClick }: OrbFieldProps) {
  return (
    <div className="relative flex min-h-[420px] w-full max-w-4xl items-center justify-center">
      <div className="grid w-full grid-cols-1 items-center justify-items-center gap-10 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {orbs.map((orb) => (
          <Orb key={orb.id} {...orb} onClick={onOrbClick} />
        ))}
      </div>
    </div>
  );
}
