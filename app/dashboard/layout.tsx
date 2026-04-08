import { Topbar } from "@/components/dashboard/topbar"
import { CurrencyProvider } from "@/lib/currency-context"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <div className="flex flex-col h-screen">
        <Topbar />
        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </CurrencyProvider>
  )
}
