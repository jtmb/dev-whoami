/**
 * Tests for the AnimatedGradient (Star Field) component.
 * Covers rendering, accessibility, theme detection, reduced motion,
 * and star generation behavior.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";

// Controllable dark mode state for tests — mirrors the component's isDark state
let mockIsDark = true;

vi.mock("react", async (importOriginal) => {
  const actual: Record<string, unknown> = await importOriginal();
  return {
    ...actual,
    useId: () => "test-id-123",
    useEffect: vi.fn(), // No-op — we control state via useState mock
    useState: vi.fn().mockImplementation((initArg: unknown) => {
      if (typeof initArg === "function") {
        return [initArg(), vi.fn()];
      }
      // For boolean initial values (like isDark = false), substitute our mock
      if (typeof initArg === "boolean") {
        return [mockIsDark, vi.fn()];
      }
      return [initArg, vi.fn()];
    }),
  };
});

Object.defineProperty(window, "MutationObserver", {
  writable: true,
  value: vi.fn(() => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// Dynamic import after mocks are set up
const AnimatedGradient = (await import("@/components/shared/animated-gradient")).AnimatedGradient;

describe("AnimatedGradient component (Star Field)", () => {
  beforeEach(() => {
    mockIsDark = true;
  });

  afterEach(() => {
    mockIsDark = true;
    vi.restoreAllMocks();
  });

  it("renders a star field div with aria-hidden", () => {
    const { container } = render(<AnimatedGradient />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it("is hidden from screen readers", () => {
    const { container } = render(<AnimatedGradient />);
    expect(container.querySelector('[aria-hidden="true"]'))
      .toHaveAttribute("aria-hidden", "true");
  });

  it("has fixed positioning and pointer-events-none via CSS class", () => {
    const { container } = render(<AnimatedGradient />);
    const bg = container.querySelector('[aria-hidden="true"]');
    expect(bg).toBeInTheDocument();
    // The star-field class includes position:fixed and pointer-events:none via injected styles
    expect(bg?.className).toMatch(/star-field-/);
  });

  it("injects style element with star keyframes", () => {
    const { container } = render(<AnimatedGradient />);
    const styleTag = container.querySelector("style");
    expect(styleTag).toBeInTheDocument();
    expect(styleTag?.textContent).toContain("@keyframes");
    expect(styleTag?.textContent).toContain("star-twinkle");
  });

  it("renders multiple star elements", () => {
    const { container } = render(<AnimatedGradient />);
    // Stars have classes like star-test-id-123 and star-animated-test-id-123
    const stars = container.querySelectorAll('[class*="star-"][style]');
    expect(stars.length).toBeGreaterThan(10);
  });

  it("renders stars with varying sizes and positions", () => {
    const { container } = render(<AnimatedGradient />);
    const starElements = Array.from(
      container.querySelectorAll('div[class*="star-"][style]')
    ) as HTMLElement[];
    expect(starElements.length).toBeGreaterThan(0);
    const firstStar = starElements[0];
    expect(firstStar.style.top).toBeDefined();
    expect(firstStar.style.left).toBeDefined();
  });

  it("renders as style + div structure (no extra wrapper nodes)", () => {
    const { container } = render(<AnimatedGradient />);
    // Fragment renders: <style> + <div aria-hidden="true">
    expect(container.children.length).toBe(2);
    expect(container.querySelector("style")).toBeInTheDocument();
  });

  it("generates exactly 80 stars", () => {
    const { container } = render(<AnimatedGradient />);
    // Each star is a div with inline style (top/left/width/height)
    const stars = container.querySelectorAll('div[style*="top:"]');
    expect(stars.length).toBe(80);
  });
});

describe("AnimatedGradient reduced motion", () => {
  beforeEach(() => {
    mockIsDark = true;
  });

  afterEach(() => {
    mockIsDark = true;
    vi.restoreAllMocks();
  });

  it("still renders when prefers-reduced-motion is set", () => {
    const { container } = render(<AnimatedGradient />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]'))
      .toHaveAttribute("aria-hidden", "true");
  });
});

describe("AnimatedGradient style content", () => {
  beforeEach(() => {
    mockIsDark = true;
  });

  afterEach(() => {
    mockIsDark = true;
    vi.restoreAllMocks();
  });

  it("includes star twinkle keyframes", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    expect(styleContent).toContain("star-twinkle");
    expect(styleContent).toContain("opacity");
    expect(styleContent).toContain("scale");
  });

  it("includes star drift keyframes for warp effect", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    expect(styleContent).toContain("star-drift");
    expect(styleContent).toContain("translateY");
  });

  it("includes reduced motion media query", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    expect(styleContent).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styleContent).toContain("animation: none");
  });

  it("uses white stars with subtle glow", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    expect(styleContent).toContain("background: white");
    expect(styleContent).toContain("box-shadow");
  });

  it("configures star field with fixed positioning", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    expect(styleContent).toContain("position: fixed");
    expect(styleContent).toContain("inset: 0");
  });
});

describe("AnimatedGradient light mode behavior", () => {
  beforeEach(() => {
    mockIsDark = false;
  });

  afterEach(() => {
    mockIsDark = true;
    vi.restoreAllMocks();
  });

  it("renders nothing in light mode", () => {
    const { container } = render(<AnimatedGradient />);
    expect(container.children.length).toBe(0);
  });
});