# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js, http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

Database (Prisma):
```bash
npx prisma migrate dev   # Apply migrations
npx prisma generate      # Regenerate client after schema changes
npx prisma studio        # Open Prisma Studio GUI
```

No test runner is configured.

## Architecture

### App Router structure
- `app/` — Next.js 16 App Router. Layouts, pages, and route segments go here.
- `app/(auth)/` — Route group for unauthenticated pages (login, signup).
- `app/globals.css` — Global styles + Tailwind CSS 4 theme tokens.
- `components/ui/` — shadcn/ui + Base UI React primitives (button, card, input, select, etc.).
- `components/` — Feature-level components built on top of `ui/`. Auth sub-components live in `components/auth/`.
- `lib/` — Shared server/client utilities. Prisma generated client lives at `lib/generated/prisma`.
- `prisma/schema.prisma` — Prisma schema. Provider: PostgreSQL. Client output: `lib/generated/prisma`.

### Component system
- Style: shadcn `radix-vega`, base color `zinc`, CSS variables enabled.
- Path aliases: `@/components`, `@/components/ui`, `@/lib`, `@/hooks`.
- Icons: `lucide-react`.
- Animation: `motion` (Motion for React) + `tw-animate-css`.
- Utilities: `clsx` + `tailwind-merge` (via `cn()` in `lib/utils`).
- Fonts: `Outfit` is the primary sans (`--font-sans`); `Geist`/`Geist Mono` available as CSS variables.

### Auth
- Better Auth (`better-auth`) with email/password, Google, and GitHub social providers.
- Server auth logic: `lib/auth.ts`. Client auth: `lib/auth-client.ts` (exports `signIn`, `signUp`, `signOut`, `useSession`).
- Route protection: `proxy.ts` exports the middleware logic (cookie-presence check only; Edge-compatible). It must be imported/re-exported from `middleware.ts` at the project root for Next.js to pick it up.
- Full session validation happens inside each API route handler: `auth.api.getSession({ headers: request.headers })`.

### Data layer
- **Prisma** with `@prisma/adapter-pg` driver adapter (direct pg connection, not the standard URL-based client). Always import the singleton from `lib/prisma.ts`, and types from `lib/generated/prisma`.
- **TanStack React Query** (`@tanstack/react-query`) for client-side data fetching and caching. The `QueryClientProvider` is set up in `components/providers.tsx`.
- **date-fns** is available for date arithmetic and formatting.
- API routes go in `app/api/` as Next.js Route Handlers.

### API route conventions
Every route handler follows this pattern:
1. Auth check — `auth.api.getSession`; return 401 if missing.
2. Parse & validate input with Zod (`safeParse`; return 400 on failure).
3. Ownership check before any mutation; return 403 if user doesn't own the resource.

### API routes
- `POST /api/expenses` — create expense; `GET /api/expenses?year=&month=` — list by optional year/month filter.
- `PATCH/DELETE /api/expenses/[id]` — update/delete a single expense.
- `POST /api/income` — upsert `MonthlyIncome` for a `(userId, year, month)` tuple.
- `GET /api/stats/monthly?year=` — per-month income/expense/balance for a year.
- `GET /api/stats/yearly` — per-year totals.
- `GET /api/stats/daily?year=&month=` — per-day totals.
- `GET /api/stats/categories?year=&month=` — spending by category.

### Domain models & money
- All monetary values are stored as **integer cents** (`amountCents: Int`). Convert to/from display dollars only in the UI.
- Use `centsToDisplay(cents, currency?)` from `lib/money.ts` for all formatted output. Supported currencies: `USD`, `EUR`, `UAH`.
- `Expense` — per-transaction record with `category`, `description?`, and `date`.
- `MonthlyIncome` — one record per `(userId, year, month)` tuple, upserted via `POST /api/income`.
- Stats routes use `prisma.$queryRaw` for date-part aggregations (Prisma `groupBy` cannot extract date parts from timestamps).

### Shared constants
- `lib/categories.ts` — `CATEGORIES` array (with `value`, `label`, `color`). Use this as the single source of truth for expense categories; `CategoryValue` type is exported.
- `components/month-year-filter.tsx` — exports `YEARS`, `MONTHS`, `useMonthYearFilter()` hook, and the `<MonthYearFilter />` component. Filter state (year, month, view) is persisted in URL search params (`?year=&month=&view=`). The `view` param is one of `"total" | "years" | "months"`.

### Forms & validation
- **React Hook Form** (`react-hook-form`) + **Zod** for form state and schema validation.
- Use `@hookform/resolvers/zod` to connect the two.
- Shared auth Zod schemas live in `lib/auth-schemas.ts`.

### Charts
- **Recharts** for data visualizations.

### Environment variables
```
DATABASE_URL                  # PostgreSQL connection string
BETTER_AUTH_SECRET            # Secret for Better Auth
NEXT_PUBLIC_BETTER_AUTH_URL   # Public base URL (used by auth-client)
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
```
