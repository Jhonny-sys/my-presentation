"use client";

import { useEffect, useState } from "react";

export type IconResult = {
  id: string;
  label: string;
  preview_url: string;
  icon_url: string;
};

type Props = {
  value: string;
  onChange: (url: string) => void;
  defaultQuery?: string;
};

export function IconifyIconPicker({ value, onChange, defaultQuery = "" }: Props) {
  const [query, setQuery] = useState(defaultQuery);
  const [items, setItems] = useState<IconResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setItems([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        await fetch("/api/admin/session", { method: "POST" });
        const response = await fetch(
          `/api/admin/icons/search?q=${encodeURIComponent(query.trim())}`,
        );
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.detail ?? "No se pudo buscar iconos");
        }
        const data = (await response.json()) as { items: IconResult[] };
        setItems(data.items ?? []);
      } catch (err) {
        setItems([]);
        setError(err instanceof Error ? err.message : "Error de búsqueda");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm text-white/60">Icono (Iconify — gratis)</label>
        <a
          href="https://iconify.design/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-cyan-400/80 hover:text-cyan-300"
        >
          iconify.design
        </a>
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar icono (ej: react, python, docker)..."
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-cyan-400/40"
      />

      {value && (
        <div className="flex items-center gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white p-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Icono seleccionado" className="h-full w-full object-contain" />
          </span>
          <p className="text-xs text-white/60">Icono seleccionado</p>
          <button
            type="button"
            onClick={() => onChange("")}
            className="ml-auto text-xs text-red-300 hover:text-red-200"
          >
            Quitar
          </button>
        </div>
      )}

      {loading && <p className="text-sm text-white/40">Buscando iconos...</p>}
      {error && <p className="text-sm text-amber-300/90">{error}</p>}

      {!loading && items.length > 0 && (
        <div className="grid max-h-56 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              title={item.label}
              onClick={() => onChange(item.icon_url)}
              className={`rounded-lg border p-2 transition hover:bg-white/5 ${
                value === item.icon_url
                  ? "border-cyan-400/50 bg-cyan-400/10"
                  : "border-white/10"
              }`}
            >
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-md bg-white p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.preview_url}
                  alt={item.label}
                  className="h-full w-full object-contain"
                />
              </span>
            </button>
          ))}
        </div>
      )}

      <p className="text-[11px] text-white/35">
        Iconos open source vía{" "}
        <a
          href="https://iconify.design/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/50"
        >
          Iconify
        </a>{" "}
        (Simple Icons, Devicon, Logos…). Sin costo ni API key.
      </p>
    </div>
  );
}
