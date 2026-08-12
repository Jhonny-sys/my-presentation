"use client";

import { useState, type ReactNode } from "react";
import type { PersonalInfo } from "@/lib/api/types";
import { normalizeExternalUrl, whatsAppWebUrl } from "@/lib/contact";
import { EmailComposeModal } from "@/components/landing/EmailComposeModal";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  WhatsAppIcon,
} from "@/components/landing/ContactIcons";

type Props = {
  profile?: PersonalInfo | null;
};

type ContactChipProps = {
  label: string;
  icon: ReactNode;
  iconBg: string;
  glow: string;
  border: string;
  text: string;
  hoverBg: string;
  onClick?: () => void;
  href?: string;
};

function ContactChip({
  label,
  icon,
  iconBg,
  glow,
  border,
  text,
  hoverBg,
  onClick,
  href,
}: ContactChipProps) {
  const className = `group inline-flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm font-medium transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${border} ${text} ${hoverBg}`;

  const content = (
    <>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg} transition group-hover:scale-110`}
        style={{ boxShadow: glow }}
      >
        {icon}
      </span>
      <span className="max-w-[200px] truncate sm:max-w-xs">{label}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export function ContactInfo({ profile }: Props) {
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const github = profile?.social_links?.github?.trim();
  const linkedin = profile?.social_links?.linkedin?.trim();
  const email = profile?.email?.trim();
  const phone = profile?.phone?.trim();
  const whatsappUrl = phone ? whatsAppWebUrl(phone) : "";

  const hasAny = github || linkedin || email || phone;
  if (!hasAny) return null;

  return (
    <>
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-400/70">Información</p>
        <div className="flex flex-wrap gap-3">
          {github && (
            <ContactChip
              label="GitHub"
              href={normalizeExternalUrl(github)}
              icon={<GitHubIcon className="h-5 w-5 text-white" />}
              iconBg="bg-[#24292f]"
              glow="0 0 20px rgba(255,255,255,0.15)"
              border="border-white/15 bg-white/[0.04]"
              text="text-white/90"
              hoverBg="hover:bg-white/10 hover:border-white/25"
            />
          )}
          {linkedin && (
            <ContactChip
              label="LinkedIn"
              href={normalizeExternalUrl(linkedin)}
              icon={<LinkedInIcon className="h-5 w-5 text-white" />}
              iconBg="bg-[#0A66C2]"
              glow="0 0 22px rgba(10,102,194,0.55)"
              border="border-blue-400/30 bg-blue-500/10"
              text="text-blue-50"
              hoverBg="hover:bg-blue-500/20 hover:border-blue-400/50"
            />
          )}
          {email && (
            <ContactChip
              label={email}
              onClick={() => setEmailModalOpen(true)}
              icon={<MailIcon className="h-5 w-5 text-amber-100" />}
              iconBg="bg-gradient-to-br from-amber-400 to-orange-500"
              glow="0 0 22px rgba(251,191,36,0.45)"
              border="border-amber-400/30 bg-amber-500/10"
              text="text-amber-50"
              hoverBg="hover:bg-amber-500/20 hover:border-amber-400/50"
            />
          )}
          {phone && whatsappUrl && (
            <ContactChip
              label={phone}
              href={whatsappUrl}
              icon={<WhatsAppIcon className="h-5 w-5 text-white" />}
              iconBg="bg-[#25D366]"
              glow="0 0 22px rgba(37,211,102,0.5)"
              border="border-emerald-400/30 bg-emerald-500/10"
              text="text-emerald-50"
              hoverBg="hover:bg-emerald-500/20 hover:border-emerald-400/50"
            />
          )}
        </div>
      </div>

      {email && (
        <EmailComposeModal
          open={emailModalOpen}
          email={email}
          onClose={() => setEmailModalOpen(false)}
        />
      )}
    </>
  );
}
