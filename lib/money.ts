const CURRENCY_SYMBOLS: Record<string, string> = {
  UAH: "₴",
  USD: "$",
  EUR: "€",
}

export function centsToDisplay(cents: number, currency = "USD"): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency
  const amount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)
  return symbol + amount
}
