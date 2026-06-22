/**
 * GitHub API types used across the application.
 * Shared between the data-fetching module and UI components.
 */

/** A GitHub repository as returned by the unauthenticated REST API. */
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  updated_at: string;
  created_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  size: number;
}

/** A GitHub user profile as returned by the REST API. */
export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

/** Curated featured project (static data, not from API). */
export interface FeaturedProject {
  name: string;
  description: string;
  repoUrl: string;
  demoUrl?: string;
  tags: string[];
  stars?: number; // Filled at build time via ISR
  featured: boolean;
  category: ProjectCategory;
}

export type ProjectCategory = "DevOps" | "Self-Hosted" | "Automation" | "Gaming" | "AI" | "Web";

/** Skill entry for the About section. */
export interface Skill {
  name: string;
  icon: string; // Lucide icon name
  category: SkillCategory;
  proficiency: 1 | 2 | 3 | 4 | 5;
}

export type SkillCategory = "Infrastructure" | "CI/CD & Automation" | "Languages" | "Tools" | "Platforms";
