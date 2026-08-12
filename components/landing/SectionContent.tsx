"use client";

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
        {bio && <p className="leading-7 text-white/70">{bio}</p>}
        {profile && (
          <dl className="grid gap-2 text-sm text-white/60">
            {profile.email && (
              <div>
                <dt className="text-white/40">Email</dt>
                <dd>{profile.email}</dd>
              </div>
            )}
            {profile.location && (
              <div>
                <dt className="text-white/40">Ubicación</dt>
                <dd>{profile.location}</dd>
              </div>
            )}
            {profile.phone && (
              <div>
                <dt className="text-white/40">Teléfono</dt>
                <dd>{profile.phone}</dd>
              </div>
            )}
          </dl>
        )}
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
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-white">{item.role}</h3>
                    <p className="text-sm text-cyan-300">{item.company}</p>
                  </div>
                  <p className="text-xs text-white/50">
                    {item.start_date} — {item.is_current ? "Actual" : item.end_date}
                  </p>
                </div>
                {item.description && (
                  <p className="mt-2 text-sm leading-6 text-white/70">{item.description}</p>
                )}
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
                <h3 className="font-semibold text-white">{item.degree}</h3>
                <p className="text-sm text-cyan-300">{item.institution}</p>
                {item.field_of_study && (
                  <p className="mt-1 text-sm text-white/60">{item.field_of_study}</p>
                )}
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
      <div className="flex flex-wrap gap-2">
        {portfolio.technologies.length === 0 ? (
          <p className="text-white/40">Sin registros aún.</p>
        ) : (
          portfolio.technologies.map((tech) => (
            <span
              key={tech.id}
              className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-sm text-cyan-100"
            >
              {tech.name}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
