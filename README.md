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
npm run type-check
npm run build
```

## Lead Form

The quote form currently uses a mocked async submit helper in `src/lib/lead.ts`. Replace `submitLeadQuote` with your backend/API call when the lead pipeline is ready.

## Admin Demo Auth

The admin portal uses a mocked HttpOnly cookie session. The default credentials are `admin@kinetic.biz` / `admin123`.

Optional environment overrides:

```bash
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-me"
```
