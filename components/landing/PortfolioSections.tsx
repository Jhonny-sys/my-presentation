import Link from "next/link";
import type { Portfolio } from "@/lib/api/types";

type Props = {
  portfolio: Portfolio;
  messages: Record<string, string>;
};

function t(messages: Record<string, string>, key: string, fallback = "") {
  return messages[key] ?? fallback;
}

export function PortfolioSections({ portfolio, messages }: Props) {
  const profile = portfolio.profile;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-16 px-6 pb-24">
      <section id="experience" className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold text-white">
            {t(messages, "section.experience", "Experiencia")}
          </h2>
          <span className="text-xs uppercase tracking-[0.3em] text-cyan-400/70">
            Work
          </span>
        </div>
        <div className="grid gap-4">
          {portfolio.experience.length === 0 ? (
            <p className="text-white/40">Sin registros aún.</p>
          ) : (
            portfolio.experience.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.role}</h3>
                    <p className="text-cyan-300">{item.company}</p>
                  </div>
                  <p className="text-sm text-white/50">
                    {item.start_date} — {item.is_current ? "Actual" : item.end_date}
                  </p>
                </div>
                {item.description && (
                  <p className="mt-3 text-sm leading-7 text-white/70">{item.description}</p>
                )}
              </article>
            ))
          )}
        </div>
      </section>

      <section id="studies" className="space-y-6">
        <h2 className="text-3xl font-bold text-white">
          {t(messages, "section.studies", "Estudios")}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {portfolio.studies.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h3 className="text-lg font-semibold text-white">{item.degree}</h3>
              <p className="text-cyan-300">{item.institution}</p>
              {item.field_of_study && (
                <p className="mt-2 text-sm text-white/60">{item.field_of_study}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="technologies" className="space-y-6">
        <h2 className="text-3xl font-bold text-white">
          {t(messages, "section.technologies", "Tecnologías")}
        </h2>
        <div className="flex flex-wrap gap-3">
          {portfolio.technologies.map((tech) => (
            <span
              key={tech.id}
              className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100"
            >
              {tech.name}
            </span>
          ))}
        </div>
      </section>

      {profile && (
        <footer className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
          {profile.email && <p>{profile.email}</p>}
          {profile.location && <p>{profile.location}</p>}
          <Link href="/login" className="mt-4 inline-block text-cyan-400/80 hover:text-cyan-300">
            Admin
          </Link>
        </footer>
      )}
    </div>
  );
}
