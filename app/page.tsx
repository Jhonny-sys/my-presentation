import Link from "next/link";
import { OrbField } from "@/components/orbs/OrbField";
import { PortfolioSections } from "@/components/landing/PortfolioSections";
import { getAssetUrls } from "@/lib/api/config";
import { fetchI18nBundle, fetchPortfolio } from "@/lib/api/server-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const assets = getAssetUrls();
  let portfolio = null;
  let messages: Record<string, string> = {};
  let error = "";

  try {
    const [portfolioData, bundle] = await Promise.all([
      fetchPortfolio(),
      fetchI18nBundle("es"),
    ]);
    portfolio = portfolioData;
    messages = bundle.messages;
  } catch {
    error = "No se pudo cargar el contenido. Verifica que la API esté activa.";
  }

  const profile = portfolio?.profile;
  const headline =
    messages["profile.headline"] ?? profile?.headline ?? "Desarrollador";
  const bio = messages["profile.bio"] ?? profile?.bio ?? "";
  const name = profile?.full_name ?? "Jhonny Alexander Fonseca";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050508] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.12),transparent_35%)]" />
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-10 pt-8">
        <header className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-[0.35em] text-cyan-300/80">
            JHONNY SYS
          </p>
          <nav className="hidden gap-6 text-sm text-white/50 md:flex">
            <a href="#experience" className="hover:text-cyan-300">
              Experiencia
            </a>
            <a href="#studies" className="hover:text-cyan-300">
              Estudios
            </a>
            <a href="#technologies" className="hover:text-cyan-300">
              Stack
            </a>
            <Link href="/login" className="hover:text-cyan-300">
              Admin
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400/70">
              Portfolio
            </p>
            <h1 className="max-w-2xl text-5xl font-bold leading-tight md:text-6xl">
              <span className="text-white">{name.split(" ")[0]} </span>
              <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                {headline}
              </span>
            </h1>
            {bio && (
              <p className="max-w-xl text-lg leading-8 text-white/65">{bio}</p>
            )}
            {error && <p className="text-sm text-amber-300/90">{error}</p>}
          </div>

          <OrbField
            imageUrl={assets.image || profile?.avatar_url || ""}
            cvUrl={assets.cv || profile?.resume_url || ""}
            letterUrl={assets.letter}
          />
        </section>

        {portfolio && <PortfolioSections portfolio={portfolio} messages={messages} />}
      </div>
    </main>
  );
}
