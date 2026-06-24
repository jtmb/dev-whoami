/**
 * Tests for ScrollProgress component.
 * Verifies rendering, accessibility attributes (role="progressbar"),
 * and structural correctness.
 */
import { render, screen } from "@testing-library/react";
import { ScrollProgress } from "@/components/shared/scroll-progress";

// Mock framer-motion to avoid animation side effects in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: (props: React.ComponentProps<"div">) => <div {...props} />,
  },
  useReducedMotion: vi.fn(() => false),
}));

describe("ScrollProgress", () => {
  it("renders with progressbar role for accessibility", () => {
    render(<ScrollProgress />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toBeInTheDocument();
  });

  it("has the correct aria-label", () => {
    render(<ScrollProgress />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-label", "Reading progress");
  });

  it("has aria-valuemin of 0", () => {
    render(<ScrollProgress />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
  });

  it("has aria-valuemax of 100", () => {
    render(<ScrollProgress />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("starts with 0% progress at page top", () => {
    render(<ScrollProgress />);
    const bar = screen.getByRole("progressbar");
    // At initial render (top of page), progress should be 0
    expect(bar).toHaveAttribute("aria-valuenow", "0");
  });

  it("renders the fixed positioning wrapper", () => {
    render(<ScrollProgress />);
    const bar = screen.getByRole("progressbar");
    expect(bar.className).toContain("fixed");
    expect(bar.className).toContain("top-0");
    expect(bar.className).toContain("left-0");
  });

  it("renders the progress fill with primary color", () => {
    render(<ScrollProgress />);
    const bar = screen.getByRole("progressbar");
    // The inner div should have bg-primary class
    const fill = bar.firstChild as HTMLElement;
    expect(fill?.className).toContain("bg-primary");
  });

  it("renders without containerRef (window-based scroll)", () => {
    expect(() => render(<ScrollProgress />)).not.toThrow();
  });

  it("renders with optional containerRef", () => {
    const ref = { current: document.createElement("div") };
    render(<ScrollProgress containerRef={ref} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toBeInTheDocument();
  });
});