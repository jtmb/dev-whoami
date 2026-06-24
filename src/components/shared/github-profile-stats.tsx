/**
 * GitHub Profile Stats Card — displays real-time repository statistics from the GitHub API.
 * Uses ISR (revalidation every 1 hour) to stay within rate limits while showing fresh data.
 * Shows total public repos, followers, following counts for the authenticated user.
 */

import { Users, GitFork } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GitHubUser } from "@/lib/types";

interface GitHubProfileStatsProps {
  user: GitHubUser | null;
}

export function GitHubProfileStats({ user }: GitHubProfileStatsProps) {
  if (!user) {
    return (
      <Card className="w-full max-w-sm mx-auto bg-muted/30 border-dashed">
        <CardContent className="pt-6 text-center text-sm text-muted-foreground">
          Loading profile stats...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden transition-all hover:shadow-md border-border bg-card">
      {/* Header with avatar and link */}
      <CardHeader className="pb-2 flex-row items-center gap-4">
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 h-16 w-16 rounded-full overflow-hidden border-2 border-border transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        >
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </a>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {user.login}
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
          {user.bio && (
            <p className="text-sm text-muted-foreground line-clamp-1">{user.bio}</p>
          )}
        </div>
      </CardHeader>

      {/* Stats grid */}
      <CardContent className="pt-2">
        <div className="grid grid-cols-3 gap-3">
          {/* Public Repos */}
          <div className="flex flex-col items-center p-3 rounded-lg bg-muted/40 transition-colors hover:bg-muted/60 border border-indigo-500/30">
            <GitFork className="h-5 w-5 mb-1 text-white" />
            <span className="text-xl font-bold">{(user.public_repos || 0).toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">Public Repos</span>
          </div>

          {/* Followers */}
          <div className="flex flex-col items-center p-3 rounded-lg bg-muted/40 transition-colors hover:bg-muted/60 border border-pink-500/30">
            <Users className="h-5 w-5 mb-1 text-white" />
            <span className="text-xl font-bold">{(user.followers || 0).toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">Followers</span>
          </div>

          {/* Following */}
          <div className="flex flex-col items-center p-3 rounded-lg bg-muted/40 transition-colors hover:bg-muted/60 border border-purple-500/30">
            <Users className="h-5 w-5 mb-1 text-white" />
            <span className="text-xl font-bold">{(user.following || 0).toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">Following</span>
          </div>

          {/* Empty placeholder to maintain grid balance */}
          <div className="flex flex-col items-center p-3 rounded-lg bg-muted/20 border border-border" />
        </div>

        {/* HTML URL for copy */}
        {user.html_url && (
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block w-full text-center px-3 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg transition-colors hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            View Profile on GitHub &rarr;
          </a>
        )}
      </CardContent>
    </Card>
  );
}

export default GitHubProfileStats;