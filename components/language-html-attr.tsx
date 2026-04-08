"use client"

import { useEffect } from "react"
import { useLocale } from "@/lib/locale-context"

export function LanguageHtmlAttr() {
  const { locale } = useLocale()
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  return null
}
