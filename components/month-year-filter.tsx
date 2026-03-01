"use client"

import { Suspense } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type ViewMode = "years" | "months" | "days"

const VIEW_OPTIONS = [
  { value: "years",  label: "Years"  },
  { value: "months", label: "Months" },
  { value: "days",   label: "Days"   },
] as const

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
]

const YEAR_START = 2020
const YEARS: number[] = []
const currentYear = new Date().getFullYear()
for (let y = YEAR_START; y <= currentYear; y++) {
  YEARS.push(y)
}

function MonthYearFilterSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-[160px] animate-pulse rounded-md bg-muted" />
      <div className="h-8 w-[130px] animate-pulse rounded-md bg-muted" />
      <div className="h-8 w-[90px] animate-pulse rounded-md bg-muted" />
    </div>
  )
}

function MonthYearFilterInner({ className }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const now = new Date()
  const year = searchParams.get("year") ?? String(now.getFullYear())
  const month = searchParams.get("month") ?? String(now.getMonth() + 1)
  const raw = searchParams.get("view")
  const view: ViewMode = raw === "years" || raw === "days" ? raw : "months"

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.replace(pathname + "?" + params.toString())
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-8 rounded-md border border-border bg-muted p-0.5 gap-0.5">
        {VIEW_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateParam("view", opt.value)}
            className={cn(
              "rounded px-2.5 text-sm font-medium transition-colors",
              view === opt.value
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {view !== "years" && (
        <Select value={year} onValueChange={(v) => updateParam("year", v)}>
          <SelectTrigger size="sm" className="w-[90px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {view === "days" && (
        <Select value={month} onValueChange={(v) => updateParam("month", v)}>
          <SelectTrigger size="sm" className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}

export function MonthYearFilter({ className }: { className?: string }) {
  return (
    <Suspense fallback={<MonthYearFilterSkeleton />}>
      <MonthYearFilterInner className={className} />
    </Suspense>
  )
}

export function useMonthYearFilter(): { year: number; month: number; view: ViewMode } {
  const searchParams = useSearchParams()
  const now = new Date()
  const year = Number(searchParams.get("year") ?? now.getFullYear())
  const month = Number(searchParams.get("month") ?? now.getMonth() + 1)
  const raw = searchParams.get("view")
  const view: ViewMode = raw === "years" || raw === "days" ? raw : "months"
  return { year, month, view }
}
