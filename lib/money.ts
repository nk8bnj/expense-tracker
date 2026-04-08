const CURRENCY_SYMBOLS: Record<string, string> = {
  UAH: "₴",
  USD: "$",
  EUR: "€",
}

export function centsToDisplay(cents: number, currency = "USD", locale = "en-US"): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency
  const amount = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)
  return symbol + amount
}
