"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Receipt, BarChart3 } from "lucide-react"

import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Dashboard",  href: "/dashboard",            icon: LayoutDashboard },
  { label: "Expenses",   href: "/dashboard/expenses",   icon: Receipt },
  { label: "Statistics", href: "/dashboard/statistics", icon: BarChart3 },
] as const

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string
  label: string
  icon: React.ElementType
  active: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Link>
  )
}

export function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      {/* Branding row — same height as topbar */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <span className="text-base font-semibold text-sidebar-foreground">Expense Tracker</span>
      </div>

      {/* Nav list */}
      <nav className="flex-1 space-y-1 p-3">
        {NAV_LINKS.map((link) => (
          <NavItem
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
            active={pathname === link.href}
            onClick={onNavClick}
          />
        ))}
      </nav>
    </div>
  )
}
