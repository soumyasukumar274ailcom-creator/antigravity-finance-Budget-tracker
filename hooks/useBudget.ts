"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getCategoryBudgets,
  getMonthlyBudget,
  getTransactions,
  getBills,
  saveCategoryBudgets,
  saveMonthlyBudget,
  saveTransactions,
  saveBills,
} from "@/lib/storage";
import {
  calculateMonthlyTotals,
  calculateNetWorth,
  getSafeToSpend,
  getCategorySpending,
  getLast30DaysData,
  getCategoryProgress,
  getTodayString,
  getMonthlyTrends,
} from "@/lib/financeEngine";
import { Bill, CategoryBudget, Transaction } from "@/lib/types";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useBudget() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [monthlyBudget, setMonthlyBudgetState] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [categoryBudgets, setCategoryBudgetsState] = useState<CategoryBudget[]>([]);

  useEffect(() => {
    setMonthlyBudgetState(getMonthlyBudget());
    setTransactions(getTransactions());
    setBills(getBills());
    setCategoryBudgetsState(getCategoryBudgets());
    setIsLoaded(true);
  }, []);

  // ── Monthly Budget ─────────────────────────────────────────────────────────
  const setMonthlyBudget = useCallback((amount: number) => {
    saveMonthlyBudget(amount);
    setMonthlyBudgetState(amount);
  }, []);

  // ── Transactions ───────────────────────────────────────────────────────────
  const addTransaction = useCallback(
    (data: Omit<Transaction, "id" | "createdAt">) => {
      const tx: Transaction = { ...data, id: generateId(), createdAt: Date.now() };
      const updated = [tx, ...transactions];
      saveTransactions(updated);
      setTransactions(updated);
    },
    [transactions]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      const updated = transactions.filter((t) => t.id !== id);
      saveTransactions(updated);
      setTransactions(updated);
    },
    [transactions]
  );

  const updateTransaction = useCallback(
    (id: string, patch: Partial<Transaction>) => {
      const updated = transactions.map((t) => (t.id === id ? { ...t, ...patch } : t));
      saveTransactions(updated);
      setTransactions(updated);
    },
    [transactions]
  );

  // ── Bills ──────────────────────────────────────────────────────────────────
  const addBill = useCallback(
    (data: Omit<Bill, "id">) => {
      const bill: Bill = { ...data, id: generateId() };
      const updated = [...bills, bill].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
      saveBills(updated);
      setBills(updated);
    },
    [bills]
  );

  const deleteBill = useCallback(
    (id: string) => {
      const updated = bills.filter((b) => b.id !== id);
      saveBills(updated);
      setBills(updated);
    },
    [bills]
  );

  const toggleBillPaid = useCallback(
    (id: string) => {
      const updated = bills.map((b) => (b.id === id ? { ...b, isPaid: !b.isPaid } : b));
      saveBills(updated);
      setBills(updated);
    },
    [bills]
  );

  // ── Category Budgets ───────────────────────────────────────────────────────
  const setCategoryBudgets = useCallback((budgets: CategoryBudget[]) => {
    saveCategoryBudgets(budgets);
    setCategoryBudgetsState(budgets);
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────
  const { income: monthlyIncome, expenses: monthlyExpenses, investments: monthlyInvestments } = calculateMonthlyTotals(transactions);
  const netWorth = calculateNetWorth(transactions);
  const safeToSpend = getSafeToSpend(monthlyBudget, transactions);
  const categorySpending = getCategorySpending(transactions);
  const chartData = getLast30DaysData(transactions);
  const categoryProgress = getCategoryProgress(transactions, categoryBudgets);
  const trends = getMonthlyTrends(transactions);
  const today = getTodayString();

  return {
    isLoaded,
    monthlyBudget, setMonthlyBudget,
    transactions, addTransaction, deleteTransaction, updateTransaction,
    bills, addBill, deleteBill, toggleBillPaid,
    categoryBudgets, setCategoryBudgets,
    // derived
    monthlyIncome, monthlyExpenses, monthlyInvestments, netWorth, safeToSpend,
    categorySpending, chartData, categoryProgress, trends,
    today,
  };
}
