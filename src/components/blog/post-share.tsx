/**
 * PostShare — social sharing buttons for blog posts.
 * Provides Twitter/X, LinkedIn, and Copy Link share options with clipboard feedback.
 * Renders as a horizontal row of icon buttons below post content.
 */
"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostShareProps {
  title: string;
  slug: string;
}

/** Social platform share URL configurations. */
const SHARE_PLATFORMS = [
  /** Twitter/X intent URL for sharing. */
  {
    name: "X (Twitter)",
    icon: Share2,
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  /** LinkedIn share-offsite URL for sharing. */
  {
    name: "LinkedIn",
    icon: Share2, // Reuse Share2 since lucide-react v1.x doesn't export Linkedin
    getUrl: (url: string, title: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
] as const;

export function PostShare({ title, slug }: PostShareProps) {
  const [copied, setCopied] = useState(false);

  /** Build the full post URL — only available in browser (not during SSR). */
  const postUrl = typeof window !== "undefined"
    ? `${window.location.origin}/blog/${slug}`
    : `/blog/${slug}`;

  /** Copy post permalink to clipboard with visual feedback. */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers — clipboard API may not be available.
      const textarea = document.createElement("textarea");
      textarea.value = postUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mt-12 pt-6 border-t border-border">
      <div className="flex items-center gap-3">
        {/* Share label */}
        <span className="text-sm font-medium text-muted-foreground mr-1">Share:</span>

        {/* Social platform share buttons */}
        {SHARE_PLATFORMS.map((platform) => (
          <Button
            key={platform.name}
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs"
            onClick={() => window.open(platform.getUrl(postUrl, title), "_blank", "noopener,noreferrer")}
            aria-label={`Share on ${platform.name}`}
          >
            <platform.icon className="h-4 w-4" />
            {platform.name}
          </Button>
        ))}

        {/* Copy link button with success feedback */}
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 text-xs"
          onClick={handleCopyLink}
          aria-label={copied ? "Link copied to clipboard" : "Copy link to clipboard"}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Link
            </>
          )}
        </Button>
      </div>
    </div>
  );
}