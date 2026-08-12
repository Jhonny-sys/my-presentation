"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { PersonalInfo } from "@/lib/api/types";
import { GERALDINE_AVATAR_URL, GERALDINE_NAME } from "@/lib/chat/geraldine";
import type { LangCode } from "@/lib/i18n/landing";
import { normalizeExternalUrl, whatsAppWebUrl } from "@/lib/contact";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  showContact?: boolean;
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

const CONTACT_FALLBACK_MARKERS: Record<LangCode, string[]> = {
  es: ["no tengo ese dato", "contáctame directamente", "contactame directamente"],
  en: ["don't have that", "contact me directly"],
  pt: ["não tenho esse dado", "contatar diretamente", "contate-me diretamente"],
};

function replySuggestsContact(reply: string, lang: LangCode): boolean {
  const lower = reply.toLowerCase();
  return CONTACT_FALLBACK_MARKERS[lang].some((marker) => lower.includes(marker));
}

const UI: Record<
  LangCode,
  {
    title: string;
    subtitle: string;
    ctaHeadline: string;
    ctaSubline: string;
    aiBadge: string;
    placeholder: string;
    send: string;
    close: string;
    turnsLeft: (n: number) => string;
    noTurns: string;
    contactPrompt: string;
    contactEmail: string;
    contactPhone: string;
    contactLinkedIn: string;
    error: string;
    welcome: string;
    thinking: string;
  }
> = {
  es: {
    title: GERALDINE_NAME,
    subtitle: "Agente IA del portfolio",
    ctaHeadline: "Pregúntale a Geraldine sobre Jhonny",
    ctaSubline: "Experiencia, stack, estudios y más",
    aiBadge: "Agente IA",
    placeholder: "Escribe tu pregunta...",
    send: "Enviar",
    close: "Cerrar",
    turnsLeft: (n) => `${n} pregunta${n === 1 ? "" : "s"} restante${n === 1 ? "" : "s"}`,
    noTurns: "Has usado tus preguntas. Contáctame directamente:",
    contactPrompt: "Puedes contactarme directamente:",
    contactEmail: "Correo",
    contactPhone: "Teléfono",
    contactLinkedIn: "LinkedIn",
    error: "Ups, no pude responder. Intenta de nuevo o contáctame directamente.",
    welcome:
      "¡Hola! Soy Geraldine, agente IA de este portfolio. Puedo contarte sobre la experiencia, estudios, stack y proyectos de Jhonny — hasta 3 preguntas.",
    thinking: "Geraldine está pensando...",
  },
  en: {
    title: GERALDINE_NAME,
    subtitle: "Portfolio AI agent",
    ctaHeadline: "Ask Geraldine about Jhonny",
    ctaSubline: "Experience, stack, studies & more",
    aiBadge: "AI Agent",
    placeholder: "Type your question...",
    send: "Send",
    close: "Close",
    turnsLeft: (n) => `${n} question${n === 1 ? "" : "s"} left`,
    noTurns: "You've used your questions. Contact me directly:",
    contactPrompt: "You can contact me directly:",
    contactEmail: "Email",
    contactPhone: "Phone",
    contactLinkedIn: "LinkedIn",
    error: "Sorry, I couldn't reply. Try again or contact Jhonny directly.",
    welcome:
      "Hi! I'm Geraldine, the AI agent for this portfolio. I can tell you about Jhonny's experience, studies, stack and projects — up to 3 questions.",
    thinking: "Geraldine is thinking...",
  },
  pt: {
    title: GERALDINE_NAME,
    subtitle: "Agente IA do portfólio",
    ctaHeadline: "Pergunte à Geraldine sobre o Jhonny",
    ctaSubline: "Experiência, stack, estudos e mais",
    aiBadge: "Agente IA",
    placeholder: "Escreva sua pergunta...",
    send: "Enviar",
    close: "Fechar",
    turnsLeft: (n) => `${n} pergunta${n === 1 ? "" : "s"} restante${n === 1 ? "" : "s"}`,
    noTurns: "Você usou suas perguntas. Entre em contato diretamente:",
    contactPrompt: "Você pode me contatar diretamente:",
    contactEmail: "E-mail",
    contactPhone: "Telefone",
    contactLinkedIn: "LinkedIn",
    error: "Não consegui responder. Tente novamente ou entre em contato.",
    welcome:
      "Olá! Sou Geraldine, agente IA deste portfólio. Posso falar sobre a experiência, estudos, stack e projetos do Jhonny — até 3 perguntas.",
    thinking: "Geraldine está pensando...",
  },
};

function GeraldineAvatar({ size = 40 }: { size?: number }) {
  return (
    <span
      className="relative shrink-0 overflow-hidden rounded-full ring-2 ring-cyan-400/40 ring-offset-2 ring-offset-[#0a0a10]"
      style={{ width: size, height: size }}
    >
      <Image
        src={GERALDINE_AVATAR_URL}
        alt={GERALDINE_NAME}
        fill
        className="object-cover"
        sizes={`${size}px`}
      />
    </span>
  );
}

