// ─── Transaction ──────────────────────────────────────────────────────────────

export type TransactionType = "income" | "expense" | "investment";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;        // always positive, in display units (not cents)
  currency: string;      // ISO 4217 code
  category: string;
  note: string;
  date: string;          // YYYY-MM-DD
  createdAt: number;
}

// Backward-compat alias
export type Expense = Transaction;

// ─── Bills ────────────────────────────────────────────────────────────────────

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  isRecurring: boolean;
}

// ─── Category Budgets ─────────────────────────────────────────────────────────

export interface CategoryBudget {
  category: string;
  monthlyLimit: number; // in display currency
}

// ─── Categories ───────────────────────────────────────────────────────────────

export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Utilities",
  "Housing",
  "Travel",
  "Education",
  "Technology",
  "Other",
] as const;

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Rental",
  "Gift",
  "Refund",
  "Other Income",
] as const;

export const INVESTMENT_CATEGORIES = [
  "Stocks",
  "Crypto",
  "Mutual Funds",
  "ETF",
  "Bonds",
  "Real Estate",
  "Gold",
  "Startup",
  "Other Investment",
] as const;

export type ExpenseCategory   = (typeof EXPENSE_CATEGORIES)[number];
export type IncomeCategory    = (typeof INCOME_CATEGORIES)[number];
export type InvestmentCategory = (typeof INVESTMENT_CATEGORIES)[number];
export type Category = ExpenseCategory | IncomeCategory | InvestmentCategory;

export const CATEGORY_ICONS: Record<string, string> = {
  // Expense
  "Food & Dining": "🍽️",
  Transport: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Health: "💊",
  Utilities: "⚡",
  Housing: "🏠",
  Travel: "✈️",
  Education: "📚",
  Technology: "💻",
  Other: "📌",
  // Income
  Salary: "💼",
  Freelance: "🧑‍💻",
  Rental: "🏢",
  Gift: "🎁",
  Refund: "🔄",
  "Other Income": "💰",
  // Investment
  Stocks: "📈",
  Crypto: "₿",
  "Mutual Funds": "🏦",
  ETF: "📊",
  Bonds: "📜",
  "Real Estate": "🏗️",
  Gold: "🥇",
  Startup: "🚀",
  "Other Investment": "💎",
};

// ─── Currencies ───────────────────────────────────────────────────────────────

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "PLN", name: "Polish Złoty", symbol: "zł" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$" },
  { code: "VND", name: "Vietnamese Đồng", symbol: "₫" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£" },
  { code: "COP", name: "Colombian Peso", symbol: "COP$" },
  { code: "ARS", name: "Argentine Peso", symbol: "AR$" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
];
