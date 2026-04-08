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
import { useLocale } from "@/lib/locale-context"
import type { Translations } from "@/lib/i18n/types"

export type ViewMode = "total" | "years" | "months"

const VIEW_OPTIONS: { value: ViewMode; labelKey: keyof Translations }[] = [
  { value: "total",  labelKey: "filter.total"  },
  { value: "years",  labelKey: "filter.years"  },
  { value: "months", labelKey: "filter.months" },
]

export const MONTHS = [
  { value: "1" },
  { value: "2" },
  { value: "3" },
  { value: "4" },
  { value: "5" },
  { value: "6" },
  { value: "7" },
  { value: "8" },
  { value: "9" },
  { value: "10" },
  { value: "11" },
  { value: "12" },
]

const YEAR_START = 2020
export const YEARS: number[] = []
const currentYear = new Date().getFullYear()
for (let y = YEAR_START; y <= currentYear; y++) {
  YEARS.push(y)
}

function MonthYearFilterSkeleton() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="h-8 w-full sm:w-[120px] animate-pulse rounded-md bg-muted" />
      <div className="flex gap-2">
        <div className="h-8 flex-1 sm:w-[90px] animate-pulse rounded-md bg-muted" />
        <div className="h-8 flex-1 sm:w-[130px] animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  )
}

function MonthYearFilterInner({ className }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { t } = useLocale()

  const now = new Date()
  const year = searchParams.get("year") ?? String(now.getFullYear())
  const month = searchParams.get("month") ?? String(now.getMonth() + 1)
  const raw = searchParams.get("view")
  const view: ViewMode = raw === "total" ? "total" : raw === "years" ? "years" : "months"

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.replace(pathname + "?" + params.toString())
  }

  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center", className)}>
      <div className="flex h-8 rounded-md border border-border bg-muted p-0.5 gap-0.5">
        {VIEW_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateParam("view", opt.value)}
            className={cn(
              "flex-1 sm:flex-none rounded px-2.5 text-sm font-medium transition-colors",
              view === opt.value
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t(opt.labelKey)}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <Select value={year} onValueChange={(v) => updateParam("year", v)} disabled={view === "total"}>
          <SelectTrigger size="sm" className="flex-1 sm:w-[90px]">
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

        <Select value={month} onValueChange={(v) => updateParam("month", v)} disabled={view === "total" || view === "years"}>
          <SelectTrigger size="sm" className="flex-1 sm:w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {t(`months.${m.value}` as keyof Translations)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
  const view: ViewMode = raw === "total" ? "total" : raw === "years" ? "years" : "months"
  return { year, month, view }
}
