/**
 * Live Repositories page — all GitHub repos with client-side filtering.
 * Server component fetches all repos via ISR, passes data to the interactive grid.
 */
import type { Metadata } from "next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedReveal } from "@/components/shared/animated-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { RepoGrid } from "@/components/repos/repo-grid";
import { getRepos } from "@/lib/github";

export const metadata: Metadata = {
  title: "GitHub Repositories",
  description:
    "Browse all 46+ public repositories by James — DevOps automation, self-hosted tools, homelab infrastructure, and more.",
};

// ISR: revalidate every hour (3600 seconds)
export const revalidate = 3600;

export default async function ReposPage() {
  const repos = await getRepos();

  if (!repos || repos.length === 0) {
    return (
      <SectionWrapper>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-muted-foreground">
            Unable to load repositories. Please try again later.
          </p>
        </div>
      </SectionWrapper>
    );
  }

  // Extract sorted language list for the filter chips
  const langCounts: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
    }
  }
  const allLanguages = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang);

  return (
    <SectionWrapper>
      <AnimatedReveal>
        <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          <GradientText>GitHub Repositories</GradientText>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          All {repos.length} public repositories. Filter by language, search by
          name or description, and sort by recency, stars, or name.
        </p>
      </AnimatedReveal>

      <div className="mt-12">
        <RepoGrid repos={repos} allLanguages={allLanguages} />
      </div>
    </SectionWrapper>
  );
}
