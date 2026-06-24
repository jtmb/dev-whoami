"use client";

/**
 * BlogListClient — Client-side wrapper for the blog list page.
 * Receives posts from the Server Component, manages filter state via PostFilters,
 * and renders only the matching post cards. This keeps data fetching server-side
 * while enabling interactive filtering on the client.
 */
import { useCallback, useState } from "react";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedReveal } from "@/components/shared/animated-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { PostFilters, type FilterablePost } from "./post-filters";
import { formatDate } from "@/lib/utils";

interface BlogListClientProps {
  posts: FilterablePost[];
}

export function BlogListClient({ posts }: BlogListClientProps) {
  const [filteredSlugs, setFilteredSlugs] = useState(() =>
    new Set(posts.map((p) => p.slug)),
  );

  // Called by PostFilters whenever search/tags change.
  const handleFilterChange = useCallback((slugs: Set<string>) => {
    setFilteredSlugs(slugs);
  }, []);

  const visiblePosts = posts.filter((p) => filteredSlugs.has(p.slug));

  return (
    <SectionWrapper>
      {/* Header */}
      <AnimatedReveal>
        <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          <GradientText>Blog</GradientText>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Tutorials, guides, and thoughts on DevOps, self-hosting, automation,
          and building reliable infrastructure.
        </p>
      </AnimatedReveal>

      {/* Filters */}
      <div className="mx-auto mt-10 max-w-3xl">
        <PostFilters posts={posts} onFilterChange={handleFilterChange} />
      </div>

      {/* Post list */}
      {visiblePosts.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No posts match your filters
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or tag selection
          </p>
        </div>
      ) : (
        <div className="mx-auto mt-8 max-w-3xl space-y-6">
          {visiblePosts.map((post, i) => (
            <AnimatedReveal key={post.slug} delay={i * 0.05}>
              <Link href={`/blog/${post.slug}`}>
                <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl transition-colors hover:text-primary">
                          {post.title}
                        </CardTitle>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(post.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {post.readingTime ?? 5} min read
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {post.description}
                    </p>
                    {post.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </AnimatedReveal>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}