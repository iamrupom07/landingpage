"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle, LockKeyhole } from "lucide-react";
import { useForm } from "react-hook-form";
import { type LeadQuotePayload, leadQuoteSchema, submitLeadQuote } from "@/lib/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const defaultValues: LeadQuotePayload = {
  businessName: "",
  contactName: "",
  phone: "",
  email: "",
  businessAddress: "",
  currentProvider: "",
  employees: "",
  comments: ""
};

type FieldErrorProps = {
  message?: string;
  id: string;
};

function FieldError({ message, id }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm font-medium text-red-600">
      {message}
    </p>
  );
}

// BUG FIX: Removed dead `successId` state — the component unmounted before
// React could re-render the success block because router.push() was called
// immediately after setSuccessId(). Now we pass the referenceId as a query
// param to the thank-you page so it can display it there instead.
export function LeadCaptureForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LeadQuotePayload>({
    resolver: zodResolver(leadQuoteSchema),
    defaultValues
  });

  async function onSubmit(values: LeadQuotePayload) {
    setServerError(null);
    const result = await submitLeadQuote(values);

    if (result.ok) {
      reset(defaultValues);
      // Pass referenceId as query param so thank-you page can display it
      router.push(`/thank-you?ref=${result.referenceId}`);
    } else {
      // Surface field-level errors from server validation
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          setError(field as keyof LeadQuotePayload, {
            type: "server",
            message: messages[0]
          });
        }
      }
      setServerError(result.error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="surface-glow relative overflow-hidden rounded-lg border border-white/80 p-5 shadow-lift sm:p-7"
      noValidate
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-500" />
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <p className="text-sm font-extrabold uppercase text-emerald-600">Secure quote request</p>
          <p className="font-display mt-1 text-2xl font-extrabold text-slate-950">Tell us what you need</p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
          <LockKeyhole className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      {serverError ? (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
          {serverError}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            className="mt-2"
            placeholder="Acme Operations"
            aria-invalid={Boolean(errors.businessName)}
            aria-describedby="businessName-error"
            {...register("businessName")}
          />
          <FieldError id="businessName-error" message={errors.businessName?.message} />
        </div>
        <div>
          <Label htmlFor="contactName">Contact Name</Label>
          <Input
            id="contactName"
            className="mt-2"
            placeholder="Jordan Lee"
            aria-invalid={Boolean(errors.contactName)}
            aria-describedby="contactName-error"
            {...register("contactName")}
          />
          <FieldError id="contactName-error" message={errors.contactName?.message} />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            className="mt-2"
            inputMode="tel"
            placeholder="(555) 218-9044"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby="phone-error"
            {...register("phone")}
          />
          <FieldError id="phone-error" message={errors.phone?.message} />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            className="mt-2"
            type="email"
            placeholder="jordan@company.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby="email-error"
            {...register("email")}
          />
          <FieldError id="email-error" message={errors.email?.message} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="businessAddress">Business Address</Label>
          <Input
            id="businessAddress"
            className="mt-2"
            placeholder="1200 Market Street, Suite 400"
            aria-invalid={Boolean(errors.businessAddress)}
            aria-describedby="businessAddress-error"
            {...register("businessAddress")}
          />
          <FieldError id="businessAddress-error" message={errors.businessAddress?.message} />
        </div>
        <div>
          <Label htmlFor="currentProvider">Current Internet Provider</Label>
          <Input
            id="currentProvider"
            className="mt-2"
            placeholder="Current provider"
            aria-invalid={Boolean(errors.currentProvider)}
            aria-describedby="currentProvider-error"
            {...register("currentProvider")}
          />
          <FieldError id="currentProvider-error" message={errors.currentProvider?.message} />
        </div>
        <div>
          <Label htmlFor="employees">
            Number of Employees{" "}
            <span className="font-medium text-slate-400">(Optional)</span>
          </Label>
          <Input
            id="employees"
            className="mt-2"
            inputMode="numeric"
            placeholder="25"
            {...register("employees")}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="comments">Comments / Requirements</Label>
          <Textarea
            id="comments"
            className="mt-2"
            placeholder="Tell us about locations, current pain points, static IP needs, or installation timing."
            aria-invalid={Boolean(errors.comments)}
            aria-describedby="comments-error"
            {...register("comments")}
          />
          <FieldError id="comments-error" message={errors.comments?.message} />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className={cn("mt-6 w-full", isSubmitting && "cursor-wait")}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="animate-spin" aria-hidden="true" />
            Preparing quote request
          </>
        ) : (
          <>
            Get My Free Business Quote
            <ArrowRight aria-hidden="true" />
          </>
        )}
      </Button>
      <p className="mt-4 text-center text-xs leading-5 text-slate-500">
        We respect your privacy. Your information is used only to prepare your business internet quote.
      </p>
    </form>
  );
}
