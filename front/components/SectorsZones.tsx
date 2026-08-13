"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/content";

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-3 text-white/60 text-sm leading-relaxed pb-5 border-b border-white/10"
        >
          <span className="text-white/30 mt-0.5">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SectorsZones() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section className="py-28 px-6 bg-navy">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto mb-20 text-center">
          <p className="text-2xl md:text-3xl tracking-[0.3em] uppercase text-white/55 mb-4 font-bold" style={{ fontFamily: "var(--font-display)" }}>
            {t.sectors.eyebrow}
          </p>
          
          <h2
            className="text-2xl md:text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.sectors.title}
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          <div>
            <h3
              className="text-2xl font-bold mb-10 text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.sectors.objetSocial}
            </h3>
            <BulletList items={t.sectors.objetSocialItems} />
          </div>
          <div>
            <h3
              className="text-2xl font-bold mb-10 text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.sectors.secteurs}
            </h3>
            <BulletList items={t.sectors.sectorItems} />
          </div>
          <div>
            <h3
              className="text-2xl font-bold mb-10 text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.sectors.zones}
            </h3>
            <BulletList items={t.sectors.zoneItems} />

            <div className="mt-12 p-8 bg-white">
              <h4
                className="text-xl font-bold text-navy mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t.sectors.contactTitle}
              </h4>
              <p className="text-navy/50 text-sm mb-5 leading-relaxed">
                {t.sectors.contactBody}
              </p>
              <a
                href="#contact"
                className="inline-block px-6 py-3 text-[11px] tracking-[0.18em] uppercase font-semibold bg-navy text-white hover:bg-navy/80 transition-colors"
              >
                {t.sectors.cta} →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}