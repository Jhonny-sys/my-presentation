"use client";

import { useMemo, useState } from "react";
import type { PersonalInfo } from "@/lib/api/types";
import type { LangCode } from "@/lib/i18n/landing";
import { normalizeExternalUrl, whatsAppWebUrl } from "@/lib/contact";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type ChatResponse = {
  reply: string;
  turn: number;
  turns_remaining: number;
  suggest_contact: boolean;
};

type Props = {
  lang: LangCode;
  profile?: PersonalInfo | null;
};

const MAX_TURNS = 3;

const UI: Record<
  LangCode,
  {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    open: string;
    close: string;
    turnsLeft: (n: number) => string;
    noTurns: string;
    contactTitle: string;
    error: string;
    welcome: string;
  }
> = {
  es: {
    title: "Asistente",
    subtitle: "Pregunta sobre mi perfil",
    placeholder: "Escribe tu pregunta...",
    send: "Enviar",
    open: "¿Preguntas?",
    close: "Cerrar",
    turnsLeft: (n) => `${n} pregunta${n === 1 ? "" : "s"} restante${n === 1 ? "" : "s"}`,
    noTurns: "Has usado tus preguntas. Contáctame directamente:",
    contactTitle: "Contacto",
    error: "No pude responder. Intenta de nuevo o contáctame.",
    welcome: "Hola, soy el asistente del portfolio. Puedo responder hasta 3 preguntas sobre mi experiencia, estudios, stack y proyectos.",
  },
  en: {
    title: "Assistant",
    subtitle: "Ask about my profile",
    placeholder: "Type your question...",
    send: "Send",
    open: "Questions?",
    close: "Close",
    turnsLeft: (n) => `${n} question${n === 1 ? "" : "s"} left`,
    noTurns: "You've used your questions. Contact me directly:",
    contactTitle: "Contact",
    error: "I couldn't reply. Try again or contact me.",
    welcome: "Hi, I'm the portfolio assistant. I can answer up to 3 questions about my experience, studies, tech stack, and projects.",
  },
  pt: {
    title: "Assistente",
    subtitle: "Pergunte sobre meu perfil",
    placeholder: "Escreva sua pergunta...",
    send: "Enviar",
    open: "Dúvidas?",
    close: "Fechar",
    turnsLeft: (n) => `${n} pergunta${n === 1 ? "" : "s"} restante${n === 1 ? "" : "s"}`,
    noTurns: "Você usou suas perguntas. Entre em contato diretamente:",
    contactTitle: "Contato",
    error: "Não consegui responder. Tente novamente ou entre em contato.",
    welcome: "Olá, sou o assistente do portfólio. Posso responder até 3 perguntas sobre experiência, estudos, stack e projetos.",
  },
};

export function PortfolioChat({ lang, profile }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [turn, setTurn] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestContact, setSuggestContact] = useState(false);

  const t = UI[lang];
  const turnsRemaining = MAX_TURNS - turn;
  const canAsk = turnsRemaining > 0 && !loading;

  const contactLinks = useMemo(() => {
    const links: { label: string; href: string }[] = [];
    if (profile?.email) links.push({ label: profile.email, href: "#contact-email" });
    if (profile?.phone && whatsAppWebUrl(profile.phone)) {
      links.push({ label: profile.phone, href: whatsAppWebUrl(profile.phone) });
    }
    if (profile?.social_links?.linkedin) {
      links.push({ label: "LinkedIn", href: normalizeExternalUrl(profile.social_links.linkedin) });
    }
    if (profile?.social_links?.github) {
      links.push({ label: "GitHub", href: normalizeExternalUrl(profile.social_links.github) });
    }
    return links;
  }, [profile]);

  function openChat() {
    setOpen(true);
    if (messages.length === 0) {
      setMessages([{ role: "assistant", text: t.welcome }]);
    }
  }

  async function sendMessage(event?: React.FormEvent) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || !canAsk) return;

    const nextTurn = turn + 1;
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, lang, turn: nextTurn }),
      });

      const data: ChatResponse & { detail?: string } = await response.json();
      if (!response.ok) {
        throw new Error(data.detail ?? "Error");
      }

      setTurn(nextTurn);
      setSuggestContact(data.suggest_contact);
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: t.error }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={openChat}
          className="fixed bottom-6 right-6 z-40 rounded-full border border-cyan-400/30 bg-cyan-400/15 px-4 py-3 text-sm font-semibold text-cyan-100 shadow-lg shadow-cyan-500/20 backdrop-blur-sm transition hover:bg-cyan-400/25"
        >
          {t.open}
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-40 flex h-[min(520px,80vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a10]/95 shadow-2xl shadow-cyan-500/10 backdrop-blur-md">
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="font-semibold text-white">{t.title}</p>
              <p className="text-xs text-white/50">{t.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-white/10 px-2 py-1 text-xs text-white/60 hover:bg-white/5"
            >
              {t.close}
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[90%] rounded-xl px-3 py-2 text-sm leading-6 ${
                  msg.role === "user"
                    ? "ml-auto bg-cyan-400/20 text-cyan-50"
                    : "bg-white/5 text-white/80"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="max-w-[90%] rounded-xl bg-white/5 px-3 py-2 text-sm text-white/50">
                ...
              </div>
            )}
          </div>

          {(suggestContact || turnsRemaining === 0) && contactLinks.length > 0 && (
            <div className="border-t border-white/10 px-4 py-3">
              <p className="mb-2 text-xs text-white/50">{t.noTurns}</p>
              <div className="flex flex-wrap gap-2">
                {contactLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("#") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100 hover:bg-cyan-400/20"
                    onClick={
                      link.href === "#contact-email"
                        ? (e) => {
                            e.preventDefault();
                            document
                              .querySelector<HTMLElement>('[data-contact="email"]')
                              ?.click();
                          }
                        : undefined
                    }
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          <footer className="border-t border-white/10 px-4 py-3">
            {turnsRemaining > 0 && (
              <p className="mb-2 text-xs text-white/40">{t.turnsLeft(turnsRemaining)}</p>
            )}
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                disabled={!canAsk}
                maxLength={500}
                className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/40 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!canAsk || !input.trim()}
                className="rounded-xl bg-cyan-400 px-3 py-2 text-sm font-semibold text-black disabled:opacity-50"
              >
                {t.send}
              </button>
            </form>
          </footer>
        </div>
      )}
    </>
  );
}
