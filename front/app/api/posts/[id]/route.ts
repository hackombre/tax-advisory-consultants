import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
  LocalizedText,
  PostCategory,
  PostDocument,
  serializePosts,
} from "@/lib/posts";

import { isAuthenticated } from "@/lib/auth";
import { normalizeSpaces } from "@/lib/text";
import { syncPostsToGitHub } from "@/lib/github-storage";

export const dynamic = "force-dynamic";

const CATEGORIES: PostCategory[] = [
  "actualite",
  "publication",
  "documentation",
];

export async function DELETE(
  _req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      {
        error: "Non autorisé.",
      },
      {
        status: 401,
      }
    );
  }

  const { id } = await context.params;

  const existing = getPostById(id);

  if (!existing) {
    return NextResponse.json(
      {
        error: "Publication introuvable.",
      },
      {
        status: 404,
      }
    );
  }

  try {
    deletePost(id);

    await syncPostsToGitHub(
      serializePosts(getAllPosts()),
      `content: suppression ${existing.category} ${id}`
    );

    return NextResponse.json({
      success: true,
      savedToGitHub: true,
    });
  } catch (error) {
    console.error(
      "Erreur suppression publication:",
      error
    );

    return NextResponse.json(
      {
        error:
          "La suppression locale a été effectuée mais la synchronisation GitHub a échoué.",
        details:
          error instanceof Error
            ? error.message
            : "Erreur inconnue",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      {
        error: "Non autorisé.",
      },
      {
        status: 401,
      }
    );
  }

  const { id } = await context.params;

  const existing = getPostById(id);

  if (!existing) {
    return NextResponse.json(
      {
        error: "Publication introuvable.",
      },
      {
        status: 404,
      }
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
      {
        status: 400,
      }
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
    category &&
    !CATEGORIES.includes(category)
  ) {
    return NextResponse.json(
      {
        error: "Catégorie invalide.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    title !== undefined &&
    !title.fr?.trim()
  ) {
    return NextResponse.json(
      {
        error:
          "Le titre (au moins en français) est requis.",
      },
      {
        status: 400,
      }
    );
  }

  if (
    excerpt !== undefined &&
    !excerpt.fr?.trim()
  ) {
    return NextResponse.json(
      {
        error:
          "Le texte de présentation (au moins en français) est requis.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const updated = updatePost(id, {
      category:
        category ?? existing.category,

      title: title
        ? {
            fr:
              normalizeSpaces(
                title.fr.trim()
              ) || "",
            en:
              normalizeSpaces(
                title.en?.trim()
              ) || undefined,
          }
        : existing.title,

      excerpt: excerpt
        ? {
            fr:
              normalizeSpaces(
                excerpt.fr.trim()
              ) || "",
            en:
              normalizeSpaces(
                excerpt.en?.trim()
              ) || undefined,
          }
        : existing.excerpt,

      body:
        body !== undefined
          ? {
              fr:
                body.fr?.trim() ?? "",
              en:
                body.en?.trim() ||
                undefined,
            }
          : existing.body,

      coverImageUrl:
        coverImageUrl !== undefined
          ? coverImageUrl
          : existing.coverImageUrl,

      videoUrl:
        videoUrl !== undefined
          ? videoUrl
          : existing.videoUrl,

      documents:
        documents !== undefined
          ? documents
          : existing.documents,
    });

    if (!updated) {
      return NextResponse.json(
        {
          error:
            "Impossible de modifier la publication.",
        },
        {
          status: 500,
        }
      );
    }

    await syncPostsToGitHub(
      serializePosts(getAllPosts()),
      `content: modification ${updated.category} ${id}`
    );

    return NextResponse.json({
      post: updated,
      savedToGitHub: true,
    });
  } catch (error) {
    console.error(
      "Erreur modification publication:",
      error
    );

    return NextResponse.json(
      {
        error:
          "La modification locale a été effectuée mais la synchronisation GitHub a échoué.",
        details:
          error instanceof Error
            ? error.message
            : "Erreur inconnue",
      },
      {
        status: 500,
      }
    );
  }
}
