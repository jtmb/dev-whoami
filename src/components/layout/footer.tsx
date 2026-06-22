/**
 * Site footer — minimal, clean. Shows copyright, tech stack badges, and GitHub link.
 * Uses server component (no client interactivity needed).
 */
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { GitHubIcon } from "@/components/shared/github-icon";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 sm:px-6">
        {/* Tech stack badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">
            Next.js
          </span>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">
            TypeScript
          </span>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">
            Tailwind CSS
          </span>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">
            shadcn/ui
          </span>
        </div>

        <Separator className="max-w-xs" />

        {/* Social + copyright */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link
            href="https://github.com/jtmb"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <GitHubIcon className="h-4 w-4" />
            <span>jtmb</span>
          </Link>
          <span>·</span>
          <span>&copy; {currentYear} James</span>
        </div>
      </div>
    </footer>
  );
}
