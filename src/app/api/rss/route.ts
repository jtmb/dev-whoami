/**
 * Blog RSS/Atom Feed endpoint.
 * Generates an Atom XML feed from MDX blog posts, allowing readers to subscribe
 * via their preferred feed reader (Feedly, Inoreader, NetNewsWire, etc.).
 *
 * Uses the existing getAllPosts() utility to read post metadata at request time,
 * so new posts appear in the feed immediately without a rebuild.
 */
import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/mdx";

/** The base URL for the portfolio site (used for link elements). */
const SITE_URL = process.env.SITE_URL || "https://jtmb.dev";

/**
 * Escape a string for safe XML embedding.
 * Replaces characters that have special meaning in XML to prevent malformed output.
 */
export function xmlEscape(str: string): string {
  return str
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;")
    .replace(/'/g, "\u0026apos;");
}

/**
 * Generate Atom XML feed from blog posts.
 * Atom is the modern standard (RFC 4287), preferred over RSS 2.0 by most feed readers.
 */
export function generateAtomFeed(posts: ReturnType<typeof getAllPosts>): string {
  const now = new Date().toISOString();

  // Build <entry> elements for each post, newest first.
  const entries = posts
    .map(
      (post) => `  <entry>
    <title>${xmlEscape(post.title)}</title>
    <link href="${SITE_URL}/blog/${post.slug}" />
    <id>${SITE_URL}/blog/${post.slug}</id>
    <updated>${post.date}</updated>
    <published>${post.date}</published>
    <author><name>${xmlEscape(post.author || "James")}</name></author>
    <content type="html">${xmlEscape(post.description)}</content>
  </entry>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${SITE_URL}/blog</id>
  <title>${xmlEscape("James' Dev Portfolio Blog")}</title>
  <subtitle>Technical blog posts about DevOps, homelab, and software engineering</subtitle>
  <link href="${SITE_URL}/api/rss" rel="self" />
  <link href="${SITE_URL}/blog" />
  <updated>${now}</updated>
${entries}
</feed>`;
}

export async function GET() {
  try {
    const posts = getAllPosts();
    const xml = generateAtomFeed(posts);

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        // Cache for 1 hour — feed readers don't need real-time freshness.
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("[RSS Feed] Generation error:", error);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate feed</error>',
      {
        status: 500,
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      },
    );
  }
}