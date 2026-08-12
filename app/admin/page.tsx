import { AdminPanel } from "@/components/admin/AdminPanel";
import { fetchAdminPortfolio } from "@/lib/api/admin-client";
import type { Portfolio } from "@/lib/api/types";

export const dynamic = "force-dynamic";

const emptyPortfolio: Portfolio = {
  profile: null,
  experience: [],
  studies: [],
  technologies: [],
};

export default async function AdminPage() {
  let portfolio = emptyPortfolio;
  try {
    portfolio = await fetchAdminPortfolio();
  } catch {
    portfolio = emptyPortfolio;
  }

  return (
    <main className="min-h-screen bg-[#050508] text-white">
      <div className="border-b border-white/10 px-6 py-6">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-400/80">Panel</p>
        <h1 className="text-2xl font-bold">Editor de contenido</h1>
      </div>
      <AdminPanel initialPortfolio={portfolio} />
    </main>
  );
}
