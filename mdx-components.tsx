/**
 * Custom MDX components — maps HTML elements rendered from MDX
 * to styled versions using Tailwind Typography.
 * Used by @next/mdx via the mdx-components.tsx convention.
 */
import type { MDXComponents } from "mdx/types";
import type { ImageProps } from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Apply typography prose class to wrapping elements
    wrapper: ({ children }) => (
      <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-border">
        {children}
      </div>
    ),

    // Customize headings for anchor links
    h2: ({ children, ...props }) => (
      <h2 className="mt-10 mb-4 text-2xl font-bold tracking-tight" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="mt-8 mb-3 text-xl font-semibold tracking-tight" {...props}>
        {children}
      </h3>
    ),

    // Inline code blocks
    code: ({ children, ...props }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono" {...props}>
        {children}
      </code>
    ),

    // Blockquotes
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Links open in new tab for external URLs
    a: ({ children, href, ...props }) => {
      const isExternal =
        href && (href.startsWith("http://") || href.startsWith("https://"));
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          {...props}
        >
          {children}
        </a>
      );
    },

    // Merge any user-provided component overrides
    ...components,
  };
}
