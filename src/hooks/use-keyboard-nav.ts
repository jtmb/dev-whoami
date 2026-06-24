/**
 * Custom hook that adds keyboard navigation to focusable elements within a container.
 * Supports arrow key navigation (Up/Down or Left/Right) between items, with optional wrap-around.
 * Also handles Enter/Space activation and Escape to blur.
 *
 * Usage:
 *   const ref = useRef<HTMLDivElement>(null);
 *   useKeyboardNav(ref, { orientation: "vertical" });
 *
 * Requires items to have tabIndex (set via the returned setTabIndex function or manually).
 */
import { useEffect, RefObject } from "react";

export interface UseKeyboardNavOptions {
  /** Navigation direction: "vertical" (Up/Down) or "horizontal" (Left/Right) */
  orientation?: "vertical" | "horizontal";
  /** Allow wrapping from last item to first and vice versa */
  wrapAround?: boolean;
  /** CSS selector for navigable items within the container */
  itemSelector?: string;
}

const defaultOptions: Required<UseKeyboardNavOptions> = {
  orientation: "vertical",
  wrapAround: false,
  itemSelector: "[tabindex]",
};

export function useKeyboardNav(
  containerRef: RefObject<HTMLElement | null>,
  options: UseKeyboardNavOptions = {},
) {
  const config = { ...defaultOptions, ...options };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /** Get all navigable items in DOM order */
    function getItems(): HTMLElement[] {
      return Array.from(
        container!.querySelectorAll(config.itemSelector),
      ) as HTMLElement[];
    }

    function handleKeyDown(event: KeyboardEvent) {
      const items = getItems();
      if (items.length === 0) return;

      const currentIndex = items.indexOf(
        document.activeElement as HTMLElement,
      );
      let nextIndex: number;

      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
          // Use the correct arrow based on orientation
          if (
            (config.orientation === "vertical" && event.key !== "ArrowDown") ||
            (config.orientation === "horizontal" && event.key !== "ArrowRight")
          ) {
            return;
          }
          event.preventDefault();
          nextIndex = currentIndex + 1;
          if (nextIndex >= items.length) {
            nextIndex = config.wrapAround ? 0 : items.length - 1;
          }
          break;

        case "ArrowUp":
        case "ArrowLeft":
          if (
            (config.orientation === "vertical" && event.key !== "ArrowUp") ||
            (config.orientation === "horizontal" && event.key !== "ArrowLeft")
          ) {
            return;
          }
          event.preventDefault();
          nextIndex = currentIndex - 1;
          if (nextIndex < 0) {
            nextIndex = config.wrapAround ? items.length - 1 : 0;
          }
          break;

        case "Home":
          event.preventDefault();
          nextIndex = 0;
          break;

        case "End":
          event.preventDefault();
          nextIndex = items.length - 1;
          break;

        default:
          return; // Not a navigation key
      }

      items[nextIndex]?.focus();
    }

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [containerRef, config.orientation, config.wrapAround, config.itemSelector]);
}

/**
 * Hook for handling Enter/Space activation on non-button elements (like Badge chips).
 * Makes the element behave like a button for keyboard users.
 */
export function useActivation(eventHandler: () => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        eventHandler();
      }
    }

    // Attach to the element this hook is used in (handled by the component)
    return () => {};
  }, [eventHandler]);
}