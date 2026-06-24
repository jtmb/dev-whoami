"use client";

/**
 * ContactForm — Client-side contact submission form.
 * Validates inputs locally, submits to /api/contact via fetch,
 * and displays success/error states with loading indicators.
 */
import { useCallback, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Handle individual field changes.
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      // Clear field error on input change.
      if (fieldErrors[name]) {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [fieldErrors],
  );

  // Submit form to API route.
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("loading");
      setFieldErrors({});
      setErrorMessage("");

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setForm(initialState);
        } else if (data.error?.code === "VALIDATION_ERROR") {
          // Map field-level errors from Zod.
          const errors: Record<string, string> = {};
          for (const issue of data.error.details) {
            if (issue.path && issue.message) {
              errors[issue.path[0]] = issue.message;
            }
          }
          setFieldErrors(errors);
          setStatus("error");
        } else {
          setErrorMessage(data.error?.message ?? "Something went wrong. Please try again.");
          setStatus("error");
        }
      } catch {
        setErrorMessage("Network error. Please check your connection and try again.");
        setStatus("error");
      }
    },
    [form],
  );

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Success State */}
        {status === "success" ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
              <Send className="h-6 w-6 text-emerald-500" />
            </div>
            <p className="text-lg font-medium text-foreground">Message sent!</p>
            <p className="mt-1 text-sm text-muted-foreground">Thanks for reaching out. I'll get back to you soon.</p>
            <Button variant="outline" className="mt-4" onClick={() => setStatus("idle")}>
              Send Another
            </Button>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} aria-label="Contact" className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-muted-foreground">
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                aria-invalid={!!fieldErrors.name}
                className={fieldErrors.name ? "border-destructive" : ""}
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-muted-foreground">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                aria-invalid={!!fieldErrors.email}
                className={fieldErrors.email ? "border-destructive" : ""}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="mb-1 block text-sm font-medium text-muted-foreground">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                type="text"
                placeholder="What's this about?"
                value={form.subject}
                onChange={handleChange}
                aria-invalid={!!fieldErrors.subject}
                className={fieldErrors.subject ? "border-destructive" : ""}
              />
              {fieldErrors.subject && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.subject}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium text-muted-foreground">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Your message..."
                rows={5}
                value={form.message}
                onChange={handleChange}
                aria-invalid={!!fieldErrors.message}
                className={`w-full rounded-lg border bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-base ${
                  fieldErrors.message ? "border-destructive" : "border-input"
                }`}
              />
              {fieldErrors.message && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.message}</p>
              )}
            </div>

            {/* General Error */}
            {status === "error" && errorMessage && !Object.keys(fieldErrors).length && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={status === "loading"} className="w-full">
              {status === "loading" ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}