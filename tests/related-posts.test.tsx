/**
 * Tests for RelatedPosts utilities (extractTagsFromContent, findRelatedPosts, getTagOverlap).
 * Component rendering tests are skipped since RelatedPosts uses runtime require() for mdx module.
 */
import { describe, it, expect, vi } from "vitest";
import { extractTagsFromContent, findRelatedPosts, getTagOverlap } from "@/lib/related-posts";

// Mock mdx module - provides getAllPosts() used by utilities
const mockAllPosts = [
  { slug: "post-a", title: "Post A", date: "2026-01-15", tags: ["docker", "kubernetes"] },
  { slug: "post-b", title: "Post B", date: "2026-03-20", tags: ["docker", "devops"] },
  { slug: "post-c", title: "Post C", date: "2026-05-10", tags: ["kubernetes", "terraform"] },
  { slug: "post-d", title: "Post D", date: "2026-04-01", tags: ["docker", "kubernetes", "devops"] },
  { slug: "post-e", title: "Post E", date: "2026-06-01", tags: ["python", "ml"] },
];

vi.mock("@/lib/mdx", () => ({
  getAllPosts: () => mockAllPosts,
  getPostBySlug: (slug: string) => mockAllPosts.find((p) => p.slug === slug),
}));

describe("extractTagsFromContent utility", () => {
  it("extracts tags from MDX frontmatter", () => {
    const content = `---
title: "Test Post"
tags: [docker, kubernetes, devops]
---

Some content here.`;

    const tags = extractTagsFromContent(content);
    expect(tags).toEqual(["docker", "kubernetes", "devops"]);
  });

  it("handles quoted tags in frontmatter", () => {
    const content = `---
title: "Test Post"
tags: ["docker", "k8s"]
---`;

    const tags = extractTagsFromContent(content);
    expect(tags).toEqual(["docker", "k8s"]);
  });

  it("handles single-quoted tags", () => {
    const content = `---
tags: ['python', 'ml']
---`;

    const tags = extractTagsFromContent(content);
    expect(tags).toEqual(["python", "ml"]);
  });

  it("deduplicates repeated tags", () => {
    const content = `---
tags: [docker, docker, kubernetes]
---`;

    const tags = extractTagsFromContent(content);
    expect(tags).toHaveLength(2);
    expect(tags).toEqual(["docker", "kubernetes"]);
  });

  it("returns empty array for content without frontmatter", () => {
    const content = `# Hello World

No frontmatter here.`;

    const tags = extractTagsFromContent(content);
    expect(tags).toEqual([]);
  });

  it("handles null and undefined input gracefully", () => {
    expect(extractTagsFromContent(null)).toEqual([]);
    expect(extractTagsFromContent(undefined)).toEqual([]);
    expect(extractTagsFromContent("")).toEqual([]);
  });

  it("handles frontmatter without tags field", () => {
    const content = `---
title: "No Tags"
date: 2026-01-01
---`;

    const tags = extractTagsFromContent(content);
    expect(tags).toEqual([]);
  });
});

