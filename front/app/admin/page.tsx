"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LocalizedText, Post, PostCategory, PostDocument } from "@/lib/posts";
import RichTextEditor from "@/components/RichTextEditor";
import PostPreview from "@/components/PostPreview";

const CATEGORY_LABELS: Record<PostCategory, string> = {
  actualite: "Actualités",
  publication: "Publications",
  documentation: "Documentation",
};

const emptyLocalized: LocalizedText = { fr: "", en: "" };

async function uploadFile(file: File): Promise<{ url: string; originalName: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Échec de l'upload.");
  return data;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function AdminPage() {
  const router = useRouter();

  const [section, setSection] = useState<"overview" | "new" | Category>("overview");
  type Category = PostCategory;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [manageTab, setManageTab] = useState<Category>("actualite");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [contentLang, setContentLang] = useState<"fr" | "en">("fr");
  const [category, setCategory] = useState<Category>("actualite");
  const [title, setTitle] = useState<LocalizedText>({ ...emptyLocalized });
  const [excerpt, setExcerpt] = useState<LocalizedText>({ ...emptyLocalized });
  const [body, setBody] = useState<LocalizedText>({ ...emptyLocalized });
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(undefined);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [documents, setDocuments] = useState<PostDocument[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);


  const loadPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data.posts ?? []);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const stats = useMemo(() => {
    const counts: Record<Category, number> = { actualite: 0, publication: 0, documentation: 0 };
    posts.forEach((p) => (counts[p.category] += 1));
    return counts;
  }, [posts]);

  function resetForm() {
    setEditingId(null);
    setCategory("actualite");
    setTitle({ ...emptyLocalized });
    setExcerpt({ ...emptyLocalized });
    setBody({ ...emptyLocalized });
    setCoverImageUrl(undefined);
    setVideoUrl(undefined);
    setDocuments([]);
    setCoverFile(null);
    setVideoFile(null);
    setDocFile(null);
    setContentLang("fr");
    setMessage(null);
  }

  function loadPostIntoForm(post: Post) {
    setEditingId(post.id);
    setCategory(post.category);
    setTitle({ fr: post.title.fr, en: post.title.en ?? "" });
    setExcerpt({ fr: post.excerpt.fr, en: post.excerpt.en ?? "" });
    setBody({ fr: post.body.fr, en: post.body.en ?? "" });
    setCoverImageUrl(post.coverImageUrl);
    setVideoUrl(post.videoUrl);
    setDocuments(post.documents ?? []);
    setCoverFile(null);
    setVideoFile(null);
    setDocFile(null);
    setContentLang("fr");
    setMessage(null);
    setSection("new");
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette publication ?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (editingId === id) resetForm();
    loadPosts();
  }

  async function handleAddDocument() {
    if (!docFile) return;
    setUploadingDoc(true);
    try {
      const { url, originalName } = await uploadFile(docFile);
      setDocuments((docs) => [...docs, { id: uid(), name: originalName, url }]);
      setDocFile(null);
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : "Échec de l'ajout du document.",
        error: true,
      });
    } finally {
      setUploadingDoc(false);
    }
  }

  function handleRenameDocument(id: string, name: string) {
    setDocuments((docs) => docs.map((d) => (d.id === id ? { ...d, name } : d)));
  }

  function handleRemoveDocument(id: string) {
    setDocuments((docs) => docs.filter((d) => d.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const [uploadedCover, uploadedVideo] = await Promise.all([
        coverFile ? uploadFile(coverFile) : Promise.resolve(null),
        videoFile ? uploadFile(videoFile) : Promise.resolve(null),
      ]);

      const finalCoverUrl = uploadedCover?.url ?? coverImageUrl;
      const finalVideoUrl = uploadedVideo?.url ?? videoUrl;

      const payload = {
        category,
        title,
        excerpt,
        body,
        coverImageUrl: finalCoverUrl,
        videoUrl: finalVideoUrl,
        documents,
      };

      const res = await fetch(editingId ? `/api/posts/${editingId}` : "/api/posts", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de la publication.");

      setMessage({ text: editingId ? "Mis à jour avec succès." : "Publié avec succès." });
      setManageTab(category);
      resetForm();
      setSection("overview");
      loadPosts();
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : "Une erreur est survenue.",
        error: true,
      });
    } finally {
      setSubmitting(false);
    }
  }

  const filteredPosts = posts.filter((p) => p.category === manageTab);

  const navItems: { key: typeof section; label: string; icon: string }[] = [
    { key: "overview", label: "Vue d'ensemble", icon: "grid" },
    { key: "new", label: "Nouvelle publication", icon: "plus" },
    { key: "actualite", label: "Actualités", icon: "news" },
    { key: "publication", label: "Publications", icon: "doc" },
    { key: "documentation", label: "Documentation", icon: "folder" },
  ];

  function SidebarIcon({ name }: { name: string }) {
    const common = {
      width: 16,
      height: 16,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.8,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
    };
    switch (name) {
      case "grid":
        return (
          <svg {...common}>
            <rect x="3" y="3" width="8" height="8" rx="1.5" />
            <rect x="13" y="3" width="8" height="8" rx="1.5" />
            <rect x="3" y="13" width="8" height="8" rx="1.5" />
            <rect x="13" y="13" width="8" height="8" rx="1.5" />
          </svg>
        );
      case "plus":
        return (
          <svg {...common}>
            <path d="M12 5v14M5 12h14" />
          </svg>
        );
      case "news":
        return (
          <svg {...common}>
            <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
            <path d="M7 8.5h6M7 12h10M7 15.5h10" />
          </svg>
        );
      case "doc":
        return (
          <svg {...common}>
            <path d="M6 3.5h8l4 4v13a1 1 0 01-1 1H6a1 1 0 01-1-1v-16a1 1 0 011-1z" />
            <path d="M14 3.5v4h4" />
          </svg>
        );
      case "folder":
        return (
          <svg {...common}>
            <path d="M3.5 6.5a1 1 0 011-1H10l2 2h7.5a1 1 0 011 1v10a1 1 0 01-1 1h-15a1 1 0 01-1-1v-12z" />
          </svg>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-navy/[0.04] to-white text-navy">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-navy/10 bg-white md:flex md:flex-col">
        <div className="border-b border-navy/10 px-6 py-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-navy/40">
            Tax Advisory Consultants
          </p>
          <p className="font-display text-lg font-semibold">Espace de gestion</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                if (item.key === "new") resetForm();
                setSection(item.key);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                section === item.key
                  ? "bg-navy text-white"
                  : "text-navy/60 hover:bg-navy/[0.05] hover:text-navy"
              }`}
            >
              <SidebarIcon name={item.icon} />
              {item.label}
              {item.key !== "overview" && item.key !== "new" && (
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-[10px] ${
                    section === item.key ? "bg-white/20" : "bg-navy/[0.06] text-navy/50"
                  }`}
                >
                  {stats[item.key as Category]}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="border-t border-navy/10 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-navy/15 py-2.5 text-xs font-medium uppercase tracking-wide text-navy/70 transition-colors hover:bg-navy hover:text-white"
          >
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 px-6 py-10 md:px-10">
        <div className={section === "new" ? "mx-auto max-w-[1400px]" : "mx-auto max-w-4xl"}>
          <div className="mb-8 flex items-center justify-between md:hidden">
            <h1 className="font-display text-xl font-semibold">Espace de gestion</h1>
            <button
              onClick={handleLogout}
              className="rounded-full border border-navy/20 px-4 py-2 text-xs font-medium uppercase tracking-wide"
            >
              Déconnexion
            </button>
          </div>

          {section === "overview" && (
            <>
              <h1 className="font-display mb-1 text-2xl font-semibold">Vue d&apos;ensemble</h1>
              <p className="mb-8 text-sm text-navy/50">
                Résumé du contenu publié sur le site.
              </p>
              <div className="grid gap-5 sm:grid-cols-3">
                {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setManageTab(cat);
                      setSection(cat);
                    }}
                    className="rounded-2xl border border-navy/10 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
                  >
                    <p className="text-3xl font-semibold text-navy">{stats[cat]}</p>
                    <p className="mt-1 text-sm text-navy/50">{CATEGORY_LABELS[cat]}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setSection("new");
                }}
                className="mt-8 rounded-full bg-navy px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-white hover:opacity-90"
              >
                + Nouvelle publication
              </button>
            </>
          )}

          {(section === "actualite" || section === "publication" || section === "documentation") && (
            <>
              <h1 className="font-display mb-1 text-2xl font-semibold">
                {CATEGORY_LABELS[section]}
              </h1>
              <p className="mb-6 text-sm text-navy/50">
                {posts.filter((p) => p.category === section).length} publication(s).
              </p>
              {loadingPosts ? (
                <p className="text-navy/50">Chargement...</p>
              ) : posts.filter((p) => p.category === section).length === 0 ? (
                <p className="rounded-2xl border border-navy/10 bg-white p-8 text-center text-navy/50">
                  Aucune publication dans cette catégorie.
                </p>
              ) : (
                <ul className="space-y-3">
                  {posts
                    .filter((p) => p.category === section)
                    .map((post) => (
                      <li
                        key={post.id}
                        className="flex items-center gap-4 rounded-2xl border border-navy/10 bg-white p-4 shadow-sm"
                      >
                        {post.coverImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.coverImageUrl}
                            alt={post.title.fr}
                            className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-navy/[0.06] text-navy/30">
                            ✳
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{post.title.fr}</p>
                          <p className="text-xs text-navy/50">
                            {new Date(post.createdAt).toLocaleString("fr-FR")}
                            {post.title.en ? " · FR + EN" : " · FR"}
                            {post.documents && post.documents.length > 0
                              ? ` · ${post.documents.length} document(s)`
                              : ""}
                          </p>
                        </div>
                        <button
                          onClick={() => loadPostIntoForm(post)}
                          className="text-sm text-accent hover:underline"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Supprimer
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </>
          )}

          {section === "new" && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-semibold">
                    {editingId ? "Modifier la publication" : "Nouvelle publication"}
                  </h1>
                  <p className="mt-1 text-sm text-navy/50">
                    La photo et le texte de présentation apparaissent sur la carte. Le contenu
                    complet s&apos;affiche à l&apos;ouverture.
                  </p>
                </div>
                {editingId && (
                  <button
                    onClick={() => {
                      resetForm();
                    }}
                    className="text-sm text-navy/50 hover:text-navy"
                  >
                    Annuler la modification
                  </button>
                )}
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
              <form onSubmit={handleSubmit} className="min-w-0 space-y-6">
                <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-navy/60">
                        Catégorie
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full rounded-lg border border-navy/20 px-3 py-2.5 focus:border-navy focus:outline-none"
                      >
                        <option value="actualite">Actualités</option>
                        <option value="publication">Publications</option>
                        <option value="documentation">Documentation</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-navy/60">
                        Langue en cours d&apos;édition
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setContentLang("fr")}
                          className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                            contentLang === "fr"
                              ? "border-navy bg-navy text-white"
                              : "border-navy/20 text-navy/60"
                          }`}
                        >
                          Français
                        </button>
                        <button
                          type="button"
                          onClick={() => setContentLang("en")}
                          className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                            contentLang === "en"
                              ? "border-navy bg-navy text-white"
                              : "border-navy/20 text-navy/60"
                          }`}
                        >
                          English
                          <span className="ml-1 text-[10px] opacity-60">(facultatif)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-navy/40">
                      Contenu — {contentLang === "fr" ? "Français" : "English"}
                    </p>
                  </div>
                  {contentLang === "en" && !title.en && !excerpt.en && !body.en && (
                    <p className="mb-4 rounded-lg bg-accent/[0.06] px-3 py-2 text-xs text-navy/60">
                      Vous pouvez laisser l&apos;anglais vide : la traduction se fera
                      automatiquement (sans clé ni configuration) la première fois qu&apos;un
                      visiteur consultera cette publication en anglais, puis restera enregistrée.
                      Remplissez ces champs uniquement si vous voulez fournir votre propre
                      traduction.
                    </p>
                  )}

                  <div className="mb-4">
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-navy/60">
                      Titre {contentLang === "fr" && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      value={title[contentLang] ?? ""}
                      onChange={(e) => setTitle((t) => ({ ...t, [contentLang]: e.target.value }))}
                      required={contentLang === "fr"}
                      className="w-full rounded-lg border border-navy/20 px-3 py-2.5 focus:border-navy focus:outline-none"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-navy/60">
                      Texte de présentation (carte){" "}
                      {contentLang === "fr" && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                      value={excerpt[contentLang] ?? ""}
                      onChange={(e) =>
                        setExcerpt((ex) => ({ ...ex, [contentLang]: e.target.value }))
                      }
                      required={contentLang === "fr"}
                      rows={2}
                      className="w-full rounded-lg border border-navy/20 px-3 py-2.5 focus:border-navy focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-navy/60">
                      Contenu complet — facultatif
                    </label>
                    <RichTextEditor
                      value={body[contentLang] ?? ""}
                      onChange={(html) => setBody((b) => ({ ...b, [contentLang]: html }))}
                      placeholder="Rédigez le contenu complet : grands titres, titres, texte, mise en forme (gras, couleur, police, taille), liens, images, vidéos, audio et documents."
                    />
                    <p className="mt-1.5 text-[11px] text-navy/40">
                      Utilisez « Grand titre » (H2) et « Titre » (H3) dans le menu déroulant à
                      gauche de la barre d&apos;outils pour structurer le contenu — un sommaire
                      est généré automatiquement à partir de ces titres. Les boutons 🎬 🎵 📄
                      insèrent une vidéo, un audio ou un document directement dans le texte.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-navy/40">
                    Médias (communs aux deux langues)
                  </p>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-navy/60">
                        Photo de présentation
                      </label>
                      {coverImageUrl && !coverFile && (
                        <div className="mb-2 flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={coverImageUrl} alt="" className="h-10 w-10 rounded object-cover" />
                          <button
                            type="button"
                            onClick={() => setCoverImageUrl(undefined)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Retirer
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                        className="w-full rounded-lg border border-navy/20 px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-navy/60">
                        Vidéo
                      </label>
                      {videoUrl && !videoFile && (
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-xs text-navy/50">Vidéo déjà ajoutée</span>
                          <button
                            type="button"
                            onClick={() => setVideoUrl(undefined)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Retirer
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                        className="w-full rounded-lg border border-navy/20 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {category === "documentation" && (
                  <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-navy/40">
                      Documents téléchargeables
                    </p>
                    <p className="mb-4 text-[11px] text-navy/40">
                      PDF, Word, Excel... Les visiteurs pourront les télécharger depuis la page.
                    </p>

                    {documents.length > 0 && (
                      <ul className="mb-4 space-y-2">
                        {documents.map((doc) => (
                          <li
                            key={doc.id}
                            className="flex items-center gap-2 rounded-lg border border-navy/10 bg-navy/[0.02] px-3 py-2"
                          >
                            <input
                              value={doc.name}
                              onChange={(e) => handleRenameDocument(doc.id, e.target.value)}
                              className="flex-1 rounded border border-navy/15 bg-white px-2 py-1.5 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveDocument(doc.id)}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Retirer
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
                        className="flex-1 rounded-lg border border-navy/20 px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleAddDocument}
                        disabled={!docFile || uploadingDoc}
                        className="rounded-lg bg-navy px-4 py-2 text-xs font-medium uppercase tracking-wide text-white disabled:opacity-40"
                      >
                        {uploadingDoc ? "Ajout..." : "Ajouter"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-navy px-7 py-2.5 text-sm font-medium uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {submitting
                      ? "Enregistrement..."
                      : editingId
                        ? "Mettre à jour"
                        : "Publier"}
                  </button>
                  {message && (
                    <span className={`text-sm ${message.error ? "text-red-600" : "text-navy/70"}`}>
                      {message.text}
                    </span>
                  )}
                </div>
              </form>

              <div className="lg:sticky lg:top-10 lg:self-start">
                <PostPreview
                  category={category}
                  title={title[contentLang] ?? ""}
                  excerpt={excerpt[contentLang] ?? ""}
                  bodyHtml={body[contentLang] ?? ""}
                  coverImageUrl={coverFile ? coverPreviewUrl : coverImageUrl}
                  documents={documents}
                  lang={contentLang}
                />
              </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
