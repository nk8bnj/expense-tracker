"use client"

import { Suspense, useState } from "react"
import { Plus, Pencil } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { KpiCards } from "@/components/kpi-cards"
import { IncomeExpenseLineChart } from "@/components/charts/income-expense-line-chart"
import { CategoryPieChart } from "@/components/charts/category-pie-chart"
import { MonthYearFilter, useMonthYearFilter, YEARS, MONTHS } from "@/components/month-year-filter"
import { CATEGORIES, type CategoryValue } from "@/lib/categories"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

function IncomeFormWithContext({
  year,
  month,
  onSuccess,
}: {
  year: number
  month: number
  onSuccess: () => void
}) {
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

function EditIncomeButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <Pencil className="size-3.5" />
      Add income
    </Button>
  )
}

function CategoryBreakdownSection() {
  const { year, month, view } = useMonthYearFilter()
  return (
    <CategoryBreakdownTable
      year={view !== "total" ? year : undefined}
      month={view === "months" ? month : undefined}
    />
  )
}

function DashboardExpensesSection() {
  const { year, month, view } = useMonthYearFilter()
  const [addOpen, setAddOpen] = useState(false)
  const [category, setCategory] = useState<CategoryValue | "all">("all")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Expenses</h2>
        <div className="flex items-center gap-2">
          <Select value={category} onValueChange={(v) => setCategory(v as CategoryValue | "all")}>
            <SelectTrigger size="sm" className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus />
            Add Expense
          </Button>
        </div>
      </div>
      <ExpensesTable
        year={view !== "total" ? year : undefined}
        month={view === "months" ? month : undefined}
        category={category === "all" ? undefined : category}
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

function DashboardContent() {
  const [editIncomeOpen, setEditIncomeOpen] = useState(false)
  const now = new Date()
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)

  function handleOpenChange(open: boolean) {
    if (open) {
      const n = new Date()
      setSelectedYear(n.getFullYear())
      setSelectedMonth(n.getMonth() + 1)
    }
    setEditIncomeOpen(open)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium tracking-tight">Dashboard</h1>
          <EditIncomeButton onClick={() => handleOpenChange(true)} />
        </div>
        <MonthYearFilter />
      </div>
      <KpiCards />
      <Dialog open={editIncomeOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Income</DialogTitle>
            <DialogDescription>Set your income for this month.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Suspense>
            <IncomeFormWithContext
              year={selectedYear}
              month={selectedMonth}
              onSuccess={() => setEditIncomeOpen(false)}
            />
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

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex flex-col gap-6 animate-pulse" />}>
      <DashboardContent />
    </Suspense>
  )
}
