"use client"

import { Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { PieChart, Pie, Cell, Tooltip } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useMonthYearFilter } from "@/components/month-year-filter"
import { centsToDisplay } from "@/lib/money"

type CategoryStat = {
  category: string
  totalCents: number
  percentage: number
}

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F0A500", "#FF8B94", "#A8E6CF", "#B0B0B0",
]

const skeleton = (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm font-medium">Spending by Category</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[300px] animate-pulse rounded-lg bg-muted" />
    </CardContent>
  </Card>
)

function CategoryPieChartInner() {
  const { year, month } = useMonthYearFilter()

  const { data, isLoading } = useQuery<CategoryStat[]>({
    queryKey: ["stats", "categories", year, month],
    queryFn: () =>
      fetch(`/api/stats/categories?year=${year}&month=${month}`).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch")
        return r.json()
      }),
  })

  if (isLoading) return skeleton

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
              No expense data
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6">
            <PieChart width={240} height={240}>
              <Pie
                data={data}
                dataKey="totalCents"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number | undefined) => val != null ? centsToDisplay(val) : ""}
              />
            </PieChart>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              {data.map((entry, i) => (
                <div key={entry.category} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-xs text-muted-foreground">{entry.category}</span>
                  <span className="text-xs font-medium">{centsToDisplay(entry.totalCents)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function CategoryPieChart() {
  return (
    <Suspense fallback={skeleton}>
      <CategoryPieChartInner />
    </Suspense>
  )
}
