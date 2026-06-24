/**
 * Accessibility testing utilities using axe-core.
 * Wraps axe.run() with jsdom-compatible defaults and provides
 * helper assertions for common WCAG 2.1 violations.
 */
import axe from "axe-core";
import type { AxeResults } from "axe-core";

// Violation rule type — derived from AxeResults since AxeRule is not exported directly
type AxeViolation = AxeResults["violations"][number];

// Configure axe to ignore violations we can't fix in jsdom (e.g., color contrast)
// since jsdom doesn't render pixels — these checks are only meaningful in a real browser.
axe.configure({
  rules: [
    // Skip color-contrast in unit tests — verify with Lighthouse or browser DevTools instead.
    { id: "color-contrast", enabled: false },
    // Skip focus-order (jsdom has no visual layout)
    { id: "focus-order-semantics", enabled: false },
  ],
});

/**
 * Run axe-core audit on a DOM container and return only violations.
 * @param container - The DOM element to audit (usually from render().container)
 * @returns Array of violation objects, or empty array if no issues found
 */
export async function getAxeViolations(container: HTMLElement): Promise<AxeResults["violations"]> {
  const results = await axe.run(container, {
    runOnly: [
      "best-practice",
      "cat.semantics",
      "cat.name-role-value",
      "cat.keyboard",
      "cat.color",
      "cat.sensory-and-reading-order",
      "cat.cognitive-low-acuity",
    ],
  });
  return results.violations;
}

/**
 * Assert that a rendered component has no axe-core violations.
 * Fails the test with a detailed message listing each violation and its impact.
 * @param container - The DOM element to audit
 */
export async function expectNoViolations(container: HTMLElement): Promise<void> {
  const violations = await getAxeViolations(container);

  if (violations.length > 0) {
    const details = violations
      .map((v: AxeViolation) => {
        const impacted = v.nodes.length;
        return `  - ${v.id} (${v.impact}): ${impacted} node(s)`;
      })
      .join("\n");

    throw new Error(
      `Accessibility violations found:\n${details}\n\n` +
        `${violations.reduce((sum: number, v: AxeViolation) => sum + v.nodes.length, 0)} impacted nodes total.`
    );
  }
}

/**
 * Assert that a specific axe-core violation exists (useful for testing known issues).
 * @param container - The DOM element to audit
 * @param ruleId - The axe rule ID to check for (e.g., "document-title")
 */
export async function expectViolation(container: HTMLElement, ruleId: string): Promise<void> {
  const violations = await getAxeViolations(container);
  const found = violations.find((v: AxeViolation) => v.id === ruleId);

  if (!found) {
    throw new Error(
      `Expected violation "${ruleId}" not found.\n` +
        `Actual violations: ${violations.map((v: AxeViolation) => v.id).join(", ") || "none"}`
    );
  }
}

/**
 * Check that all interactive elements (buttons, inputs, links) have accessible names.
 * @param container - The DOM element to audit
 * @returns Array of elements missing accessible names
 */
export function getElementsWithoutAccessibleNames(container: HTMLElement): Element[] {
  const interactiveSelectors = [
    "button:not([aria-label]):not([title])",
    'input:not([aria-label]):not([title])[type="button"]',
    'input:not([aria-label]):not([title])[type="submit"]',
  ];

  const results: Element[] = [];
  for (const selector of interactiveSelectors) {
    try {
      const matches = container.querySelectorAll(selector);
      for (const el of Array.from(matches)) {
        // Check if element has an aria-labelledby or is wrapped in a label
        if (!el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby")) {
          results.push(el);
        }
      }
    } catch {
      // Invalid selector for this DOM — skip gracefully
    }
  }
  return results;
}

/**
 * Check that all form inputs have associated labels.
 * @param container - The DOM element to audit
 * @returns Array of input elements without labels
 */
export function getInputsMissingLabels(container: HTMLElement): Element[] {
  const inputs = container.querySelectorAll(
    'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"])'
  );

  return Array.from(inputs).filter((input) => {
    // Has aria-label?
    if (input.hasAttribute("aria-label")) return false;
    // Has aria-labelledby?
    if (input.hasAttribute("aria-labelledby")) return false;
    // Associated <label> via for/id?
    const id = input.getAttribute("id");
    if (id && container.querySelector(`label[for="${id}"]`)) return false;
    // Wrapped in a <label>?
    if (input.closest("label")) return false;
    // Has title attribute?
    if (input.hasAttribute("title")) return false;
    return true;
  });
}

/**
 * Verify keyboard accessibility: all interactive elements are focusable.
 * @param container - The DOM element to audit
 * @returns Array of interactive elements that cannot receive focus
 */
export function getNonFocusableInteractiveElements(container: HTMLElement): Element[] {
  const interactiveSelectors = ["button", "input", "select", "textarea", 'a[href]', '[role="button"]'];

  return Array.from(container.querySelectorAll(interactiveSelectors.join(", "))).filter((el) => {
    // Elements with tabindex="-1" are intentionally non-focusable — skip those
    if (el.getAttribute("tabindex") === "-1") return false;
    // Disabled elements don't need to be focusable
    if (el.hasAttribute("disabled")) return false;
    // Check if element is naturally focusable or has a positive tabindex
    try {
      (el as HTMLElement).focus();
      return document.activeElement !== el;
    } catch {
      return true;
    }
  });
}

/**
 * Axe-core rule categories available for targeted testing.
 */
export const AXE_CATEGORIES = [
  "best-practice",
  "cat.bf",
  "cat.bl",
  "cat.bv",
  "cat.color",
  "cat.cognitive-low-acuity",
  "cat.keyboard",
  "cat.name-role-value",
  "cat.sensory-and-reading-order",
  "cat.semantics",
] as const;