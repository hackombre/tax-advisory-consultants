"use client";

import { useLanguage } from "@/context/LanguageContext";
import Hero from "@/components/Hero";
import { PostCategory } from "@/lib/posts";

const COPY: Record<PostCategory, { fr: [string, string, string]; en: [string, string, string] }> = {
  actualite: {
    fr: ["Espace actualités", "ACTUALITÉS", "Les dernières informations et actualités du cabinet."],
    en: ["News section", "NEWS", "The firm's latest news and updates."],
  },
  publication: {
    fr: [
      "Espace publications",
      "PUBLICATIONS",
      "Articles, notes et contenus publiés par le cabinet.",
    ],
    en: ["Publications section", "PUBLICATIONS", "Articles, notes and content published by the firm."],
  },
  documentation: {
    fr: [
      "Espace documentation",
      "DOCUMENTATION",
      "Ressources et documents mis à disposition par le cabinet.",
    ],
    en: [
      "Documentation section",
      "DOCUMENTATION",
      "Resources and documents made available by the firm.",
    ],
  },
};

export default function CategoryHero({ category }: { category: PostCategory }) {
  const { lang } = useLanguage();
  const [eyebrow, title, subtitle] = COPY[category][lang];

  return <Hero showCtas={false} eyebrow={eyebrow} title={title} subtitle={subtitle} />;
}
