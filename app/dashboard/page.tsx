import { KpiCards } from "@/components/kpi-cards"
import { IncomeExpenseLineChart } from "@/components/charts/income-expense-line-chart"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome to your expense tracker.</p>
      </div>
      <KpiCards />
      <IncomeExpenseLineChart />
    </div>
  )
}
