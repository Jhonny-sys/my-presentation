"use client";

import { useState } from "react";
import type { Portfolio } from "@/lib/api/types";
import { ProfileAssets } from "@/components/landing/ProfileAssets";
import { SectionContent } from "@/components/landing/SectionContent";
import { SectionModal } from "@/components/landing/SectionModal";
import { OrbField, type DbOrbConfig, type DbOrbId } from "@/components/orbs/OrbField";

type Props = {
  portfolio: Portfolio | null;
  messages: Record<string, string>;
  name: string;
  headline: string;
  bio: string;
  error: string;
  cvUrl: string;
  letterUrl: string;
  imageUrl: string;
};

export function LandingShell({
  portfolio,
  messages,
  name,
  headline,
  bio,
  error,
  cvUrl,
  letterUrl,
  imageUrl,
}: Props) {
  const [activeOrb, setActiveOrb] = useState<DbOrbId | null>(null);

  const dbOrbs: DbOrbConfig[] = [
    {
      id: "profile",
      label: "Perfil",
      subtitle: "personal_info",
      accent: "#22d3ee",
      delay: "0s",
    },
    {
      id: "experience",
      label: "Experiencia",
      subtitle: `experience · ${portfolio?.experience.length ?? 0}`,
      accent: "#34d399",
      delay: "0.2s",
    },
    {
      id: "studies",
      label: "Estudios",
      subtitle: `studies · ${portfolio?.studies.length ?? 0}`,
      accent: "#818cf8",
      delay: "0.4s",
    },
    {
      id: "technologies",
      label: "Stack",
      subtitle: `technologies · ${portfolio?.technologies.length ?? 0}`,
      accent: "#f472b6",
      delay: "0.6s",
    },
  ];

  const activeConfig = dbOrbs.find((orb) => orb.id === activeOrb);

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-semibold tracking-[0.35em] text-cyan-300/80">JHONNY SYS</p>
        <ProfileAssets
          cvUrl={cvUrl}
          letterUrl={letterUrl}
          imageUrl={imageUrl}
          name={name}
        />
      </header>

      <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-400/70">Portfolio</p>
          <h1 className="max-w-2xl text-5xl font-bold leading-tight md:text-6xl">
            <span className="text-white">{name.split(" ")[0]} </span>
            <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              {headline}
            </span>
          </h1>
          {bio && <p className="max-w-xl text-lg leading-8 text-white/65">{bio}</p>}
          {error && <p className="text-sm text-amber-300/90">{error}</p>}
        </div>

        <OrbField orbs={dbOrbs} onOrbClick={setActiveOrb} />
      </section>

      {activeOrb && activeConfig && (
        <SectionModal
          open
          title={activeConfig.label}
          accent={activeConfig.accent}
          onClose={() => setActiveOrb(null)}
        >
          {portfolio ? (
            <SectionContent
              section={activeOrb}
              portfolio={portfolio}
              messages={messages}
              name={name}
              headline={headline}
              bio={bio}
            />
          ) : (
            <p className="text-white/60">
              {error || "No se pudo cargar el contenido. Verifica que la API esté activa."}
            </p>
          )}
        </SectionModal>
      )}
    </>
  );
}
