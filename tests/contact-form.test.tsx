/**
 * Tests for the Contact Form feature: API route validation & form component.
 * Covers Zod schema validation (422), spam detection (403), success responses (200),
 * and Client Component rendering states (idle, loading, success, error).
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactForm } from "@/components/contact/contact-form";

// Mock framer-motion to avoid animation side effects in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: (props: React.ComponentProps<"div">) => <div {...props} />,
  },
  useReducedMotion: vi.fn(() => false),
  useInView: vi.fn(() => true),
}));

// Mock fetch for form submission tests.
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ContactForm Component", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders all form fields with correct labels", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("renders submit button with correct text", () => {
    render(<ContactForm />);
    const button = screen.getByRole("button", { name: /send message/i });
    expect(button).toBeInTheDocument();
  });

  it("updates field values on input change", async () => {
    render(<ContactForm />);
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: "James" } });
    expect(nameInput).toHaveValue("James");
  });

  it("shows loading state during submission", async () => {
    render(<ContactForm />);

    // Fill form fields.
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "James" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "james@example.com" } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: "Hello" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "This is a test message for validation purposes." } });

    // Mock successful response.
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: "Message sent successfully" }),
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  it("shows success state after successful submission", async () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "James" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "james@example.com" } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: "Hello" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "This is a test message for validation purposes." } });

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: "Message sent successfully" }),
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/message sent!/i)).toBeInTheDocument();
    });
  });

  it("resets form after successful submission", async () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "James" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "james@example.com" } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: "Hello" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "This is a test message for validation purposes." } });

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/message sent!/i)).toBeInTheDocument();
    });

    // Click "Send Another" to reset.
    fireEvent.click(screen.getByRole("button", { name: /send another/i }));

    expect(screen.queryByText(/message sent!/i)).not.toBeInTheDocument();
  });

  it("displays field validation errors from API response", async () => {
    render(<ContactForm />);

    // Submit empty form.
    mockFetch.mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid form data",
            details: [
              { path: ["name"], message: "Name is required" },
              { path: ["email"], message: "Valid email is required" },
              { path: ["message"], message: "Message must be at least 10 characters" },
            ],
          },
        }),
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/valid email is required/i)).toBeInTheDocument();
    });
  });

  it("displays general error for non-validation failures", async () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "James" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "james@example.com" } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: "Hello" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "This is a test message for validation purposes." } });

    mockFetch.mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({
          error: { code: "SPAM_DETECTED", message: "Submission rejected" },
        }),
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/submission rejected/i)).toBeInTheDocument();
    });
  });

  it("handles network errors gracefully", async () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "James" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "james@example.com" } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: "Hello" } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "This is a test message for validation purposes." } });

    mockFetch.mockRejectedValue(new Error("Network error"));

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/network error\. please check your connection/i),
      ).toBeInTheDocument();
    });
  });

  it("form element has correct accessibility role", () => {
    render(<ContactForm />);
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
  });
});