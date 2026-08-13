"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/content";
import { NAV_LINKS, navLabelFor } from "@/lib/data";

export default function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Filtrer pour garder uniquement les liens principaux (sans les enfants)
  const footerLinks = NAV_LINKS.filter(link => !link.children);

  return (
    <footer className="bg-white border-t border-navy/06">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-12 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-navy text-2xl" style={{ fontFamily: "Georgia, serif" }}>
                ✳
              </span>
              <div>
                <div className="text-sm tracking-[0.16em] text-navy uppercase" style={{ fontFamily: "var(--font-display)" }}>
                  Tax Advisory
                </div>
                <div className="text-sm tracking-[0.16em] text-navy uppercase" style={{ fontFamily: "var(--font-display)" }}>
                  Consultants
                </div>
              </div>
            </div>
            <p className="text-xs text-navy/35 leading-relaxed">
              {lang === "fr"
                ? "Cabinet de conseil fiscal agréé CEMAC — N° SCF 027."
                : "CEMAC-approved tax advisory firm — SCF No. 027."}
              <br />
              {lang === "fr" ? "Inscrit à l'ONCFC sous le N° 2213." : "Registered with the ONCFC under No. 2213."}
            </p>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.16em] uppercase text-navy mb-5" style={{ fontFamily: "var(--font-display)" }}>
              {t.footer.navigation}
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xs text-navy/40 hover:text-navy transition-colors tracking-wide"
                  >
                    {navLabelFor(link.label, t)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.16em] uppercase text-navy mb-5" style={{ fontFamily: "var(--font-display)" }}>
              {t.footer.contact}
            </h4>
            <ul className="space-y-2.5 text-xs text-navy/40">
              <li>Ndogbong, Douala, Cameroun</li>
              <li>675 29 12 66 / 655 61 29 53</li>
              <li>bod@taxadvisoryconsultants.com</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-navy/06">
          <p className="text-[11px] text-navy/30">
            {t.footer.copyright.replace("{year}", String(new Date().getFullYear()))}
          </p>
          <p className="text-[11px] text-navy/30">
            {t.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}