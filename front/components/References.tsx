"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/content";
import { REFERENCES } from "@/lib/data";

export default function References() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="references" className="py-28 px-6 bg-white border-t border-navy/06">
      <div className="max-w-7xl mx-auto">
        <p className="text-xl md:text-3xl tracking-[0.3em] uppercase text-[#0F2747] text-center font-bold" style={{ fontFamily: "var(--font-display)" }}>
          {t.references.eyebrow}
        </p>
        <br/>
        <h2
          className="text-2xl md:text-xl font-bold text-center mb-4 text-navy"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t.references.title}
        </h2>
        <p className="text-center text-navy/45 text-sm mb-16 max-w-lg mx-auto leading-relaxed">
          {t.references.intro}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {REFERENCES.map((ref) => (
            <div
              key={ref.file}
              className="group aspect-square flex items-center justify-center p-5 bg-navy/02 border border-navy/06 rounded-sm hover:border-navy/15 hover:bg-navy/03 transition-all duration-300"
            >
              <div className="relative w-full h-full">
                <Image
                  src={`/images/references/${ref.file}`}
                  alt={ref.name}
                  fill
                  className="object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  sizes="(max-width: 768px) 33vw, 16vw"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-[11px] text-navy/30 tracking-wide uppercase">
            {t.references.footer}
          </p>
        </div>
      </div>
    </section>
  );
}
