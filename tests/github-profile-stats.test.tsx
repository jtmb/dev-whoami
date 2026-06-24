/**
 * Tests for GitHubProfileStats component.
 * Validates rendering with/without user data, props handling, accessibility, and link behavior.
 */
import { render, screen } from "@testing-library/react";
import { GitHubProfileStats } from "@/components/shared/github-profile-stats";

// Mock framer-motion — animations don't run in jsdom, just render children.
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  },
}));

describe("GitHubProfileStats", () => {
  const mockUser = {
    login: "testuser",
    name: null,
    bio: null,
    avatar_url: "https://avatars.githubusercontent.com/u/123456?v=4",
    html_url: "https://github.com/testuser",
    public_repos: 42,
    followers: 100,
    following: 15,
    created_at: "2020-01-01T00:00:00Z",
  };

  describe("Loading state (no user)", () => {
    it("renders loading message when no user data provided", () => {
      render(<GitHubProfileStats user={null} />);
      expect(screen.getByText(/loading profile stats/i)).toBeInTheDocument();
    });
  });

  describe("User data rendering", () => {
    it("renders GitHub username in heading", () => {
      render(<GitHubProfileStats user={mockUser} />);
      expect(screen.getByText("testuser")).toBeInTheDocument();
    });

    it("renders avatar image with correct source", () => {
      render(<GitHubProfileStats user={mockUser} />);
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute(
        "src",
        "https://avatars.githubusercontent.com/u/123456?v=4"
      );
    });

    it("renders avatar with lazy loading attribute", () => {
      render(<GitHubProfileStats user={mockUser} />);
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("loading", "lazy");
    });

    it("renders public repos count", () => {
      render(<GitHubProfileStats user={mockUser} />);
      expect(screen.getByText(/42/i)).toBeInTheDocument();
    });

    it("renders followers count", () => {
      render(<GitHubProfileStats user={mockUser} />);
      expect(screen.getByText(/100/i)).toBeInTheDocument();
    });

    it("renders following count", () => {
      render(<GitHubProfileStats user={mockUser} />);
      expect(screen.getByText(/15/i)).toBeInTheDocument();
    });
  });

  describe("Bio rendering", () => {
    it("renders bio when present in GitHub profile", () => {
      const mockUserWithBio = {
        ...mockUser,
        bio: "Full-stack developer passionate about open source and DevOps",
      };
      render(<GitHubProfileStats user={mockUserWithBio} />);
      expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
    });

    it("does not render bio section when no bio is present", () => {
      render(<GitHubProfileStats user={mockUser} />);
      const bio = screen.queryByText(/full-stack developer/i);
      expect(bio).not.toBeInTheDocument();
    });
  });

  describe("Props handling", () => {
    it("accepts valid GitHubUser props without errors", () => {
      expect(() => render(<GitHubProfileStats user={mockUser} />)).not.toThrow();
    });

    it("handles edge case with zero repos/followers", () => {
      const zeroUser = {
        ...mockUser,
        public_repos: 0,
        followers: 0,
        following: 0,
      };
      render(<GitHubProfileStats user={zeroUser} />);
    });

    it("handles edge case with very large numbers", () => {
      const bigUser = {
        ...mockUser,
        public_repos: 99999,
        followers: 88888,
        following: 77777,
      };
      render(<GitHubProfileStats user={bigUser} />);
    });

    it("handles edge case with empty/null fields gracefully", () => {
      const minimalUser = {
        login: "minimal",
        name: null,
        bio: null,
        avatar_url: "",
        html_url: "",
        public_repos: 0,
        followers: 0,
        following: 0,
        created_at: "",
      };
      expect(() => render(<GitHubProfileStats user={minimalUser} />)).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("has proper alt text for avatar image", () => {
      render(<GitHubProfileStats user={mockUser} />);
      const img = screen.getByRole("img");
      expect(img).toHaveAccessibleName(`testuser's avatar`);
    });

    it("avatar link opens in new tab with security attributes", () => {
      render(<GitHubProfileStats user={mockUser} />);
      // Avatar is wrapped in a link
      const avatarLink = screen.getByRole("img").closest("a");
      expect(avatarLink).toHaveAttribute("target", "_blank");
      expect(avatarLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("profile link uses noopener noreferrer for security", () => {
      render(<GitHubProfileStats user={mockUser} />);
      // The main profile link is the one inside CardTitle (the first link)
      const allLinks = screen.getAllByRole("link");
      expect(allLinks[0]).toHaveAttribute("target", "_blank");
      expect(allLinks[0]).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Visual structure", () => {
    it("renders username in heading", () => {
      render(<GitHubProfileStats user={mockUser} />);
      const heading = screen.getByText(/testuser/i);
      expect(heading).toBeInTheDocument();
    });
  });

  describe("Hover state handling", () => {
    // NOTE: We cannot test hover effects in jsdom - these require visual regression testing.
    it.skip("applies hover shadow on card container");
  });
});