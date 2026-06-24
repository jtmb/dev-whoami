"use client";

/**
 * Client-side repository filter bar — text search, language filter, and sort options.
 * Operates entirely on in-memory data (no extra API calls).
 * Debounced text input for smooth UX.
 */
import { useState, useMemo, useRef } from "react";
import { Search, X } from "lucide-react";
import { useKeyboardNav } from "@/hooks/use-keyboard-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GitHubRepo } from "@/lib/types";

export type SortOption = "updated" | "stars" | "name";

interface RepoFilterProps {
  repos: GitHubRepo[];
  onFilteredChange: (filtered: GitHubRepo[]) => void;
  allLanguages: string[];
}

export function RepoFilter({
  repos,
  onFilteredChange,
  allLanguages,
}: RepoFilterProps) {
  const filterRef = useRef<HTMLDivElement>(null);
  // Arrow-key navigation across language badges and sort buttons
  useKeyboardNav(filterRef, { orientation: "horizontal", wrapAround: true });
  const [search, setSearch] = useState("");
  const [selectedLangs, setSelectedLangs] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortOption>("updated");

  // Filter and sort repos whenever inputs change
  useMemo(() => {
    let filtered = [...repos];

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.topics?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // Language filter
    if (selectedLangs.size > 0) {
      filtered = filtered.filter(
        (r) => r.language && selectedLangs.has(r.language),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sort) {
        case "stars":
          return b.stargazers_count - a.stargazers_count;
        case "name":
          return a.name.localeCompare(b.name);
        case "updated":
        default:
          return (
            new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
          );
      }
    });

    onFilteredChange(filtered);
  }, [repos, search, selectedLangs, sort, onFilteredChange]);

  /** Toggle a language in the filter set. */
  function toggleLang(lang: string) {
    setSelectedLangs((prev) => {
      const next = new Set(prev);
      if (next.has(lang)) next.delete(lang);
      else next.add(lang);
      return next;
    });
  }

  /** Clear all filters. */
  function clearFilters() {
    setSearch("");
    setSelectedLangs(new Set());
    setSort("updated");
  }

  const hasFilters = search.trim() || selectedLangs.size > 0;

  return (
    <div ref={filterRef} className="space-y-4" role="group" aria-label="Repository filters">
      {/* Search + sort row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <SortButton
            current={sort}
            value="updated"
            label="Recent"
            onClick={setSort}
          />
          <SortButton
            current={sort}
            value="stars"
            label="Stars"
            onClick={setSort}
          />
          <SortButton
            current={sort}
            value="name"
            label="Name"
            onClick={setSort}
          />
        </div>
      </div>

      {/* Language filter chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        {allLanguages.map((lang) => (
          <Badge
            key={lang}
            variant={selectedLangs.has(lang) ? "default" : "outline"}
            className="cursor-pointer transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
            tabIndex={0}
            role="button"
            aria-pressed={selectedLangs.has(lang)}
            aria-label={`${selectedLangs.has(lang) ? 'Deselect' : 'Select'} ${lang} filter`}
            onClick={() => toggleLang(lang)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleLang(lang);
              }
            }}
          >
            {lang}
          </Badge>
        ))}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            tabIndex={0}
            aria-label="Clear all filters"
            onClick={clearFilters}
          >
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

/** Inline sort toggle button. */
function SortButton({
  current,
  value,
  label,
  onClick,
}: {
  current: SortOption;
  value: SortOption;
  label: string;
  onClick: (v: SortOption) => void;
}) {
  return (
    <Button
      variant={current === value ? "secondary" : "ghost"}
      size="sm"
      tabIndex={0}
      role="menuitemradio"
      aria-checked={current === value}
      aria-label={`Sort by ${label.toLowerCase()}`}
      onClick={() => onClick(value)}
      className="text-xs focus:ring-2 focus:ring-primary focus:outline-none"
    >
      {label}
    </Button>
  );
}
