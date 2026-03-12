"use client"

import Link from "next/link"
import { motion } from "motion/react"
import {
  TrendingUp,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Wallet,
  Globe,
  UserPlus,
  PlusCircle,
  LineChart,
  Sparkles,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MarketingNav, Logo } from "@/components/marketing-nav"

const ease = [0.25, 0.46, 0.45, 0.94] as const

// ─── Mock Dashboard ───────────────────────────────────────────────────────────

function MockDashboard() {
  return (
    <div
      className="w-full max-w-2xl mx-auto rounded-2xl border border-border bg-card shadow-lg overflow-hidden"
      style={{ maskImage: "linear-gradient(to bottom, black 60%, transparent)" }}
    >
      {/* Topbar */}
      <div className="flex h-10 items-center gap-3 border-b border-border bg-background/60 px-4">
        <div className="h-3 w-3 rounded-full bg-muted-foreground/20" />
        <div className="h-2 w-24 rounded-full bg-muted-foreground/20" />
        <div className="flex-1" />
        <div className="h-2 w-16 rounded-full bg-muted-foreground/20" />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-3 p-4">
        {[
          { color: "bg-emerald-500/10" },
          { color: "bg-rose-500/10" },
          { color: "bg-sky-500/10" },
        ].map((card, i) => (
          <div key={i} className={`rounded-xl border border-border p-3 ${card.color}`}>
            <div className="mb-2 h-2 w-12 animate-pulse rounded-full bg-muted-foreground/20" />
            <div className="h-4 w-16 animate-pulse rounded-full bg-muted-foreground/30" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="px-4 pb-4">
        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="mb-3 h-2 w-24 rounded-full bg-muted-foreground/20" />
          <svg viewBox="0 0 400 120" className="w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.7 0.18 145)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="oklch(0.7 0.18 145)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.65 0.18 15)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="oklch(0.65 0.18 15)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Income area */}
            <polygon
              points="0,80 50,60 100,50 150,40 200,35 250,42 300,30 350,25 400,20 400,120 0,120"
              fill="url(#incomeGrad)"
            />
            <polyline
              points="0,80 50,60 100,50 150,40 200,35 250,42 300,30 350,25 400,20"
              fill="none"
              stroke="oklch(0.7 0.18 145)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Expense area */}
            <polygon
              points="0,100 50,90 100,85 150,75 200,80 250,70 300,72 350,65 400,60 400,120 0,120"
              fill="url(#expenseGrad)"
            />
            <polyline
              points="0,100 50,90 100,85 150,75 200,80 250,70 300,72 350,65 400,60"
              fill="none"
              stroke="oklch(0.65 0.18 15)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-14 text-center">
      {/* Background blob */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.88 0.004 286 / 0.4), transparent)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease }}
        className="flex flex-col items-center gap-6 max-w-2xl"
      >
        {/* Badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-sm text-muted-foreground">
          <Star className="size-3.5 fill-emerald-500 text-emerald-500" />
          <span>100% Free, always</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Track every dollar.
          <br />
          <span className="text-muted-foreground">Build real clarity.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
          Finio helps you log expenses across 11 categories, visualize spending trends with
          beautiful charts, and track income vs. balance — in any currency.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            className="rounded-xl bg-foreground text-background hover:bg-foreground/90 gap-1.5"
            size="lg"
            asChild
          >
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" className="rounded-xl" size="lg" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </motion.div>

      {/* Mock dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease }}
        className="mt-12 w-full max-w-2xl"
      >
        <MockDashboard />
      </motion.div>
    </section>
  )
}

// ─── Free Banner ──────────────────────────────────────────────────────────────

function FreeBanner() {
  return (
    <div className="bg-muted/60 border-y border-border py-4">
      <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 px-6 text-sm sm:text-base">
        <CheckCircle className="size-4 shrink-0 text-emerald-500" />
        <p className="text-center text-foreground">
          Finio is <strong>completely free</strong> — no trials, no credit card, no limits.
        </p>
      </div>
    </div>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────

const features = [
  {
    icon: BarChart3,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    title: "Smart Spending Insights",
    description:
      "Break down your spending by category with interactive charts that reveal where your money actually goes.",
  },
  {
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    title: "Income vs Expenses",
    description:
      "See income and expenses side-by-side across any time range to understand your financial momentum.",
  },
  {
    icon: Wallet,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    title: "Net Balance at a Glance",
    description:
      "Your running net balance is always front and center — know at a glance whether you're ahead or behind.",
  },
  {
    icon: Globe,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    title: "Multi-Currency Support",
    description:
      "Switch seamlessly between USD, EUR, and UAH. All amounts display in your preferred currency.",
  },
]

function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.35, ease }}
        className="mb-10 text-center"
      >
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Everything you need, nothing you don&apos;t
        </h2>
        <p className="mt-2 text-muted-foreground">
          Simple, focused tools to give you a clear picture of your finances.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.08, duration: 0.35, ease }}
            className="rounded-2xl border border-border bg-card/40 p-6"
          >
            <div className={`mb-3 inline-flex rounded-lg p-2 ${f.bg}`}>
              <f.icon className={`size-5 ${f.color}`} />
            </div>
            <h3 className="mb-1 font-semibold text-foreground">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create a free account",
    description: "Sign up in seconds with email, Google, or GitHub. No credit card required.",
  },
  {
    number: "02",
    icon: PlusCircle,
    title: "Add your first expense",
    description: "Log an amount, pick a category, and add a note. It takes about five seconds.",
  },
  {
    number: "03",
    icon: LineChart,
    title: "Watch the insights appear",
    description:
      "Charts and summaries update instantly. Your financial picture comes to life right away.",
  },
]

function HowItWorks() {
  return (
    <section className="bg-muted/30 border-y border-border py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.35, ease }}
          className="mb-10 text-center"
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Up and running in minutes
          </h2>
          <p className="mt-2 text-muted-foreground">Three steps and you&apos;re tracking.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.35, ease }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background">
                <step.icon className="size-5 text-foreground" />
              </div>
              <span className="mb-1 text-xs font-semibold tracking-widest text-muted-foreground">
                {step.number}
              </span>
              <h3 className="mb-1 font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA Section ──────────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.35, ease }}
        className="rounded-3xl border border-border bg-card/40 p-10 text-center sm:p-16"
      >
        <div className="mb-4 inline-flex rounded-xl bg-muted p-2">
          <Sparkles className="size-5 text-foreground" />
        </div>
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Start tracking your money today
        </h2>
        <p className="mb-8 text-muted-foreground">
          Join thousands of people who use Finio to take control of their finances.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            className="rounded-xl bg-foreground text-background hover:bg-foreground/90 gap-1.5"
            size="lg"
            asChild
          >
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" className="rounded-xl" size="lg" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          No credit card required. Free forever.
        </p>
      </motion.div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function LandingFooter() {
  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <Logo />
          <p className="text-xs text-muted-foreground">© 2026 Finio. All rights reserved.</p>
        </div>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <MarketingNav scrollAware />
      <main>
        <HeroSection />
        <FreeBanner />
        <FeaturesGrid />
        <HowItWorks />
        <CtaSection />
      </main>
      <LandingFooter />
    </>
  )
}
