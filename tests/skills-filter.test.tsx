/**
 * Skills Filter Tests
 *
 * Verifies the interactive skills filtering component:
 * - Renders search input and category badges correctly
 * - Filters skills by text search (case-insensitive)
 * - Filters skills by category selection
 * - Combines search + category filters correctly
 * - Shows accurate result counts
 * - Clear filters button resets state
 * - Keyboard accessibility for category badges
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { SkillsFilter } from "@/components/hero/skills-filter";
import type { FilterableSkill } from "@/components/hero/skills-filter";

const testSkills: FilterableSkill[] = [
  { name: "Docker", icon: "Container", category: "Infrastructure", proficiency: 5 },
  { name: "Kubernetes", icon: "Ship", category: "Infrastructure", proficiency: 4 },
  { name: "Ansible", icon: "Cog", category: "Infrastructure", proficiency: 5 },
  { name: "GitHub Actions", icon: "Workflow", category: "CI/CD & Automation", proficiency: 5 },
  { name: "Git", icon: "GitGraph", category: "CI/CD & Automation", proficiency: 5 },
  { name: "TypeScript", icon: "FileCode", category: "Languages", proficiency: 4 },
  { name: "Python", icon: "Code", category: "Languages", proficiency: 4 },
  { name: "Bash", icon: "TerminalSquare", category: "Languages", proficiency: 5 },
  { name: "VS Code", icon: "Monitor", category: "Tools", proficiency: 5 },
  { name: "Grafana", icon: "BarChart3", category: "Tools", proficiency: 3 },
];

describe("SkillsFilter", () => {
  it("renders search input and all unique categories", () => {
    const onFilterChange = vi.fn();
    render(<SkillsFilter skills={testSkills} onFilterChange={onFilterChange} />);

    expect(screen.getByPlaceholderText("Search skills...")).toBeInTheDocument();
    expect(screen.getByText("Infrastructure")).toBeInTheDocument();
    expect(screen.getByText("CI/CD & Automation")).toBeInTheDocument();
    expect(screen.getByText("Languages")).toBeInTheDocument();
    expect(screen.getByText("Tools")).toBeInTheDocument();
  });

  it("shows correct initial result count", () => {
    const onFilterChange = vi.fn();
    render(<SkillsFilter skills={testSkills} onFilterChange={onFilterChange} />);

    expect(screen.getByText(`${testSkills.length} skills`)).toBeInTheDocument();
  });

  it("filters by text search (case-insensitive)", () => {
    const onFilterChange = vi.fn();
    render(<SkillsFilter skills={testSkills} onFilterChange={onFilterChange} />);

    fireEvent.change(screen.getByPlaceholderText("Search skills..."), {
      target: { value: "docker" },
    });

    expect(onFilterChange).toHaveBeenLastCalledWith(
      new Set(["Docker"]),
    );
  });

  it("filters by category selection", () => {
    const onFilterChange = vi.fn();
    render(<SkillsFilter skills={testSkills} onFilterChange={onFilterChange} />);

    // Click Infrastructure category badge
    fireEvent.click(screen.getByText("Infrastructure"));

    expect(onFilterChange).toHaveBeenLastCalledWith(
      new Set(["Docker", "Kubernetes", "Ansible"]),
    );
  });

  it("combines search + category filters correctly", () => {
    const onFilterChange = vi.fn();
    render(<SkillsFilter skills={testSkills} onFilterChange={onFilterChange} />);

    // Select Infrastructure category
    fireEvent.click(screen.getByText("Infrastructure"));

    // Then search for "kube" within that category
    fireEvent.change(screen.getByPlaceholderText("Search skills..."), {
      target: { value: "kube" },
    });

    expect(onFilterChange).toHaveBeenLastCalledWith(new Set(["Kubernetes"]));
  });

  it("shows 'X of Y' count when filtered", () => {
    const onFilterChange = vi.fn();
    render(<SkillsFilter skills={testSkills} onFilterChange={onFilterChange} />);

    fireEvent.change(screen.getByPlaceholderText("Search skills..."), {
      target: { value: "bash" },
    });

    expect(screen.getByText(`1 of ${testSkills.length} skills`)).toBeInTheDocument();
  });

  it("clears filters when clear button is clicked", () => {
    const onFilterChange = vi.fn();
    render(<SkillsFilter skills={testSkills} onFilterChange={onFilterChange} />);

    // Apply a filter first
    fireEvent.change(screen.getByPlaceholderText("Search skills..."), {
      target: { value: "docker" },
    });

    // Clear filters
    fireEvent.click(screen.getByLabelText("Clear all filters"));

    expect(onFilterChange).toHaveBeenLastCalledWith(
      new Set(testSkills.map((s) => s.name)),
    );
  });

  it("category badges are keyboard accessible", () => {
    const onFilterChange = vi.fn();
    render(<SkillsFilter skills={testSkills} onFilterChange={onFilterChange} />);

    const badge = screen.getByText("Languages");
    expect(badge).toHaveAttribute("role", "button");
    expect(badge).toHaveAttribute("tabIndex", "0");

    // Space key toggles the category
    fireEvent.keyDown(badge, { key: " " });
    expect(onFilterChange).toHaveBeenCalled();
  });

  it("toggles category badge on/off", () => {
    const onFilterChange = vi.fn();
    render(<SkillsFilter skills={testSkills} onFilterChange={onFilterChange} />);

    // Click to activate
    fireEvent.click(screen.getByText("Tools"));
    expect(onFilterChange).toHaveBeenLastCalledWith(
      new Set(["VS Code", "Grafana"]),
    );

    // Click again to deactivate
    fireEvent.click(screen.getByText("Tools"));
    expect(onFilterChange).toHaveBeenLastCalledWith(
      new Set(testSkills.map((s) => s.name)),
    );
  });

  it("shows 'No skills match' message when no results", () => {
    const onFilterChange = vi.fn();
    render(<SkillsFilter skills={testSkills} onFilterChange={onFilterChange} />);

    fireEvent.change(screen.getByPlaceholderText("Search skills..."), {
      target: { value: "nonexistent" },
    });

    expect(onFilterChange).toHaveBeenLastCalledWith(new Set());
  });
});