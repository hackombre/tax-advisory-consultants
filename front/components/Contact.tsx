"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/content";

const INFO_ITEMS = [
  { icon: "location_on", label: "Adresse", value: "Ndogbong, Douala, Cameroun" },
  { icon: "call", label: "Téléphone", value: "+237 675 29 12 66 / +237 655 61 29 53" },
  { icon: "mail", label: "E-mail", value: "bod@taxadvisoryconsultants.com" },
];

type FormData = {
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  message: string;
};

const inputStyle = {
  backgroundColor: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(0,0,0,0.15)",
};

function onFocusBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = "rgba(0,0,0,0.45)";
}
function onBlurBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = "rgba(0,0,0,0.15)";
}

export default function Contact() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [formData, setFormData] = useState<FormData>({
    prenom: "",
    nom: "",
    telephone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setFormData({ prenom: "", nom: "", telephone: "", email: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="py-32 px-6 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <p className="text-2xl md:text-xl tracking-[0.3em] uppercase text-[#0F2747] mb-4 text-center font-bold" style={{ fontFamily: "var(--font-display)" }}>
              {t.contact.eyebrow}
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold mb-8 leading-tight text-navy"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.contact.title}
              <br />
              <span className="font-bold text-navy">{t.contact.titleItalic}</span>
            </h2>
            <p className="text-navy/70 mb-12 leading-relaxed text-[15px]">
              {t.contact.intro}
            </p>

            <div className="space-y-7">
              {INFO_ITEMS.map((item) => (
                <div key={item.label} className="flex items-start gap-5">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 border border-navy/20 text-navy/80">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.15em] uppercase text-navy/45 mb-1">
                      {item.label === "Adresse"
                        ? t.contact.infoLabel
                        : item.label === "Téléphone"
                          ? t.contact.phoneLabel
                          : t.contact.emailLabel}
                    </div>
                    <div className="text-navy/85 text-sm">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] tracking-[0.18em] uppercase text-navy/50 mb-2">
                  {t.contact.firstName} <span className="text-navy/60">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className="w-full px-4 py-3 text-sm text-navy outline-none transition-colors"
                  style={inputStyle}
                  onFocus={onFocusBorder}
                  onBlur={onBlurBorder}
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.18em] uppercase text-navy/50 mb-2">
                  {t.contact.lastName} <span className="text-navy/60">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-4 py-3 text-sm text-navy outline-none transition-colors"
                  style={inputStyle}
                  onFocus={onFocusBorder}
                  onBlur={onBlurBorder}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.18em] uppercase text-navy/50 mb-2">
                {t.contact.phone} <span className="text-navy/60">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder={t.contact.placeholder}
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="w-full px-4 py-3 text-sm text-navy placeholder:text-navy/35 outline-none transition-colors"
                style={inputStyle}
                onFocus={onFocusBorder}
                onBlur={onBlurBorder}
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.18em] uppercase text-navy/50 mb-2">
                {t.contact.emailLabel} <span className="text-navy/60">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 text-sm text-navy placeholder:text-navy/35 outline-none transition-colors"
                style={inputStyle}
                onFocus={onFocusBorder}
                onBlur={onBlurBorder}
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.18em] uppercase text-navy/50 mb-2">
                {t.contact.message} <span className="text-navy/60">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 text-sm text-navy resize-none outline-none transition-colors"
                style={inputStyle}
                onFocus={onFocusBorder}
                onBlur={onBlurBorder}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 text-[11px] tracking-[0.2em] uppercase font-semibold bg-navy text-white hover:bg-navy/85 disabled:opacity-50 transition-all duration-200"
            >
              {status === "loading" ? t.contact.loading : t.contact.submit}
            </button>

            {status === "success" && (
              <div className="text-center py-3 text-sm text-navy/70 border border-navy/20">
                {t.contact.success}
              </div>
            )}
            {status === "error" && (
              <div className="text-center py-3 text-sm text-red-800 border border-red-800/25">
                {t.contact.error}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}