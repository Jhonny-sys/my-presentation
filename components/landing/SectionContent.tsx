"use client";

import Image from "next/image";
import type { Portfolio } from "@/lib/api/types";

type Props = {
  section: "profile" | "experience" | "studies" | "technologies";
  portfolio: Portfolio;
  messages: Record<string, string>;
  name: string;
  headline: string;
  bio: string;
};

function t(messages: Record<string, string>, key: string, fallback = "") {
  return messages[key] ?? fallback;
}

function formatPeriod(
  start?: string | null,
  end?: string | null,
  isCurrent?: boolean,
) {
  if (!start && !end) return isCurrent ? "Actualmente" : "";
  const endLabel = isCurrent ? "Actualmente" : end ?? "";
  return start ? `${start} — ${endLabel}` : endLabel;
}

export function SectionContent({
  section,
  portfolio,
  messages,
  name,
  headline,
  bio,
}: Props) {
  const profile = portfolio.profile;

  if (section === "profile") {
    return (
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/70">personal_info</p>
        <h2 className="text-2xl font-bold text-white">{name}</h2>
        <p className="text-lg text-cyan-200">{headline}</p>
        <p className="leading-7 text-white/70">{bio || profile?.bio || "Sin descripción aún."}</p>
      </div>
    );
  }

  if (section === "experience") {
    return (
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/70">experience</p>
        <h2 className="text-2xl font-bold text-white">
          {t(messages, "section.experience", "Experiencia")}
        </h2>
        <div className="grid gap-3">
          {portfolio.experience.length === 0 ? (
            <p className="text-white/40">Sin registros aún.</p>
          ) : (
            portfolio.experience.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex gap-4">
                  {item.company_logo_url && (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.company_logo_url}
                        alt={item.company}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-semibold text-white">{item.company}</h3>
                      <p className="text-xs text-white/50">
                        {formatPeriod(item.start_date, item.end_date, item.is_current)}
                      </p>
                    </div>
                    {item.description && (
                      <p className="mt-2 text-sm leading-6 text-white/70">{item.description}</p>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    );
  }

  if (section === "studies") {
    return (
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-400/70">studies</p>
        <h2 className="text-2xl font-bold text-white">
          {t(messages, "section.studies", "Estudios")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {portfolio.studies.length === 0 ? (
            <p className="text-white/40">Sin registros aún.</p>
          ) : (
            portfolio.studies.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex gap-3">
                  {item.certificate_url && (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.certificate_url}
                        alt={item.institution}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white">{item.degree}</h3>
                    <p className="text-sm text-cyan-300">{item.institution}</p>
                    <p className="mt-1 text-xs text-white/50">
                      {formatPeriod(item.start_date, item.end_date, item.is_current)}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-[0.3em] text-pink-400/70">technologies</p>
      <h2 className="text-2xl font-bold text-white">
        {t(messages, "section.technologies", "Tecnologías")}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {portfolio.technologies.length === 0 ? (
          <p className="text-white/40">Sin registros aún.</p>
        ) : (
          portfolio.technologies.map((tech) => (
            <article
              key={tech.id}
              className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              {tech.icon_url && (
                <div className="relative h-10 w-10 shrink-0">
                  <Image
                    src={tech.icon_url}
                    alt={tech.name}
                    fill
                    className="object-contain"
                    sizes="40px"
                  />
                </div>
              )}
              <div>
                <p className="font-semibold text-cyan-100">{tech.name}</p>
                {tech.description && (
                  <p className="mt-1 text-sm text-white/60">{tech.description}</p>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
