"use client";

import { useEffect } from "react";
import { gmailComposeUrl, outlookComposeUrl } from "@/lib/contact";
import { GmailIcon, MailIcon, OutlookIcon } from "@/components/landing/ContactIcons";

type Props = {
  open: boolean;
  email: string;
  onClose: () => void;
};

export function EmailComposeModal({ open, email, onClose }: Props) {
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

  function openProvider(provider: "gmail" | "outlook") {
    const url = provider === "gmail" ? gmailComposeUrl(email) : outlookComposeUrl(email);
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-modal-title"
        className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a0a10] p-6 shadow-2xl shadow-cyan-500/5"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
          <MailIcon className="h-6 w-6 text-white" />
        </div>
        <h2 id="email-modal-title" className="text-lg font-semibold text-white">
          Enviar correo
        </h2>
        <p className="mt-2 text-sm text-white/60">
          Elige tu cliente para escribir a{" "}
          <span className="font-medium text-cyan-200">{email}</span>
        </p>
        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={() => openProvider("gmail")}
            className="flex items-center gap-3 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-left text-sm font-medium text-red-50 transition hover:-translate-y-0.5 hover:bg-red-400/20 hover:shadow-lg hover:shadow-red-500/20"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md">
              <GmailIcon className="h-6 w-6" />
            </span>
            Abrir en Gmail
          </button>
          <button
            type="button"
            onClick={() => openProvider("outlook")}
            className="flex items-center gap-3 rounded-xl border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-left text-sm font-medium text-sky-50 transition hover:-translate-y-0.5 hover:bg-sky-400/20 hover:shadow-lg hover:shadow-sky-500/20"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md">
              <OutlookIcon className="h-6 w-6" />
            </span>
            Abrir en Outlook
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/5"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
