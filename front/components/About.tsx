"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/content";

export default function About() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="apropos" className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-xl md:text-2xl tracking-[0.3em] uppercase text-[#0F2747] text-center font-black" style={{ fontFamily: "var(--font-display)" }}>
            {t.about.eyebrow}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2
              className="text-xl md:text-2xl font-bold mb-6 leading-tight text-navy"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.about.title}
              <br />
              <span className="font-bold text-navy">
              {t.about.titleItalic}
              </span>
            </h2>

            <div className="w-12 h-px bg-navy mb-8" />
            <div className="space-y-4 text-navy/60 leading-relaxed text-[15px]">
              <p>
                <strong className="text-navy font-semibold">Tax Advisory Consultants</strong>{" "}
                {t.about.intro}
              </p>
              <p>{t.about.body1}</p>
              <p>{t.about.body2}</p>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-navy/08 pt-8">
              {t.about.stats.map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-xl font-bold text-navy mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-navy/40 leading-tight uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full border border-navy/10" aria-hidden="true" />
            <div className="relative z-10 w-full h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=700&h=600&fit=crop&auto=format"
                alt="Équipe Tax Advisory Consultants en réunion"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-8 -right-6 z-20 px-6 py-5 bg-navy">
              <div className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                100%
              </div>
              <div className="text-[10px] text-white/50 mt-1 font-medium uppercase tracking-widest">
                {t.about.badge}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
