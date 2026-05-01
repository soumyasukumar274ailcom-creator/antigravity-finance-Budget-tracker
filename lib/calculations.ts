import { Bill, Expense } from "./types";

// 2026 is NOT a leap year — Feb has 28 days
const DAYS_IN_MONTH_2026 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Returns the number of days in a given month of 2026 (month is 0-indexed).
 */
export function getDaysInMonth2026(month: number): number {
  return DAYS_IN_MONTH_2026[month];
}

/**
 * Returns today's date string as YYYY-MM-DD (local time).
 */
export function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/**
 * Returns current year-month as YYYY-MM string.
 */
export function getCurrentYearMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Returns days remaining in the current month including today.
 * Uses 2026 calendar if the current year is 2026, otherwise native Date.
 */
export function getDaysRemainingInMonth(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const today = now.getDate();

  const daysInMonth =
    year === 2026 ? DAYS_IN_MONTH_2026[month] : new Date(year, month + 1, 0).getDate();

  return daysInMonth - today + 1; // inclusive of today
}

/**
 * Returns the total of upcoming (unpaid) bills due in the current month.
 */
export function getTotalUpcomingBillsThisMonth(bills: Bill[]): number {
  const currentYM = getCurrentYearMonth();
  return bills
    .filter((b) => !b.isPaid && b.dueDate.startsWith(currentYM))
    .reduce((sum, b) => sum + b.amount, 0);
}

/**
 * Returns the total expenses logged for the current month.
 */
export function getTotalSpentThisMonth(expenses: Expense[]): number {
  const currentYM = getCurrentYearMonth();
  return expenses
    .filter((e) => e.date.startsWith(currentYM))
    .reduce((sum, e) => sum + e.amount, 0);
}

/**
 * Returns total expenses logged for today specifically.
 */
export function getTotalSpentToday(expenses: Expense[]): number {
  const today = getTodayString();
  return expenses
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0);
}

/**
 * Core formula:
 * Safe to Spend = (monthlyBudget - spentThisMonth - upcomingBills) / daysRemaining
 */
export function getSafeToSpendToday(
  monthlyBudget: number,
  expenses: Expense[],
  bills: Bill[]
): number {
  const spent = getTotalSpentThisMonth(expenses);
  const upcomingBills = getTotalUpcomingBillsThisMonth(bills);
  const daysRemaining = getDaysRemainingInMonth();

  const remaining = monthlyBudget - spent - upcomingBills;
  if (daysRemaining <= 0) return 0;
  return Math.max(0, remaining / daysRemaining);
}

/**
 * Format a number as Indian Rupee string.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format an ISO date string to a readable label like "Today", "Tomorrow", "Apr 28".
 */
export function formatDateLabel(dateStr: string): string {
  const today = getTodayString();
  if (dateStr === today) return "Today";

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
  if (dateStr === tomorrowStr) return "Tomorrow";

  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}
