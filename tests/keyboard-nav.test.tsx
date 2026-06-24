/**
 * Tests for useKeyboardNav hook — arrow key navigation between focusable items.
 */
import { render, screen } from "@testing-library/react";
import { useRef } from "react";
import { useKeyboardNav } from "@/hooks/use-keyboard-nav";

// Minimal test component that wraps children in a ref'd div with keyboard nav.
function TestContainer({
  orientation = "vertical",
  wrapAround = false,
  children,
}: {
  orientation?: "vertical" | "horizontal";
  wrapAround?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useKeyboardNav(ref, { orientation, wrapAround });

  return (
    <div ref={ref} role="group" data-testid="container">
      {children}
    </div>
  );
}

/** Dispatch a native KeyboardEvent on the container element. */
function dispatchKey(container: HTMLElement, key: string) {
  container.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true }),
  );
}

describe("useKeyboardNav", () => {
  it("renders container with child items", () => {
    render(
      <TestContainer>
        <button tabIndex={0} data-testid="item-1">One</button>
        <button tabIndex={0} data-testid="item-2">Two</button>
        <button tabIndex={0} data-testid="item-3">Three</button>
      </TestContainer>,
    );

    expect(screen.getByTestId("item-1")).toBeInTheDocument();
    expect(screen.getByTestId("item-2")).toBeInTheDocument();
    expect(screen.getByTestId("item-3")).toBeInTheDocument();
  });

  it("navigates down with ArrowDown in vertical mode", () => {
    render(
      <TestContainer orientation="vertical">
        <button tabIndex={0} data-testid="item-1">One</button>
        <button tabIndex={0} data-testid="item-2">Two</button>
        <button tabIndex={0} data-testid="item-3">Three</button>
      </TestContainer>,
    );

    const item1 = screen.getByTestId("item-1");
    const item2 = screen.getByTestId("item-2");
    const container = screen.getByTestId("container");

    // Focus first item so document.activeElement is item1
    item1.focus();

    dispatchKey(container, "ArrowDown");

    expect(item2).toHaveFocus();
  });

  it("navigates up with ArrowUp in vertical mode", () => {
    render(
      <TestContainer orientation="vertical">
        <button tabIndex={0} data-testid="item-1">One</button>
        <button tabIndex={0} data-testid="item-2">Two</button>
        <button tabIndex={0} data-testid="item-3">Three</button>
      </TestContainer>,
    );

    const item2 = screen.getByTestId("item-2");
    const item1 = screen.getByTestId("item-1");
    const container = screen.getByTestId("container");

    item2.focus();

    dispatchKey(container, "ArrowUp");

    expect(item1).toHaveFocus();
  });

  it("navigates right with ArrowRight in horizontal mode", () => {
    render(
      <TestContainer orientation="horizontal">
        <button tabIndex={0} data-testid="item-1">One</button>
        <button tabIndex={0} data-testid="item-2">Two</button>
        <button tabIndex={0} data-testid="item-3">Three</button>
      </TestContainer>,
    );

    const item1 = screen.getByTestId("item-1");
    const item2 = screen.getByTestId("item-2");
    const container = screen.getByTestId("container");

    item1.focus();

    dispatchKey(container, "ArrowRight");

    expect(item2).toHaveFocus();
  });

  it("ignores wrong axis keys (ArrowDown in horizontal mode)", () => {
    render(
      <TestContainer orientation="horizontal">
        <button tabIndex={0} data-testid="item-1">One</button>
        <button tabIndex={0} data-testid="item-2">Two</button>
      </TestContainer>,
    );

    const item1 = screen.getByTestId("item-1");
    const container = screen.getByTestId("container");

    item1.focus();

    dispatchKey(container, "ArrowDown");

    // Should still be on item1 since ArrowDown is ignored in horizontal mode
    expect(item1).toHaveFocus();
  });

  it("stops at the end without wrap-around", () => {
    render(
      <TestContainer orientation="vertical" wrapAround={false}>
        <button tabIndex={0} data-testid="item-1">One</button>
        <button tabIndex={0} data-testid="item-2">Two</button>
        <button tabIndex={0} data-testid="item-3">Three</button>
      </TestContainer>,
    );

    const item3 = screen.getByTestId("item-3");
    const container = screen.getByTestId("container");

    item3.focus();

    dispatchKey(container, "ArrowDown");

    // Should stay on last item (no wrap)
    expect(item3).toHaveFocus();
  });

  it("wraps from last to first when wrapAround is enabled", () => {
    render(
      <TestContainer orientation="vertical" wrapAround={true}>
        <button tabIndex={0} data-testid="item-1">One</button>
        <button tabIndex={0} data-testid="item-2">Two</button>
        <button tabIndex={0} data-testid="item-3">Three</button>
      </TestContainer>,
    );

    const item3 = screen.getByTestId("item-3");
    const item1 = screen.getByTestId("item-1");
    const container = screen.getByTestId("container");

    item3.focus();

    dispatchKey(container, "ArrowDown");

    expect(item1).toHaveFocus();
  });

  it("Home key focuses first item", () => {
    render(
      <TestContainer orientation="vertical">
        <button tabIndex={0} data-testid="item-1">One</button>
        <button tabIndex={0} data-testid="item-2">Two</button>
        <button tabIndex={0} data-testid="item-3">Three</button>
      </TestContainer>,
    );

    const item3 = screen.getByTestId("item-3");
    const item1 = screen.getByTestId("item-1");
    const container = screen.getByTestId("container");

    item3.focus();

    dispatchKey(container, "Home");

    expect(item1).toHaveFocus();
  });

  it("End key focuses last item", () => {
    render(
      <TestContainer orientation="vertical">
        <button tabIndex={0} data-testid="item-1">One</button>
        <button tabIndex={0} data-testid="item-2">Two</button>
        <button tabIndex={0} data-testid="item-3">Three</button>
      </TestContainer>,
    );

    const item1 = screen.getByTestId("item-1");
    const item3 = screen.getByTestId("item-3");
    const container = screen.getByTestId("container");

    item1.focus();

    dispatchKey(container, "End");

    expect(item3).toHaveFocus();
  });

  it("does not navigate for non-navigation keys", () => {
    render(
      <TestContainer orientation="vertical">
        <button tabIndex={0} data-testid="item-1">One</button>
        <button tabIndex={0} data-testid="item-2">Two</button>
      </TestContainer>,
    );

    const item1 = screen.getByTestId("item-1");
    const container = screen.getByTestId("container");

    item1.focus();

    dispatchKey(container, "a");

    // Should still be on item1
    expect(item1).toHaveFocus();
  });
});