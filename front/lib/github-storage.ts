import fs from "fs";
import path from "path";

const GITHUB_API = "https://api.github.com";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Variable d'environnement manquante : ${name}`
    );
  }

  return value;
}

function getGitHubConfig() {
  return {
    token: getRequiredEnv("GITHUB_TOKEN"),
    owner: getRequiredEnv("GITHUB_OWNER"),
    repo: getRequiredEnv("GITHUB_REPO"),
    branch: process.env.GITHUB_BRANCH || "main",
  };
}

async function githubRequest(
  url: string,
  options: RequestInit = {}
) {
  const { token } = getGitHubConfig();

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const text = await response.text();

  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    console.error(
      "Erreur GitHub API:",
      response.status,
      data
    );

    throw new Error(
      `GitHub API ${response.status}: ${
        typeof data === "string"
          ? data
          : JSON.stringify(data)
      }`
    );
  }

  return data;
}

async function getFileFromGitHub(
  filePath: string
) {
  const {
    owner,
    repo,
    branch,
  } = getGitHubConfig();

  const url =
    `${GITHUB_API}/repos/${owner}/${repo}/contents/` +
    `${filePath}?ref=${encodeURIComponent(branch)}`;

  try {
    return await githubRequest(url);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("GitHub API 404")
    ) {
      return null;
    }

    throw error;
  }
}

export async function commitFileToGitHub(
  filePath: string,
  content: string | Buffer,
  message: string
) {
  const {
    owner,
    repo,
    branch,
  } = getGitHubConfig();

  const existing = await getFileFromGitHub(filePath);

  const buffer = Buffer.isBuffer(content)
    ? content
    : Buffer.from(content, "utf-8");

  const body: Record<string, unknown> = {
    message,
    content: buffer.toString("base64"),
    branch,
  };

  if (
    existing &&
    typeof existing === "object" &&
    "sha" in existing
  ) {
    body.sha = (
      existing as { sha: string }
    ).sha;
  }

  const url =
    `${GITHUB_API}/repos/${owner}/${repo}/contents/` +
    filePath;

  return githubRequest(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function syncPostsToGitHub(
  postsJson: string,
  message: string
) {
  const filePath =
    process.env.GITHUB_POSTS_PATH ||
    "front/data/posts.json";

  return commitFileToGitHub(
    filePath,
    postsJson,
    message
  );
}

export async function syncUploadToGitHub(
  filename: string,
  buffer: Buffer,
  message: string
) {
  const filePath =
    `front/public/uploads/${filename}`;

  return commitFileToGitHub(
    filePath,
    buffer,
    message
  );
}
