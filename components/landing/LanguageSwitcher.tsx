"use client";

import { SUPPORTED_LANGUAGES, type LangCode } from "@/lib/i18n/landing";

type Props = {
  lang: LangCode;
  onChange: (lang: LangCode) => void;
};

export function LanguageSwitcher({ lang, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
      {SUPPORTED_LANGUAGES.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => onChange(item.code)}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
            lang === item.code
              ? "bg-cyan-400/20 text-cyan-200"
              : "text-white/45 hover:text-white/80"
          }`}
          aria-label={`Idioma ${item.label}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
