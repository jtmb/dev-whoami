/**
 * Related Posts utilities — extracts tags from MDX content and finds related posts.
 * Module-level exports that work in both Server and Client contexts.
 */

import { getAllPosts, getPostBySlug } from "@/lib/mdx";

interface PostWithTags {
  slug: string;
  title: string;
  date: string;
  tags: string[];
}

/** Extract all unique tags from a raw MDX content string. */
export function extractTagsFromContent(content: string | null | undefined): string[] {
  // Handle null/undefined gracefully
  if (!content) return [];

  // Parse frontmatter to get tags array
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return [];

  const frontmatterBlock = match[1];
  const tags: string[] = [];

  for (const line of frontmatterBlock.split("\n")) {
    // Match tags: [tag1, tag2, tag3]
    const tagsMatch = line.match(/tags:\s*\[(.*?)\]/);
    if (!tagsMatch) continue;

    const inner = tagsMatch[1];
    const extractedTags = inner
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
    tags.push(...extractedTags);
  }

  return [...new Set(tags)]; // Deduplicate
}

/** Find related posts based on shared tags. */
export function findRelatedPosts(
  currentPost: PostWithTags,
  allPosts: PostWithTags[] = getAllPosts()
): PostWithTags[] {
  if (!currentPost.tags || currentPost.tags.length === 0) {
    return [];
  }

  // Filter posts that share at least one tag with current post
  const related = allPosts.filter((post) => {
    // Skip the current post itself
    if (post.slug === currentPost.slug) return false;

    // Check for shared tags
    const sharedTags = currentPost.tags.filter((tag) => post.tags.includes(tag));
    return sharedTags.length > 0;
  });

  // Sort by number of shared tags (most similar first), then by date (newest first)
  related.sort((a, b) => {
    const aShared = currentPost.tags.filter((tag) => a.tags.includes(tag)).length;
    const bShared = currentPost.tags.filter((tag) => b.tags.includes(tag)).length;

    // Primary sort: most shared tags first
    if (bShared !== aShared) return bShared - aShared;

    // Secondary sort: newest date first
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Limit to top 5 recommendations
  return related.slice(0, 5);
}

/** Get tag overlap count between two posts. */
export function getTagOverlap(currentTags: string[], otherTags: string[]): number {
  if (!currentTags || !otherTags) return 0;

  const currentSet = new Set(currentTags);
  let overlap = 0;

  for (const tag of otherTags) {
    if (currentSet.has(tag)) {
      overlap++;
    }
  }

  return overlap;
}