import type { Translations } from "./types"

const uk: Translations = {
  // Landing page
  "landing.freeBadge": "100% безкоштовно, назавжди",
  "landing.headline1": "Відстежуйте кожну гривню.",
  "landing.headline2": "Побудуйте фінансову ясність.",
  "landing.subtitle": "Записуйте витрати, візуалізуйте тренди та стежте за доходом і балансом — у будь-якій валюті.",
  "landing.cta.getStarted": "Почати безкоштовно",
  "landing.cta.signIn": "Увійти",
  "landing.feature.spendingInsights": "Аналіз витрат",
  "landing.feature.incomeTracking": "Облік доходів",
  "landing.feature.multiCurrency": "Мультивалютність",
  "landing.feature.netBalance": "Чистий баланс",

  // Nav
  "nav.signIn": "Увійти",
  "nav.signUp": "Реєстрація",

  // Auth common
  "auth.common.email": "Електронна пошта",
  "auth.common.password": "Пароль",
  "auth.common.back": "Назад",
  "auth.common.orContinueWith": "Або продовжити через",
  "auth.common.termsText": "Натискаючи продовжити, ви погоджуєтесь з нашими",
  "auth.common.termsLink": "Умовами використання",
  "auth.common.termsAnd": "та",
  "auth.common.privacyLink": "Політикою конфіденційності",

  // Login
  "auth.login.title": "З поверненням",
  "auth.login.subtitle": "Увійдіть до свого облікового запису.",
  "auth.login.continueWithEmail": "Продовжити з поштою",
  "auth.login.signingIn": "Вхід...",
  "auth.login.signIn": "Увійти",
  "auth.login.noAccount": "Немає облікового запису?",
  "auth.login.signUpLink": "Зареєструватись",

  // Signup
  "auth.signup.title": "Створити обліковий запис",
  "auth.signup.subtitle": "Почніть відстежувати витрати за секунди.",
  "auth.signup.signUpWithEmail": "Зареєструватись з поштою",
  "auth.signup.name": "Ім'я",
  "auth.signup.confirmPassword": "Підтвердіть пароль",
  "auth.signup.creatingAccount": "Створення...",
  "auth.signup.createAccount": "Створити обліковий запис",
  "auth.signup.alreadyHaveAccount": "Вже є обліковий запис?",
  "auth.signup.signInLink": "Увійти",

  // Dashboard
  "dashboard.title": "Панель управління",
  "dashboard.addIncome": "Додати дохід",
  "dashboard.editIncome.title": "Редагувати дохід",
  "dashboard.editIncome.description": "Встановіть дохід за цей місяць.",
  "dashboard.expenses.title": "Витрати",
  "dashboard.expenses.allCategories": "Всі категорії",
  "dashboard.expenses.addExpense": "Додати витрату",

  // Expense form
  "expenseForm.addTitle": "Додати витрату",
  "expenseForm.editTitle": "Редагувати витрату",
  "expenseForm.amount": "Сума",
  "expenseForm.category": "Категорія",
  "expenseForm.categoryPlaceholder": "Оберіть категорію",
  "expenseForm.description": "Опис (необов'язково)",
  "expenseForm.descriptionPlaceholder": "На що це було?",
  "expenseForm.date": "Дата",
  "expenseForm.cancel": "Скасувати",
  "expenseForm.saving": "Збереження...",
  "expenseForm.saveChanges": "Зберегти зміни",
  "expenseForm.addButton": "Додати витрату",
  "expenseForm.genericError": "Щось пішло не так",

  // Income form
  "incomeForm.amount": "Сума",
  "incomeForm.saving": "Збереження...",
  "incomeForm.save": "Зберегти дохід",

  // Filter
  "filter.total": "Всього",
  "filter.years": "За роком",
  "filter.months": "За місяцем",

  // Months
  "months.1": "Січень",
  "months.2": "Лютий",
  "months.3": "Березень",
  "months.4": "Квітень",
  "months.5": "Травень",
  "months.6": "Червень",
  "months.7": "Липень",
  "months.8": "Серпень",
  "months.9": "Вересень",
  "months.10": "Жовтень",
  "months.11": "Листопад",
  "months.12": "Грудень",

  // KPI
  "kpi.totalIncome": "Загальний дохід",
  "kpi.totalExpenses": "Загальні витрати",
  "kpi.netBalance": "Чистий баланс",

  // Table
  "table.date": "Дата",
  "table.category": "Категорія",
  "table.description": "Опис",
  "table.amount": "Сума",
  "table.noExpenses": "Витрат ще немає.",
  "table.failedToLoad": "Не вдалося завантажити витрати.",
  "table.edit": "Редагувати",
  "table.delete": "Видалити",
  "table.breakdown.category": "Категорія",
  "table.breakdown.amount": "Сума",
  "table.breakdown.percentOfTotal": "% від загального",
  "table.breakdown.noData": "Витрат не зафіксовано.",
  "table.breakdown.failedToLoad": "Не вдалося завантажити статистику.",

  // Delete dialog
  "deleteDialog.title": "Видалити витрату?",
  "deleteDialog.description": "Цю дію неможливо скасувати.",
  "deleteDialog.cancel": "Скасувати",
  "deleteDialog.delete": "Видалити",
  "deleteDialog.deleting": "Видалення...",

  // Charts
  "chart.incomeVsExpenses": "Дохід vs Витрати",
  "chart.incomeLabel": "Дохід",
  "chart.expensesLabel": "Витрати",
  "chart.spendingByCategory": "Витрати за категоріями",
  "chart.noExpenseData": "Немає даних про витрати",

  // Topbar
  "topbar.appName": "Облік витрат",
  "topbar.signOut": "Вийти",

  // Categories
  "categories.rent": "🏠 Оренда / Житло",
  "categories.groceries": "🛒 Продукти",
  "categories.utilities": "⚡ Комунальні послуги",
  "categories.foodDining": "🍽 Їжа та ресторани",
  "categories.subscriptions": "📋 Підписки",
  "categories.transportation": "🚗 Транспорт",
  "categories.shopping": "🛍 Шопінг",
  "categories.healthcare": "💊 Охорона здоров'я",
  "categories.entertainment": "🎮 Розваги",
  "categories.travel": "✈️ Подорожі",
  "categories.savings": "💰 Заощадження",
  "categories.charity": "🤝 Благодійність",
  "categories.other": "❓ Інше",
}

export default uk
