# WOW Insurance

A Next.js (App Router, TypeScript) insurance web app with two login roles (Admin and Enduser), a Turso (libSQL/SQLite) database via Drizzle ORM, and role-based dashboards.

## Features

- **Admin login** (email + password) — end-to-end view of all policies, claim history, and insurance products.
- **Enduser login** (email or mobile number + password) — view your policy number, insurance amount, claim history, and FAQs.
- **New User Registration** for endusers.
- **Forgot Username** / **Forgot Password** flows (simulated in this draft: the result is shown on-screen instead of being emailed/texted, so there's no dependency on a third-party email/SMS provider yet).

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS · Turso (libSQL) · Drizzle ORM · `jose` (JWT) · `bcryptjs` · `zod`.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Turso database (via the [Turso dashboard](https://app.turso.tech) or the `turso` CLI) and copy `.env.example` to `.env.local`, filling in:
   ```
   TURSO_DATABASE_URL=...
   TURSO_AUTH_TOKEN=...
   JWT_SECRET=...   # any long random string
   ```
3. Push the schema to your database:
   ```bash
   npm run db:push
   ```
4. Seed initial data (admin account, sample products, FAQs, a demo enduser with a policy and claims):
   ```bash
   npm run db:seed
   ```
   This prints the generated admin password once — save it.
5. Run the app:
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000.

## Demo accounts (after seeding)

- **Admin**: `admin@wowinsurance.com` / password printed by `npm run db:seed`
- **Enduser**: `demo.user@example.com` or `9876543210` / `Demo@1234`

## Project structure

- `app/` — pages and API routes (App Router)
- `db/schema.ts` — Drizzle table definitions
- `db/client.ts` — Turso/Drizzle client
- `lib/auth.ts` — JWT session + password hashing helpers
- `lib/queries.ts` — shared Drizzle queries used by pages and API routes
- `middleware.ts` — protects `/admin/**` and `/dashboard/**` by role
- `scripts/seed.ts` — seed script (`npm run db:seed`)
