"use client";

import { useMemo, useState } from "react";
import type { Portfolio } from "@/lib/api/types";
import { ContactInfo } from "@/components/landing/ContactInfo";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import { ProfileAssets } from "@/components/landing/ProfileAssets";
import { SectionContent } from "@/components/landing/SectionContent";
import { SectionModal } from "@/components/landing/SectionModal";
import { OrbField, type DbOrbConfig, type DbOrbId } from "@/components/orbs/OrbField";
import { orbLabel, localizedBio, localizedHeadline, type LangCode } from "@/lib/i18n/landing";

type Props = {
  portfolio: Portfolio | null;
  messagesByLang: Record<LangCode, Record<string, string>>;
  defaultLang?: LangCode;
  name: string;
  error: string;
  cvUrl: string;
  letterUrl: string;
  imageUrl: string;
};

export function LandingShell({
  portfolio,
  messagesByLang,
  defaultLang = "es",
  name,
  error,
  cvUrl,
  letterUrl,
  imageUrl,
}: Props) {
  const [lang, setLang] = useState<LangCode>(defaultLang);
  const [activeOrb, setActiveOrb] = useState<DbOrbId | null>(null);

  const messages = messagesByLang[lang] ?? messagesByLang.es;
  const profile = portfolio?.profile;

  const headline = useMemo(
    () => localizedHeadline(messages, lang, profile?.headline),
    [messages, lang, profile?.headline],
  );

  const bio = useMemo(
    () => localizedBio(messages, lang, profile?.bio),
    [messages, lang, profile?.bio],
  );

  const dbOrbs: DbOrbConfig[] = useMemo(
    () => [
      {
        id: "profile",
        label: orbLabel(lang, "profile", messages),
        accent: "#22d3ee",
        delay: "0s",
      },
      {
        id: "experience",
        label: orbLabel(lang, "experience", messages),
        accent: "#34d399",
        delay: "0.2s",
      },
      {
        id: "studies",
        label: orbLabel(lang, "studies", messages),
        accent: "#818cf8",
        delay: "0.4s",
      },
      {
        id: "technologies",
        label: orbLabel(lang, "technologies", messages),
        accent: "#f472b6",
        delay: "0.6s",
      },
    ],
    [lang, messages],
  );

  const activeConfig = dbOrbs.find((orb) => orb.id === activeOrb);

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-semibold tracking-[0.35em] text-cyan-300/80">JHONNY SYS</p>
        <div className="flex flex-wrap items-center gap-3">
          <LanguageSwitcher lang={lang} onChange={setLang} />
          <ProfileAssets
            cvUrl={cvUrl}
            letterUrl={letterUrl}
            imageUrl={imageUrl}
            name={name}
          />
        </div>
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
          <ContactInfo profile={profile} />
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
