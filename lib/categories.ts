export const CATEGORIES = [
  { value: "Rent / Housing",  label: "🏠 Rent / Housing",  color: "#C4826E" },
  { value: "Groceries",       label: "🛒 Groceries",        color: "#6FA87A" },
  { value: "Utilities",       label: "⚡ Utilities",         color: "#D4B95A" },
  { value: "Food & Dining",   label: "🍽 Food & Dining",    color: "#D4956A" },
  { value: "Subscriptions",   label: "📋 Subscriptions",    color: "#9B85C0" },
  { value: "Transportation",  label: "🚗 Transportation",   color: "#6A9BB8" },
  { value: "Shopping",        label: "🛍 Shopping",          color: "#C47EA8" },
  { value: "Healthcare",      label: "💊 Healthcare",        color: "#5FA898" },
  { value: "Entertainment",   label: "🎮 Entertainment",    color: "#C4855A" },
  { value: "Travel",          label: "✈️ Travel",            color: "#6AB8C8" },
  { value: "Savings",         label: "💰 Savings",           color: "#B5A97A" },
  { value: "Charity",         label: "🤝 Charity",           color: "#C47878" },
  { value: "Other",           label: "❓ Other",             color: "#A0AAAA" },
] as const

export type Category = typeof CATEGORIES[number]
export type CategoryValue = Category["value"]
