"use client"

import { Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useMonthYearFilter } from "@/components/month-year-filter"
import { centsToDisplay } from "@/lib/money"
import { useCurrency } from "@/lib/currency-context"

type YearStat = {
  year: number
  totalExpenses: number
  totalIncome: number
  balance: number
  categories: Record<string, number>
}

type MonthStat = {
  month: number
  income: number
  totalExpenses: number
  balance: number
  categories: Record<string, number>
}

type DayStat = {
  day: number
  totalExpenses: number
  income: number
  categories: Record<string, number>
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

type TooltipPayload = {
  active?: boolean
  payload?: Array<{
    value?: number
    dataKey?: string | number
    name?: string
    color?: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label, currency }: TooltipPayload & { currency: string }) {
  if (!active || !payload?.length) return null
  const items = payload
    .filter((p) => (p.value ?? 0) > 0)
    .sort((a, b) => {
      const rank = (key: string | undefined) =>
        key === "income" ? 0 : key === "totalExpenses" ? 1 : 2
      return rank(a.dataKey as string) - rank(b.dataKey as string)
    })
  if (!items.length) return null
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {items.map((item) => (
        <p key={item.dataKey as string} style={{ color: item.color }} className="leading-5">
          {item.name} : {centsToDisplay((item.value ?? 0) * 100, currency)}
        </p>
      ))}
    </div>
  )
}

type ChartPoint = { name: string; income: number; totalExpenses: number }

const skeleton = (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm font-medium">Income vs Expenses</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[300px] animate-pulse rounded-lg bg-muted" />
    </CardContent>
  </Card>
)

function IncomeExpenseLineChartInner() {
  const { year, month, view } = useMonthYearFilter()
  const { currency, symbol } = useCurrency()

  const yearlyQ = useQuery<YearStat[]>({
    queryKey: ["stats", "yearly"],
    queryFn: () =>
      fetch("/api/stats/yearly").then((r) => {
        if (!r.ok) throw new Error("Failed to fetch")
        return r.json()
      }),
    enabled: view === "total",
  })

  const monthlyQ = useQuery<MonthStat[]>({
    queryKey: ["stats", "monthly", year],
    queryFn: () =>
      fetch(`/api/stats/monthly?year=${year}`).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch")
        return r.json()
      }),
    enabled: view === "years",
  })

  const dailyQ = useQuery<DayStat[]>({
    queryKey: ["stats", "daily", year, month],
    queryFn: () =>
      fetch(`/api/stats/daily?year=${year}&month=${month}`).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch")
        return r.json()
      }),
    enabled: view === "months",
  })

  const isLoading =
    view === "total" ? yearlyQ.isLoading
    : view === "years" ? monthlyQ.isLoading
    : dailyQ.isLoading

  if (isLoading) return skeleton

  let chartData: ChartPoint[] = []

  if (view === "total" && yearlyQ.data) {
    chartData = yearlyQ.data.map((d) => ({
      name: String(d.year),
      income: d.totalIncome / 100,
      totalExpenses: d.totalExpenses / 100,
    }))
  } else if (view === "years" && monthlyQ.data) {
    chartData = MONTH_NAMES.map((name, i) => {
      const stat = monthlyQ.data.find((d) => d.month === i + 1)
      return {
        name,
        income: (stat?.income ?? 0) / 100,
        totalExpenses: (stat?.totalExpenses ?? 0) / 100,
      }
    })
  } else if (view === "months" && dailyQ.data) {
    chartData = dailyQ.data.map((d) => ({
      name: String(d.day),
      income: d.income / 100,
      totalExpenses: d.totalExpenses / 100,
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis
                tickFormatter={(v) => symbol + v.toLocaleString()}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <Tooltip content={<CustomTooltip currency={currency} />} />
              <Line dataKey="income" name="Income" stroke="#59FF24" dot={view !== "months"} strokeWidth={2} />
              <Line dataKey="totalExpenses" name="Expenses" stroke="#FF4444" dot={view !== "months"} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
            {[
              { name: "Income", color: "#59FF24" },
              { name: "Expenses", color: "#FF4444" },
            ].map((item) => (
              <span key={item.name} className="flex items-center gap-1 text-xs text-muted-foreground">
                <span
                  className="inline-block h-[2px] w-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function IncomeExpenseLineChart() {
  return (
    <Suspense fallback={skeleton}>
      <IncomeExpenseLineChartInner />
    </Suspense>
  )
}
