/**
 * Tests for PostShare — social sharing buttons for blog posts.
 * Verifies share button rendering, clipboard copy behavior, and accessibility.
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { PostShare } from "@/components/blog/post-share";

// Mock window.location.origin for consistent URL generation in tests.
beforeEach(() => {
  Object.defineProperty(window, "location", {
    value: { origin: "https://jtmb.ca" },
    writable: false,
  });

  // Mock clipboard API for copy link functionality.
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("PostShare", () => {
  const defaultProps = {
    title: "Building a Portfolio with Next.js",
    slug: "building-portfolio-nextjs",
  };

  it("renders share label", () => {
    render(<PostShare {...defaultProps} />);
    expect(screen.getByText("Share:")).toBeInTheDocument();
  });

  it("renders X (Twitter) share button", () => {
    render(<PostShare {...defaultProps} />);
    const twitterButton = screen.getByRole("button", { name: /share on x \(twitter\)/i });
    expect(twitterButton).toBeInTheDocument();
  });

  it("renders LinkedIn share button", () => {
    render(<PostShare {...defaultProps} />);
    const linkedinButton = screen.getByRole("button", { name: /share on linkedin/i });
    expect(linkedinButton).toBeInTheDocument();
  });

  it("renders Copy Link button", () => {
    render(<PostShare {...defaultProps} />);
    const copyButton = screen.getByRole("button", { name: "Copy link to clipboard" });
    expect(copyButton).toBeInTheDocument();
    expect(screen.getByText("Copy Link")).toBeInTheDocument();
  });

  it("opens Twitter share URL in new tab on click", () => {
    const openSpy = vi.spyOn(window, "open").mockReturnValue(undefined);

    render(<PostShare {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /share on x \(twitter\)/i }));

    expect(openSpy).toHaveBeenCalledWith(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(defaultProps.title)}&url=${encodeURIComponent("https://jtmb.ca/blog/" + defaultProps.slug)}`,
      "_blank",
      "noopener,noreferrer"
    );
  });

  it("opens LinkedIn share URL in new tab on click", () => {
    const openSpy = vi.spyOn(window, "open").mockReturnValue(undefined);

    render(<PostShare {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /share on linkedin/i }));

    expect(openSpy).toHaveBeenCalledWith(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://jtmb.ca/blog/" + defaultProps.slug)}&title=${encodeURIComponent(defaultProps.title)}`,
      "_blank",
      "noopener,noreferrer"
    );
  });

  it("copies link to clipboard and shows success feedback", async () => {
    render(<PostShare {...defaultProps} />);

    const copyButton = screen.getByRole("button", { name: "Copy link to clipboard" });
    fireEvent.click(copyButton);

    // Wait for the async clipboard write + state update to complete.
    await vi.waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        `https://jtmb.ca/blog/${defaultProps.slug}`
      );
    });
    // After copy, button shows "Copied!" feedback.
    await vi.waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });

  it("resets copy button after timeout", async () => {
    render(<PostShare {...defaultProps} />);

    const copyButton = screen.getByRole("button", { name: "Copy link to clipboard" });
    fireEvent.click(copyButton);

    // Wait for the async handler to set copied=true.
    await vi.waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });

    // Advance past the 2-second timeout.
    await new Promise((resolve) => setTimeout(resolve, 2100));

    // Button should reset to original state.
    expect(screen.queryByText("Copied!")).not.toBeInTheDocument();
    expect(screen.getByText("Copy Link")).toBeInTheDocument();
  });

  it("has correct aria-labels for accessibility", () => {
    render(<PostShare {...defaultProps} />);
    const twitterButton = screen.getByRole("button", { name: /share on x \(twitter\)/i });
    const linkedinButton = screen.getByRole("button", { name: /share on linkedin/i });
    const copyButton = screen.getByRole("button", { name: "Copy link to clipboard" });

    expect(twitterButton).toHaveAttribute("aria-label", "Share on X (Twitter)");
    expect(linkedinButton).toHaveAttribute("aria-label", "Share on LinkedIn");
    expect(copyButton).toHaveAttribute("aria-label", "Copy link to clipboard");
  });

  it("encodes special characters in share URLs correctly", () => {
    const openSpy = vi.spyOn(window, "open").mockReturnValue(undefined);

    render(
      <PostShare
        title="Test: Special Chars & Symbols"
        slug="test-post-with-dashes"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /share on x \(twitter\)/i }));

    // Verify URL encoding handles special characters.
    const expectedUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Test: Special Chars & Symbols")}&url=${encodeURIComponent("https://jtmb.ca/blog/test-post-with-dashes")}`;
    expect(openSpy).toHaveBeenCalledWith(expectedUrl, "_blank", "noopener,noreferrer");
  });

  it("renders all three share buttons in correct order", () => {
    render(<PostShare {...defaultProps} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveAttribute("aria-label", "Share on X (Twitter)");
    expect(buttons[1]).toHaveAttribute("aria-label", "Share on LinkedIn");
    expect(buttons[2]).toHaveAttribute("aria-label", "Copy link to clipboard");
  });
});