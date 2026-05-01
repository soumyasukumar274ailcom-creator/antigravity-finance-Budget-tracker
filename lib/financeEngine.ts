import { Transaction, CategoryBudget, EXPENSE_CATEGORIES } from "./types";

// ─── Monthly Totals ──────────────────────────────────────────────────────────

export interface MonthlyTotals {
  income: number;
  expenses: number;
  investments: number;
}

export const calculateMonthlyTotals = (transactions: Transaction[], monthOffset = 0): MonthlyTotals => {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const targetMonth = d.getMonth();
  const targetYear = d.getFullYear();

  return transactions.reduce(
    (acc, transaction) => {
      const tDate = new Date(transaction.date + "T00:00:00");
      if (
        tDate.getMonth() === targetMonth &&
        tDate.getFullYear() === targetYear
      ) {
        if (transaction.type === "income") {
          acc.income += transaction.amount;
        } else if (transaction.type === "expense") {
          acc.expenses += transaction.amount;
        } else if (transaction.type === "investment") {
          acc.investments += transaction.amount;
        }
      }
      return acc;
    },
    { income: 0, expenses: 0, investments: 0 }
  );
};

export const getMonthlyTrends = (transactions: Transaction[]) => {
  const current = calculateMonthlyTotals(transactions, 0);
  const previous = calculateMonthlyTotals(transactions, -1);

  const calcDelta = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  return {
    incomeDelta: calcDelta(current.income, previous.income),
    expenseDelta: calcDelta(current.expenses, previous.expenses),
    investmentDelta: calcDelta(current.investments, previous.investments),
  };
};

// ─── Net Worth ────────────────────────────────────────────────────────────────

export const calculateNetWorth = (transactions: Transaction[]): number => {
  return transactions.reduce((net, t) => {
    return t.type === "income" ? net + t.amount : net - t.amount;
  }, 0);
};

// ─── Last 30 Days Chart Data ──────────────────────────────────────────────────

export interface DayData {
  date: string;    // YYYY-MM-DD
  label: string;   // "May 1"
  income: number;
  expenses: number;
}

export const getLast30DaysData = (transactions: Transaction[]): DayData[] => {
  const days: DayData[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dayTxns = transactions.filter((t) => t.date === dateStr);
    days.push({
      date: dateStr,
      label,
      income: dayTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      expenses: dayTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    });
  }
  return days;
};

// ─── Category Spending This Month ─────────────────────────────────────────────

export const getCategorySpending = (transactions: Transaction[]): Record<string, number> => {
  const now = new Date();
  const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const totals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(currentYM))
    .forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
  return totals;
};

// ─── Format Currency ─────────────────────────────────────────────────────────

export const formatCurrency = (amount: number, currencyCode = "USD"): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
};

// ─── Today's Date String ─────────────────────────────────────────────────────

export const getTodayString = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// ─── Days Remaining In Month ──────────────────────────────────────────────────

export const getDaysRemainingInMonth = (): number => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return daysInMonth - now.getDate() + 1;
};

// ─── Safe-to-Spend Today ─────────────────────────────────────────────────────

export const getSafeToSpend = (
  monthlyBudget: number,
  transactions: Transaction[]
): number => {
  const { expenses } = calculateMonthlyTotals(transactions);
  const remaining = monthlyBudget - expenses;
  const days = getDaysRemainingInMonth();
  return days > 0 ? Math.max(0, remaining / days) : 0;
};

// ─── Category Progress (for orbs) ────────────────────────────────────────────

export const getCategoryProgress = (
  transactions: Transaction[],
  budgets: CategoryBudget[]
): { category: string; spent: number; limit: number; pct: number }[] => {
  const spending = getCategorySpending(transactions);
  const budgetMap = Object.fromEntries(budgets.map((b) => [b.category, b.monthlyLimit]));

  return (EXPENSE_CATEGORIES as unknown as string[]).map((cat) => {
    const limit = budgetMap[cat] ?? 0;
    const spent = spending[cat] ?? 0;
    return {
      category: cat,
      spent,
      limit,
      pct: limit > 0 ? Math.min(spent / limit, 1) : 0,
    };
  }).sort((a, b) => {
    // Show active budgets first, then by percentage
    if (a.limit > 0 && b.limit === 0) return -1;
    if (a.limit === 0 && b.limit > 0) return 1;
    return b.pct - a.pct;
  });
};
