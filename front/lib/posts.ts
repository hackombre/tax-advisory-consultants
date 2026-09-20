import 'server-only';

import {
  readGitHubJson,
  writeGitHubJson,
} from './github-storage';

export type PostType =
  | 'publication'
  | 'actualite'
  | 'document';

export interface Post {
  id: string;
  type: PostType;

  title: string;
  slug?: string;

  excerpt?: string;
  content?: string;

  image?: string;
  coverImage?: string;

  category?: string;

  author?: string;

  publishedAt?: string;
  createdAt: string;
  updatedAt: string;

  featured?: boolean;

  documentUrl?: string;
  fileUrl?: string;

  tags?: string[];

  [key: string]: unknown;
}

const POSTS_PATH =
  process.env.GITHUB_POSTS_PATH ||
  'front/data/posts.json';

function normalizePosts(value: unknown): Post[] {
  if (Array.isArray(value)) {
    return value as Post[];
  }

  if (
    value &&
    typeof value === 'object' &&
    Array.isArray(
      (value as { posts?: unknown }).posts
    )
  ) {
    return (
      (value as { posts: Post[] }).posts
    );
  }

  return [];
}

export async function getPosts(): Promise<Post[]> {
  const data = await readGitHubJson<unknown>(
    POSTS_PATH,
    []
  );

  return normalizePosts(data);
}

export async function getPostById(
  id: string
): Promise<Post | null> {
  const posts = await getPosts();

  return (
    posts.find(
      (post) => String(post.id) === String(id)
    ) || null
  );
}

export async function getPostsByType(
  type: PostType
): Promise<Post[]> {
  const posts = await getPosts();

  return posts
    .filter((post) => post.type === type)
    .sort((a, b) => {
      const dateA = new Date(
        a.publishedAt ||
          a.createdAt ||
          0
      ).getTime();

      const dateB = new Date(
        b.publishedAt ||
          b.createdAt ||
          0
      ).getTime();

      return dateB - dateA;
    });
}

export async function createPost(
  input: Omit<
    Post,
    'id' | 'createdAt' | 'updatedAt'
  >
): Promise<Post> {
  const posts = await getPosts();

  const now = new Date().toISOString();

  const post: Post = {
    ...input,

    id: crypto.randomUUID(),

    createdAt: now,
    updatedAt: now,
  };

  posts.unshift(post);

  await writeGitHubJson(
    posts,
    `content: add ${post.type} ${post.id}`
  );

  return post;
}

export async function updatePost(
  id: string,
  changes: Partial<Post>
): Promise<Post> {
  const posts = await getPosts();

  const index = posts.findIndex(
    (post) =>
      String(post.id) === String(id)
  );

  if (index === -1) {
    throw new Error(
      `Publication introuvable : ${id}`
    );
  }

  const current = posts[index];

  const updated: Post = {
    ...current,
    ...changes,

    id: current.id,

    createdAt: current.createdAt,

    updatedAt: new Date().toISOString(),
  };

  posts[index] = updated;

  await writeGitHubJson(
    posts,
    `content: update ${updated.type} ${updated.id}`
  );

  return updated;
}

export async function deletePost(
  id: string
): Promise<void> {
  const posts = await getPosts();

  const existing = posts.find(
    (post) =>
      String(post.id) === String(id)
  );

  if (!existing) {
    throw new Error(
      `Publication introuvable : ${id}`
    );
  }

  const remaining = posts.filter(
    (post) =>
      String(post.id) !== String(id)
  );

  await writeGitHubJson(
    remaining,
    `content: delete ${existing.type} ${existing.id}`
  );
}
