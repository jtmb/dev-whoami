/**
 * Blog post detail page — renders MDX content for a single blog post.
 * Uses @next/mdx to process MDX at build time.
 * generateStaticParams pre-renders all posts at build time for maximum perf.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { PostToc } from "@/components/blog/post-toc";
import { RelatedPosts } from "@/components/blog/related-posts";
import { PostShare } from "@/components/blog/post-share";
import { extractHeadings } from "@/lib/blog-toc";
import { extractTagsFromContent } from "@/lib/related-posts";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAllPosts, getPostBySlug, getReadingTime, formatDate } from "@/lib/mdx";
import fs from "fs";
import path from "path";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-render all blog post pages at build time. */
export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

/** Generate metadata for SEO. */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author || "James"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Read raw content for reading time calculation
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "posts",
    `${slug}.mdx`,
  );
  let readingTime = 5;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    readingTime = getReadingTime(raw);
  } catch {
    // Use default
  }

  // Dynamically import the MDX file and extract headings for TOC
  const { default: PostContent, raw } = await import(
    `@/content/posts/${slug}.mdx`
  );
  
  // Extract headings from raw MDX content using shared utility
  const headings = extractHeadings(raw);

  // Extract tags from current post for related posts feature
  const currentPostTags = extractTagsFromContent(raw);

  return (
    <>
      {/* Reading progress bar — fixed at top of viewport */}
      <ScrollProgress />

      {/* Table of Contents sidebar */}
      {headings.length > 0 && <PostToc headings={headings} />}

      {/* Related Posts section */}
      {currentPostTags.length > 0 && (
        <RelatedPosts currentPost={{ slug, tags: currentPostTags }} />
      )}

      <SectionWrapper>
      {/* Back button */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" render={<Link href="/blog" />}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Blog
        </Button>
      </div>

      {/* Post header */}
      <article className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readingTime} min read
            </span>
            <span>{post.author || "James"}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <Separator className="mb-10" />

        {/* MDX rendered content */}
        <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-border">
          <PostContent />
        </div>

        {/* Social share buttons */}
        <PostShare title={post.title} slug={slug} />
      </article>
    </SectionWrapper>
    </>
  );
}
