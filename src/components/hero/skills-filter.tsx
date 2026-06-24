"use client";

/**
 * Skills Filter — category tabs + search input for filtering the skills grid.
 * Client Component that manages local filter state (active categories, search query)
 * and exposes filtered results via callback to the parent Server Component.
 *
 * Pattern: mirrors PostFilters (blog tag filtering) but adapted for skill data —
 * filters by category tabs instead of tags, with optional text search.
 */
import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Minimal skill shape needed for filtering — avoids importing full types. */
export interface FilterableSkill {
  name: string;
  icon: string;
  category: string;
  proficiency: number;
}

interface SkillsFilterProps {
  /** All skills available to filter (passed from Server Component). */
  skills: FilterableSkill[];
  /** Called whenever the filtered list changes, receiving matching skill names. */
  onFilterChange: (filteredNames: Set<string>) => void;
}

export function SkillsFilter({ skills, onFilterChange }: SkillsFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());

  // Collect all unique categories from the skills data, sorted alphabetically.
  const allCategories: string[] = useMemo(() => {
    const catSet = new Set<string>();
    for (const skill of skills) {
      catSet.add(skill.category);
    }
    return Array.from(catSet).sort((a, b) => a.localeCompare(b));
  }, [skills]);

  // Compute filtered skills whenever search query or active categories change.
  const filteredSkills = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const hasActiveCategories = activeCategories.size > 0;
    const hasSearch = query.length > 0;

    return skills.filter((skill) => {
      // Text search: match against skill name
      if (hasSearch) {
        if (!skill.name.toLowerCase().includes(query)) return false;
      }

      // Category filter: skill must belong to at least one selected category
      if (hasActiveCategories) {
        if (!activeCategories.has(skill.category)) return false;
      }

      return true;
    });
  }, [skills, searchQuery, activeCategories]);

  // Notify parent component of filtered results via callback.
  useEffect(() => {
    const names = new Set(filteredSkills.map((s) => s.name));
    onFilterChange(names);
  }, [filteredSkills, onFilterChange]);

  /** Toggle a category filter — adds if inactive, removes if active. */
  const toggleCategory = (category: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  /** Clear all filters — reset search and categories. */
  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategories(new Set());
  };

  const hasAnyFilter = searchQuery.trim().length > 0 || activeCategories.size > 0;
  const resultCount = filteredSkills.length;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          aria-label="Search skills by name"
        />
      </div>

      {/* Category filter badges */}
      {allCategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Filter by category:
          </span>
          {allCategories.map((category) => {
            const isActive = activeCategories.has(category);
            return (
              <Badge
                key={category}
                variant={isActive ? "default" : "secondary"}
                className={cn(
                  "cursor-pointer text-xs transition-colors",
                  isActive && "bg-primary text-primary-foreground",
                )}
                onClick={() => toggleCategory(category)}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleCategory(category);
                  }
                }}
              >
                {category}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Results summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {resultCount === skills.length
            ? `${resultCount} skill${resultCount !== 1 ? "s" : ""}`
            : `${resultCount} of ${skills.length} skills`}
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