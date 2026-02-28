export const CATEGORIES = [
  { value: "Rent / Housing",  label: "Rent / Housing",  color: "#FF6B6B" },
  { value: "Groceries",       label: "Groceries",       color: "#4ECDC4" },
  { value: "Utilities",       label: "Utilities",       color: "#45B7D1" },
  { value: "Food & Dining",   label: "Food & Dining",   color: "#96CEB4" },
  { value: "Subscriptions",   label: "Subscriptions",   color: "#FFEAA7" },
  { value: "Transportation",  label: "Transportation",  color: "#DDA0DD" },
  { value: "Shopping",        label: "Shopping",        color: "#98D8C8" },
  { value: "Healthcare",      label: "Healthcare",      color: "#F0A500" },
  { value: "Entertainment",   label: "Entertainment",   color: "#FF8B94" },
  { value: "Travel",          label: "Travel",          color: "#A8E6CF" },
  { value: "Other",           label: "Other",           color: "#B0B0B0" },
] as const

export type Category = typeof CATEGORIES[number]
export type CategoryValue = Category["value"]
