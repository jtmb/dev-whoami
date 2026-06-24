"use client";

/**
 * Table of Contents component for blog posts.
 * Auto-generates from MDX headings, tracks active section with IntersectionObserver.
 * Responsive: sticky sidebar on desktop, collapsible section on mobile.
 */
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useKeyboardNav } from "@/hooks/use-keyboard-nav";

interface Heading {
  level: number;
  text: string;
  id: string;
}

interface PostTocProps {
  headings: Heading[];
  className?: string;
}

/** Generate unique anchor IDs for headings */
function generateId(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-")     // Replace spaces with hyphens
    .replace(/--/g, "-");     // Collapse multiple hyphens
  return slug || "section";
}

/** Extract headings from raw MDX content - module-level utility */
export function extractHeadings(content: string): Heading[] {
  const lines = content.split("\n");
  const headings: Heading[] = [];

  for (const line of lines) {
    // Match ## and ### headings (and higher if needed)
    const match = line.match(/^(#{2,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();

      // Only track valid heading levels
      if (level >= 2 && level <= 3) {
        headings.push({
          level,
          text,
          id: generateId(text),
        });
      }
    }
  }

  return headings;
}

/** Client Component - must be imported with "use client" */
export function PostToc({ headings, className }: PostTocProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);
  // Arrow-key navigation between TOC entries (vertical list)
  useKeyboardNav(tocRef, { orientation: "vertical", wrapAround: true });

  /** Track which section is currently in viewport */
  useEffect(() => {
    if (!tocRef.current || headings.length === 0) return;

    const observerOptions: IntersectionObserverInit = {
      root: null, // viewport
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: "0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all heading elements
    const headingElements = document.querySelectorAll(".toc-heading");
    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  /** Toggle mobile TOC */
  function toggleMobile() {
    setIsMobileOpen(!isMobileOpen);
  }

  /** Handle click on TOC item */
  function handleNavigate(id: string) {
    const element = document.getElementById(id);
    if (element) {
      // Smooth scroll with offset for fixed header
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Close mobile TOC if open
      if (isMobileOpen) {
        setIsMobileOpen(false);
      }
    }
  }

  /** Get indentation class based on heading level */
  function getIndentClass(level: number): string {
    const indent = level - 2; // H2 = no indent, H3 = one indent
    if (indent <= 0) return "";
    return `ml-${Math.min(indent * 4, 16)} pl-2`;
  }

  /** Check if heading is active */
  function isActive(id: string): boolean {
    return activeId === id;
  }

  const hasHeadings = headings.length > 0;

  return (
    <div
      ref={tocRef}
      className={cn(
        "fixed right-4 top-24 z-40 max-w-xs",
        "bg-background border border-border rounded-lg shadow-sm",
        "transition-all duration-300 ease-in-out",
        // Desktop: always visible as sticky sidebar
        "hidden md:block sticky top-24",
        // Mobile: collapsible section
        isMobileOpen && "!block"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2 text-sm font-medium">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span>Contents</span>
        </div>
        {/* Mobile toggle */}
        <button
          onClick={toggleMobile}
          className="md:hidden p-2 -mr-2 rounded-md hover:bg-muted transition-colors"
          aria-label={isMobileOpen ? "Close contents" : "Open contents"}
        >
          {isMobileOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* TOC Content */}
      {hasHeadings ? (
        <nav className="p-3 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={() => handleNavigate(heading.id)}
              tabIndex={0}
              className="toc-heading relative block py-1.5 px-2 rounded-md transition-colors group focus:ring-2 focus:ring-primary focus:outline-none"
              style={{ scrollBehavior: "smooth" }}
            >
              <span
                className={cn(
                  "text-sm",
                  getIndentClass(heading.level),
                  isActive(heading.id) && "text-primary font-medium bg-primary/10"
                )}
              >
                {heading.text}
              </span>

              {/* Active indicator */}
              {isActive(heading.id) && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-primary rounded-r-full" />
              )}
            </a>
          ))}
        </nav>
      ) : (
        // Empty state
        <div className="p-6 text-center text-sm text-muted-foreground">
          No headings found in this post.
        </div>
      )}

      {/* Footer */}
      {hasHeadings && (
        <div className="px-3 py-2 border-t border-border bg-muted/50 text-xs text-center text-muted-foreground">
          {headings.length} section{headings.length === 1 ? "" : "s"}
        </div>
      )}
    </div>
  );
}

/** Extract headings from MDX content (exported for use in page component) */