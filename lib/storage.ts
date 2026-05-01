import { Bill, CategoryBudget, Transaction } from "./types";

const KEYS = {
  MONTHLY_BUDGET: "ag_monthly_budget",
  TRANSACTIONS: "ag_transactions",
  BILLS: "ag_bills",
  CATEGORY_BUDGETS: "ag_category_budgets",
  CURRENCY: "ag_currency",
  THEME: "ag_theme",
} as const;

// ─── Transactions ────────────────────────────────────────────────────────────

export function getTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(KEYS.TRANSACTIONS);
    if (raw) return JSON.parse(raw) as Transaction[];
    // Migrate old expenses key
    const old = localStorage.getItem("dbt_expenses");
    if (old) {
      const migrated = (JSON.parse(old) as Record<string, unknown>[]).map((e) => ({
        ...e,
        type: "expense" as const,
        currency: getCurrency(),
      })) as Transaction[];
      saveTransactions(migrated);
      return migrated;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

// ─── Monthly Budget ───────────────────────────────────────────────────────────

export function getMonthlyBudget(): number {
  try {
    const raw = localStorage.getItem(KEYS.MONTHLY_BUDGET);
    return raw ? parseFloat(raw) : 0;
  } catch {
    return 0;
  }
}

export function saveMonthlyBudget(amount: number): void {
  localStorage.setItem(KEYS.MONTHLY_BUDGET, String(amount));
}

// ─── Bills ────────────────────────────────────────────────────────────────────

export function getBills(): Bill[] {
  try {
    const raw = localStorage.getItem(KEYS.BILLS);
    if (raw) return JSON.parse(raw) as Bill[];
    const old = localStorage.getItem("dbt_bills");
    if (old) return JSON.parse(old) as Bill[];
    return [];
  } catch {
    return [];
  }
}

export function saveBills(bills: Bill[]): void {
  localStorage.setItem(KEYS.BILLS, JSON.stringify(bills));
}

// ─── Category Budgets ─────────────────────────────────────────────────────────

export function getCategoryBudgets(): CategoryBudget[] {
  try {
    const raw = localStorage.getItem(KEYS.CATEGORY_BUDGETS);
    return raw ? (JSON.parse(raw) as CategoryBudget[]) : [];
  } catch {
    return [];
  }
}

export function saveCategoryBudgets(budgets: CategoryBudget[]): void {
  localStorage.setItem(KEYS.CATEGORY_BUDGETS, JSON.stringify(budgets));
}

// ─── Currency Preference ─────────────────────────────────────────────────────

export function getCurrency(): string {
  try {
    return localStorage.getItem(KEYS.CURRENCY) ?? "USD";
  } catch {
    return "USD";
  }
}

export function saveCurrency(code: string): void {
  localStorage.setItem(KEYS.CURRENCY, code);
}

// ─── Theme Preference ────────────────────────────────────────────────────────
export function getTheme(): "light" | "dark" {
  try {
    return (localStorage.getItem(KEYS.THEME) as any) ?? "dark";
  } catch {
    return "dark";
  }
}

export function saveTheme(theme: "light" | "dark"): void {
  localStorage.setItem(KEYS.THEME, theme);
}
