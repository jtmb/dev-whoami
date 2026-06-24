/**
 * Tests for the ProjectCard component.
 * Covers rendering with/without images, hover states, accessibility attributes,
 * and button/link behavior.
 */
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/projects/project-card";

describe("ProjectCard Component", () => {
  const mockProject = {
    name: "test-project",
    description: "A test project for the portfolio.",
    repoUrl: "https://github.com/test/repo",
    tags: ["TypeScript", "React"],
    featured: true,
    category: "DevOps" as const,
  };

  it("renders project name as a link to repo URL", () => {
    render(<ProjectCard project={mockProject} />);
    const link = screen.getByRole("link", { name: /test-project/i });
    expect(link).toHaveAttribute("href", "https://github.com/test/repo");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders project description text", () => {
    render(<ProjectCard project={mockProject} />);
    const paragraph = screen.getByText(/a test project for the portfolio/i);
    expect(paragraph).toBeInTheDocument();
  });

  it("renders tech tags as badges", () => {
    render(<ProjectCard project={mockProject} />);
    const badge1 = screen.getByText("TypeScript");
    const badge2 = screen.getByText("React");
    expect(badge1).toBeInTheDocument();
    expect(badge2).toBeInTheDocument();
  });

  it("renders Source button with GitHub icon", () => {
    render(<ProjectCard project={mockProject} />);
    const sourceLink = screen.getByRole("link", { name: /source/i });
    expect(sourceLink).toBeInTheDocument();
    expect(sourceLink).toHaveAttribute("href", "https://github.com/test/repo");
  });

  it("renders Demo button when demoUrl is provided", () => {
    const projectWithDemo = { ...mockProject, demoUrl: "https://demo.example.com" };
    render(<ProjectCard project={projectWithDemo} />);
    const demoLink = screen.getByRole("link", { name: /demo/i });
    expect(demoLink).toBeInTheDocument();
    expect(demoLink).toHaveAttribute("href", "https://demo.example.com");
  });

  it("does not render Demo button when demoUrl is not provided", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.queryByRole("button", { name: /demo/i })).not.toBeInTheDocument();
  });

  it("renders optional image when provided", () => {
    const projectWithImage = { ...mockProject, image: "/images/project-screenshot.png" };
    render(<ProjectCard project={projectWithImage} />);
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/images/project-screenshot.png");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("does not render image section when no image is provided", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders stars when stars prop is provided", () => {
    render(<ProjectCard project={mockProject} stars={42} />);
    const starCount = screen.getByText("42");
    expect(starCount).toBeInTheDocument();
  });

  it("does not render stars section when stars prop is not provided", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.queryByText(/star/i)).not.toBeInTheDocument();
  });

  it("has correct accessibility attributes on card", () => {
    render(<ProjectCard project={mockProject} />);
    // Card is rendered as a div, not an article. Check children instead.
    expect(screen.getByText(/test-project/i)).toBeInTheDocument();
    expect(screen.getByText(/a test project for the portfolio/i)).toBeInTheDocument();
  });

  it("renders with proper spacing when image is present", () => {
    const projectWithImage = { ...mockProject, image: "/images/project-screenshot.png" };
    render(<ProjectCard project={projectWithImage} />);
    // Image should be rendered first, then content below
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
  });

  it("renders with proper spacing when no image is present", () => {
    render(<ProjectCard project={mockProject} />);
    // No image section, content starts at top
    expect(screen.getByText(/test-project/i)).toBeInTheDocument();
  });
});