import { z } from "zod";
import { apiFetch, ApiError } from "./api";

export const leadQuoteSchema = z.object({
  businessName:    z.string().min(2, "Enter your business name."),
  contactName:     z.string().min(2, "Enter a contact name."),
  phone: z
    .string()
    .min(10, "Enter a valid phone number.")
    .regex(/^[0-9+\-().\s]+$/, "Use a valid phone number format."),
  email:           z.string().email("Enter a valid email address."),
  businessAddress: z.string().min(8, "Enter your business address."),
  currentProvider: z.string().min(2, "Enter your current provider."),
  employees:       z.string().optional(),
  comments:        z.string().max(600, "Keep comments under 600 characters.").optional(),
});

export type LeadQuotePayload = z.infer<typeof leadQuoteSchema>;

type SubmitResult =
  | { ok: true;  referenceId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitLeadQuote(payload: LeadQuotePayload): Promise<SubmitResult> {
  try {
    const data = await apiFetch<{ success: boolean; data: { id: string }; message: string }>(
      "/api/leads",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    // Use the DB id as the reference (truncated for display)
    const referenceId = `KB-${data.data.id.slice(-6).toUpperCase()}`;
    return { ok: true, referenceId };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, error: err.message, fieldErrors: err.errors };
    }
    return { ok: false, error: "Failed to submit. Please try again." };
  }
}
