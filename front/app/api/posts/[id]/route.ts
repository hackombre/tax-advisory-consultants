import { NextRequest, NextResponse } from "next/server";
import {
  deletePost,
  getPostById,
  updatePost,
  LocalizedText,
  PostCategory,
  PostDocument,
} from "@/lib/posts";
import { isAuthenticated } from "@/lib/auth";
import { normalizeSpaces } from "@/lib/text";

const CATEGORIES: PostCategory[] = ["actualite", "publication", "documentation"];

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await context.params;
  deletePost(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = getPostById(id);
  if (!existing) {
    return NextResponse.json({ error: "Publication introuvable." }, { status: 404 });
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
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const { category, title, excerpt, body, coverImageUrl, videoUrl, documents } = payload;

  if (category && !CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }
  if (title !== undefined && !title.fr?.trim()) {
    return NextResponse.json(
      { error: "Le titre (au moins en français) est requis." },
      { status: 400 }
    );
  }
  if (excerpt !== undefined && !excerpt.fr?.trim()) {
    return NextResponse.json(
      { error: "Le texte de présentation (au moins en français) est requis." },
      { status: 400 }
    );
  }

  const updated = updatePost(id, {
    category: category ?? existing.category,
    title: title
      ? { fr: normalizeSpaces(title.fr.trim())!, en: normalizeSpaces(title.en?.trim()) || undefined }
      : existing.title,
    excerpt: excerpt
      ? {
          fr: normalizeSpaces(excerpt.fr.trim())!,
          en: normalizeSpaces(excerpt.en?.trim()) || undefined,
        }
      : existing.excerpt,
    body: body ? { fr: body.fr?.trim() ?? "", en: body.en?.trim() || undefined } : existing.body,
    coverImageUrl: coverImageUrl !== undefined ? coverImageUrl : existing.coverImageUrl,
    videoUrl: videoUrl !== undefined ? videoUrl : existing.videoUrl,
    documents: documents !== undefined ? documents : existing.documents,
  });

  return NextResponse.json({ post: updated });
}
