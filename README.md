# Kinetic Business Landing Page

Modern B2B lead-generation landing page for a business internet service provider, built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives, Framer Motion, Lucide icons, React Hook Form, and Zod.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run build
```

## Lead Form

The quote form currently uses a mocked async submit helper in `src/lib/lead.ts`. Replace `submitLeadQuote` with your backend/API call when the lead pipeline is ready.
