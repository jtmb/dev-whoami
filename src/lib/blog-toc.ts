/**
 * Blog TOC utilities — heading extraction and ID generation for Table of Contents.
 * Module-level exports that work in both Server and Client contexts.
 */

interface Heading {
  level: number;
  text: string;
  id: string;
}

/** Generate unique anchor IDs for headings */
export function generateId(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-")     // Replace spaces with hyphens
    .replace(/--/g, "-");     // Collapse multiple hyphens
  return slug || "section";
}

/** Extract headings from raw MDX content */
export function extractHeadings(content: string | null | undefined): Heading[] {
  // Handle null/undefined gracefully
  if (!content) {
    return [];
  }

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