import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#050508] px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.08),transparent_50%)]" />
      <div className="relative w-full max-w-md space-y-6">
        <LoginForm />
        <Link href="/" className="block text-center text-sm text-white/40 hover:text-cyan-300">
          Volver al portfolio
        </Link>
      </div>
    </main>
  );
}
