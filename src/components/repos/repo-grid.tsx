"use client";

/**
 * Interactive repo grid — client component that handles filtering and rendering.
 * Receives repos data from the server component and renders the filter bar + grid.
 */
import { useState, useCallback } from "react";
import { RepoFilter } from "@/components/repos/repo-filter";
import { RepoCard } from "@/components/repos/repo-card";
import { AnimatedReveal } from "@/components/shared/animated-reveal";
import { Skeleton } from "@/components/ui/skeleton";
import type { GitHubRepo } from "@/lib/types";

interface RepoGridProps {
  repos: GitHubRepo[];
  allLanguages: string[];
}

export function RepoGrid({ repos, allLanguages }: RepoGridProps) {
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>(repos);

  const handleFilteredChange = useCallback((filtered: GitHubRepo[]) => {
    setFilteredRepos(filtered);
  }, []);

  return (
    <>
      <RepoFilter
        repos={repos}
        onFilteredChange={handleFilteredChange}
        allLanguages={allLanguages}
      />

      {/* Results count */}
      <p className="mt-4 text-sm text-muted-foreground">
        Showing {filteredRepos.length} of {repos.length} repositories
      </p>

      {/* Repo grid */}
      {filteredRepos.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRepos.map((repo, i) => (
            <AnimatedReveal key={repo.id} delay={(i % 6) * 0.05}>
              <RepoCard repo={repo} />
            </AnimatedReveal>
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No repositories match your filters.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or language filters.
          </p>
        </div>
      )}
    </>
  );
}

/** Skeleton loading grid shown while ISR cache is cold. */
export function RepoGridSkeleton() {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-xl border border-border p-4">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
