import { NextRequest, NextResponse } from "next/server";
import { getPostById, updatePost } from "@/lib/posts";
import { translateText, translateHtml } from "@/lib/googleTranslate";
import { getClientKey } from "@/lib/rateLimit";
import { isTranslateRateLimited } from "@/lib/translateRateLimit";

export async function POST(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const post = getPostById(id);

  if (!post) {
    return NextResponse.json({ error: "Publication introuvable." }, { status: 404 });
  }

  const hasTitle = !!post.title.en?.trim();
  const hasExcerpt = !!post.excerpt.en?.trim();
  const bodyNeeded = !!post.body.fr?.trim();
  const hasBody = !bodyNeeded || !!post.body.en?.trim();

  // Already fully translated (or manually authored) — serve instantly, no external call.
  if (hasTitle && hasExcerpt && hasBody) {
    return NextResponse.json({
      title: post.title.en,
      excerpt: post.excerpt.en,
      body: post.body.en ?? "",
    });
  }

  const key = getClientKey(_req);
  if (isTranslateRateLimited(key)) {
    return NextResponse.json({ error: "Trop de requêtes de traduction, réessayez dans un instant." }, {
      status: 429,
    });
  }

  try {
    const [title, excerpt, body] = await Promise.all([
      hasTitle ? Promise.resolve(post.title.en as string) : translateText(post.title.fr, "en"),
      hasExcerpt ? Promise.resolve(post.excerpt.en as string) : translateText(post.excerpt.fr, "en"),
      hasBody ? Promise.resolve(post.body.en ?? "") : translateHtml(post.body.fr, "en"),
    ]);

    // Cache the result on the post itself so every future visitor (and the
    // admin, next time they open this post) gets it instantly with no
    // further translation calls.
    updatePost(id, {
      category: post.category,
      title: { fr: post.title.fr, en: title },
      excerpt: { fr: post.excerpt.fr, en: excerpt },
      body: { fr: post.body.fr, en: body },
      coverImageUrl: post.coverImageUrl,
      videoUrl: post.videoUrl,
      documents: post.documents,
    });

    return NextResponse.json({ title, excerpt, body });
  } catch {
    return NextResponse.json(
      { error: "Échec de la traduction automatique. Réessayez plus tard." },
      { status: 502 }
    );
  }
}
