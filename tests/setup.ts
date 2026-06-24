/**
 * Vitest test setup — configures React Testing Library and jsdom globals.
 * Imports @testing-library/jest-dom for custom matchers (toBeInTheDocument, etc.).
 */
import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mock next/navigation hooks — usePathname() returns null in jsdom without this
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Mock window.matchMedia for components that check media queries (e.g., theme providers)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage for components that use it (e.g., theme persistence)
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });
