/**
 * Central GitHub API module — single source of truth for all GitHub data fetching.
 * Uses the unauthenticated GitHub REST API (60 requests/hour).
 * ISR revalidation keeps us well within rate limits.
 */
import type { GitHubRepo, GitHubUser } from "./types";

const GITHUB_API = "https://api.github.com";
const GITHUB_USER = process.env.NEXT_PUBLIC_GITHUB_USER || "jtmb";

/**
 * Build a GitHub API URL with the correct user.
 * All requests go through this helper to ensure consistency.
 */
function apiUrl(path: string): string {
  return `${GITHUB_API}${path}`;
}

/**
 * Fetch with a timeout and standard headers for the GitHub API.
 * Returns null on any failure (network, rate limit, 404) —
 * callers handle graceful degradation.
 */
async function githubFetch<T>(url: string, revalidate?: number): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "dev-whoami-portfolio",
      },
      signal: controller.signal,
      next: revalidate ? { revalidate } : undefined,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`GitHub API error: ${res.status} ${res.statusText} for ${url}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (err) {
    console.error(`GitHub fetch failed for ${url}:`, err);
    return null;
  }
}

/**
 * Fetch the authenticated user's GitHub profile.
 * ISR: revalidate every 24 hours (profile changes rarely).
 */
export async function getUser(): Promise<GitHubUser | null> {
  return githubFetch<GitHubUser>(
    apiUrl(`/users/${GITHUB_USER}`),
    86400, // 24 hours
  );
}

/**
 * Fetch all public repositories for the user.
 * ISR: revalidate every hour (repos change more often).
 * Returns up to 100 repos, sorted by last updated.
 */
export async function getRepos(): Promise<GitHubRepo[] | null> {
  return githubFetch<GitHubRepo[]>(
    apiUrl(`/users/${GITHUB_USER}/repos?per_page=100&sort=updated`),
    3600, // 1 hour
  );
}

/**
 * Fetch a single repository by name.
 * Used to get star counts for featured projects.
 */
export async function getRepo(name: string): Promise<GitHubRepo | null> {
  return githubFetch<GitHubRepo>(
    apiUrl(`/repos/${GITHUB_USER}/${name}`),
    3600,
  );
}

/**
 * Get the total star count across all public repos.
 * Useful for profile stats display.
 */
export async function getTotalStars(): Promise<number> {
  const repos = await getRepos();
  if (!repos) return 0;
  return repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
}

/**
 * Get the top N languages used across all repos.
 * Returns sorted array of { language, count }.
 */
export async function getTopLanguages(topN = 5): Promise<{ language: string; count: number }[]> {
  const repos = await getRepos();
  if (!repos) return [];

  const langCount: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      langCount[repo.language] = (langCount[repo.language] || 0) + 1;
    }
  }

  return Object.entries(langCount)
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}
