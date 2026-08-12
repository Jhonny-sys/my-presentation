"use client";

import { useMemo, useState } from "react";
import type { I18nEntry } from "@/lib/api/types";
import { ADMIN_SECTIONS } from "@/lib/api/config";

type Props = {
  initialEntries: I18nEntry[];
};

export function AdminPanel({ initialEntries }: Props) {
  const [section, setSection] = useState<(typeof ADMIN_SECTIONS)[number]["id"]>(
    ADMIN_SECTIONS[0].id,
  );
  const [entries, setEntries] = useState(initialEntries);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const currentSection = ADMIN_SECTIONS.find((item) => item.id === section)!;

  const filtered = useMemo(
    () => entries.filter((entry) => entry.namespace === currentSection.namespace),
    [entries, currentSection.namespace],
  );

  function getDraft(entry: I18nEntry) {
    return drafts[entry.key] ?? entry.source_text;
  }

  async function ensureSession() {
    const response = await fetch("/api/admin/session", { method: "POST" });
    return response.ok;
  }

  async function saveEntry(entry: I18nEntry) {
    const source_text = getDraft(entry).trim();
    if (!source_text) return;

    setLoadingKey(entry.key);
    setStatus("");

    if (!(await ensureSession())) {
      setStatus("Sesión expirada. Vuelve a iniciar sesión.");
      setLoadingKey(null);
      return;
    }

    const response = await fetch(`/api/admin/i18n/${encodeURIComponent(entry.key)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_text }),
    });

    if (!response.ok) {
      setStatus("Error al guardar");
      setLoadingKey(null);
      return;
    }

    const updated: I18nEntry = await response.json();
    setEntries((prev) => prev.map((item) => (item.key === updated.key ? updated : item)));
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[entry.key];
      return next;
    });
    setStatus(`Guardado: ${entry.key}`);
    setLoadingKey(null);
  }

  async function createEntry() {
    const key = window.prompt(`Nueva clave (${currentSection.namespace}.mi_texto):`);
    if (!key) return;

    const source_text = window.prompt("Texto en español:");
    if (!source_text) return;

    setStatus("Creando...");

    if (!(await ensureSession())) {
      setStatus("Sesión expirada. Vuelve a iniciar sesión.");
      return;
    }

    const response = await fetch("/api/admin/i18n", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key,
        source_text,
        namespace: currentSection.namespace,
      }),
    });

    if (!response.ok) {
      setStatus("No se pudo crear la clave");
      return;
    }

    const created: I18nEntry = await response.json();
    setEntries((prev) => [...prev, created]);
    setStatus(`Creado: ${created.key}`);
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-2">
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-cyan-400/80">
          Secciones
        </p>
        {ADMIN_SECTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSection(item.id)}
            className={`block w-full rounded-xl px-4 py-3 text-left transition ${
              section === item.id
                ? "bg-cyan-400/15 text-cyan-200"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}

        <form action="/api/admin/logout" method="POST" className="pt-6">
          <button
            type="submit"
            className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70 hover:bg-white/5"
          >
            Cerrar sesión
          </button>
        </form>
      </aside>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{currentSection.label}</h1>
            <p className="text-sm text-white/50">Namespace: {currentSection.namespace}</p>
          </div>
          <button
            type="button"
            onClick={createEntry}
            className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-300"
          >
            Nueva clave
          </button>
        </div>

        {status && <p className="text-sm text-cyan-300">{status}</p>}

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <p className="text-white/40">No hay claves en esta sección.</p>
          ) : (
            filtered.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <code className="text-sm text-cyan-300">{entry.key}</code>
                  <span className="text-xs text-white/40">
                    EN: {entry.translations.en ?? "—"} · PT: {entry.translations.pt ?? "—"}
                  </span>
                </div>
                <textarea
                  value={getDraft(entry)}
                  onChange={(event) =>
                    setDrafts((prev) => ({ ...prev, [entry.key]: event.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-cyan-400/40"
                />
                <button
                  type="button"
                  onClick={() => saveEntry(entry)}
                  disabled={loadingKey === entry.key}
                  className="mt-3 rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 disabled:opacity-50"
                >
                  {loadingKey === entry.key ? "Guardando..." : "Guardar y traducir"}
                </button>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
