/**
 * Blog post detail page — renders MDX content for a single blog post.
 * Uses @next/mdx to process MDX at build time.
 * generateStaticParams pre-renders all posts at build time for maximum perf.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
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

  // Dynamically import the MDX file
  const { default: PostContent } = await import(
    `@/content/posts/${slug}.mdx`
  );

  return (
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
      </article>
    </SectionWrapper>
  );
}
