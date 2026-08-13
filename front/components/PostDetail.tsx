"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { pickLocalized } from "@/lib/i18n";
import { extractToc, TocItem } from "@/lib/toc";
import { Post, PostCategory } from "@/lib/posts";
import { useAutoTranslatedPost } from "@/lib/useAutoTranslatedPost";
import TableOfContents from "@/components/TableOfContents";
import DocumentsList from "@/components/DocumentsList";

const BACK_LABELS: Record<PostCategory, { fr: string; en: string }> = {
  actualite: { fr: "Toutes les actualités", en: "All news" },
  publication: { fr: "Toutes les publications", en: "All publications" },
  documentation: { fr: "Toute la documentation", en: "All documentation" },
};

export default function PostDetail({ post, basePath }: { post: Post; basePath: string }) {
  const { lang } = useLanguage();
  const localized = useAutoTranslatedPost(post, lang);
  const contentRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);

  const html = pickLocalized(localized.body, lang);

  useEffect(() => {
    if (contentRef.current) {
      setToc(extractToc(contentRef.current));
    }
  }, [html]);

  const backLabel = BACK_LABELS[post.category][lang];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-36">
      <Link
        href={basePath}
        className="mb-8 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent transition-colors hover:text-navy"
      >
        ← {backLabel}
      </Link>

      <div className="flex gap-16">
        <article className="min-w-0 flex-1">
          <h1 className="font-display mb-3 break-words text-3xl font-semibold leading-tight text-navy md:text-4xl">
            {pickLocalized(localized.title, lang)}
          </h1>
          <time className="mb-8 block text-sm text-navy/40">
            {new Date(localized.createdAt).toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>

          {localized.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={localized.coverImageUrl}
              alt={pickLocalized(localized.title, lang)}
              className="mb-8 w-full rounded-2xl object-cover shadow-sm"
            />
          )}

          {localized.videoUrl && (
            <video
              src={localized.videoUrl}
              controls
              className="mb-8 w-full rounded-2xl bg-black shadow-sm"
            />
          )}

          <p className="mb-8 whitespace-pre-line break-words text-lg text-navy/70">
            {pickLocalized(localized.excerpt, lang)}
          </p>

          {html && (
            <div
              ref={contentRef}
              className="prose-content max-w-none text-navy/80"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}

          {localized.documents && localized.documents.length > 0 && (
            <DocumentsList
              documents={localized.documents}
              title={lang === "en" ? "Downloadable documents" : "Documents téléchargeables"}
            />
          )}
        </article>

        <TableOfContents items={toc} title={lang === "en" ? "Contents" : "Sommaire"} />
      </div>
    </div>
  );
}
