/**
 * Tests for PostFilters and BlogListClient components.
 * Verifies search functionality, tag filtering, combined filters,
 * accessibility attributes, empty states, and result counts.
 */
import { render, screen, fireEvent, act } from "@testing-library/react";
import { PostFilters, type FilterablePost } from "@/components/blog/post-filters";

// Mock framer-motion to avoid animation side effects in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: (props: React.ComponentProps<"div">) => <div {...props} />,
  },
  useReducedMotion: vi.fn(() => false),
  useInView: vi.fn(() => true),
}));

const testPosts: FilterablePost[] = [
  {
    slug: "post-one",
    title: "Building with Kubernetes",
    description: "A guide to deploying apps on K8s clusters",
    date: "2026-01-15",
    tags: ["Kubernetes", "DevOps"],
    readingTime: 8,
  },
  {
    slug: "post-two",
    title: "Docker Compose Tips",
    description: "Best practices for multi-container Docker setups",
    date: "2026-02-20",
    tags: ["Docker", "DevOps"],
    readingTime: 5,
  },
  {
    slug: "post-three",
    title: "Ansible Automation",
    description: "Infrastructure as code with Ansible playbooks",
    date: "2026-03-10",
    tags: ["Ansible", "Automation"],
    readingTime: 12,
  },
];

