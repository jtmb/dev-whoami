/**
 * MDX utilities — file system reading, frontmatter parsing, and post listing.
 * Used by blog pages to find and render MDX content from src/content/posts/.
 */
import fs from "fs";
import path from "path";

/** Frontmatter schema for blog posts. */
export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  author?: string;
}

/** The directory where MDX blog posts live. */
const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");

/**
 * Parse YAML-style frontmatter from raw MDX content.
 * Expects frontmatter between --- delimiters at the top of the file.
 * Returns the metadata and the remaining content (body) separately.
 */
export function parseFrontmatter(raw: string): {
  meta: Record<string, unknown>;
  content: string;
} {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { meta: {}, content: raw };
  }

  const frontmatterBlock = match[1];
  const content = match[2];
  const meta: Record<string, unknown> = {};

  // Simple YAML key: value parser (handles arrays with [a, b, c] syntax)
  for (const line of frontmatterBlock.split("\n")) {
    const kvMatch = line.match(/^(\w[\w\s]*?):\s*(.+)$/);
    if (!kvMatch) continue;
    const key = kvMatch[1].trim();
    let value: string | string[] = kvMatch[2].trim();

    // Strip surrounding quotes from scalar values (YAML allows quoted strings)
    if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
    }

    // Parse arrays: [tag1, tag2, tag3]
    if (value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1);
      value = inner
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""));
    }

    meta[key] = value;
  }

  return { meta, content };
}

/**
 * Get all blog posts sorted by date (newest first).
 * Reads the filesystem at build time — no runtime overhead.
 */
export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts: BlogPostMeta[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { meta } = parseFrontmatter(raw);

    posts.push({
      slug: file.replace(/\.mdx$/, ""),
      title: (meta.title as string) || "Untitled",
      description: (meta.description as string) || "",
      date: (meta.date as string) || "",
      tags: Array.isArray(meta.tags) ? (meta.tags as string[]) : [],
      author: (meta.author as string) || "James",
    });
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

/**
 * Get a single blog post's frontmatter by slug.
 */
export function getPostBySlug(slug: string): BlogPostMeta | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

/**
 * Calculate estimated reading time in minutes.
 * Rough estimate: 200 words per minute.
 */
export function getReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Format a date string for display. */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
