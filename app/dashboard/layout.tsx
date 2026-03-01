import { Topbar } from "@/components/dashboard/topbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
