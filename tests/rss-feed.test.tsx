/**
 * Tests for RSS/Atom Feed endpoint and utilities.
 * Covers XML escaping, feed generation, and integration with getAllPosts.
 */
import { describe, it, expect } from "vitest";
import { xmlEscape, generateAtomFeed } from "@/app/api/rss/route";
import { getAllPosts } from "@/lib/mdx";

// Unicode escapes for XML entities — survives formatter stripping.
const AMP = "\u0026amp;";
const LT = "\u0026lt;";
const GT = "\u0026gt;";
const QUOT = "\u0026quot;";
const APOS = "\u0026apos;";

describe("RSS Feed (Atom) Endpoint", () => {
  describe("xmlEscape", () => {
    it("escapes ampersand", () => {
      expect(xmlEscape("A & B")).toBe(`A ${AMP} B`);
    });

    it("escapes less-than and greater-than", () => {
      const result = xmlEscape("<script>alert('xss')</script>");
      // Verify dangerous characters are escaped.
      expect(result).toContain(`${LT}script${GT}`);
      expect(result).not.toContain("<script>");
    });

    it("escapes double quotes", () => {
      expect(xmlEscape(`Say "hello"`)).toBe(`Say ${QUOT}hello${QUOT}`);
    });

    it("escapes single quotes", () => {
      expect(xmlEscape("James' blog")).toBe(`James${APOS} blog`);
    });

    it("passes through safe strings unchanged", () => {
      expect(xmlEscape("Hello World 123!")).toBe("Hello World 123!");
    });

    it("handles empty string", () => {
      expect(xmlEscape("")).toBe("");
    });

    it("escapes multiple special chars in one string", () => {
      const input = `A <tag> with "quotes" & 'apostrophes'`;
      const output = xmlEscape(input);
      // Verify each character is escaped.
      expect(output).toContain(`${LT}tag${GT}`);
      expect(output).toContain(`${QUOT}quotes${QUOT}`);
      expect(output).toContain(AMP);
      expect(output).toContain(`${APOS}apostrophes${APOS}`);
    });
  });

  describe("generateAtomFeed", () => {
    const samplePosts = [
      {
        slug: "post-one",
        title: "First Post",
        description: "An intro post",
        date: "2026-01-15T00:00:00Z",
        tags: ["intro"],
        author: "James",
      },
      {
        slug: "post-two",
        title: "Second Post",
        description: "A follow-up",
        date: "2026-01-10T00:00:00Z",
        tags: ["devops"],
        author: "James",
      },
    ];

    it("returns valid XML declaration", () => {
      const xml = generateAtomFeed(samplePosts);
      expect(xml).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    });

    it("includes Atom namespace", () => {
      const xml = generateAtomFeed(samplePosts);
      expect(xml).toContain('xmlns="http://www.w3.org/2005/Atom"');
    });

    it("includes feed id, title, and subtitle", () => {
      const xml = generateAtomFeed(samplePosts);
      expect(xml).toContain("<id>https://jtmb.dev/blog</id>");
      // Title contains apostrophe which is escaped.
      expect(xml).toContain(
        `<title>James${APOS} Dev Portfolio Blog</title>`,
      );
      expect(xml).toContain("Technical blog posts about DevOps, homelab");
    });

    it("includes self-link with rel=self", () => {
      const xml = generateAtomFeed(samplePosts);
      expect(xml).toContain('<link href="https://jtmb.dev/api/rss" rel="self" />');
    });

    it("includes alternate link to blog page", () => {
      const xml = generateAtomFeed(samplePosts);
      expect(xml).toContain('<link href="https://jtmb.dev/blog" />');
    });

    it("sets feed updated timestamp to current time", () => {
      const before = new Date().toISOString();
      const xml = generateAtomFeed(samplePosts);
      const after = new Date().toISOString();
      // Extract the <updated> value from the feed header.
      const match = xml.match(/<updated>([^<]+)<\/updated>/);
      expect(match).not.toBeNull();
      const updated = new Date(match![1]).getTime();
      expect(updated).toBeGreaterThanOrEqual(new Date(before).getTime());
      expect(updated).toBeLessThanOrEqual(new Date(after).getTime());
    });

    it("generates one entry per post", () => {
      const xml = generateAtomFeed(samplePosts);
      // Count <entry> elements.
      const count = (xml.match(/<entry>/g) || []).length;
      expect(count).toBe(2);
    });

    it("includes all required entry fields", () => {
      const xml = generateAtomFeed(samplePosts);
      expect(xml).toContain("<title>First Post</title>");
      expect(xml).toContain('<link href="https://jtmb.dev/blog/post-one" />');
      expect(xml).toContain("<id>https://jtmb.dev/blog/post-one</id>");
      expect(xml).toContain("<updated>2026-01-15T00:00:00Z</updated>");
      expect(xml).toContain("<published>2026-01-15T00:00:00Z</published>");
      expect(xml).toContain("<author><name>James</name></author>");
      expect(xml).toContain('<content type="html">An intro post</content>');
    });

    it("defaults author to James when not provided", () => {
      const posts = [
        { ...samplePosts[0], author: undefined },
      ];
      const xml = generateAtomFeed(posts);
      expect(xml).toContain("<author><name>James</name></author>");
    });

    it("handles empty post list gracefully (no entries)", () => {
      const xml = generateAtomFeed([]);
      expect(xml).not.toContain("<entry>");
      // Feed structure should still be valid.
      expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
    });

    it("escapes dangerous characters in entry content", () => {
      const posts = [
        {
          slug: "xss-test",
          title: "<script>alert('xss')</script>",
          description: `Desc with & "special" chars`,
          date: "2026-01-01T00:00:00Z",
          tags: [],
          author: "Author'Name",
        },
      ];
      const xml = generateAtomFeed(posts);
      // Raw dangerous characters should not appear unescaped.
      expect(xml).not.toContain("<script>");
      // Escaped form should be present.
      expect(xml).toContain(`${LT}script${GT}`);
    });

    it("posts are ordered newest first (same order as input)", () => {
      const xml = generateAtomFeed(samplePosts);
      const firstEntryIdx = xml.indexOf("<title>First Post</title>");
      const secondEntryIdx = xml.indexOf("<title>Second Post</title>");
      expect(firstEntryIdx).toBeLessThan(secondEntryIdx);
    });

    it("generates feed from actual blog posts", () => {
      const posts = getAllPosts();
      expect(posts.length).toBeGreaterThan(0);
      const xml = generateAtomFeed(posts);
      // Check slugs (URL-safe, no escaping issues) and entry count.
      for (const post of posts) {
        expect(xml).toContain(`/blog/${post.slug}`);
      }
      // Verify we have one <entry> per post.
      const entryCount = (xml.match(/<entry>/g) || []).length;
      expect(entryCount).toBe(posts.length);
    });

    it("feed closes properly with closing feed tag", () => {
      const xml = generateAtomFeed(samplePosts);
      expect(xml.trimEnd()).toMatch(/<\/feed>$/);
    });
  });
});