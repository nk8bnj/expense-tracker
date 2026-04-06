# Expense Tracker

A personal finance management app for tracking expenses, income, and net balance — with visual dashboards, category breakdowns, and multi-currency support.

## Features

- **Expense logging** — Add transactions with amount, category, description, and date
- **Monthly income** — Set income per month and track your net balance
- **Visual dashboards** — Income vs. expenses area chart; category spending pie chart
- **Time-period filtering** — Switch between daily, monthly, yearly, and all-time views
- **Category breakdown** — 13 predefined categories (Rent, Groceries, Dining, Travel, etc.)
- **Multi-currency display** — USD, EUR, UAH
- **Authentication** — Email/password and OAuth via Google and GitHub

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS 4, shadcn/ui, Radix UI |
| Charts | Recharts |
| Authentication | Better Auth (email + OAuth) |
| Database | PostgreSQL + Prisma ORM |
| Forms & Validation | React Hook Form + Zod |
| Server State | TanStack React Query |
| Animations | Motion (Framer Motion) |
| Icons | Lucide React |
| Language | TypeScript |

## Project Structure

```
expense-tracker/
├── app/
│   ├── page.tsx               # Landing page
│   ├── (auth)/
│   │   ├── login/             # Login page
│   │   └── signup/            # Signup page
│   ├── dashboard/
│   │   └── page.tsx           # Main dashboard (KPIs, charts, tables)
│   └── api/
│       ├── expenses/          # GET, POST, DELETE /api/expenses
│       ├── income/            # GET, POST /api/income
│       └── stats/             # daily, monthly, yearly, categories
├── components/
│   ├── ui/                    # Base UI primitives (button, card, dialog…)
│   ├── charts/                # Recharts wrappers
│   ├── auth/                  # Auth form components
│   ├── kpi-cards.tsx
│   ├── expenses-table.tsx
│   ├── expense-form-dialog.tsx
│   ├── income-form.tsx
│   └── month-year-filter.tsx
├── lib/
│   ├── auth.ts                # Better Auth server config
│   ├── auth-client.ts         # Client-side auth helpers
│   ├── prisma.ts              # Prisma singleton
│   ├── categories.ts          # Category definitions (source of truth)
│   ├── money.ts               # Currency formatting utilities
│   └── currency-context.tsx   # Multi-currency React context
└── prisma/
    └── schema.prisma          # Database schema
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd expense-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example below into a `.env` file at the project root and fill in your values.

4. **Apply database migrations**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Random secret for Better Auth (min 32 chars) |
| `BETTER_AUTH_URL` | Base URL of the app (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Same as above, exposed to the client |
| `GOOGLE_CLIENT_ID` | Google OAuth app client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth app client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |

```env
DATABASE_URL="postgresql://user:password@localhost:5432/expense_tracker"
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

## Database

Managed with **Prisma ORM** against PostgreSQL. Key models:

- **User** — authentication profile
- **Expense** — individual transaction (`amountCents`, `category`, `description`, `date`)
- **MonthlyIncome** — one record per `(userId, year, month)` tuple

All monetary values are stored as **integer cents** and converted to display currency only in the UI.

```bash
npx prisma migrate dev    # Apply migrations
npx prisma generate       # Regenerate client after schema changes
npx prisma studio         # Open Prisma Studio GUI
```

## API Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/expenses?year=&month=` | List expenses (optional year/month filter) |
| `POST` | `/api/expenses` | Create an expense |
| `PATCH` | `/api/expenses/[id]` | Update an expense |
| `DELETE` | `/api/expenses/[id]` | Delete an expense |
| `GET` | `/api/income?year=&month=` | Get monthly income |
| `POST` | `/api/income` | Upsert monthly income |
| `GET` | `/api/stats/daily?year=&month=` | Per-day totals |
| `GET` | `/api/stats/monthly?year=` | Per-month income/expense/balance |
| `GET` | `/api/stats/yearly` | Per-year totals |
| `GET` | `/api/stats/categories?year=&month=` | Spending by category |

## Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
