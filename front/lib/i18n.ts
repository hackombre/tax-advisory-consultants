import type { Language } from "@/context/LanguageContext";
import type { LocalizedText } from "@/lib/posts";

export function pickLocalized(text: LocalizedText | undefined, lang: Language): string {
  if (!text) return "";
  if (lang === "en" && text.en && text.en.trim()) return text.en;
  return text.fr;
}
