/**
 * Terminal window decorative component — renders a fake terminal frame
 * with green-on-black text. Used in project cards for CLI tool previews
 * and anywhere we want a dev-oriented visual element.
 */
import { cn } from "@/lib/utils";

interface TerminalWindowProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function TerminalWindow({
  children,
  className,
  title = "terminal",
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-zinc-950 font-mono text-sm",
        className,
      )}
    >
      {/* Title bar with traffic-light dots */}
      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        <span className="h-3 w-3 rounded-full bg-yellow-500" />
        <span className="h-3 w-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-zinc-500">{title}</span>
      </div>
      {/* Content */}
      <div className="p-4 text-green-400">{children}</div>
    </div>
  );
}
