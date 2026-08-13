"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/content";

export default function Atouts() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="atouts" className="py-32 px-6 bg-[#eaeaece6]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <p
            className="text-2xl md:text-3xl tracking-[0.3em] uppercase text-[#0F2747] text-center font-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.atouts.eyebrow}
          </p>
          <br/>
         <h2 
            className="text-2xl md:text-xl font-bold mb-5 leading-tight text-navy" 
            style={{ fontFamily: "var(--font-display)" }} 
          > 
            {t.atouts.title} 
            <br /> 
              <span className="font-bold text-navy/35"> 
                {t.atouts.titleItalic} 
              </span> 
         </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {t.atouts.items.map((atout, index) => (
            <div
              key={atout.title}
              className="rounded-none border border-navy/08 bg-white p-8 shadow-sm"
            >
              <div className="text-[11px] tracking-[0.25em] text-navy/25 mb-5 font-medium">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3
                className="text-xl font-semibold mb-4 text-navy leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {atout.title}
              </h3>
              <p className="text-sm text-navy/60 leading-relaxed">
                {atout.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
