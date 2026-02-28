"use client"

import { Suspense, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { KpiCards } from "@/components/kpi-cards"
import { IncomeExpenseLineChart } from "@/components/charts/income-expense-line-chart"
import { CategoryPieChart } from "@/components/charts/category-pie-chart"
import { MonthYearFilter, useMonthYearFilter } from "@/components/month-year-filter"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { IncomeForm } from "@/components/income-form"

type MonthStat = {
  month: number
  income: number
  totalExpenses: number
  balance: number
}

function IncomeFormWithContext({ onSuccess }: { onSuccess: () => void }) {
  const { year, month } = useMonthYearFilter()
  const { data } = useQuery<MonthStat[]>({
    queryKey: ["stats", "monthly", year],
    queryFn: () =>
      fetch(`/api/stats/monthly?year=${year}`).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch")
        return r.json()
      }),
  })
  const currentIncomeCents = data?.find((d) => d.month === month)?.income ?? 0

  return (
    <IncomeForm
      year={year}
      month={month}
      currentAmountCents={currentIncomeCents}
      onSuccess={onSuccess}
    />
  )
}

export default function DashboardPage() {
  const [editIncomeOpen, setEditIncomeOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome to your expense tracker.</p>
        </div>
        <MonthYearFilter />
      </div>
      <KpiCards onEditIncome={() => setEditIncomeOpen(true)} />
      <Dialog open={editIncomeOpen} onOpenChange={setEditIncomeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Income</DialogTitle>
            <DialogDescription>Set your income for this month.</DialogDescription>
          </DialogHeader>
          <Suspense>
            <IncomeFormWithContext onSuccess={() => setEditIncomeOpen(false)} />
          </Suspense>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <IncomeExpenseLineChart />
        <CategoryPieChart />
      </div>
    </div>
  )
}
