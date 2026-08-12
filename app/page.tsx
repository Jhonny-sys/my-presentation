import { LandingShell } from "@/components/landing/LandingShell";
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

  const imageUrl = assets.image || profile?.avatar_url || "";
  const cvUrl = assets.cv || profile?.resume_url || "";
  const letterUrl = assets.letter;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050508] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.12),transparent_35%)]" />
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-10 pt-8">
        <LandingShell
          portfolio={portfolio}
          messages={messages}
          name={name}
          headline={headline}
          bio={bio}
          error={error}
          cvUrl={cvUrl}
          letterUrl={letterUrl}
          imageUrl={imageUrl}
        />
      </div>
    </main>
  );
}
