"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, TrendingUp } from "lucide-react"

import { useSession, signOut } from "@/lib/auth-client"
import { useCurrency, type Currency } from "@/lib/currency-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: "UAH", label: "₴" },
  { value: "USD", label: "$" },
  { value: "EUR", label: "€" },
]

export function Topbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { currency, setCurrency } = useCurrency()

  const user = session?.user
  const initial = user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?"

  async function handleSignOut() {
    setIsSigningOut(true)
    await signOut()
    router.push("/")
  }

  return (
    <header className="flex h-12 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-sm px-6 py-3">
      {/* Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-foreground/80">
          <TrendingUp className="size-4 text-foreground" strokeWidth={2.5} />
        </div>
        <span className="hidden sm:inline text-sm font-semibold tracking-tight text-foreground">
          Expense Tracker
        </span>
      </div>

      <Separator orientation="vertical" className="h-5" />

      {/* Currency switcher */}
      <div className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
        {CURRENCIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setCurrency(value)}
            className={cn(
              "flex h-7 min-w-9 cursor-pointer items-center justify-center gap-1 rounded-md px-2.5 text-xs font-medium transition-all",
              currency === value
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>{label}</span>
            <span className="hidden sm:inline opacity-70">{value}</span>
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User section */}
      <div className="flex items-center gap-2">
        {/* Avatar */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground overflow-hidden">
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name ?? ""} className="h-full w-full object-cover" />
          ) : (
            initial
          )}
        </div>

        {/* Name + email */}
        <div className="hidden flex-col sm:flex">
          {user?.name && (
            <span className="text-xs font-medium leading-tight text-foreground">{user.name}</span>
          )}
          <span className="text-[11px] leading-tight text-muted-foreground">{user?.email}</span>
        </div>
      </div>

      <Separator orientation="vertical" className="h-5" />

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleSignOut}
        disabled={isSigningOut}
        aria-label="Sign out"
        className="text-muted-foreground hover:text-foreground"
      >
        <LogOut className="size-4" />
      </Button>
    </header>
  )
}
