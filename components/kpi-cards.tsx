"use client"

import { Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { useEffect } from "react"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useMonthYearFilter } from "@/components/month-year-filter"
import { centsToDisplay } from "@/lib/money"

type MonthStat = {
  month: number
  income: number
  totalExpenses: number
  balance: number
}

type StatField = "income" | "totalExpenses" | "balance"

function AnimatedAmount({ cents, isError }: { cents: number; isError: boolean }) {
  const motionVal = useMotionValue(cents)
  const spring = useSpring(motionVal, { stiffness: 120, damping: 20 })
  const display = useTransform(spring, (v) => centsToDisplay(v))

  useEffect(() => {
    motionVal.set(cents)
  }, [cents, motionVal])

  if (isError) return <span className="text-2xl font-bold">—</span>

  return <motion.span className="text-2xl font-bold">{display}</motion.span>
}

const CARDS = [
  {
    label: "Total Income",
    field: "income" as StatField,
    icon: TrendingUp,
    color: "#59FF24",
  },
  {
    label: "Total Expenses",
    field: "totalExpenses" as StatField,
    icon: TrendingDown,
    color: "#FF161A",
  },
  {
    label: "Net Balance",
    field: "balance" as StatField,
    icon: Wallet,
    color: null, // dynamic
  },
]

function KpiCardsInner() {
  const { year, month } = useMonthYearFilter()

  const { data, isLoading, isError } = useQuery<MonthStat[]>({
    queryKey: ["stats", "monthly", year],
    queryFn: () =>
      fetch(`/api/stats/monthly?year=${year}`).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch")
        return r.json()
      }),
  })

  const monthData = data?.find((d) => d.month === month) ?? {
    income: 0,
    totalExpenses: 0,
    balance: 0,
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CARDS.map((card) => (
          <Card key={card.label}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {CARDS.map((card, index) => {
        const value = monthData[card.field] as number
        const accent =
          card.color ?? (value >= 0 ? "#59FF24" : "#FF161A")
        const Icon = card.icon

        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <Card
              className="overflow-hidden"
              style={{ borderTop: `3px solid ${accent}` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <Icon className="size-4" style={{ color: accent }} />
                  {card.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatedAmount cents={value} isError={isError} />
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

export function KpiCards() {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CARDS.map((card) => (
            <Card key={card.label}>
              <CardHeader>
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      }
    >
      <KpiCardsInner />
    </Suspense>
  )
}
