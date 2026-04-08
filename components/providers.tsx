"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { LocaleProvider } from "@/lib/locale-context"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <LocaleProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </LocaleProvider>
  )
}
