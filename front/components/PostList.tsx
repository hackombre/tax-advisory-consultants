"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { pickLocalized } from "@/lib/i18n";
import { Post, PostCategory } from "@/lib/posts";
import { useAutoTranslatedPost } from "@/lib/useAutoTranslatedPost";

const EMPTY_MESSAGES: Record<PostCategory, { fr: string; en: string }> = {
  actualite: {
    fr: "Aucune actualité n'est disponible pour le moment.",
    en: "No news is available at the moment.",
  },
  publication: {
    fr: "Aucune publication n'est disponible pour le moment.",
    en: "No publication is available at the moment.",
  },
  documentation: {
    fr: "Aucune documentation n'est disponible pour le moment.",
    en: "No documentation is available at the moment.",
  },
};

function PlaceholderThumb() {
  return (
    <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-navy to-navy-light">
      <span
        className="select-none text-4xl text-white/25"
        style={{ fontFamily: "Georgia, serif" }}
      >
        ✳
      </span>
    </div>
  );
}

function PostCard({ post, basePath }: { post: Post; basePath: string }) {
  const { lang } = useLanguage();
  const localized = useAutoTranslatedPost(post, lang);

  return (
    <Link
      href={`${basePath}/${post.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10"
    >
      {localized.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={localized.coverImageUrl}
          alt={pickLocalized(localized.title, lang)}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <PlaceholderThumb />
      )}

      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-display mb-2 break-words text-lg font-semibold leading-snug text-navy">
          {pickLocalized(localized.title, lang)}
        </h2>
        <p className="mb-4 line-clamp-3 flex-1 whitespace-pre-line break-words text-sm text-navy/60">
          {pickLocalized(localized.excerpt, lang)}
        </p>
        <div className="flex items-center justify-between text-xs">
          <time className="text-navy/40">
            {new Date(localized.createdAt).toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <span className="font-medium uppercase tracking-wide text-accent transition-transform group-hover:translate-x-1">
            {lang === "en" ? "Read →" : "Lire →"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function PostList({
  posts,
  basePath,
  category,
}: {
  posts: Post[];
  basePath: string;
  category: PostCategory;
}) {
  const { lang } = useLanguage();

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-navy/10 bg-navy/[0.03] px-8 py-20 text-center">
        <p className="text-lg text-navy/60">{EMPTY_MESSAGES[category][lang]}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} basePath={basePath} />
      ))}
    </div>
  );
}
