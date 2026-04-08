export type Locale = "en" | "uk"

export interface Translations {
  // Landing page
  "landing.freeBadge": string
  "landing.headline1": string
  "landing.headline2": string
  "landing.subtitle": string
  "landing.cta.getStarted": string
  "landing.cta.signIn": string
  "landing.feature.spendingInsights": string
  "landing.feature.incomeTracking": string
  "landing.feature.multiCurrency": string
  "landing.feature.netBalance": string

  // Nav
  "nav.signIn": string
  "nav.signUp": string

  // Auth common
  "auth.common.email": string
  "auth.common.password": string
  "auth.common.back": string
  "auth.common.orContinueWith": string
  "auth.common.termsText": string
  "auth.common.termsLink": string
  "auth.common.termsAnd": string
  "auth.common.privacyLink": string

  // Login
  "auth.login.title": string
  "auth.login.subtitle": string
  "auth.login.continueWithEmail": string
  "auth.login.signingIn": string
  "auth.login.signIn": string
  "auth.login.noAccount": string
  "auth.login.signUpLink": string

  // Signup
  "auth.signup.title": string
  "auth.signup.subtitle": string
  "auth.signup.signUpWithEmail": string
  "auth.signup.name": string
  "auth.signup.confirmPassword": string
  "auth.signup.creatingAccount": string
  "auth.signup.createAccount": string
  "auth.signup.alreadyHaveAccount": string
  "auth.signup.signInLink": string

  // Dashboard
  "dashboard.title": string
  "dashboard.addIncome": string
  "dashboard.editIncome.title": string
  "dashboard.editIncome.description": string
  "dashboard.expenses.title": string
  "dashboard.expenses.allCategories": string
  "dashboard.expenses.addExpense": string

  // Expense form
  "expenseForm.addTitle": string
  "expenseForm.editTitle": string
  "expenseForm.amount": string
  "expenseForm.category": string
  "expenseForm.categoryPlaceholder": string
  "expenseForm.description": string
  "expenseForm.descriptionPlaceholder": string
  "expenseForm.date": string
  "expenseForm.cancel": string
  "expenseForm.saving": string
  "expenseForm.saveChanges": string
  "expenseForm.addButton": string
  "expenseForm.genericError": string

  // Income form
  "incomeForm.amount": string
  "incomeForm.saving": string
  "incomeForm.save": string

  // Filter
  "filter.total": string
  "filter.years": string
  "filter.months": string

  // Months
  "months.1": string
  "months.2": string
  "months.3": string
  "months.4": string
  "months.5": string
  "months.6": string
  "months.7": string
  "months.8": string
  "months.9": string
  "months.10": string
  "months.11": string
  "months.12": string

  // KPI
  "kpi.totalIncome": string
  "kpi.totalExpenses": string
  "kpi.netBalance": string

  // Table
  "table.date": string
  "table.category": string
  "table.description": string
  "table.amount": string
  "table.noExpenses": string
  "table.failedToLoad": string
  "table.edit": string
  "table.delete": string
  "table.breakdown.category": string
  "table.breakdown.amount": string
  "table.breakdown.percentOfTotal": string
  "table.breakdown.noData": string
  "table.breakdown.failedToLoad": string

  // Delete dialog
  "deleteDialog.title": string
  "deleteDialog.description": string
  "deleteDialog.cancel": string
  "deleteDialog.delete": string
  "deleteDialog.deleting": string

  // Charts
  "chart.incomeVsExpenses": string
  "chart.incomeLabel": string
  "chart.expensesLabel": string
  "chart.spendingByCategory": string
  "chart.noExpenseData": string

  // Topbar
  "topbar.appName": string
  "topbar.signOut": string

  // Categories
  "categories.rent": string
  "categories.groceries": string
  "categories.utilities": string
  "categories.foodDining": string
  "categories.subscriptions": string
  "categories.transportation": string
  "categories.shopping": string
  "categories.healthcare": string
  "categories.entertainment": string
  "categories.travel": string
  "categories.savings": string
  "categories.charity": string
  "categories.other": string
}
