"use client";

import { useState } from "react";
import type { Portfolio } from "@/lib/api/types";
import { ADMIN_SECTIONS } from "@/lib/api/config";
import * as adminApi from "@/lib/admin-api";
import { Field, FileUploadField, inputClass } from "@/components/admin/FileUploadField";
import { IconifyIconPicker } from "@/components/admin/IconifyIconPicker";
import type { Experience, Study, Technology } from "@/lib/api/types";

type Props = {
  initialPortfolio: Portfolio;
};

type SectionId = (typeof ADMIN_SECTIONS)[number]["id"];

const emptyExperience = {
  company: "",
  description: "",
  company_logo_url: "",
  start_date: "",
  end_date: "",
  is_current: false,
};

const emptyStudy = {
  institution: "",
  degree: "",
  certificate_url: "",
  start_date: "",
  end_date: "",
  is_current: false,
};

const emptyTechnology = {
  name: "",
  description: "",
  icon_url: "",
};

export function AdminPanel({ initialPortfolio }: Props) {
  const [section, setSection] = useState<SectionId>(ADMIN_SECTIONS[0].id);
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [bio, setBio] = useState(portfolio.profile?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(portfolio.profile?.avatar_url ?? "");
  const [resumeUrl, setResumeUrl] = useState(portfolio.profile?.resume_url ?? "");
  const [letterUrl, setLetterUrl] = useState(portfolio.profile?.letter_url ?? "");
  const [expForm, setExpForm] = useState(emptyExperience);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [studyForm, setStudyForm] = useState(emptyStudy);
  const [editingStudyId, setEditingStudyId] = useState<string | null>(null);
  const [techForm, setTechForm] = useState(emptyTechnology);
  const [editingTechId, setEditingTechId] = useState<string | null>(null);

  const currentSection = ADMIN_SECTIONS.find((item) => item.id === section)!;

  async function saveProfile() {
    setLoading(true);
    setStatus("");
    try {
      const profile = await adminApi.saveProfile({
        bio,
        avatar_url: avatarUrl || null,
        resume_url: resumeUrl || null,
        letter_url: letterUrl || null,
      });
      setPortfolio((prev) => ({ ...prev, profile }));
      setAvatarUrl(profile.avatar_url ?? "");
      setResumeUrl(profile.resume_url ?? "");
      setLetterUrl(profile.letter_url ?? "");
      setStatus("Perfil guardado");
    } catch {
      setStatus("Error al guardar perfil");
    } finally {
      setLoading(false);
    }
  }

  function resetExpForm() {
    setExpForm(emptyExperience);
    setEditingExpId(null);
  }

  function editExperience(item: Experience) {
    setEditingExpId(item.id);
    setExpForm({
      company: item.company,
      description: item.description ?? "",
      company_logo_url: item.company_logo_url ?? "",
      start_date: item.start_date,
      end_date: item.end_date ?? "",
      is_current: item.is_current,
    });
  }

  async function saveExperience() {
    if (!expForm.company.trim() || !expForm.start_date) return;
    setLoading(true);
    setStatus("");
    const payload = {
      company: expForm.company.trim(),
      description: expForm.description || null,
      company_logo_url: expForm.company_logo_url || null,
      start_date: expForm.start_date,
      end_date: expForm.is_current ? null : expForm.end_date || null,
      is_current: expForm.is_current,
    };
    try {
      let item: Experience;
      if (editingExpId) {
        item = await adminApi.updateExperience(editingExpId, payload);
        setPortfolio((prev) => ({
          ...prev,
          experience: prev.experience.map((e) => (e.id === item.id ? item : e)),
        }));
      } else {
        item = await adminApi.createExperience(payload);
        setPortfolio((prev) => ({ ...prev, experience: [...prev.experience, item] }));
      }
      resetExpForm();
      setStatus("Experiencia guardada");
    } catch {
      setStatus("Error al guardar experiencia");
    } finally {
      setLoading(false);
    }
  }

  async function removeExperience(id: string) {
    if (!confirm("¿Eliminar esta experiencia?")) return;
    setLoading(true);
    try {
      await adminApi.deleteExperience(id);
      setPortfolio((prev) => ({
        ...prev,
        experience: prev.experience.filter((e) => e.id !== id),
      }));
      if (editingExpId === id) resetExpForm();
      setStatus("Experiencia eliminada");
    } catch {
      setStatus("Error al eliminar");
    } finally {
      setLoading(false);
    }
  }

  function resetStudyForm() {
    setStudyForm(emptyStudy);
    setEditingStudyId(null);
  }

  function editStudy(item: Study) {
    setEditingStudyId(item.id);
    setStudyForm({
      institution: item.institution,
      degree: item.degree,
      certificate_url: item.certificate_url ?? "",
      start_date: item.start_date ?? "",
      end_date: item.end_date ?? "",
      is_current: item.is_current,
    });
  }

  async function saveStudy() {
    if (!studyForm.institution.trim() || !studyForm.degree.trim()) return;
    setLoading(true);
    const payload = {
      institution: studyForm.institution.trim(),
      degree: studyForm.degree.trim(),
      certificate_url: studyForm.certificate_url || null,
      start_date: studyForm.start_date || null,
      end_date: studyForm.is_current ? null : studyForm.end_date || null,
      is_current: studyForm.is_current,
    };
    try {
      let item: Study;
      if (editingStudyId) {
        item = await adminApi.updateStudy(editingStudyId, payload);
        setPortfolio((prev) => ({
          ...prev,
          studies: prev.studies.map((s) => (s.id === item.id ? item : s)),
        }));
      } else {
        item = await adminApi.createStudy(payload);
        setPortfolio((prev) => ({ ...prev, studies: [...prev.studies, item] }));
      }
      resetStudyForm();
      setStatus("Estudio guardado");
    } catch {
      setStatus("Error al guardar estudio");
    } finally {
      setLoading(false);
    }
  }

  async function removeStudy(id: string) {
    if (!confirm("¿Eliminar este estudio?")) return;
    setLoading(true);
    try {
      await adminApi.deleteStudy(id);
      setPortfolio((prev) => ({
        ...prev,
        studies: prev.studies.filter((s) => s.id !== id),
      }));
      if (editingStudyId === id) resetStudyForm();
      setStatus("Estudio eliminado");
    } catch {
      setStatus("Error al eliminar");
    } finally {
      setLoading(false);
    }
  }

  function resetTechForm() {
    setTechForm(emptyTechnology);
    setEditingTechId(null);
  }

  function editTechnology(item: Technology) {
    setEditingTechId(item.id);
    setTechForm({
      name: item.name,
      description: item.description ?? "",
      icon_url: item.icon_url ?? "",
    });
  }

  async function saveTechnology() {
    if (!techForm.name.trim()) return;
    setLoading(true);
    const payload = {
      name: techForm.name.trim(),
      description: techForm.description || null,
      icon_url: techForm.icon_url || null,
    };
    try {
      let item: Technology;
      if (editingTechId) {
        item = await adminApi.updateTechnology(editingTechId, payload);
        setPortfolio((prev) => ({
          ...prev,
          technologies: prev.technologies.map((t) => (t.id === item.id ? item : t)),
        }));
      } else {
        item = await adminApi.createTechnology(payload);
        setPortfolio((prev) => ({ ...prev, technologies: [...prev.technologies, item] }));
      }
      resetTechForm();
      setStatus("Tecnología guardada");
    } catch {
      setStatus("Error al guardar tecnología");
    } finally {
      setLoading(false);
    }
  }

  async function removeTechnology(id: string) {
    if (!confirm("¿Eliminar esta tecnología?")) return;
    setLoading(true);
    try {
      await adminApi.deleteTechnology(id);
      setPortfolio((prev) => ({
        ...prev,
        technologies: prev.technologies.filter((t) => t.id !== id),
      }));
      if (editingTechId === id) resetTechForm();
      setStatus("Tecnología eliminada");
    } catch {
      setStatus("Error al eliminar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-2">
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-cyan-400/80">Secciones</p>
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
        <div>
          <h1 className="text-3xl font-bold text-white">{currentSection.label}</h1>
          <p className="text-sm text-white/50">Tabla: {currentSection.table}</p>
        </div>

        {status && <p className="text-sm text-cyan-300">{status}</p>}

        {section === "profile" && (
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
            <Field label="Texto del perfil (única entrada)">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={6}
                className={inputClass}
                placeholder="Descripción profesional..."
              />
            </Field>
            <FileUploadField
              label="Foto de perfil"
              accept="image/*"
              previewUrl={avatarUrl}
              uploading={uploading}
              onUploadStart={() => setUploading(true)}
              onUploadEnd={() => setUploading(false)}
              upload={adminApi.uploadFile}
              onUploaded={setAvatarUrl}
            />
            <FileUploadField
              label="Hoja de vida (CV)"
              accept="application/pdf,image/*"
              previewUrl={resumeUrl}
              uploading={uploading}
              onUploadStart={() => setUploading(true)}
              onUploadEnd={() => setUploading(false)}
              upload={adminApi.uploadFile}
              onUploaded={setResumeUrl}
            />
            <FileUploadField
              label="Carta de presentación"
              accept="application/pdf,image/*"
              previewUrl={letterUrl}
              uploading={uploading}
              onUploadStart={() => setUploading(true)}
              onUploadEnd={() => setUploading(false)}
              upload={adminApi.uploadFile}
              onUploaded={setLetterUrl}
            />
            <button
              type="button"
              onClick={saveProfile}
              disabled={loading}
              className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-300 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar perfil"}
            </button>
          </article>
        )}

        {section === "experience" && (
          <div className="space-y-6">
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
              <h2 className="text-lg font-semibold text-white">
                {editingExpId ? "Editar experiencia" : "Nueva experiencia"}
              </h2>
              <Field label="Empresa">
                <input
                  className={inputClass}
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                />
              </Field>
              <Field label="Descripción">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                />
              </Field>
              <FileUploadField
                label="Logo / imagen"
                previewUrl={expForm.company_logo_url}
                uploading={uploading}
                onUploadStart={() => setUploading(true)}
                onUploadEnd={() => setUploading(false)}
                upload={adminApi.uploadFile}
                onUploaded={(url) => setExpForm({ ...expForm, company_logo_url: url })}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Fecha inicio">
                  <input
                    type="date"
                    className={inputClass}
                    value={expForm.start_date}
                    onChange={(e) => setExpForm({ ...expForm, start_date: e.target.value })}
                  />
                </Field>
                <Field label="Fecha fin">
                  <input
                    type="date"
                    className={inputClass}
                    value={expForm.end_date}
                    disabled={expForm.is_current}
                    onChange={(e) => setExpForm({ ...expForm, end_date: e.target.value })}
                  />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={expForm.is_current}
                  onChange={(e) =>
                    setExpForm({
                      ...expForm,
                      is_current: e.target.checked,
                      end_date: e.target.checked ? "" : expForm.end_date,
                    })
                  }
                />
                Actualmente trabajo aquí
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveExperience}
                  disabled={loading}
                  className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-black"
                >
                  {loading ? "Guardando..." : editingExpId ? "Actualizar" : "Agregar"}
                </button>
                {editingExpId && (
                  <button
                    type="button"
                    onClick={resetExpForm}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </article>

            <div className="space-y-3">
              {portfolio.experience.map((item) => (
                <article
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div>
                    <p className="font-semibold text-white">{item.company}</p>
                    <p className="text-sm text-white/50">
                      {item.start_date} — {item.is_current ? "Actualmente" : item.end_date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editExperience(item)}
                      className="text-sm text-cyan-300"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeExperience(item.id)}
                      className="text-sm text-red-400"
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {section === "studies" && (
          <div className="space-y-6">
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
              <h2 className="text-lg font-semibold text-white">
                {editingStudyId ? "Editar estudio" : "Nuevo estudio"}
              </h2>
              <FileUploadField
                label="Foto / certificado"
                previewUrl={studyForm.certificate_url}
                uploading={uploading}
                onUploadStart={() => setUploading(true)}
                onUploadEnd={() => setUploading(false)}
                upload={adminApi.uploadFile}
                onUploaded={(url) => setStudyForm({ ...studyForm, certificate_url: url })}
              />
              <Field label="Institución">
                <input
                  className={inputClass}
                  value={studyForm.institution}
                  onChange={(e) => setStudyForm({ ...studyForm, institution: e.target.value })}
                />
              </Field>
              <Field label="Título">
                <input
                  className={inputClass}
                  value={studyForm.degree}
                  onChange={(e) => setStudyForm({ ...studyForm, degree: e.target.value })}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Fecha inicio">
                  <input
                    type="date"
                    className={inputClass}
                    value={studyForm.start_date}
                    onChange={(e) => setStudyForm({ ...studyForm, start_date: e.target.value })}
                  />
                </Field>
                <Field label="Fecha fin">
                  <input
                    type="date"
                    className={inputClass}
                    value={studyForm.end_date}
                    disabled={studyForm.is_current}
                    onChange={(e) => setStudyForm({ ...studyForm, end_date: e.target.value })}
                  />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={studyForm.is_current}
                  onChange={(e) =>
                    setStudyForm({
                      ...studyForm,
                      is_current: e.target.checked,
                      end_date: e.target.checked ? "" : studyForm.end_date,
                    })
                  }
                />
                Actualmente estoy estudiando
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveStudy}
                  disabled={loading}
                  className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-black"
                >
                  {loading ? "Guardando..." : editingStudyId ? "Actualizar" : "Agregar"}
                </button>
                {editingStudyId && (
                  <button type="button" onClick={resetStudyForm} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70">
                    Cancelar
                  </button>
                )}
              </div>
            </article>

            <div className="space-y-3">
              {portfolio.studies.map((item) => (
                <article
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div>
                    <p className="font-semibold text-white">{item.degree}</p>
                    <p className="text-sm text-cyan-300">{item.institution}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => editStudy(item)} className="text-sm text-cyan-300">
                      Editar
                    </button>
                    <button type="button" onClick={() => removeStudy(item.id)} className="text-sm text-red-400">
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {section === "technologies" && (
          <div className="space-y-6">
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
              <h2 className="text-lg font-semibold text-white">
                {editingTechId ? "Editar tecnología" : "Nueva tecnología"}
              </h2>
              <IconifyIconPicker
                value={techForm.icon_url}
                onChange={(url) => setTechForm({ ...techForm, icon_url: url })}
                defaultQuery={techForm.name}
              />
              <Field label="Título">
                <input
                  className={inputClass}
                  value={techForm.name}
                  onChange={(e) => setTechForm({ ...techForm, name: e.target.value })}
                />
              </Field>
              <Field label="Descripción">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={techForm.description}
                  onChange={(e) => setTechForm({ ...techForm, description: e.target.value })}
                />
              </Field>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveTechnology}
                  disabled={loading}
                  className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-black"
                >
                  {loading ? "Guardando..." : editingTechId ? "Actualizar" : "Agregar"}
                </button>
                {editingTechId && (
                  <button type="button" onClick={resetTechForm} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70">
                    Cancelar
                  </button>
                )}
              </div>
            </article>

            <div className="space-y-3">
              {portfolio.technologies.map((item) => (
                <article
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex items-center gap-3">
                    {item.icon_url && (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.icon_url} alt="" className="h-full w-full object-contain" />
                      </span>
                    )}
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-white/50">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => editTechnology(item)} className="text-sm text-cyan-300">
                      Editar
                    </button>
                    <button type="button" onClick={() => removeTechnology(item.id)} className="text-sm text-red-400">
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
