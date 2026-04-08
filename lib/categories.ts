import type { Translations } from "./i18n/types"

export const CATEGORIES = [
  { value: "Rent / Housing",  label: "🏠 Rent / Housing",  labelKey: "categories.rent"          as keyof Translations, color: "#C4826E" },
  { value: "Groceries",       label: "🛒 Groceries",        labelKey: "categories.groceries"      as keyof Translations, color: "#6FA87A" },
  { value: "Utilities",       label: "⚡ Utilities",         labelKey: "categories.utilities"      as keyof Translations, color: "#D4B95A" },
  { value: "Food & Dining",   label: "🍽 Food & Dining",    labelKey: "categories.foodDining"     as keyof Translations, color: "#D4956A" },
  { value: "Subscriptions",   label: "📋 Subscriptions",    labelKey: "categories.subscriptions"  as keyof Translations, color: "#9B85C0" },
  { value: "Transportation",  label: "🚗 Transportation",   labelKey: "categories.transportation" as keyof Translations, color: "#6A9BB8" },
  { value: "Shopping",        label: "🛍 Shopping",          labelKey: "categories.shopping"       as keyof Translations, color: "#C47EA8" },
  { value: "Healthcare",      label: "💊 Healthcare",        labelKey: "categories.healthcare"     as keyof Translations, color: "#5FA898" },
  { value: "Entertainment",   label: "🎮 Entertainment",    labelKey: "categories.entertainment"  as keyof Translations, color: "#C4855A" },
  { value: "Travel",          label: "✈️ Travel",            labelKey: "categories.travel"         as keyof Translations, color: "#6AB8C8" },
  { value: "Savings",         label: "💰 Savings",           labelKey: "categories.savings"        as keyof Translations, color: "#B5A97A" },
  { value: "Charity",         label: "🤝 Charity",           labelKey: "categories.charity"        as keyof Translations, color: "#C47878" },
  { value: "Other",           label: "❓ Other",             labelKey: "categories.other"          as keyof Translations, color: "#A0AAAA" },
] as const

export type Category = typeof CATEGORIES[number]
export type CategoryValue = Category["value"]
