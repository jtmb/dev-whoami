/**
 * Featured project card — displays a curated project with description,
 * tech tags, star count, and GitHub link. Used on the /projects page.
 * Supports optional project image for visual differentiation.
 */
import { ExternalLink, Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/shared/github-icon";
import type { FeaturedProject } from "@/lib/types";

interface ProjectCardProps {
  project: FeaturedProject;
  stars?: number;
}

export function ProjectCard({ project, stars }: ProjectCardProps) {
  return (
    <Card className="group flex flex-col transition-all hover:border-primary/50 hover:shadow-md">
      {/* Optional image section */}
      {project.image && (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <img
            src={project.image}
            alt={`${project.name} screenshot`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      <CardHeader className={project.image ? "pt-4" : ""}>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              {project.name}
            </a>
          </CardTitle>
          {/* Stars */}
          {stars !== undefined && (
            <span className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              {stars}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className={project.image ? "flex-1" : ""}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        {/* Tech tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className={project.image ? "pt-4" : ""}>
        <Button
          variant="outline"
          size="sm"
          render={
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <GitHubIcon className="mr-1.5 h-3.5 w-3.5" />
          Source
        </Button>
        {project.demoUrl && (
          <Button
            variant="secondary"
            size="sm"
            render={
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Demo
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}