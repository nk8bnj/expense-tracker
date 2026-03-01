"use client"

import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { centsToDisplay } from "@/lib/money"
import { CATEGORIES } from "@/lib/categories"

type CategoryStat = {
  category: string
  totalCents: number
  percentage: number
}

const TABLE_HEADERS = ["Category", "Amount", "% of Total"]

function TableSkeleton() {
  return (
    <div className="rounded-lg border overflow-hidden w-full">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            {TABLE_HEADERS.map((h, i) => (
              <th
                key={i}
                className={cn(
                  "px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide",
                  i === 0 ? "text-left" : "text-right"
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-muted animate-pulse shrink-0" />
                  <div className="h-4 w-28 rounded bg-muted animate-pulse" />
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-20 rounded bg-muted animate-pulse ml-auto" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-12 rounded bg-muted animate-pulse ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface CategoryBreakdownTableProps {
  year: number
  month?: number
}

export function CategoryBreakdownTable({ year, month }: CategoryBreakdownTableProps) {
  const url = month
    ? `/api/stats/categories?year=${year}&month=${month}`
    : `/api/stats/categories?year=${year}`

  const { data, isLoading, isError } = useQuery<CategoryStat[]>({
    queryKey: ["stats", "categories", year, month ?? null],
    queryFn: () =>
      fetch(url).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch")
        return r.json()
      }),
  })

  if (isLoading) return <TableSkeleton />

  if (isError) {
    return (
      <div className="rounded-lg border overflow-hidden w-full">
        <p className="px-4 py-6 text-sm text-muted-foreground">
          Failed to load category stats.
        </p>
      </div>
    )
  }

  const rows = data ?? []

  return (
    <div className="rounded-lg border overflow-hidden w-full">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            {TABLE_HEADERS.map((h, i) => (
              <th
                key={i}
                className={cn(
                  "px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide",
                  i === 0 ? "text-left" : "text-right"
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-10 text-center text-sm text-muted-foreground"
              >
                No expenses recorded.
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const cat = CATEGORIES.find((c) => c.value === row.category)
              const color = cat?.color ?? "#B0B0B0"

              return (
                <tr
                  key={row.category}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      {row.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                    {centsToDisplay(row.totalCents)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap text-muted-foreground">
                    {row.percentage.toFixed(1)}%
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
