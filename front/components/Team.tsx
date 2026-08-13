"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/content";
import { TEAM } from "@/lib/data";

export default function Team() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="equipe" className="py-28 px-6 bg-navy">
      <div className="max-w-7xl mx-auto">
        <p className="text-2xl md:text-3xl tracking-[0.3em] uppercase text-[#999a9c] text-center font-black" style={{ fontFamily: "var(--font-display)" }}
        >
          {t.team.eyebrow}
        </p>
        <br/>
        <h2
          className="text-2xl md:text-xl font-bold text-center mb-4 text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t.team.title}
        </h2>
        <p className="text-center text-white/40 text-sm mb-16 max-w-lg mx-auto leading-relaxed">
          {t.team.intro}
        </p>

        {(() => {
          const [manager, ...rest] = TEAM;
          
          // TEAM a 7 éléments:
          // Index 0: Boniface (manager) → retiré par le destructuring
          // rest contient: Yvan(0), Bertrand(1), Philippe(2), Christina(3), Williams(4), Lionel(5)
          
          // Ordre souhaité sur la ligne: Yvan, Bertrand, Christina, Philippe, Williams
          const yvan = rest[0];
          const bertrand = rest[1];
          const christina = rest[3];
          const philippe = rest[2];
          const williams = rest[4];
          const lionel = rest[5];
          
          // Les 5 membres sur la ligne du milieu avec Christina en 3e position
          const middleRow = [yvan, bertrand, christina, philippe, williams];
          
          const renderMember = (member: (typeof TEAM)[number], index: number) => (
            <div
              key={member.name}
              className="flex flex-col items-center text-center group w-48 sm:w-52"
            >
              <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4 border-2 border-white/10 group-hover:border-white/40 transition-all duration-300 flex-shrink-0">
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <h3
                className="text-[13px] font-bold text-white leading-tight mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {member.name}
              </h3>
              <p className="text-[11px] text-white font-medium uppercase tracking-wide mb-2" style={{ fontFamily: "var(--font-display)" }}>
                {t.team.members[index]?.role ?? member.role}
              </p>
              <p className="text-[11px] text-white leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>
                {t.team.members[index]?.detail ?? member.detail}
              </p>
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="mt-2 text-[10px] text-white hover:text-white transition-colors whitespace-nowrap" style={{ fontFamily: "var(--font-display)" }}
                >
                  {member.email}
                </a>
              )}
            </div>
          );

          return (
            <>
              {/* Ligne 1 : Manager centré */}
              <div className="flex justify-center mb-14">
                {renderMember(manager, 0)}
              </div>

              {/* Ligne 2 : 5 membres - Christina en 3e position */}
              {/* Ordre: Yvan (1), Bertrand (2), Christina (4), Philippe (3), Williams (5) */}
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-14">
                {middleRow.map((member, i) => {
                  // Mapping des indices pour les traductions
                  // Yvan → 1, Bertrand → 2, Christina → 4, Philippe → 3, Williams → 5
                  const indexMap = [1, 2, 4, 3, 5];
                  return renderMember(member, indexMap[i]);
                })}
              </div>

              {/* Ligne 3 : Lionel seul centré */}
              <div className="flex justify-center mt-14">
                {renderMember(lionel, 6)}
              </div>
            </>
          );
        })()}
      </div>
    </section>
  );
}