/**
 * Gradient text heading — renders text with a gradient from primary to a highlight color.
 * Used for section headings and the hero name to add visual polish.
 */
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "span";
  className?: string;
}

export function GradientText({
  children,
  as: Tag = "span",
  className,
}: GradientTextProps) {
  return (
    <Tag
      className={cn(
        "bg-gradient-to-r from-primary via-primary/80 to-blue-500 bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
