"use client";

import DocumentsList from "@/components/DocumentsList";
import { PostCategory, PostDocument } from "@/lib/posts";

const CATEGORY_LABELS: Record<PostCategory, string> = {
  actualite: "Actualités",
  publication: "Publications",
  documentation: "Documentation",
};

export default function PostPreview({
  category,
  title,
  excerpt,
  bodyHtml,
  coverImageUrl,
  documents,
  lang,
}: {
  category: PostCategory;
  title: string;
  excerpt: string;
  bodyHtml: string;
  coverImageUrl?: string;
  documents: PostDocument[];
  lang: "fr" | "en";
}) {
  const isEmpty = !title.trim() && !excerpt.trim() && !bodyHtml.trim();

  return (
    <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
      {/* Fake browser chrome so it reads unambiguously as "this is a preview" */}
      <div className="flex items-center gap-2 border-b border-navy/10 bg-navy/[0.03] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-navy/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-navy/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-navy/15" />
        <span className="ml-2 flex-1 truncate rounded-full bg-white px-3 py-1 text-[10px] text-navy/40">
          taxadvisoryconsultants.com/{category === "actualite" ? "actualites" : category === "publication" ? "publications" : "documentation"}/…
        </span>
      </div>

      <div className="max-h-[75vh] overflow-y-auto">
        <div className="border-b border-navy/10 bg-navy/[0.02] px-6 py-2.5">
          <span className="rounded-full bg-navy/[0.08] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy/50">
            Aperçu — {CATEGORY_LABELS[category]} · {lang === "fr" ? "Français" : "English"}
          </span>
        </div>

        {isEmpty ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="text-3xl text-navy/15">✳</span>
            <p className="text-sm text-navy/35">
              Commencez à écrire pour voir apparaître un aperçu fidèle de la page publique ici.
            </p>
          </div>
        ) : (
          <article className="px-6 py-8">
            <h1 className="font-display mb-3 text-2xl font-semibold leading-tight text-navy">
              {title || <span className="text-navy/25">Titre de la publication</span>}
            </h1>
            <time className="mb-6 block text-xs text-navy/40">
              {new Date().toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>

            {coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImageUrl}
                alt={title}
                className="mb-6 w-full rounded-2xl object-cover shadow-sm"
              />
            )}

            {excerpt && (
              <p className="mb-6 whitespace-pre-line text-base text-navy/70">{excerpt}</p>
            )}

            {bodyHtml && (
              <div
                className="prose-content max-w-none text-navy/80"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            )}

            {category === "documentation" && documents.length > 0 && (
              <DocumentsList
                documents={documents}
                title={lang === "en" ? "Downloadable documents" : "Documents téléchargeables"}
              />
            )}
          </article>
        )}
      </div>
    </div>
  );
}
