"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { NAV_LINKS, navLabelFor } from "@/lib/data";
import { translations } from "@/lib/content";

type NavIcon = "quisommesnous" | "atouts" | "services" | "references" | "equipe";

function Icon({ name, className }: { name: NavIcon; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "quisommesnous":
      return (
        <svg {...common}>
          <path d="M5 20.5V9.2L12 4l7 5.2v11.3" />
          <path d="M9 20.5v-6.2h6v6.2" />
          <path d="M9.5 9.7h1.2M13.3 9.7h1.2" />
        </svg>
      );
    case "atouts":
      return (
        <svg {...common}>
          <path d="M12 2.5l7 3.2v5.4c0 4.6-3 8.6-7 9.9-4-1.3-7-5.3-7-9.9V5.7l7-3.2z" />
          <path d="M9 12l2 2 4-4.2" />
        </svg>
      );
    case "services":
      return (
        <svg {...common}>
          <rect x="3.5" y="7.5" width="17" height="12" rx="1.6" />
          <path d="M8.5 7.5V6a2 2 0 012-2h3a2 2 0 012 2v1.5" />
          <path d="M3.5 12.5h17" />
        </svg>
      );
    case "references":
      return (
        <svg {...common}>
          <path d="M8 12.5l2.4 2.4L16.5 8.7" />
          <circle cx="12" cy="12" r="8.5" />
        </svg>
      );
    case "equipe":
      return (
        <svg {...common}>
          <circle cx="9" cy="8.5" r="2.6" />
          <path d="M3.8 19c.6-3 2.6-4.7 5.2-4.7s4.6 1.7 5.2 4.7" />
          <circle cx="17" cy="8.7" r="2.1" />
          <path d="M15.6 14.5c2.1.3 3.6 1.8 4.1 4.2" />
        </svg>
      );
  }
}

function labelFor(label: string, t: (typeof translations)[keyof typeof translations]) {
  return navLabelFor(label, t);
}

export default function Header({ alwaysSolid = false }: { alwaysSolid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const { lang, setLanguage } = useLanguage();
  const t = translations[lang];
  const solid = alwaysSolid || scrolled;

  useEffect(() => {
    if (alwaysSolid) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysSolid]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: solid ? "rgba(11,27,58,0.94)" : "transparent",
        backdropFilter: solid ? "blur(14px)" : "none",
        borderBottom: solid ? "1px solid rgba(255,255,255,0.08)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 group">
          <span
            className="text-2xl select-none transition-transform group-hover:rotate-12 duration-300 inline-block text-white"
            style={{ fontFamily: "Georgia, serif" }}
          >
            ✳
          </span>
          <div>
            <div className="text-[10px] tracking-[0.25em] font-bold uppercase leading-none transition-colors duration-500 text-white">
              Tax Advisory
            </div>
            <div className="text-sm tracking-[0.12em] font-bold uppercase leading-tight transition-colors duration-500 text-white">
              Consultants
            </div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => link.children && setOpenDropdown(link.href)}
              onMouseLeave={() => link.children && setOpenDropdown(null)}
            >
              <a
                href={link.href}
                className="flex items-center gap-1 text-[11px] tracking-[0.12em] uppercase transition-colors duration-500 font-medium text-white/70 hover:text-white"
              >
                {labelFor(link.label, t)}
                {link.children && (
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 10 6"
                    fill="none"
                    className={`transition-transform duration-300 ${openDropdown === link.href ? "rotate-180" : ""}`}
                  >
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </a>

              {link.children && (
                <div
                  className="absolute left-1/2 top-full -translate-x-1/2 pt-4 transition-all duration-200"
                  style={{
                    opacity: openDropdown === link.href ? 1 : 0,
                    visibility: openDropdown === link.href ? "visible" : "hidden",
                    transform: `translateX(-50%) translateY(${openDropdown === link.href ? "0" : "-6px"})`,
                  }}
                >
                  <div className="min-w-[220px] rounded-xl bg-navy shadow-2xl shadow-navy-deep/40 border border-white/10 py-2 overflow-hidden">
                    {link.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        className="flex items-center gap-3 px-5 py-3 text-[11px] tracking-[0.1em] uppercase font-medium text-white/65 hover:text-white hover:bg-white/06 transition-colors"
                      >
                        <Icon name={child.icon as NavIcon} className="w-4 h-4 flex-shrink-0" />
                        {labelFor(child.label, t)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setLanguage(lang === "fr" ? "en" : "fr")}
            className="ml-3 rounded-full border px-3 py-1 text-[10px] tracking-[0.2em] uppercase transition-colors border-white/30 text-white/80 hover:text-white hover:border-white/60"
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>
        </nav>

        <button
          className="lg:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span
            className="block w-6 h-px transition-all duration-200 bg-white"
            style={{ transform: mobileOpen ? "rotate(45deg) translate(2px, 2px)" : "" }}
          />
          <span
            className="block w-6 h-px transition-all duration-200 bg-white"
            style={{ opacity: mobileOpen ? 0 : 1 }}
          />
          <span
            className="block w-6 h-px transition-all duration-200 bg-white"
            style={{ transform: mobileOpen ? "rotate(-45deg) translate(2px, -2px)" : "" }}
          />
        </button>
      </div>

      <div
        className="lg:hidden overflow-hidden transition-all duration-300 bg-navy border-t border-white/08"
        style={{ maxHeight: mobileOpen ? "560px" : "0" }}
      >
        <nav className="flex flex-col px-6 pb-6 pt-3 gap-1">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div key={link.href} className="border-b border-white/08">
                <button
                  type="button"
                  onClick={() =>
                    setMobileDropdown(mobileDropdown === link.href ? null : link.href)
                  }
                  className="w-full flex items-center justify-between text-sm tracking-[0.08em] uppercase text-white/70 hover:text-white py-3 transition-colors"
                >
                  {labelFor(link.label, t)}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 6"
                    fill="none"
                    className={`transition-transform duration-300 ${mobileDropdown === link.href ? "rotate-180" : ""}`}
                  >
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: mobileDropdown === link.href ? "240px" : "0" }}
                >
                  <div className="flex flex-col pb-2 pl-1">
                    {link.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        onClick={() => {
                          setMobileOpen(false);
                          setMobileDropdown(null);
                        }}
                        className="flex items-center gap-3 text-[13px] tracking-[0.06em] uppercase text-white/55 hover:text-white py-2.5 transition-colors"
                      >
                        <Icon name={child.icon as NavIcon} className="w-4 h-4 flex-shrink-0" />
                        {labelFor(child.label, t)}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm tracking-[0.08em] uppercase text-white/70 hover:text-white py-3 border-b border-white/08 transition-colors"
              >
                {labelFor(link.label, t)}
              </a>
            )
          )}
          <button
            type="button"
            onClick={() => {
              setLanguage(lang === "fr" ? "en" : "fr");
              setMobileOpen(false);
            }}
            className="mt-2 self-start rounded-full border border-white/30 px-3 py-2 text-[10px] tracking-[0.2em] uppercase text-white/80"
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>
        </nav>
      </div>
    </header>
  );
}