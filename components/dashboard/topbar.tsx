"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Menu } from "lucide-react"

import { useSession, signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function Topbar({
  onMenuClick,
}: {
  onMenuClick: () => void
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const user = session?.user
  const initial = user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?"

  async function handleSignOut() {
    setIsSigningOut(true)
    await signOut()
    router.push("/login")
  }

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4">
      {/* Hamburger — mobile only */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </Button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Avatar */}
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt={user.name ?? ""} className="h-full w-full rounded-full object-cover" />
        ) : (
          initial
        )}
      </div>

      {/* Name + email — hidden on xs */}
      <div className="hidden flex-col sm:flex">
        {user?.name && <span className="text-xs font-medium leading-tight">{user.name}</span>}
        <span className="text-xs text-muted-foreground leading-tight">{user?.email}</span>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Sign out */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleSignOut}
        disabled={isSigningOut}
        aria-label="Sign out"
      >
        <LogOut className="size-4" />
      </Button>
    </header>
  )
}
