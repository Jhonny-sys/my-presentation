"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  title: string;
  accent: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function SectionModal({ open, title, accent, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="section-modal-title"
        className="relative z-10 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a10] p-6 shadow-2xl"
        style={{ boxShadow: `0 0 80px ${accent}22` }}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="section-modal-title" className="text-lg font-semibold text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-3 py-1 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            Cerrar
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
