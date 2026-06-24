/**
 * Blog list page — Server Component that reads posts from the filesystem at build time,
 * then delegates rendering to BlogListClient (Client Component) for interactive filtering.
 */
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { getAllPosts, getReadingTime } from "@/lib/mdx";
import { BlogListClient } from "@/components/blog/blog-list-client";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "DevOps tutorials, homelab guides, and thoughts on automation, self-hosting, and infrastructure.",
};

/** Convert MDX BlogPostMeta to the FilterablePost shape for client-side filtering. */
function buildFilterablePosts() {
  const posts = getAllPosts();

  return posts.map((post) => {
    // Read raw file content to calculate reading time at build time.
    let readingTime = 5;
    try {
      const filePath = path.join(
        process.cwd(),
        "src",
        "content",
        "posts",
        `${post.slug}.mdx`,
      );
      const raw = fs.readFileSync(filePath, "utf-8");
      readingTime = getReadingTime(raw);
    } catch {
      // Use default if file can't be read (e.g., during tests)
    }

    return {
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      tags: post.tags,
      readingTime,
    };
  });
}

export default function BlogPage() {
  const posts = buildFilterablePosts();

  return <BlogListClient posts={posts} />;
}