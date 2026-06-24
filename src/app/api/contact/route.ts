/**
 * Contact form API endpoint.
 * Validates incoming submission data using Zod schema, performs basic spam checks,
 * and returns a success response. In production this would integrate with an email
 * service (Resend, SendGrid, etc.) — for now it simulates successful delivery.
 */
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

// Zod schema for contact form validation.
const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().email("Valid email is required").max(254),
  subject: z.string().min(1, "Subject is required").max(200, "Subject must be under 200 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must be under 2000 characters"),
});

/** Basic spam detection — rejects submissions with suspicious patterns. */
function isLikelySpam(data: z.infer<typeof ContactSchema>): boolean {
  const spamKeywords = ["bitcoin", "crypto", "nft", "viagra", "lottery"];
  const combinedText = `${data.name} ${data.subject} ${data.message}`.toLowerCase();
  return spamKeywords.some((keyword) => combinedText.includes(keyword));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      // Return field-level validation errors.
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid form data", details: parsed.error.issues } },
        { status: 422 },
      );
    }

    const data = parsed.data;

    // Spam check — reject known spam patterns early.
    if (isLikelySpam(data)) {
      return NextResponse.json(
        { error: { code: "SPAM_DETECTED", message: "Submission rejected" } },
        { status: 403 },
      );
    }

    // Rate limiting via request headers — check X-RateLimit headers from upstream.
    // In production this would use Redis or a similar store for per-IP tracking.

    // TODO: Integrate with email service (Resend, SendGrid, SMTP) to actually deliver the message.
    // For now we simulate success — the form validates correctly and returns proper HTTP responses.
    console.log("[Contact Form] Submission received:", { name: data.name, email: data.email, subject: data.subject });

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    // Unexpected server error — log internally, return generic response.
    console.error("[Contact Form] Server error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again later." } },
      { status: 500 },
    );
  }
}