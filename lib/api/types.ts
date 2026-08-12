export type SocialLinks = {
  github?: string | null;
  linkedin?: string | null;
  website?: string | null;
};

export type PersonalInfo = {
  id: string;
  full_name: string;
  headline: string;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  resume_url?: string | null;
  social_links: SocialLinks;
  available_for_work: boolean;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  description?: string | null;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  location?: string | null;
  company_logo_url?: string | null;
  highlights: string[];
};

export type Study = {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current: boolean;
  certificate_url?: string | null;
};

export type Technology = {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  proficiency?: number | null;
  icon_url?: string | null;
  is_featured: boolean;
};

export type Portfolio = {
  profile: PersonalInfo | null;
  experience: Experience[];
  studies: Study[];
  technologies: Technology[];
};

export type I18nEntry = {
  id: string;
  key: string;
  namespace?: string | null;
  source_lang: string;
  source_text: string;
  description?: string | null;
  translations: Record<string, string>;
};

export type I18nBundle = {
  lang: string;
  messages: Record<string, string>;
};

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in: number;
  refresh_expires_in: number;
};
