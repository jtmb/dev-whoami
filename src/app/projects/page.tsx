/**
 * Featured Projects page — showcases curated portfolio highlights.
 * ISR with daily revalidation. Star counts fetched from GitHub API.
 */
import type { Metadata } from "next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedReveal } from "@/components/shared/animated-reveal";
import { GradientText } from "@/components/shared/gradient-text";
import { ProjectCard } from "@/components/projects/project-card";
import { featuredProjects } from "@/data/featured-projects";
import { getRepo } from "@/lib/github";

export const metadata: Metadata = {
  title: "Featured Projects",
  description:
    "Curated DevOps and self-hosting projects by James — Docker automation, Kubernetes clusters, homelab tooling, and more.",
};

// ISR: revalidate every 24 hours (86400 seconds)
export const revalidate = 86400;

export default async function ProjectsPage() {
  // Fetch star counts for featured projects in parallel
  const starsMap = new Map<string, number>();
  const starResults = await Promise.allSettled(
    featuredProjects.map((p) => getRepo(p.name)),
  );
  starResults.forEach((result, i) => {
    if (result.status === "fulfilled" && result.value) {
      starsMap.set(featuredProjects[i].name, result.value.stargazers_count);
    }
  });

  const featured = featuredProjects.filter((p) => p.featured);
  const other = featuredProjects.filter((p) => !p.featured);

  return (
    <SectionWrapper>
      <AnimatedReveal>
        <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          <GradientText>Featured Projects</GradientText>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          A hand-picked selection of my best work — from Docker automation and
          Kubernetes clusters to self-hosting tools and AI experiments.
        </p>
      </AnimatedReveal>

      {/* Featured (top-tier) projects */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((project, i) => (
          <AnimatedReveal key={project.name} delay={i * 0.1}>
            <ProjectCard
              project={project}
              stars={starsMap.get(project.name)}
            />
          </AnimatedReveal>
        ))}
      </div>

      {/* Other projects */}
      {other.length > 0 && (
        <>
          <h2 className="mt-16 text-center text-2xl font-bold tracking-tight">
            More Projects
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {other.map((project, i) => (
              <AnimatedReveal key={project.name} delay={i * 0.1}>
                <ProjectCard
                  project={project}
                  stars={starsMap.get(project.name)}
                />
              </AnimatedReveal>
            ))}
          </div>
        </>
      )}
    </SectionWrapper>
  );
}
