"use client"

import { Suspense, useState } from "react"
import { Plus } from "lucide-react"
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
import { ExpensesTable } from "@/components/expenses-table"
import { ExpenseFormDialog } from "@/components/expense-form-dialog"
import { Button } from "@/components/ui/button"
import { CategoryBreakdownTable } from "@/components/category-breakdown-table"

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

function CategoryBreakdownSection() {
  const { year, month, view } = useMonthYearFilter()
  return (
    <CategoryBreakdownTable
      year={view !== "years" ? year : undefined}
      month={view === "days" ? month : undefined}
    />
  )
}

function DashboardExpensesSection() {
  const { year, month, view } = useMonthYearFilter()
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Expenses</h2>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus />
          Add Expense
        </Button>
      </div>
      <ExpensesTable
        year={view !== "years" ? year : undefined}
        month={view === "days" ? month : undefined}
      />
      <ExpenseFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        year={year}
        month={month}
      />
    </div>
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
      <IncomeExpenseLineChart />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryBreakdownSection />
        <CategoryPieChart />
      </div>
      <Suspense>
        <DashboardExpensesSection />
      </Suspense>
    </div>
  )
}
