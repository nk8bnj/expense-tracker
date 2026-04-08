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

      {/* Income/expense area chart — spans center, behind hero text */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Area fill under income curve */}
        <path
          d="M -40 780 C 80 760, 140 700, 220 660 C 300 620, 330 700, 390 640 C 450 580, 470 500, 530 470 C 590 440, 620 520, 690 480 C 760 440, 790 360, 870 330 C 950 300, 980 390, 1060 350 C 1140 310, 1170 230, 1260 210 C 1350 190, 1420 250, 1480 220 L 1480 900 L -40 900 Z"
          fill="#76D6B1"
          fillOpacity="0.06"
        />
        {/* Income line */}
        <path
          d="M -40 780 C 80 760, 140 700, 220 660 C 300 620, 330 700, 390 640 C 450 580, 470 500, 530 470 C 590 440, 620 520, 690 480 C 760 440, 790 360, 870 330 C 950 300, 980 390, 1060 350 C 1140 310, 1170 230, 1260 210 C 1350 190, 1420 250, 1480 220"
          fill="none"
          stroke="#76D6B1"
          strokeWidth="1.5"
          strokeOpacity="0.20"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Expense line — dashed, slightly below income */}
        <path
          d="M -40 820 C 100 800, 160 760, 240 730 C 320 700, 360 760, 420 720 C 480 680, 510 620, 580 600 C 650 580, 680 640, 750 610 C 820 580, 860 510, 940 490 C 1020 470, 1050 540, 1130 510 C 1210 480, 1250 410, 1340 400 C 1410 392, 1450 440, 1480 430"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="1"
          strokeOpacity="0.13"
          strokeDasharray="6 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Category donut chart — bottom-right corner, 4 colored segments */}
      <svg
        className="absolute bottom-0 right-0"
        width="500"
        height="500"
        viewBox="0 0 500 500"
        aria-hidden="true"
      >
        {/* Indigo segment: 185°→212° */}
        <path
          d="M 181.2 472.1 A 320 320 0 0 1 228.7 330.4 L 322.1 388.7 A 210 210 0 0 0 290.9 481.7 Z"
          fill="#6366f1"
          fillOpacity="0.18"
        />
        {/* Rose segment: 214°→237° */}
        <path
          d="M 234.7 321.1 A 320 320 0 0 1 325.7 231.6 L 385.6 323.9 A 210 210 0 0 0 325.9 382.6 Z"
          fill="#f43f5e"
          fillOpacity="0.18"
        />
        {/* Emerald segment: 239°→257° */}
        <path
          d="M 335.2 225.9 A 320 320 0 0 1 428.0 188.2 L 452.8 295.4 A 210 210 0 0 0 391.8 320.0 Z"
          fill="#10b981"
          fillOpacity="0.18"
        />
        {/* Amber segment: 259°→270° */}
        <path
          d="M 438.9 185.9 A 320 320 0 0 1 500.0 180.0 L 500.0 290.0 A 210 210 0 0 0 459.9 293.9 Z"
          fill="#f59e0b"
          fillOpacity="0.18"
        />
      </svg>

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
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-6 pb-6 sm:gap-x-8 sm:pb-10 md:gap-x-12"
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
