import { Topbar } from "@/components/dashboard/topbar"
import { CurrencyProvider } from "@/lib/currency-context"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <div className="flex flex-col h-screen">
        <Topbar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </CurrencyProvider>
  )
}
