import { Topbar } from "@/components/dashboard/topbar"
import { CurrencyProvider } from "@/lib/currency-context"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <div className="flex flex-col h-screen">
        <Topbar />
        <main className="flex-1 px-8 py-6">
          <div className="max-w-screen-xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </CurrencyProvider>
  )
}
