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
  Legend,
  ReferenceLine,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useMonthYearFilter } from "@/components/month-year-filter"
import { centsToDisplay } from "@/lib/money"

type YearStat = {
  year: number
  totalExpenses: number
  totalIncome: number
  balance: number
}

type MonthStat = {
  month: number
  income: number
  totalExpenses: number
  balance: number
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

type ChartPoint = { name: string; income: number; expenses: number }

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
  const selectedMonthIndex = view === "months" ? month - 1 : -1

  const highlightDot = (color: string) =>
    (props: { cx?: number; cy?: number; index?: number }) => {
      const { cx = 0, cy = 0, index = -1 } = props
      if (index !== selectedMonthIndex) return <g key={index} />
      return (
        <circle
          key={index}
          cx={cx}
          cy={cy}
          r={5}
          fill={color}
          stroke="white"
          strokeWidth={2}
        />
      )
    }

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
    enabled: view === "months",
  })

  const isLoading = view === "total" ? yearlyQ.isLoading : monthlyQ.isLoading

  if (isLoading) return skeleton

  let chartData: ChartPoint[] = []

  if (view === "total" && yearlyQ.data) {
    chartData = yearlyQ.data.map((d) => ({
      name: String(d.year),
      income: d.totalIncome / 100,
      expenses: d.totalExpenses / 100,
    }))
  } else if (view === "months" && monthlyQ.data) {
    chartData = MONTH_NAMES.map((name, i) => {
      const stat = monthlyQ.data.find((d) => d.month === i + 1)
      return {
        name,
        income: (stat?.income ?? 0) / 100,
        expenses: (stat?.totalExpenses ?? 0) / 100,
      }
    })
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
                tickFormatter={(v) => "$" + v.toLocaleString()}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <Tooltip formatter={(val: number | undefined) => val != null ? centsToDisplay(val * 100) : ""} />
              <Legend />
              {view === "months" && (
                <ReferenceLine
                  x={MONTH_NAMES[month - 1]}
                  stroke="rgba(255,255,255,0.25)"
                  strokeDasharray="4 4"
                />
              )}
              <Line dataKey="income" name="Income" stroke="#59FF24" dot={highlightDot("#59FF24")} strokeWidth={2} />
              <Line dataKey="expenses" name="Expenses" stroke="#FF161A" dot={highlightDot("#FF161A")} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
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
