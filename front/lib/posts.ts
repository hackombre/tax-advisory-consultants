import fs from "fs";
import path from "path";
import crypto from "crypto";

export type PostCategory = "actualite" | "publication" | "documentation";

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

export type PostInput = Omit<Post, "id" | "createdAt" | "updatedAt">;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "posts.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

export function getAllPosts(): Post[] {
  ensureFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getPostsByCategory(category: PostCategory): Post[] {
  return getAllPosts()
    .filter((p) => p.category === category)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getPostById(id: string): Post | null {
  return getAllPosts().find((p) => p.id === id) ?? null;
}

function persist(posts: Post[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

export function addPost(input: PostInput): Post {
  ensureFile();
  const posts = getAllPosts();
  const newPost: Post = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  posts.push(newPost);
  persist(posts);
  return newPost;
}

export function updatePost(id: string, input: PostInput): Post | null {
  ensureFile();
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated: Post = {
    ...posts[index],
    ...input,
    id: posts[index].id,
    createdAt: posts[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  posts[index] = updated;
  persist(posts);
  return updated;
}

export function deletePost(id: string): void {
  ensureFile();
  const posts = getAllPosts().filter((p) => p.id !== id);
  persist(posts);
}
