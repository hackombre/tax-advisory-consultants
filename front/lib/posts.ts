import fs from "fs";
import path from "path";
import crypto from "crypto";

export type PostCategory =
  | "actualite"
  | "publication"
  | "documentation";

export interface LocalizedText {
  fr: string;
  en?: string;
}

export interface PostDocument {
  id: string;
  name: string;
  url: string;
}

export interface Post {
  id: string;
  category: PostCategory;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText;
  coverImageUrl?: string;
  videoUrl?: string;
  documents?: PostDocument[];
  createdAt: string;
  updatedAt?: string;
}

export type PostInput = Omit<
  Post,
  "id" | "createdAt" | "updatedAt"
>;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "posts.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
  }
}

export function getAllPosts(): Post[] {
  ensureFile();

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");

    if (!raw.trim()) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Erreur lecture posts.json :", error);
    return [];
  }
}

export function getPostsByCategory(
  category: PostCategory
): Post[] {
  return getAllPosts()
    .filter((post) => post.category === category)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
}

export function getPostById(id: string): Post | null {
  return (
    getAllPosts().find((post) => post.id === id) ?? null
  );
}

export function serializePosts(posts: Post[]): string {
  return JSON.stringify(posts, null, 2) + "\n";
}

export function persistPosts(posts: Post[]) {
  ensureFile();

  fs.writeFileSync(
    DATA_FILE,
    serializePosts(posts),
    "utf-8"
  );
}

export function addPost(input: PostInput): Post {
  const posts = getAllPosts();

  const newPost: Post = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  posts.push(newPost);

  persistPosts(posts);

  return newPost;
}

export function updatePost(
  id: string,
  input: PostInput
): Post | null {
  const posts = getAllPosts();

  const index = posts.findIndex(
    (post) => post.id === id
  );

  if (index === -1) {
    return null;
  }

  const existing = posts[index];

  const updated: Post = {
    ...existing,
    ...input,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  posts[index] = updated;

  persistPosts(posts);

  return updated;
}

export function deletePost(id: string): void {
  const posts = getAllPosts().filter(
    (post) => post.id !== id
  );

  persistPosts(posts);
}

export function getPostsFilePath(): string {
  return DATA_FILE;
}
