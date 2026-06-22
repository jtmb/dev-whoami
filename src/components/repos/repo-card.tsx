/**
 * Repository card — displays a GitHub repo in the live repo grid.
 * Shows name, description, language (with color dot), stars, forks, topics.
 */
import { Star, GitFork, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitHubIcon } from "@/components/shared/github-icon";
import type { GitHubRepo } from "@/lib/types";

/** Map language names to Tailwind color classes for the dot indicator. */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Shell: "bg-emerald-400",
  PHP: "bg-indigo-500",
  CSS: "bg-pink-500",
  HTML: "bg-orange-500",
  PowerShell: "bg-cyan-500",
  Go: "bg-teal-500",
  Rust: "bg-amber-600",
};

/** Format a date string as a relative "X days/months ago" string. */
function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
}

interface RepoCardProps {
  repo: GitHubRepo;
}

export function RepoCard({ repo }: RepoCardProps) {
  return (
    <Card className="group flex flex-col transition-all hover:border-primary/50 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              {repo.name}
            </a>
          </CardTitle>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={`View ${repo.name} on GitHub`}
          >
            <GitHubIcon className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {repo.description || "No description available."}
        </p>
        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {repo.topics.slice(0, 5).map((topic) => (
              <Badge key={topic} variant="secondary" className="text-[10px]">
                {topic}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center gap-4 text-xs text-muted-foreground">
        {/* Language */}
        {repo.language && (
          <span className="flex items-center gap-1">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                LANGUAGE_COLORS[repo.language] || "bg-gray-400"
              }`}
            />
            {repo.language}
          </span>
        )}
        {/* Stars */}
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          {repo.stargazers_count}
        </span>
        {/* Forks */}
        <span className="flex items-center gap-1">
          <GitFork className="h-3 w-3" />
          {repo.forks_count}
        </span>
        {/* Updated */}
        <span className="ml-auto flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {relativeTime(repo.pushed_at)}
        </span>
      </CardFooter>
    </Card>
  );
}
