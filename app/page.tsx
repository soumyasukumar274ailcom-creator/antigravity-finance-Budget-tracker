"use client";

import { useBudget } from "@/hooks/useBudget";
import { useApp } from "@/contexts/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { PulseChart } from "@/components/PulseChart";
import { CategoryOrbs } from "@/components/CategoryOrbs";
import { RecentActivity } from "@/components/RecentActivity";
import { FloatingTransactionBar } from "@/components/FloatingTransactionBar";
import { BottomNav } from "@/components/BottomNav";
import { Toaster } from "@/components/ui/sonner";
import { TrendingUp, TrendingDown, Wallet, Zap, PiggyBank } from "lucide-react";

export default function Home() {
  const {
    isLoaded,
    transactions, addTransaction, deleteTransaction,
    monthlyIncome, monthlyExpenses, monthlyInvestments, netWorth, safeToSpend,
    chartData, categoryProgress, categoryBudgets, setCategoryBudgets, trends,
  } = useBudget();

  const { currency } = useApp();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0E14] overflow-hidden relative">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--lavender)]/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[var(--cyan)]/5 blur-[80px] rounded-full animate-pulse" />

        <div className="flex flex-col items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9B8EDF] to-[#00F5D4] flex items-center justify-center shadow-2xl animate-drift-in">
              <Zap className="w-8 h-8 text-[#0A0E14]" fill="currentColor" />
            </div>
            {/* Spinning ring */}
            <div className="absolute -inset-2 rounded-[22px] border-2 border-dashed border-[var(--lavender)]/20 animate-[spin_10s_linear_infinite]" />
          </div>
          
          <div className="text-center space-y-1.5">
            <p className="text-[var(--text-1)] text-xs font-bold tracking-[0.2em] uppercase opacity-80">Antigravity</p>
            <p className="text-[var(--text-3)] text-[10px] tracking-widest uppercase">Initializing OS…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Header */}
        <Header netWorth={netWorth} />

        {/* Scrollable content */}
        <main
          id="dashboard"
          className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 pb-40 lg:pb-24 space-y-6 max-w-6xl w-full mx-auto"
        >

          {/* ── Stat Grid ──────────────────────────────────────────────────── */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Net Worth"
              value={netWorth}
              icon={<Wallet className="w-5 h-5" style={{ color: "var(--lavender)" }} />}
              variant="lavender"
              animDelay="0ms"
            />
            <StatCard
              label="Monthly Income"
              value={monthlyIncome}
              icon={<TrendingUp className="w-5 h-5" style={{ color: "var(--cyan)" }} />}
              variant="cyan"
              animDelay="80ms"
              trend={trends.incomeDelta}
            />
            <StatCard
              label="Monthly Expenses"
              value={monthlyExpenses}
              icon={<TrendingDown className="w-5 h-5" style={{ color: "var(--coral)" }} />}
              variant="coral"
              animDelay="160ms"
              trend={trends.expenseDelta}
            />
            <StatCard
              label="Investments"
              value={monthlyInvestments}
              icon={<PiggyBank className="w-5 h-5" style={{ color: "var(--amber)" }} />}
              variant="amber"
              animDelay="240ms"
              trend={trends.investmentDelta}
            />
          </section>

          {/* ── Safe to Spend Banner ────────────────────────────────────────── */}
          {safeToSpend > 0 && (
            <div className="glass rounded-2xl border border-[var(--cyan)]/20 px-6 py-4 flex items-center justify-between animate-drift-in" style={{ animationDelay: "240ms" }}>
              <div>
                <p className="text-[var(--text-3)] text-xs uppercase tracking-widest font-semibold">Safe to Spend Today</p>
                <p className="text-[var(--cyan)] font-black text-3xl ghost-val mt-0.5">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency }).format(safeToSpend)}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[var(--cyan-dim)] border border-[var(--cyan)]/20 flex items-center justify-center">
                <Zap className="w-7 h-7 text-[var(--cyan)]" />
              </div>
            </div>
          )}

          {/* ── Pulse Chart ─────────────────────────────────────────────────── */}
          <PulseChart data={chartData} />

          {/* ── Analytics Row: Category Pulse (Merged Orbs & Budgets) ── */}
          <section id="analytics">
            <CategoryOrbs 
              data={categoryProgress} 
              budgets={categoryBudgets}
              onSaveBudgets={setCategoryBudgets}
            />
          </section>

          {/* ── Recent Activity ──────────────────────────────────────────── */}
          <RecentActivity
            transactions={transactions}
            onDelete={deleteTransaction}
          />

        </main>
      </div>

      {/* Floating Transaction Bar */}
      <FloatingTransactionBar onAdd={addTransaction} />

      {/* Mobile Bottom Nav */}
      <BottomNav />

      {/* Toasts */}
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(13,18,32,0.95)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#E8F0FF",
            backdropFilter: "blur(20px)",
          },
        }}
      />
    </div>
  );
}
