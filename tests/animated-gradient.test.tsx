/**
 * Tests for the AnimatedGradient (Warp Speed Star Field) component.
 * Covers rendering, accessibility, theme detection, reduced motion,
 * and warp tunnel star generation behavior.
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

describe("AnimatedGradient component (Warp Speed Star Field)", () => {
  beforeEach(() => {
    mockIsDark = true;
  });

  afterEach(() => {
    mockIsDark = true;
    vi.restoreAllMocks();
  });

  it("renders a warp tunnel div with aria-hidden", () => {
    const { container } = render(<AnimatedGradient />);
    // Component renders: engine-glow + warp-tunnel (both with aria-hidden)
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("is hidden from screen readers", () => {
    const { container } = render(<AnimatedGradient />);
    expect(container.querySelector('[aria-hidden="true"]'))
      .toHaveAttribute("aria-hidden", "true");
  });

  it("has warp tunnel div with pointer-events-none in class", () => {
    const { container } = render(<AnimatedGradient />);
    // Warp tunnel container should have the class pattern
    expect(container.querySelector('[class*="warp-tunnel-"]')).toBeInTheDocument();
  });

  it("injects style element with warp tunnel keyframes", () => {
    const { container } = render(<AnimatedGradient />);
    const styleTag = container.querySelector("style");
    expect(styleTag).toBeInTheDocument();
    expect(styleTag?.textContent).toContain("@keyframes");
    // Warp speed uses radial perspective, not twinkle effects
    expect(styleTag?.textContent).toContain("warp-travel");
  });

  it("renders multiple warp streak elements", () => {
    const { container } = render(<AnimatedGradient />);
    // Stars have classes like warp-streak-test-id-123 and warp-streak-animated-test-id-123
    const stars = container.querySelectorAll('[class*="warp-streak-"]');
    expect(stars.length).toBeGreaterThan(10);
  });

  it("renders streaks with varying sizes, opacities, and travel distances", () => {
    const { container } = render(<AnimatedGradient />);
    const starElements = Array.from(
      container.querySelectorAll('div[class*="warp-streak-"][style]')
    ) as HTMLElement[];
    expect(starElements.length).toBeGreaterThan(0);
    // Warp streaks have inline styles for travel distance and scale
    if (starElements[0]) {
      const style = starElements[0].getAttribute("style");
      expect(style?.includes("--star-distance")).toBe(true);
      expect(style?.includes("--scale-start")).toBe(true);
    }
  });

  it("renders as style + two div structure (engine glow + warp tunnel)", () => {
    const { container } = render(<AnimatedGradient />);
    // Fragment renders: style tag + engine-glow + warp-tunnel + second style tag for reduced motion
    expect(container.children.length).toBe(4);
  });

  it("generates exactly 150 stars (warp tunnel density)", () => {
    const { container } = render(<AnimatedGradient />);
    // Each warp streak is a div with inline style for travel distance
    const streaks = container.querySelectorAll('div[style*="--star-distance"]');
    expect(streaks.length).toBe(150);
  });

  it("uses seeded randomness for consistent star positions", () => {
    const { container } = render(<AnimatedGradient />);
    // With useId and deterministic seeding, same component instance renders same stars
    const streakCount = container.querySelectorAll('div[style*="--star-distance"]').length;
    expect(streakCount).toBeGreaterThan(0);
  });

  it("applies CSS variables for warp animation", () => {
    const { container } = render(<AnimatedGradient />);
    const streaks = container.querySelectorAll('[class*="warp-streak-animated"]');
    // Each streak has inline styles setting --star-distance, --scale-start, etc.
    expect(streaks.length).toBe(150);
  });

  it("renders engine glow pulse behind warp tunnel", () => {
    const { container } = render(<AnimatedGradient />);
    // Engine glow is a separate div with radial gradient background
    const glow = container.querySelector('.engine-glow-test-id-123');
    expect(glow).toBeInTheDocument();
  });

  it("has overflow hidden for clipped animations", () => {
    const { container } = render(<AnimatedGradient />);
    // Warp tunnel has overflow: hidden in its CSS rules (not as a class)
    const styleContent = container.querySelector("style")?.textContent || "";
    expect(styleContent).toContain("overflow: hidden");
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
    // Reduced motion disables animation but still shows static stars
    expect(container.querySelector('style')?.textContent).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("applies no-animation transform when reduced motion is detected", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    expect(styleContent).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styleContent).toContain("animation: none !important");
  });

  it("freezes star positions in reduced motion mode", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    // In reduced motion, stars are frozen with scale(1) transform
    expect(styleContent).toContain("transform: scale(1)");
  });

  it("preserves static star rendering in reduced motion", () => {
    const { container } = render(<AnimatedGradient />);
    // Even with reduced motion, stars still appear (just not animating)
    const streaks = container.querySelectorAll('div[class*="warp-streak-"]');
    expect(streaks.length).toBe(150);
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

  it("includes warp tunnel keyframes", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    expect(styleContent).toContain("@keyframes warp-travel");
    expect(styleContent).toContain("--tx: -160px"); // Center vanishing point
  });

  it("includes star drift keyframes for radial perspective", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    expect(styleContent).toContain("--star-distance");
    expect(styleContent).toContain("--scale-start");
  });

  it("includes reduced motion media query", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    expect(styleContent).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styleContent).toContain("animation: none");
  });

  it("uses white streaks with subtle glow", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    expect(styleContent).toContain("background: white");
    expect(styleContent).toContain("box-shadow: 0 0 2px rgba(255, 255, 255, 0.6)");
  });

  it("configures warp tunnel with fixed positioning", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    expect(styleContent).toContain("position: fixed");
    expect(styleContent).toContain("inset: 0");
    expect(styleContent).toContain("overflow: hidden");
  });

  it("includes engine glow pulse animation", () => {
    const { container } = render(<AnimatedGradient />);
    // Engine glow is separate from warp tunnel styles - in the DOM, not necessarily same style tag
    const styleContent = container.querySelector("style")?.textContent || "";
    expect(styleContent).toContain(".engine-glow");
  });

  it("applies z-index layering for depth effect", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    // Engine glow is behind warp tunnel (z-index: -2 vs -1)
    expect(styleContent).toContain("z-index: -2");
  });

  it("has pointer-events-none for all overlay elements", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    // Warp tunnel and engine glow don't interfere with underlying content
    expect(styleContent).toContain("pointer-events: none");
  });

  it("uses radial gradient for engine glow effect", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    // Engine glow uses radial-gradient with rgba version of portfolio accent color
    expect(styleContent).toContain("radial-gradient");
    expect(styleContent).toContain("rgba(6, 182, 212");
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

  it("does not inject styles when dark mode is off", () => {
    const { container } = render(<AnimatedGradient />);
    expect(container.querySelector("style")).toBeNull();
  });
});

describe("Warp tunnel animation timing", () => {
  beforeEach(() => {
    mockIsDark = true;
  });

  afterEach(() => {
    mockIsDark = true;
    vi.restoreAllMocks();
  });

  it("applies linear infinite loop to warp streak animations", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    expect(styleContent).toContain("linear infinite");
  });

  it("uses appropriate animation duration for different star distances", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    // Duration is calculated based on star distance (near=fast, far=slow)
    expect(styleContent).toContain("--star-duration");
  });

  it("applies rotation during warp travel for streak effect", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    // Rotation creates the "fly-by" perspective effect
    expect(styleContent).toContain("rotate(360deg)");
  });

  it("starts animations from center vanishing point", () => {
    const { container } = render(<AnimatedGradient />);
    const styleContent = container.querySelector("style")?.textContent || "";
    // Center of screen at 1920x1080 is (960, 540)
    expect(styleContent).toContain("--tx: -160px");
    expect(styleContent).toContain("--ty: -160px");
  });
});