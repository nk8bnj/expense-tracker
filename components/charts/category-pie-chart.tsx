"use client"

import { Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useMonthYearFilter } from "@/components/month-year-filter"
import { centsToDisplay } from "@/lib/money"
import { useCurrency } from "@/lib/currency-context"
import { CATEGORIES } from "@/lib/categories"

type CategoryStat = {
  category: string
  totalCents: number
  percentage: number
}

const FALLBACK_COLOR = "#A0AAAA"

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
  const { year, month, view } = useMonthYearFilter()
  const { currency } = useCurrency()

  const url =
    view === "total" ? `/api/stats/categories`
    : `/api/stats/categories?year=${year}&month=${month}`

  const { data, isLoading } = useQuery<CategoryStat[]>({
    queryKey: ["stats", "categories", view === "total" ? null : year, view === "total" ? null : month],
    queryFn: () =>
      fetch(url).then((r) => {
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
            <CardTitle className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Spending by Category</CardTitle>
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
          <CardTitle className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="w-full max-w-[240px]" style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="totalCents"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                  >
                    {data.map((entry, i) => (
                      <Cell key={i} fill={CATEGORIES.find(c => c.value === entry.category)?.color ?? FALLBACK_COLOR} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number | undefined) => val != null ? centsToDisplay(val, currency) : ""}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              {data.map((entry, i) => (
                <div key={entry.category} className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">{CATEGORIES.find(c => c.value === entry.category)?.label ?? entry.category}</span>
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: CATEGORIES.find(c => c.value === entry.category)?.color ?? FALLBACK_COLOR }}
                  />
                  <span className="text-xs font-medium">{centsToDisplay(entry.totalCents, currency)}</span>
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
