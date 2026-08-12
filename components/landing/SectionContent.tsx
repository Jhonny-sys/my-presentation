"use client";

import Image from "next/image";
import type { Portfolio } from "@/lib/api/types";
import {
  entityI18nKey,
  formatLocalizedPeriod,
  localizedEntityText,
  orbLabel,
  type LangCode,
} from "@/lib/i18n/landing";

type Props = {
  section: "profile" | "experience" | "studies" | "technologies";
  portfolio: Portfolio;
  messages: Record<string, string>;
  lang: LangCode;
  name: string;
  headline: string;
  bio: string;
};

function splitDescriptionBySentences(text: string): string[] {
  return text
    .split(".")
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .map((sentence) => (sentence.endsWith(".") ? sentence : `${sentence}.`));
}

const EMPTY_LABEL: Record<LangCode, string> = {
  es: "Sin registros aún.",
  en: "No entries yet.",
  pt: "Sem registros ainda.",
};

export function SectionContent({
  section,
  portfolio,
  messages,
  lang,
  name,
  headline,
  bio,
}: Props) {
  const profile = portfolio.profile;

  if (section === "profile") {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">{name}</h2>
        <p className="text-lg text-cyan-200">{headline}</p>
        <p className="leading-7 text-white/70">{bio || profile?.bio || "Sin descripción aún."}</p>
      </div>
    );
  }

  if (section === "experience") {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">
          {orbLabel(lang, "experience", messages)}
        </h2>
        <div className="grid gap-3">
          {portfolio.experience.length === 0 ? (
            <p className="text-white/40">{EMPTY_LABEL[lang]}</p>
          ) : (
            portfolio.experience.map((item) => {
              const company = localizedEntityText(
                messages,
                entityI18nKey("experience", item.id, "company"),
                lang,
                item.company,
              );
              const description = localizedEntityText(
                messages,
                entityI18nKey("experience", item.id, "description"),
                lang,
                item.description,
              );

              return (
                <article
                  key={item.id}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex gap-4">
                    {item.company_logo_url && (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={item.company_logo_url}
                          alt={company}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-semibold text-white">{company}</h3>
                        <p className="text-xs text-white/50">
                          {formatLocalizedPeriod(
                            lang,
                            item.start_date,
                            item.end_date,
                            item.is_current,
                          )}
                        </p>
                      </div>
                      {description && (
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-white/70">
                          {splitDescriptionBySentences(description).map((sentence, index) => (
                            <li key={index} className="flex gap-2.5">
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" />
                              <span>{sentence}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    );
  }

  if (section === "studies") {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">{orbLabel(lang, "studies", messages)}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {portfolio.studies.length === 0 ? (
            <p className="text-white/40">{EMPTY_LABEL[lang]}</p>
          ) : (
            portfolio.studies.map((item) => {
              const degree = localizedEntityText(
                messages,
                entityI18nKey("studies", item.id, "degree"),
                lang,
                item.degree,
              );
              const institution = localizedEntityText(
                messages,
                entityI18nKey("studies", item.id, "institution"),
                lang,
                item.institution,
              );

              return (
                <article
                  key={item.id}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex gap-3">
                    {item.certificate_url && (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={item.certificate_url}
                          alt={institution}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-white">{degree}</h3>
                      <p className="text-sm text-cyan-300">{institution}</p>
                      <p className="mt-1 text-xs text-white/50">
                        {formatLocalizedPeriod(
                          lang,
                          item.start_date,
                          item.end_date,
                          item.is_current,
                        )}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">
        {orbLabel(lang, "technologies", messages)}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {portfolio.technologies.length === 0 ? (
          <p className="text-white/40">{EMPTY_LABEL[lang]}</p>
        ) : (
          portfolio.technologies.map((tech) => {
            const description = localizedEntityText(
              messages,
              entityI18nKey("technologies", tech.id, "description"),
              lang,
              tech.description,
            );

            return (
            <article
              key={tech.id}
              className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              {tech.icon_url && (
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1">
                  <Image
                    src={tech.icon_url}
                    alt={tech.name}
                    fill
                    className="object-contain p-0.5"
                    sizes="40px"
                  />
                </span>
              )}
              <div>
                <p className="font-semibold text-cyan-100">{tech.name}</p>
                {description && (
                  <p className="mt-1 text-sm text-white/60">{description}</p>
                )}
              </div>
            </article>
            );
          })
        )}
      </div>
      <p className="text-[11px] text-white/35">
        Iconos vía{" "}
        <a
          href="https://iconify.design/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/50"
        >
          Iconify
        </a>
      </p>
    </div>
  );
}
