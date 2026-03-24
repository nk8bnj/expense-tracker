"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, BarChart3, TrendingUp, Wallet, Globe, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MarketingNav } from "@/components/marketing-nav"

const ease = [0.25, 0.46, 0.45, 0.94] as const

const hints = [
  { icon: BarChart3, label: "Spending Insights", color: "text-indigo-500" },
  { icon: TrendingUp, label: "Income Tracking", color: "text-emerald-500" },
  { icon: Globe, label: "Multi-Currency", color: "text-sky-500" },
  { icon: Wallet, label: "Net Balance", color: "text-amber-500" },
]

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay, ease },
  }
}

// ── Background ───────────────────────────────────────────────────────────────

function BackgroundGraphics() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

      {/* Grid — centered and radially faded at edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(oklch(0.5 0 0 / 0.09) 1px, transparent 1px)",
            "linear-gradient(90deg, oklch(0.5 0 0 / 0.09) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 68% 68% at 50% 50%, black 10%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 68% 68% at 50% 50%, black 10%, transparent 75%)",
        }}
      />

      {/* Top vignette — keeps hero headline readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 58% at 50% 0%, oklch(0.98 0.002 286 / 0.92) 0%, transparent 65%)",
        }}
      />
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <MarketingNav />

      <main className="h-dvh flex flex-col overflow-hidden">
        <BackgroundGraphics />

        {/* Hero — centered */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 pt-14 text-center">
          <motion.div
            {...fadeUp(0)}
            className="mb-4 flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-sm text-muted-foreground"
          >
            <Star className="size-3.5 fill-emerald-500 text-emerald-500" />
            <span>100% Free, always</span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.06)}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            Track every dollar.
            <br />
            <span className="text-muted-foreground">Build real clarity.</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.12)}
            className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg"
          >
            Log expenses, visualize trends, and follow your income vs. balance — in any currency.
          </motion.p>

          <motion.div
            {...fadeUp(0.18)}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
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
          </motion.div>
        </div>

        {/* Feature hint row — anchored to bottom */}
        <motion.div
          {...fadeUp(0.28)}
          className="hidden sm:flex items-center justify-center gap-8 px-6 pb-10 md:gap-12"
        >
          {hints.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2 text-muted-foreground">
              <Icon className={`size-4 ${color}`} />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </motion.div>
      </main>
    </>
  )
}
