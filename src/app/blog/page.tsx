/**
 * Blog list page — all posts sorted by date, newest first.
 * Static page that reads from the filesystem at build time.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedReveal } from "@/components/shared/animated-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPosts, formatDate, getReadingTime } from "@/lib/mdx";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "DevOps tutorials, homelab guides, and thoughts on automation, self-hosting, and infrastructure.",
};

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <SectionWrapper>
      <AnimatedReveal>
        <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          <GradientText>Blog</GradientText>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Tutorials, guides, and thoughts on DevOps, self-hosting, automation,
          and building reliable infrastructure.
        </p>
      </AnimatedReveal>

      {posts.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No posts yet — check back soon!
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            First posts on DevOps and homelab automation are in the works.
          </p>
        </div>
      ) : (
        <div className="mx-auto mt-12 max-w-3xl space-y-6">
          {posts.map((post, i) => {
            // Read the file to calculate reading time
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
              // Use default
            }

            return (
              <AnimatedReveal key={post.slug} delay={i * 0.1}>
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
                              {readingTime} min read
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
            );
          })}
        </div>
      )}
    </SectionWrapper>
  );
}
