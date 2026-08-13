import { useEffect, useState } from "react";
import type { Language } from "@/context/LanguageContext";
import { Post } from "@/lib/posts";

const cache = new Map<string, Post>();
const inFlight = new Map<string, Promise<Post>>();

function needsTranslation(post: Post): boolean {
  const bodyNeeded = !!post.body.fr?.trim();
  return !post.title.en?.trim() || !post.excerpt.en?.trim() || (bodyNeeded && !post.body.en?.trim());
}

async function fetchTranslation(post: Post): Promise<Post> {
  const existing = inFlight.get(post.id);
  if (existing) return existing;

  const promise = fetch(`/api/posts/${post.id}/translate`, { method: "POST" })
    .then((res) => res.json())
    .then((data: { title?: string; excerpt?: string; body?: string; error?: string }) => {
      if (data.error) throw new Error(data.error);
      const translated: Post = {
        ...post,
        title: { ...post.title, en: data.title },
        excerpt: { ...post.excerpt, en: data.excerpt },
        body: { ...post.body, en: data.body },
      };
      cache.set(post.id, translated);
      return translated;
    })
    .finally(() => {
      inFlight.delete(post.id);
    });

  inFlight.set(post.id, promise);
  return promise;
}

/**
 * Returns the post as-is when browsing in French, or with its English
 * fields filled in automatically (fetched once and cached both client-side
 * and on the server) when the visitor has switched to English.
 */
export function useAutoTranslatedPost(post: Post, lang: Language): Post {
  const [current, setCurrent] = useState<Post>(() => cache.get(post.id) ?? post);

  useEffect(() => {
    setCurrent(cache.get(post.id) ?? post);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id]);

  useEffect(() => {
    if (lang !== "en") return;
    if (!needsTranslation(current)) return;

    let cancelled = false;
    fetchTranslation(post)
      .then((translated) => {
        if (!cancelled) setCurrent(translated);
      })
      .catch(() => {
        // Swallowed on purpose: the visitor keeps seeing the French
        // fallback rather than an error state.
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, post.id, current.title.en, current.excerpt.en, current.body.en]);

  return current;
}
