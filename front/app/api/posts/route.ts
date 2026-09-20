import { NextRequest, NextResponse } from "next/server";

import {
  addPost,
  getAllPosts,
  getPostsByCategory,
  LocalizedText,
  PostCategory,
  PostDocument,
} from "@/lib/posts";

import { isAuthenticated } from "@/lib/auth";
import { normalizeSpaces } from "@/lib/text";
import { syncPostsToGitHub } from "@/lib/github-storage";

const CATEGORIES: PostCategory[] = [
  "actualite",
  "publication",
  "documentation",
];

export async function GET(
  req: NextRequest
) {
  const categoryParam =
    req.nextUrl.searchParams.get(
      "category"
    ) as PostCategory | null;

  if (
    categoryParam &&
    !CATEGORIES.includes(categoryParam)
  ) {
    return NextResponse.json(
      {
        error: "Catégorie invalide.",
      },
      { status: 400 }
    );
  }

  const posts = categoryParam
    ? getPostsByCategory(categoryParam)
    : getAllPosts();

  return NextResponse.json({
    posts,
  });
}

export async function POST(
  req: NextRequest
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      {
        error: "Non autorisé.",
      },
      { status: 401 }
    );
  }

  let payload: {
    category?: PostCategory;
    title?: LocalizedText;
    excerpt?: LocalizedText;
    body?: LocalizedText;
    coverImageUrl?: string;
    videoUrl?: string;
    documents?: PostDocument[];
  };

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      {
        error: "Requête invalide.",
      },
      { status: 400 }
    );
  }

  const {
    category,
    title,
    excerpt,
    body,
    coverImageUrl,
    videoUrl,
    documents,
  } = payload;

  if (
    !category ||
    !CATEGORIES.includes(category)
  ) {
    return NextResponse.json(
      {
        error: "Catégorie invalide.",
      },
      { status: 400 }
    );
  }

  if (!title?.fr?.trim()) {
    return NextResponse.json(
      {
        error:
          "Le titre (au moins en français) est requis.",
      },
      { status: 400 }
    );
  }

  if (!excerpt?.fr?.trim()) {
    return NextResponse.json(
      {
        error:
          "Le texte de présentation (au moins en français) est requis.",
      },
      { status: 400 }
    );
  }

  try {
    const post = addPost({
      category,

      title: {
        fr:
          normalizeSpaces(
            title.fr.trim()
          ) || "",
        en:
          normalizeSpaces(
            title.en?.trim()
          ) || undefined,
      },

      excerpt: {
        fr:
          normalizeSpaces(
            excerpt.fr.trim()
          ) || "",
        en:
          normalizeSpaces(
            excerpt.en?.trim()
          ) || undefined,
      },

      body: {
        fr:
          body?.fr?.trim() ?? "",
        en:
          body?.en?.trim() ||
          undefined,
      },

      coverImageUrl,
      videoUrl,
      documents,
    });

    /*
     * Sauvegarde durable dans GitHub.
     *
     * Le fichier local est d'abord modifié,
     * puis la totalité de posts.json est poussée.
     */
    try {
      await syncPostsToGitHub(
        getAllPosts()
      );
    } catch (githubError) {
      console.error(
        "Erreur synchronisation GitHub:",
        githubError
      );

      return NextResponse.json(
        {
          post,
          warning:
            "Publication créée localement, mais la synchronisation GitHub a échoué.",
        },
        { status: 207 }
      );
    }

    return NextResponse.json({
      post,
      persisted: true,
    });
  } catch (error) {
    console.error(
      "Erreur création publication:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de créer la publication.",
      },
      { status: 500 }
    );
  }
}