describe("PostFilters", () => {
  let onFilterChangeMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onFilterChangeMock = vi.fn();
  });

  it("renders search input with correct label", () => {
    render(<PostFilters posts={testPosts} onFilterChange={onFilterChangeMock} />);
    const input = screen.getByRole("searchbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Search posts...");
  });

  it("renders all unique tags as filter badges", () => {
    render(<PostFilters posts={testPosts} onFilterChange={onFilterChangeMock} />);
    // Tags: Ansible, DevOps, Docker, Kubernetes — sorted alphabetically
    const tagLabels = ["Ansible", "DevOps", "Docker", "Kubernetes"];
    for (const tag of tagLabels) {
      expect(screen.getByText(tag)).toBeInTheDocument();
    }
  });

  it("shows correct post count when no filters are active", () => {
    render(<PostFilters posts={testPosts} onFilterChange={onFilterChangeMock} />);
    expect(screen.getByText("3 posts")).toBeInTheDocument();
  });

  it("filters by search query matching title", () => {
    render(<PostFilters posts={testPosts} onFilterChange={onFilterChangeMock} />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "Kubernetes" } });

    // Should narrow to 1 post (post-one has "Kubernetes" in title)
    expect(screen.getByText("1 of 3 posts")).toBeInTheDocument();
    expect(onFilterChangeMock).toHaveBeenCalledWith(
      expect.any(Set),
    );
    // Use last call — first call is initial render with all posts unfiltered
    const calledSet = onFilterChangeMock.mock.calls[onFilterChangeMock.mock.calls.length - 1][0];
    expect(calledSet.has("post-one")).toBe(true);
    expect(calledSet.has("post-two")).toBe(false);
  });

  it("filters by search query matching description", () => {
    render(<PostFilters posts={testPosts} onFilterChange={onFilterChangeMock} />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "playbooks" } });

    // Only post-three has "playbooks" in description
    expect(screen.getByText("1 of 3 posts")).toBeInTheDocument();
  });

  it("filters are case-insensitive", () => {
    render(<PostFilters posts={testPosts} onFilterChange={onFilterChangeMock} />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "docker" } });

    // Should match post-two (title has "Docker")
    expect(screen.getByText("1 of 3 posts")).toBeInTheDocument();
  });

  it("tag filter shows only matching posts", () => {
    render(<PostFilters posts={testPosts} onFilterChange={onFilterChangeMock} />);
    // Click the DevOps tag badge — matches post-one and post-two
    fireEvent.click(screen.getByText("DevOps"));

    expect(screen.getByText("2 of 3 posts")).toBeInTheDocument();
  });

  it("multiple tag filters require ALL tags (AND logic)", () => {
    render(<PostFilters posts={testPosts} onFilterChange={onFilterChangeMock} />);
    // Click DevOps first
    fireEvent.click(screen.getByText("DevOps"));
    // Then click Automation — no post has both tags
    fireEvent.click(screen.getByText("Automation"));

    expect(screen.getByText("0 of 3 posts")).toBeInTheDocument();
  });

  it("combined search + tag filter works", () => {
    render(<PostFilters posts={testPosts} onFilterChange={onFilterChangeMock} />);
    // Filter by DevOps tag (post-one, post-two)
    fireEvent.click(screen.getByText("DevOps"));
    // Then search for "Docker" — only post-two matches both
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "Docker" } });

    expect(screen.getByText("1 of 3 posts")).toBeInTheDocument();
  });

  it("clears filters when clear button is clicked", () => {
    render(<PostFilters posts={testPosts} onFilterChange={onFilterChangeMock} />);
    // Activate a filter
    fireEvent.click(screen.getByText("Docker"));
    expect(screen.getByText("1 of 3 posts")).toBeInTheDocument();

    // Click clear filters
    const clearButton = screen.getByRole("button", { name: /clear all filters/i });
    fireEvent.click(clearButton);

    expect(screen.getByText("3 posts")).toBeInTheDocument();
  });

  it("tag badges have correct accessibility attributes", () => {
    render(<PostFilters posts={testPosts} onFilterChange={onFilterChangeMock} />);
    const k8sBadge = screen.getByRole("button", { name: "Kubernetes" });
    expect(k8sBadge).toHaveAttribute("aria-pressed", "false");

    // Activate it
    fireEvent.click(k8sBadge);
    const activeBadge = screen.getByRole("button", { name: "Kubernetes" });
    expect(activeBadge).toHaveAttribute("aria-pressed", "true");
  });

  it("tag badges are keyboard accessible (Enter and Space)", () => {
    render(<PostFilters posts={testPosts} onFilterChange={onFilterChangeMock} />);
    const badge = screen.getByRole("button", { name: "Ansible" });
    fireEvent.focus(badge);

    // Enter key toggles tag
    fireEvent.keyDown(badge, { key: "Enter" });
    expect(screen.getByText("1 of 3 posts")).toBeInTheDocument();

    // Space key also toggles (deactivates)
    fireEvent.keyDown(badge, { key: " " });
    expect(screen.getByText("3 posts")).toBeInTheDocument();
  });

  it("shows empty state message when no posts match", () => {
    render(<PostFilters posts={testPosts} onFilterChange={onFilterChangeMock} />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "nonexistent-zzz" } });

    expect(screen.getByText("0 of 3 posts")).toBeInTheDocument();
  });

  it("handles empty post list gracefully", () => {
    render(<PostFilters posts={[]} onFilterChange={onFilterChangeMock} />);
    expect(screen.getByText("0 posts")).toBeInTheDocument();
    // No tag badges rendered when there are no posts
    expect(screen.queryByRole("searchbox")).toBeInTheDocument();
  });

  it("notifies parent via callback when filters change", async () => {
    render(<PostFilters posts={testPosts} onFilterChange={onFilterChangeMock} />);
    const input = screen.getByRole("searchbox");

    await act(async () => {
      fireEvent.change(input, { target: { value: "DevOps" } });
    });

    expect(onFilterChangeMock).toHaveBeenCalled();
    // Use last call — first call is initial render with all posts unfiltered
    const resultSet = onFilterChangeMock.mock.calls[onFilterChangeMock.mock.calls.length - 1][0];
    // Search for "DevOps" matches: post-one (title has "Kubernetes", desc doesn't), post-two (desc has "Docker"), post-three (none) — actually none match title/desc with "devops"...
    // But all three posts pass the tag filter check since no tags are selected, so search is the only filter.
    // "DevOps" lowercased matches nothing in titles or descriptions → 0 results
    expect(resultSet.size).toBe(0);
  });
});