"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-foreground/80">
        <TrendingUp className="size-4 text-foreground" strokeWidth={2.5} />
      </div>
      <span className="text-sm font-semibold tracking-tight text-foreground">Finio</span>
    </div>
  )
}

export function MarketingNav({ scrollAware = false }: { scrollAware?: boolean }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!scrollAware) return
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [scrollAware])

  const solid = !scrollAware || scrolled

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex h-14 items-center px-6 transition-all duration-200 ${
        solid ? "bg-background/80 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <Link href="/" aria-label="Finio home">
        <Logo />
      </Link>
      <div className="flex-1" />
      <nav className="flex items-center gap-2">
        <Button variant="ghost" className="rounded-xl" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
        <Button
          className="rounded-xl bg-foreground text-background hover:bg-foreground/90"
          asChild
        >
          <Link href="/signup">Sign Up</Link>
        </Button>
      </nav>
    </header>
  )
}
