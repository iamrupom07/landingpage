import { z } from "zod";

export const leadQuoteSchema = z.object({
  businessName: z.string().min(2, "Enter your business name."),
  contactName: z.string().min(2, "Enter a contact name."),
  phone: z
    .string()
    .min(10, "Enter a valid phone number.")
    .regex(/^[0-9+\-().\s]+$/, "Use a valid phone number format."),
  email: z.string().email("Enter a valid email address."),
  businessAddress: z.string().min(8, "Enter your business address."),
  currentProvider: z.string().min(2, "Enter your current provider."),
  employees: z.string().optional(),
  comments: z.string().max(600, "Keep comments under 600 characters.").optional()
});

export type LeadQuotePayload = z.infer<typeof leadQuoteSchema>;

export async function submitLeadQuote(payload: LeadQuotePayload) {
  await new Promise((resolve) => setTimeout(resolve, 900));

  return {
    ok: true,
    referenceId: `KB-${Date.now().toString().slice(-6)}`,
    payload
  };
}
