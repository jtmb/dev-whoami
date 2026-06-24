/**
 * Related Posts component — displays recommendations based on shared tags.
 * Renders at the bottom of blog post pages with title, date, tag overlap count.
 */
import Link from "next/link";
import { Calendar } from "lucide-react";

interface PostWithTags {
  slug: string;
  title: string;
  date: string;
  tags: string[];
}

interface RelatedPostsProps {
  currentPost: {
    slug: string;
    tags: string[] | undefined;
  };
}

export function RelatedPosts({ currentPost }: RelatedPostsProps) {
  // Import here to avoid circular dependency with mdx.ts
  const allPosts = require("@/lib/mdx").getAllPosts();

  // Find related posts based on shared tags
  const relatedPosts: PostWithTags[] = [];

  for (const post of allPosts) {
    if (!post.tags || !currentPost.tags) continue;

    if (post.slug === currentPost.slug) continue;

    // Check for shared tags
    const sharedTags = currentPost.tags.filter((tag) => post.tags.includes(tag));

    if (sharedTags.length > 0) {
      relatedPosts.push({ ...post, sharedTags });
    }
  }

  // Sort by number of shared tags (most similar first), then by date (newest first)
  relatedPosts.sort((a, b) => {
    const aShared = currentPost.tags!.filter((tag) => a.tags.includes(tag)).length;
    const bShared = currentPost.tags!.filter((tag) => b.tags.includes(tag)).length;

    // Primary sort: most shared tags first
    if (bShared !== aShared) return bShared - aShared;

    // Secondary sort: newest date first
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Limit to top 5 recommendations
  const recommendations = relatedPosts.slice(0, 5);

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        Read Next
      </h2>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((post) => {
            const sharedTags = currentPost.tags!.filter(
              (tag) => post.tags.includes(tag)
            );

            return (
              <article
                key={post.slug}
                className="group cursor-pointer"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex flex-col h-full block hover:no-underline focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1"
                >
                  {/* Tag overlap indicator */}
                  {sharedTags.length > 0 && (
                    <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="text-primary font-medium">{sharedTags.length}</span>
                      shared tag{sharedTags.length === 1 ? "" : "s"}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Date */}
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  {/* Tags */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {sharedTags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        // Empty state
        <p className="text-sm text-muted-foreground">
          No related posts found.
        </p>
      )}
    </section>
  );
}

/** Extract tags from MDX content (exported for use in page component) */