describe("findRelatedPosts utility", () => {
  it("returns posts sharing at least one tag with current post", () => {
    const currentPost = { slug: "current", title: "Current", date: "2026-06-15", tags: ["docker"] };

    const related = findRelatedPosts(currentPost, mockAllPosts);

    // Post A (docker), B (docker), D (docker) all share a tag
    expect(related).toHaveLength(3);
    expect(related.map((p) => p.slug)).toContain("post-a");
    expect(related.map((p) => p.slug)).toContain("post-b");
    expect(related.map((p) => p.slug)).toContain("post-d");
  });

  it("excludes the current post from results", () => {
    const currentPost = mockAllPosts[0]; // post-a
    const related = findRelatedPosts(currentPost, mockAllPosts);

    expect(related.map((p) => p.slug)).not.toContain("post-a");
  });

  it("sorts by shared tag count (most similar first)", () => {
    // Post D shares 2 tags with current (docker + kubernetes), others share 1
    const currentPost = { slug: "current", title: "Current", date: "2026-06-15", tags: ["docker", "kubernetes"] };

    const related = findRelatedPosts(currentPost, mockAllPosts);

    // Post D (2 shared tags) should be first
    expect(related[0].slug).toBe("post-d");
  });

  it("uses date as secondary sort when tag counts are equal", () => {
    const currentPost = { slug: "current", title: "Current", date: "2026-06-15", tags: ["docker"] };

    const related = findRelatedPosts(currentPost, mockAllPosts);

    // All share 1 tag (docker). Post D (Apr) is newest among tied posts.
    expect(related[0].slug).toBe("post-d");
  });

  it("limits results to top 5", () => {
    const manyPosts = Array.from({ length: 20 }, (_, i) => ({
      slug: `post-${i}`,
      title: `Post ${i}`,
      date: "2026-01-01",
      tags: ["shared"],
    }));

    const currentPost = { slug: "current", title: "Current", date: "2026-06-15", tags: ["shared"] };
    const related = findRelatedPosts(currentPost, manyPosts);

    expect(related).toHaveLength(5);
  });

  it("returns empty array when current post has no tags", () => {
    const currentPost = { slug: "current", title: "Current", date: "2026-01-01", tags: [] };
    expect(findRelatedPosts(currentPost, mockAllPosts)).toEqual([]);
  });

  it("returns empty array when no posts share tags", () => {
    const currentPost = { slug: "current", title: "Current", date: "2026-01-01", tags: ["unique-tag"] };
    expect(findRelatedPosts(currentPost, mockAllPosts)).toEqual([]);
  });

});

describe("getTagOverlap utility", () => {
  it("counts shared tags between two tag arrays", () => {
    const overlap = getTagOverlap(["docker", "kubernetes"], ["docker", "devops"]);
    expect(overlap).toBe(1);
  });

  it("returns zero when no tags are shared", () => {
    const overlap = getTagOverlap(["python", "ml"], ["docker", "k8s"]);
    expect(overlap).toBe(0);
  });

  it("handles multiple overlapping tags", () => {
    const overlap = getTagOverlap(["a", "b", "c"], ["b", "c", "d"]);
    expect(overlap).toBe(2);
  });

  it("handles null or undefined inputs gracefully", () => {
    expect(getTagOverlap(null as any, ["docker"])).toBe(0);
    expect(getTagOverlap(["docker"], undefined as any)).toBe(0);
    expect(getTagOverlap([], ["docker"])).toBe(0);
  });
});

describe("RelatedPosts component rendering", () => {
  // Component uses runtime require("@/lib/mdx") which bypasses vi.mock.
  // Test that the component exports correctly and accepts valid props.
  it("exports RelatedPosts function", async () => {
    const { RelatedPosts } = await import("@/components/blog/related-posts");
    expect(typeof RelatedPosts).toBe("function");
  });

  it("extractTagsFromContent returns tags used by the component", () => {
    // Simulate what the blog post page does: extract tags from MDX content
    const mdxContent = `---
title: "Docker Deep Dive"
tags: [docker, containers]
date: 2026-01-15
---

# Docker Deep Dive

Content here...`;

    const tags = extractTagsFromContent(mdxContent);
    expect(tags).toContain("docker");
    expect(tags).toContain("containers");
  });

  it("findRelatedPosts returns posts the component would display", () => {
    // Simulate what happens when a user reads a docker-tagged post
    const currentPost = { slug: "docker-deep-dive", title: "Docker Deep Dive", date: "2026-01-15", tags: ["docker"] };
    const related = findRelatedPosts(currentPost, mockAllPosts);

    // Should find posts with docker tag
    expect(related.length).toBeGreaterThan(0);
    // All returned posts should share at least one tag
    for (const post of related) {
      const sharedTags = currentPost.tags.filter((t) => post.tags.includes(t));
      expect(sharedTags.length).toBeGreaterThan(0);
    }
  });
});