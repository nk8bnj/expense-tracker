"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type Currency = "UAH" | "USD" | "EUR"

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  UAH: "₴",
  USD: "$",
  EUR: "€",
}

interface CurrencyContextValue {
  currency: Currency
  setCurrency: (currency: Currency) => void
  symbol: string
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("UAH")

  useEffect(() => {
    const saved = localStorage.getItem("currency") as Currency
    if (saved) setCurrency(saved)
  }, [])

  function handleSetCurrency(newCurrency: Currency) {
    localStorage.setItem("currency", newCurrency)
    setCurrency(newCurrency)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, symbol: CURRENCY_SYMBOLS[currency] }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider")
  return ctx
}
