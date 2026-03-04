"use client"

import { Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
      <CardTitle className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Income vs Expenses</CardTitle>
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
          <CardTitle className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#76D6B1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#76D6B1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid horizontal={true} vertical={false} stroke="var(--border)" strokeOpacity={0.7} strokeDasharray="0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide={true} />
              <Tooltip content={<CustomTooltip currency={currency} />} />
              <Area
                dataKey="income"
                name="Income"
                type="monotone"
                stroke="#76D6B1"
                strokeWidth={2.5}
                fill="url(#incomeGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#76D6B1", stroke: "var(--background)", strokeWidth: 2 }}
              />
              <Line
                dataKey="totalExpenses"
                name="Expenses"
                type="monotone"
                stroke="#f43f5e"
                strokeWidth={1.5}
                strokeDasharray="5 4"
                dot={false}
                activeDot={{ r: 3, fill: "#f43f5e" }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block h-[2.5px] w-5 rounded-full bg-[#76D6B1]" />
              Income
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <svg width="20" height="3" viewBox="0 0 20 3" className="overflow-visible">
                <line x1="0" y1="1.5" x2="20" y2="1.5" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="5 4" />
              </svg>
              Expenses
            </span>
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
