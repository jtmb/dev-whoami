"use client";

/**
 * Post Filters — search input + clickable tag badges for filtering blog posts.
 * Client Component that manages local filter state (search query, active tags)
 * and exposes the filtered results via a callback to the parent Server Component.
 */
import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Minimal post shape needed for filtering — avoids importing full MDX types. */
export interface FilterablePost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  /** Estimated reading time in minutes (optional — computed at build time). */
  readingTime?: number;
}

interface PostFiltersProps {
  /** All posts available to filter (passed from Server Component). */
  posts: FilterablePost[];
  /** Called whenever the filtered list changes, receiving the matching post slugs. */
  onFilterChange: (filteredSlugs: Set<string>) => void;
}

export function PostFilters({ posts, onFilterChange }: PostFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  // Collect all unique tags across all posts, sorted alphabetically.
  const allTags: string[] = useMemo(() => {
    const tagSet = new Set<string>();
    for (const post of posts) {
      for (const tag of post.tags) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  // Compute filtered posts whenever search query or active tags change.
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const hasActiveTags = activeTags.size > 0;
    const hasSearch = query.length > 0;

    return posts.filter((post) => {
      // Text search: match against title and description
      if (hasSearch) {
        const matchesSearch =
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Tag filter: post must have ALL selected tags
      if (hasActiveTags) {
        for (const tag of activeTags) {
          if (!post.tags.includes(tag)) return false;
        }
      }

      return true;
    });
  }, [posts, searchQuery, activeTags]);

  // Notify parent component of filtered results via callback.
  useEffect(() => {
    const slugs = new Set(filteredPosts.map((p) => p.slug));
    onFilterChange(slugs);
  }, [filteredPosts, onFilterChange]);

  /** Toggle a tag filter — adds if inactive, removes if active. */
  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  /** Clear all filters — reset search and tags. */
  const clearFilters = () => {
    setSearchQuery("");
    setActiveTags(new Set());
  };

  const hasAnyFilter = searchQuery.trim().length > 0 || activeTags.size > 0;
  const resultCount = filteredPosts.length;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          aria-label="Search blog posts by title or description"
        />
      </div>

      {/* Tag filter badges */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Filter by tag:
          </span>
          {allTags.map((tag) => {
            const isActive = activeTags.has(tag);
            return (
              <Badge
                key={tag}
                variant={isActive ? "default" : "secondary"}
                className={cn(
                  "cursor-pointer text-xs transition-colors",
                  isActive && "bg-primary text-primary-foreground",
                )}
                onClick={() => toggleTag(tag)}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleTag(tag);
                  }
                }}
              >
                {tag}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Results summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {resultCount === posts.length
            ? `${resultCount} post${resultCount !== 1 ? "s" : ""}`
            : `${resultCount} of ${posts.length} posts`}
        </span>
        {hasAnyFilter && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Clear all filters"
          >
            <X className="h-3 w-3" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}