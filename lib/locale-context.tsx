"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { uk as dateFnsUk } from "date-fns/locale"
import type { Locale as DateFnsLocale } from "date-fns"
import type { Locale, Translations } from "./i18n/types"
export type { Locale }
import en from "./i18n/en"
import uk from "./i18n/uk"

const translations: Record<Locale, Translations> = { en, uk }

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: keyof Translations) => string
  dateFnsLocale: DateFnsLocale | undefined
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("uk")

  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale | null
    if (stored === "en" || stored === "uk") setLocale(stored)
  }, [])

  function handleSetLocale(next: Locale) {
    localStorage.setItem("locale", next)
    setLocale(next)
  }

  const dict = translations[locale]

  function t(key: keyof Translations): string {
    return dict[key]
  }

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale: handleSetLocale,
        t,
        dateFnsLocale: locale === "uk" ? dateFnsUk : undefined,
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}
