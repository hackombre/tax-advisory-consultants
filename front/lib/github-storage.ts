import 'server-only';

const GITHUB_API = 'https://api.github.com';

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `[GitHub] Variable d'environnement manquante : ${name}`
    );
  }

  return value;
}

function githubConfig() {
  return {
    token: requiredEnv('GITHUB_TOKEN'),
    owner: requiredEnv('GITHUB_OWNER'),
    repo: requiredEnv('GITHUB_REPO'),
    branch: process.env.GITHUB_BRANCH || 'main',
    path:
      process.env.GITHUB_POSTS_PATH ||
      'front/data/posts.json',
  };
}

function headers(token: string) {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

export interface GitHubFile {
  sha: string;
  content: string;
  encoding: string;
}

async function githubRequest(
  url: string,
  init: RequestInit
): Promise<Response> {
  const response = await fetch(url, {
    ...init,
    cache: 'no-store',
  });

  return response;
}

/**
 * Récupère un fichier depuis GitHub.
 */
export async function getGitHubFile(
  path?: string
): Promise<GitHubFile | null> {
  const config = githubConfig();

  const filePath = path || config.path;

  const url =
    `${GITHUB_API}/repos/` +
    `${encodeURIComponent(config.owner)}/` +
    `${encodeURIComponent(config.repo)}/contents/` +
    `${filePath
      .split('/')
      .map(encodeURIComponent)
      .join('/')}` +
    `?ref=${encodeURIComponent(config.branch)}`;

  const response = await githubRequest(url, {
    method: 'GET',
    headers: headers(config.token),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `[GitHub] Impossible de lire ${filePath}. ` +
      `${response.status} ${text}`
    );
  }

  const data = await response.json();

  if (!data.content) {
    throw new Error(
      `[GitHub] Le fichier ${filePath} ne contient pas de contenu.`
    );
  }

  const content = Buffer.from(
    data.content.replace(/\n/g, ''),
    'base64'
  ).toString('utf-8');

  return {
    sha: data.sha,
    content,
    encoding: data.encoding || 'base64',
  };
}

/**
 * Écrit un fichier sur GitHub et crée automatiquement
 * un commit sur la branche configurée.
 */
export async function writeGitHubFile(
  content: string,
  message: string,
  path?: string
) {
  const config = githubConfig();

  const filePath = path || config.path;

  const existing = await getGitHubFile(filePath);

  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch: config.branch,
  };

  if (existing?.sha) {
    body.sha = existing.sha;
  }

  const url =
    `${GITHUB_API}/repos/` +
    `${encodeURIComponent(config.owner)}/` +
    `${encodeURIComponent(config.repo)}/contents/` +
    filePath
      .split('/')
      .map(encodeURIComponent)
      .join('/');

  const response = await githubRequest(url, {
    method: 'PUT',
    headers: headers(config.token),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `[GitHub] Échec de l'écriture de ${filePath}. ` +
      `${response.status} ${text}`
    );
  }

  return response.json();
}

/**
 * Lit le JSON d'un fichier GitHub.
 */
export async function readGitHubJson<T>(
  path?: string,
  fallback?: T
): Promise<T> {
  const file = await getGitHubFile(path);

  if (!file) {
    if (fallback !== undefined) {
      return fallback;
    }

    throw new Error(
      `[GitHub] Fichier introuvable : ${
        path || githubConfig().path
      }`
    );
  }

  try {
    return JSON.parse(file.content) as T;
  } catch (error) {
    throw new Error(
      `[GitHub] JSON invalide dans ${
        path || githubConfig().path
      }.`
    );
  }
}

/**
 * Écrit un objet JSON et le commit sur GitHub.
 */
export async function writeGitHubJson<T>(
  data: T,
  message: string,
  path?: string
) {
  const json = JSON.stringify(data, null, 2) + '\n';

  return writeGitHubFile(
    json,
    message,
    path
  );
}