function buildDirectContactLinks(
  profile: PersonalInfo | null | undefined,
  labels: (typeof UI)["es"],
): { label: string; href: string; detail?: string }[] {
  const links: { label: string; href: string; detail?: string }[] = [];

  if (profile?.email) {
    links.push({
      label: labels.contactEmail,
      detail: profile.email,
      href: `mailto:${profile.email.trim()}`,
    });
  }

  if (profile?.social_links?.linkedin) {
    links.push({
      label: labels.contactLinkedIn,
      href: normalizeExternalUrl(profile.social_links.linkedin),
    });
  }

  if (profile?.phone) {
    const wa = whatsAppWebUrl(profile.phone);
    links.push({
      label: labels.contactPhone,
      detail: profile.phone,
      href: wa || `tel:${profile.phone.replace(/\s/g, "")}`,
    });
  }

  return links;
}

function ChatContactLinks({
  profile,
  labels,
  prompt,
}: {
  profile?: PersonalInfo | null;
  labels: (typeof UI)["es"];
  prompt: string;
}) {
  const links = buildDirectContactLinks(profile, labels);
  if (links.length === 0) return null;

  return (
    <div className="mt-2 max-w-[90%] rounded-xl border border-cyan-400/15 bg-cyan-400/5 px-3 py-2.5">
      <p className="mb-2 text-xs text-white/55">{prompt}</p>
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-black/20 px-2.5 py-1.5 text-xs text-cyan-100 transition hover:bg-cyan-400/10"
          >
            <span className="font-semibold">{link.label}</span>
            {link.detail && <span className="truncate text-white/60">{link.detail}</span>}
          </a>
        ))}
      </div>
    </div>
  );
}

export function PortfolioChat({ lang, profile }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [turn, setTurn] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const t = UI[lang];
  const turnsRemaining = MAX_TURNS - turn;
  const canAsk = turnsRemaining > 0 && !loading;

  const lastAssistantWithContact = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].role === "assistant" && messages[i].showContact) return i;
    }
    return -1;
  }, [messages]);

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

      const showContact =
        data.suggest_contact || replySuggestsContact(data.reply, lang);

      setTurn(nextTurn);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply, showContact },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: t.error, showContact: true },
      ]);
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
          className="group fixed bottom-5 right-5 z-40 max-w-[min(340px,calc(100vw-2rem))] text-left transition hover:-translate-y-0.5"
        >
          <span className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-violet-500/15 to-emerald-500/20 opacity-70 blur-lg transition group-hover:opacity-100" />
          <span className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-cyan-400/25 bg-[#0a0a10]/95 p-3 shadow-2xl shadow-cyan-500/15 backdrop-blur-md">
            <GeraldineAvatar size={52} />
            <span className="min-w-0 flex-1">
              <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                {t.aiBadge}
              </span>
              <span className="mt-1 block text-sm font-bold leading-snug text-white group-hover:text-cyan-50">
                {t.ctaHeadline}
              </span>
              <span className="mt-0.5 block text-xs text-white/55">{t.ctaSubline}</span>
            </span>
          </span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-40 flex h-[min(520px,80vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a10]/95 shadow-2xl shadow-cyan-500/10 backdrop-blur-md">
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <GeraldineAvatar size={44} />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">{t.title}</p>
                  <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-violet-200">
                    {t.aiBadge}
                  </span>
                </div>
                <p className="text-xs text-white/50">{t.subtitle}</p>
              </div>
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
              <div key={index}>
                {msg.role === "assistant" ? (
                  <div className="flex max-w-[92%] gap-2">
                    <GeraldineAvatar size={28} />
                    <div className="min-w-0 flex-1">
                      <div className="rounded-xl rounded-tl-sm bg-white/5 px-3 py-2 text-sm leading-6 text-white/85">
                        {msg.text}
                      </div>
                      {msg.showContact && (
                        <ChatContactLinks
                          profile={profile}
                          labels={t}
                          prompt={turnsRemaining === 0 ? t.noTurns : t.contactPrompt}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="ml-auto max-w-[88%] rounded-xl rounded-tr-sm bg-cyan-400/20 px-3 py-2 text-sm leading-6 text-cyan-50">
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex max-w-[92%] gap-2">
                <GeraldineAvatar size={28} />
                <div className="rounded-xl rounded-tl-sm bg-white/5 px-3 py-2 text-sm text-white/50">
                  {t.thinking}
                </div>
              </div>
            )}
          </div>

          <footer className="border-t border-white/10 px-4 py-3">
            {turnsRemaining > 0 && (
              <p className="mb-2 text-xs text-white/40">{t.turnsLeft(turnsRemaining)}</p>
            )}
            {turnsRemaining === 0 && lastAssistantWithContact === -1 && (
              <ChatContactLinks profile={profile} labels={t} prompt={t.noTurns} />
            )}
            <form onSubmit={sendMessage} className="mt-2 flex gap-2">
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
