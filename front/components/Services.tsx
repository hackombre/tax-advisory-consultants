"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/content";

export default function Services() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="services" className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto mb-20 text-center">
          <p className="text-xl md:text-3xl tracking-[0.3em] uppercase text-[#0F2747] text-center font-bold" style={{ fontFamily: "var(--font-display)" }}>
            {t.services.eyebrow}
          </p>
          <br/>
          <h2
            className="text-2xl md:text-xl font-bold mb-5 leading-tight text-navy"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.services.title}
            <br />
            <span className="font-bold text-black">
              {t.services.titleItalic}
            </span>
          </h2>
          <p className="text-navy/50 text-[15px] leading-relaxed">
            {t.services.intro}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 border-t border-l border-navy/08">
          {t.services.items.map((svc, index) => (
            <div
              key={`${svc.title}-${index}`}
              className="group p-8 border-r border-b border-navy/08 hover:bg-navy transition-all duration-300 cursor-default"
            >
              <div className="text-[11px] tracking-[0.25em] text-navy/25 group-hover:text-white/30 mb-5 font-medium">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3
                className="text-lg font-semibold mb-3 text-navy group-hover:text-white transition-colors leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {svc.title}
              </h3>
              <p className="text-sm text-navy/50 group-hover:text-white/45 leading-relaxed transition-colors">
                {svc.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
