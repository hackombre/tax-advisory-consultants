const GITHUB_API = "https://api.github.com";

function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token) {
    throw new Error(
      "GITHUB_TOKEN n'est pas configuré."
    );
  }

  if (!owner) {
    throw new Error(
      "GITHUB_OWNER n'est pas configuré."
    );
  }

  if (!repo) {
    throw new Error(
      "GITHUB_REPO n'est pas configuré."
    );
  }

  return {
    token,
    owner,
    repo,
    branch,
  };
}

function githubHeaders() {
  const { token } = getGitHubConfig();

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

/**
 * Récupère les informations d'un fichier dans GitHub.
 */
export async function getGitHubFile(
  repoPath: string
) {
  const {
    owner,
    repo,
    branch,
  } = getGitHubConfig();

  const url =
    `${GITHUB_API}/repos/${encodeURIComponent(owner)}` +
    `/${encodeURIComponent(repo)}/contents/` +
    `${repoPath}?ref=${encodeURIComponent(branch)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: githubHeaders(),
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `GitHub GET ${repoPath} : ` +
      `${response.status} ${text}`
    );
  }

  return response.json();
}

/**
 * Écrit un fichier texte dans GitHub.
 *
 * Si le fichier existe déjà, son SHA est récupéré
 * automatiquement afin de pouvoir le remplacer.
 */
export async function writeGitHubFile(
  repoPath: string,
  content: string,
  message: string
) {
  const {
    owner,
    repo,
    branch,
  } = getGitHubConfig();

  const existing = await getGitHubFile(repoPath);

  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(
      content,
      "utf-8"
    ).toString("base64"),
    branch,
  };

  if (existing?.sha) {
    body.sha = existing.sha;
  }

  const url =
    `${GITHUB_API}/repos/${encodeURIComponent(owner)}` +
    `/${encodeURIComponent(repo)}/contents/` +
    repoPath;

  const response = await fetch(url, {
    method: "PUT",
    headers: githubHeaders(),
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `GitHub PUT ${repoPath} : ` +
      `${response.status} ${text}`
    );
  }

  return response.json();
}

/**
 * Écrit un fichier binaire dans GitHub.
 *
 * Utilisé notamment pour les documents/images uploadés
 * depuis la page secrète.
 */
export async function syncUploadToGitHub(
  repoPath: string,
  buffer: Buffer,
  message?: string
) {
  const {
    owner,
    repo,
    branch,
  } = getGitHubConfig();

  const existing = await getGitHubFile(repoPath);

  const body: Record<string, unknown> = {
    message:
      message ||
      `Ajout du fichier ${repoPath}`,
    content: buffer.toString("base64"),
    branch,
  };

  if (existing?.sha) {
    body.sha = existing.sha;
  }

  const url =
    `${GITHUB_API}/repos/${encodeURIComponent(owner)}` +
    `/${encodeURIComponent(repo)}/contents/` +
    repoPath;

  const response = await fetch(url, {
    method: "PUT",
    headers: githubHeaders(),
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `GitHub upload ${repoPath} : ` +
      `${response.status} ${text}`
    );
  }

  return response.json();
}

/**
 * Synchronise posts.json vers GitHub.
 */
export async function syncPostsToGitHub(
  posts: unknown
) {
  const githubPath =
    process.env.GITHUB_POSTS_PATH ||
    "front/data/posts.json";

  const content = JSON.stringify(
    posts,
    null,
    2
  );

  return writeGitHubFile(
    githubPath,
    content,
    "Mise à jour des publications depuis l'administration"
  );
}
