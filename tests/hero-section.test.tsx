/**
 * Tests for Hero section component.
 * Verifies rendering, accessibility attributes, stats display, and CTA links.
 */
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/hero/hero-section";

// Mock framer-motion to avoid animation side effects in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ initial, animate, transition, ...props }: React.ComponentProps<"div">) =>
      // @ts-expect-error simplified mock doesn't support all props
      <div {...props} />,
  },
  useReducedMotion: vi.fn(() => true),
}));

// Mock next/link since it's a Next.js-specific component not available in jsdom
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    // eslint-disable-next-line jsx-a11y/anchor-has-name
    <a href={href}>{children}</a>,
}));

describe("Hero Section", () => {
  const defaultProps = {
    repos: 46,
    stars: 120,
    topLanguages: ["TypeScript", "Python", "Go"],
  };

  it("renders the hero name heading", () => {
    render(<Hero {...defaultProps} />);
    expect(screen.getByText("James")).toBeInTheDocument();
  });

  it("renders the title subtitle", () => {
    render(<Hero {...defaultProps} />);
    expect(
      screen.getByText("DevOps Engineer & Homelab Enthusiast"),
    ).toBeInTheDocument();
  });

  it("displays repo count stat", () => {
    render(<Hero {...defaultProps} />);
    expect(screen.getByText("46")).toBeInTheDocument();
    expect(screen.getByText("Repositories")).toBeInTheDocument();
  });

  it("displays star count stat", () => {
    render(<Hero {...defaultProps} />);
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("Stars")).toBeInTheDocument();
  });

  it("displays top languages stat", () => {
    render(<Hero {...defaultProps} />);
    expect(screen.getByText("TypeScript · Python · Go")).toBeInTheDocument();
    expect(screen.getByText("Top Languages")).toBeInTheDocument();
  });

  it("has the View Projects CTA link pointing to /projects", () => {
    render(<Hero {...defaultProps} />);
    const link = screen.getByRole("link", { name: /view projects/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/projects");
  });

  it("has the GitHub Profile CTA button", () => {
    render(<Hero {...defaultProps} />);
    // The Button component wraps <a> with role="button" for external links
    const button = screen.getByRole("button", { name: /github profile/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute(
      "href",
      "https://github.com/jtmb",
    );
  });

  it("has the section aria-label for accessibility", () => {
    render(<Hero {...defaultProps} />);
    const section = document.querySelector('section[aria-label="Introduction"]');
    expect(section).toBeInTheDocument();
  });

  it("shows first tagline when reduced motion is preferred (mocked)", () => {
    render(<Hero {...defaultProps} />);
    // With reduced motion, the static first tagline is shown instead of animation
    expect(screen.getByText("Automating infrastructure.")).toBeInTheDocument();
  });

  it("renders with zero stats without crashing", () => {
    render(
      <Hero repos={0} stars={0} topLanguages={[]} />,
    );
    expect(screen.getByText("James")).toBeInTheDocument();
  });
});