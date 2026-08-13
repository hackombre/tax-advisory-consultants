"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/content";
import { HERO_IMAGE } from "@/lib/data";

interface HeroProps {
  /** Overrides the big headline. Defaults to the company name (homepage). */
  title?: string;
  /** Overrides the small uppercase eyebrow line above the headline. */
  eyebrow?: string;
  /** Overrides the paragraph under the headline. */
  subtitle?: string;
  /** Smaller variant used on inner pages (Actualités/Publications/Documentation) so visitors don't have to scroll a full screen to reach the content. */
  compact?: boolean;
  /** Whether to show the "Découvrir nos services / Nous contacter" buttons. */
  showCtas?: boolean;
}

export default function Hero({
  title,
  eyebrow,
  subtitle,
  compact = false,
  showCtas = true,
}: HeroProps) {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section
      id={compact ? undefined : "hero"}
      className={`relative flex items-center justify-center overflow-hidden ${
        compact ? "min-h-[62vh] pt-28 pb-16" : "min-h-screen"
      }`}
    >
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Bureau professionnel Tax Advisory Consultants"
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              // Dégradé plus clair - opacités réduites
              "linear-gradient(135deg, rgba(6,15,36,0.55) 0%, rgba(11,27,58,0.35) 55%, rgba(6,15,36,0.50) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p className="text-[11px] tracking-[0.35em] uppercase text-white/70 mb-8">
          {eyebrow ?? t.hero.eyebrow}
        </p>
        <h1
          className={`font-bold leading-[1.05] mb-8 text-white ${
            compact ? "text-4xl md:text-6xl" : "text-5xl md:text-7xl"
          }`}
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          {title ?? "TAX  ADVISORY CONSULTANTS"}
        </h1>
        <p className="text-base text-white/70 mb-12 max-w-xl mx-auto leading-relaxed">
          {subtitle ?? t.hero.subtitle}
        </p>
        {showCtas && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={compact ? "/#services" : "#services"}
              className="px-10 py-4 text-[11px] tracking-[0.18em] uppercase font-semibold bg-white text-navy hover:bg-white/90 hover:scale-[1.03] transition-all duration-300"
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href={compact ? "/#contact" : "#contact"}
              className="px-10 py-4 text-[11px] tracking-[0.18em] uppercase font-medium border border-white/40 text-white hover:bg-white/10 hover:border-white/70 hover:scale-[1.03] transition-all duration-300"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>
        )}
      </div>

      {!compact && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      )}
    </section>
  );
}