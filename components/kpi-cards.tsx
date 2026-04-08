"use client"

import { Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { useEffect } from "react"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useMonthYearFilter } from "@/components/month-year-filter"
import { centsToDisplay } from "@/lib/money"
import { useCurrency } from "@/lib/currency-context"
import { useLocale } from "@/lib/locale-context"
import type { Translations } from "@/lib/i18n/types"

type MonthStat = {
  month: number
  income: number
  totalExpenses: number
  balance: number
}

type YearlyStat = {
  year: number
  totalExpenses: number
  totalIncome: number
  balance: number
}

type StatField = "income" | "totalExpenses" | "balance"

function AnimatedAmount({ cents, isError, currency }: { cents: number; isError: boolean; currency: string }) {
  const motionVal = useMotionValue(cents)
  const spring = useSpring(motionVal, { stiffness: 120, damping: 20 })
  const display = useTransform(spring, (v) => centsToDisplay(v, currency))

  useEffect(() => {
    motionVal.set(cents)
  }, [cents, motionVal])

  if (isError) return <span className="text-3xl font-bold">—</span>

  return <motion.span className="text-3xl font-bold">{display}</motion.span>
}

const CARDS = [
  {
    labelKey: "kpi.totalIncome" as keyof Translations,
    field: "income" as StatField,
    icon: TrendingUp,
    iconClass: "text-emerald-500",
    borderColor: "border-t-emerald-500/60",
  },
  {
    labelKey: "kpi.totalExpenses" as keyof Translations,
    field: "totalExpenses" as StatField,
    icon: TrendingDown,
    iconClass: "text-rose-500",
    borderColor: "border-t-rose-500/60",
  },
  {
    labelKey: "kpi.netBalance" as keyof Translations,
    field: "balance" as StatField,
    icon: Wallet,
    iconClass: "text-indigo-500",
    borderColor: "border-t-indigo-500/60",
  },
]

function KpiCardsInner() {
  const { year, month, view } = useMonthYearFilter()
  const { currency } = useCurrency()
  const { t } = useLocale()

  const yearlyQuery = useQuery<YearlyStat[]>({
    queryKey: ["stats", "yearly"],
    queryFn: () =>
      fetch("/api/stats/yearly").then((r) => {
        if (!r.ok) throw new Error("Failed to fetch")
        return r.json()
      }),
    enabled: view === "total",
  })

  const monthlyQuery = useQuery<MonthStat[]>({
    queryKey: ["stats", "monthly", year],
    queryFn: () =>
      fetch(`/api/stats/monthly?year=${year}`).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch")
        return r.json()
      }),
    enabled: view !== "total",
  })

  const stats = (() => {
    if (view === "total") {
      const rows = yearlyQuery.data ?? []
      return {
        income: rows.reduce((s, r) => s + r.totalIncome, 0),
        totalExpenses: rows.reduce((s, r) => s + r.totalExpenses, 0),
        balance: rows.reduce((s, r) => s + r.balance, 0),
      }
    }
    if (view === "years") {
      const rows = monthlyQuery.data ?? []
      return {
        income: rows.reduce((s, r) => s + r.income, 0),
        totalExpenses: rows.reduce((s, r) => s + r.totalExpenses, 0),
        balance: rows.reduce((s, r) => s + r.balance, 0),
      }
    }
    return (
      monthlyQuery.data?.find((d) => d.month === month) ?? {
        income: 0,
        totalExpenses: 0,
        balance: 0,
      }
    )
  })()

  const isLoading = view === "total" ? yearlyQuery.isLoading : monthlyQuery.isLoading
  const isError = view === "total" ? yearlyQuery.isError : monthlyQuery.isError

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CARDS.map((card) => (
          <Card key={card.labelKey}>
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
        const value = stats[card.field] as number
        const Icon = card.icon
        const isBalance = card.field === "balance"

        return (
          <motion.div
            key={card.labelKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <Card className={`overflow-hidden transition-colors hover:bg-muted/20 border-t-2 ${card.borderColor}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-muted-foreground">
                  <Icon className={`size-4 ${card.iconClass}`} />
                  <span className="text-xs uppercase tracking-widest font-medium">{t(card.labelKey)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className={isBalance && value < 0 ? "text-muted-foreground" : undefined}>
                  <AnimatedAmount cents={value} isError={isError} currency={currency} />
                </span>
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
            <Card key={card.labelKey}>
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
