/**
 * Accessibility audit tests using axe-core.
 * Tests key pages and components for WCAG 2.1 compliance, catching real-world
 * a11y issues (missing labels, improper ARIA, keyboard traps) before they ship.
 */
import { render, fireEvent } from "@testing-library/react";
import type { FeaturedProject } from "@/lib/types";
import { Hero } from "@/components/hero/hero-section";
import { ContactForm } from "@/components/contact/contact-form";
import { Navbar } from "@/components/nav/navbar";
import { Footer } from "@/components/layout/footer";
import { BackToTop } from "@/components/shared/back-to-top";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { ProjectCard } from "@/components/projects/project-card";
import { PostFilters, type FilterablePost } from "@/components/blog/post-filters";
import { expectNoViolations, getInputsMissingLabels } from "./a11y-test-utils";

// Mock IntersectionObserver for components that use it (BackToTop, ScrollProgress)
const observerMock = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: observerMock,
});

// Mock window.scrollY for BackToTop visibility logic
Object.defineProperty(window, "scrollY", {
  writable: true,
  configurable: true,
  value: 300, // Trigger visible state (threshold is 300)
});

describe("Accessibility Audit", () => {
  describe("Hero Section", () => {
    it("has no axe-core violations", async () => {
      const { container } = render(
        <Hero repos={42} stars={150} topLanguages={["Python", "Go"]} />
      );
      await expectNoViolations(container);
    });

    it("uses semantic section with accessible label", () => {
      const { getByRole, getByText } = render(
        <Hero repos={42} stars={150} topLanguages={["Python", "Go"]} />
      );

      // Section has aria-label="Introduction"
      expect(getByRole("region", { name: "Introduction" })).toBeTruthy();
      // H1 is present and contains the name
      const heading = getByText("James");
      expect(heading.tagName.toLowerCase()).toBe("h1");
    });

    it("has aria-live region for animated tagline updates", () => {
      const { container } = render(
        <Hero repos={42} stars={150} topLanguages={["Python", "Go"]} />
      );

      // The tagline div uses aria-live="polite" so screen readers announce changes
      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeTruthy();
    });

    it("decorative elements use aria-hidden", () => {
      const { container } = render(
        <Hero repos={42} stars={150} topLanguages={["Python", "Go"]} />
      );

      // Background gradient and cursor blink are decorative
      const hiddenElements = container.querySelectorAll("[aria-hidden='true']");
      expect(hiddenElements.length).toBeGreaterThan(0);
    });
  });

  describe("Contact Form", () => {
    it("has no axe-core violations", async () => {
      const { container } = render(<ContactForm />);
      await expectNoViolations(container);
    });

    it("all form inputs have associated labels", () => {
      const { container } = render(<ContactForm />);
      const missingLabels = getInputsMissingLabels(container);
      expect(missingLabels).toHaveLength(0);
    });

    it("submit button has accessible name", () => {
      const { getByRole } = render(<ContactForm />);
      // Button should have text content or aria-label
      const submitButton = getByRole("button");
      expect(submitButton.textContent?.trim()).toBeTruthy();
    });
  });

  describe("Navbar", () => {
    it("has no axe-core violations", async () => {
      const { container } = render(<Navbar />);
      await expectNoViolations(container);
    });

    it("navigation landmark is properly marked up", () => {
      const { getByRole } = render(<Navbar />);
      // Nav links should be inside a navigation landmark
      const nav = getByRole("navigation");
      expect(nav).toBeTruthy();
    });

    it("all nav links have accessible names", () => {
      const { getAllByRole } = render(<Navbar />);
      const links = getAllByRole("link");
      for (const link of links) {
        // Each link must have text content or aria-label
        expect(
          link.textContent?.trim() || link.getAttribute("aria-label")
        ).toBeTruthy();
      }
    });
  });

  describe("Footer", () => {
    it("has no axe-core violations", async () => {
      const { container } = render(<Footer />);
      await expectNoViolations(container);
    });

    it("uses footer landmark role", () => {
      const { getByRole } = render(<Footer />);
      expect(getByRole("contentinfo")).toBeTruthy();
    });
  });

  describe("Back-to-Top Button", () => {
    it("has no axe-core violations when visible", async () => {
      // Force scrollY > 300 to make button visible (threshold is hardcoded at 300)
      Object.defineProperty(window, "scrollY", { value: 500 });
      const { container } = render(<BackToTop />);
      await expectNoViolations(container);
    });

    it("button has accessible name for screen readers", () => {
      Object.defineProperty(window, "scrollY", { value: 500 });
      const { getByRole } = render(<BackToTop />);
      // Button should have aria-label or text content
      const button = getByRole("button");
      expect(
        button.getAttribute("aria-label") || button.textContent?.trim()
      ).toBeTruthy();
    });

    it("is hidden when at top of page", () => {
      Object.defineProperty(window, "scrollY", { value: 0 });
      const { queryByRole } = render(<BackToTop />);
      // Button should not be in DOM when scrollY < threshold (300)
      expect(queryByRole("button")).toBeFalsy();
    });
  });

  describe("Scroll Progress Indicator", () => {
    it("has no axe-core violations", async () => {
      const { container } = render(<ScrollProgress />);
      await expectNoViolations(container);
    });

    it("progress bar uses proper ARIA role and attributes", () => {
      const { getByRole } = render(<ScrollProgress />);
      // Progress indicator should have role="progressbar"
      const progressBar = getByRole("progressbar");
      expect(progressBar).toBeTruthy();
      expect(progressBar.getAttribute("aria-valuenow")).toBeDefined();
    });

    it("progress bar has accessible label for screen readers", () => {
      const { container } = render(<ScrollProgress />);
      // The progress bar is NOT hidden — it's useful info for screen readers.
      // It should have an aria-label describing what the progress represents.
      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar?.getAttribute("aria-label")).toBeTruthy();
    });
  });

  describe("Project Card", () => {
    const testProject: FeaturedProject = {
      name: "Test Project",
      description: "A test project description",
      repoUrl: "https://github.com/test/repo",
      tags: ["Docker", "Kubernetes"],
      featured: true,
      category: "DevOps",
    };

    it("has no axe-core violations", async () => {
      const { container } = render(<ProjectCard project={testProject} />);
      await expectNoViolations(container);
    });

    it("links have accessible names or icons with aria-labels", () => {
      const { getAllByRole } = render(<ProjectCard project={testProject} />);
      const links = getAllByRole("link");
      for (const link of links) {
        expect(
          link.textContent?.trim() || link.getAttribute("aria-label")
        ).toBeTruthy();
      }
    });
  });

  describe("Blog Post Filters", () => {
    const testPosts: FilterablePost[] = [
      { slug: "post-1", title: "First Post", description: "About Docker", date: "2024-01-01", tags: ["Docker"] },
      { slug: "post-2", title: "Second Post", description: "Kubernetes guide", date: "2024-02-01", tags: ["Kubernetes", "DevOps"] },
    ];

    it("has no axe-core violations", async () => {
      const { container } = render(
        <PostFilters posts={testPosts} onFilterChange={() => {}} />
      );
      await expectNoViolations(container);
    });

    it("search input has an associated label", () => {
      // input[type=search] gets role="searchbox" (not "search") in ARIA spec
      const { getByRole, queryByLabelText } = render(
        <PostFilters posts={testPosts} onFilterChange={() => {}} />
      );
      // Search input should be labeled (via aria-label or <label>)
      const searchInput = getByRole("searchbox");
      expect(searchInput).toBeTruthy();

      // Check it has an accessible name
      const label = queryByLabelText(/search/i, { exact: false });
      if (!label) {
        // Fallback: check aria-label attribute directly
        expect(searchInput.getAttribute("aria-label")).toBeTruthy();
      }
    });

    it("tag filter badges have accessible names and keyboard support", () => {
      const { getAllByRole, container } = render(
        <PostFilters posts={testPosts} onFilterChange={() => {}} />
      );
      // Tag badges use role="button" — check they have text content
      const badges = container.querySelectorAll('[role="button"]');
      for (const badge of badges) {
        expect(
          badge.textContent?.trim() || badge.getAttribute("aria-label")
        ).toBeTruthy();
        // Check aria-pressed is set for toggle state
        expect(badge.hasAttribute("aria-pressed")).toBe(true);
      }
    });

    it("clear filters button has accessible name when filters are active", () => {
      // Clear button only renders when search text or active tags exist.
      // Type into the searchbox to trigger the clear button visibility.
      const { getByRole } = render(
        <PostFilters posts={testPosts} onFilterChange={() => {}} />
      );
      // input[type=search] gets role="searchbox" in ARIA spec
      const input = getByRole("searchbox");
      expect(input).toBeTruthy();

      // Type text to activate the clear button
      fireEvent.change(input, { target: { value: "test" } });

      // Now the clear filters button should be visible
      const clearButton = getByRole("button", { name: /clear/i });
      expect(clearButton).toBeTruthy();
    });
  });

  describe("Utility Functions", () => {
    it("getInputsMissingLabels detects unlabeled inputs", () => {
      const { container } = render(
        <>
          <input type="text" id="labeled" />
          <label htmlFor="labeled">Name</label>
          <input type="text" aria-label="Email" />
          <input type="text" /> {/* Missing label */}
        </>
      );

      const missing = getInputsMissingLabels(container);
      expect(missing).toHaveLength(1);
    });
  });
});