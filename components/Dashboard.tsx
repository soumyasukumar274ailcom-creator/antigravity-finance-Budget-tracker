"use client";

import { formatCurrency, getDaysRemainingInMonth } from "@/lib/calculations";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, TrendingDown, CalendarDays, Wallet } from "lucide-react";

interface DashboardProps {
  monthlyBudget: number;
  safeToSpendToday: number;
  totalSpentThisMonth: number;
  totalSpentToday: number;
  totalUpcomingBills: number;
  onAddExpense: () => void;
}

export function Dashboard({
  monthlyBudget,
  safeToSpendToday,
  totalSpentThisMonth,
  totalSpentToday,
  totalUpcomingBills,
  onAddExpense,
}: DashboardProps) {
  const daysRemaining = getDaysRemainingInMonth();
  const spentPercent = monthlyBudget > 0 ? Math.min((totalSpentThisMonth / monthlyBudget) * 100, 100) : 0;
  const isHealthy = safeToSpendToday > 500;
  const isWarning = safeToSpendToday > 0 && safeToSpendToday <= 500;

  const heroColor = isHealthy
    ? "text-emerald-400"
    : isWarning
    ? "text-amber-400"
    : "text-red-400";

  const glowColor = isHealthy
    ? "shadow-emerald-500/20"
    : isWarning
    ? "shadow-amber-500/20"
    : "shadow-red-500/20";

  const now = new Date();
  const monthName = now.toLocaleString("en-IN", { month: "long" });
  const year = now.getFullYear();

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#13131f] to-[#0e0e1a] border border-[#1e1e2e] p-8 shadow-2xl ${glowColor}`}>
        {/* Decorative glow blob */}
        <div className={`absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-10 ${isHealthy ? "bg-emerald-500" : isWarning ? "bg-amber-500" : "bg-red-500"}`} />

        <div className="relative z-10">
          <p className="text-zinc-500 text-sm font-medium tracking-widest uppercase mb-1">
            Safe to Spend Today
          </p>
          <div className={`text-6xl font-black tracking-tight ${heroColor} mb-1`}>
            {monthlyBudget === 0 ? (
              <span className="text-3xl text-zinc-600">Set your budget →</span>
            ) : (
              formatCurrency(safeToSpendToday)
            )}
          </div>
          <p className="text-zinc-600 text-sm mt-2">
            {monthName} {year} · {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
          </p>

          {/* Progress bar */}
          {monthlyBudget > 0 && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-zinc-500">
                <span>Spent {formatCurrency(totalSpentThisMonth)}</span>
                <span>of {formatCurrency(monthlyBudget)}</span>
              </div>
              <Progress
                value={spentPercent}
                className="h-2 bg-[#1e1e2e]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={<Wallet className="w-4 h-4 text-indigo-400" />}
          label="Monthly Budget"
          value={formatCurrency(monthlyBudget)}
          accent="indigo"
        />
        <StatCard
          icon={<TrendingDown className="w-4 h-4 text-rose-400" />}
          label="Spent Today"
          value={formatCurrency(totalSpentToday)}
          accent="rose"
        />
        <StatCard
          icon={<CalendarDays className="w-4 h-4 text-amber-400" />}
          label="Bills This Month"
          value={formatCurrency(totalUpcomingBills)}
          accent="amber"
        />
      </div>

      {/* Add Expense FAB */}
      <Button
        id="add-expense-btn"
        onClick={onAddExpense}
        className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40 hover:-translate-y-0.5"
      >
        <Plus className="w-5 h-5 mr-2" />
        Quick Add Expense
      </Button>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  const borderMap: Record<string, string> = {
    indigo: "border-indigo-500/20",
    rose: "border-rose-500/20",
    amber: "border-amber-500/20",
  };
  return (
    <div className={`rounded-xl bg-[#111118] border ${borderMap[accent]} p-4 space-y-2`}>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-zinc-500 text-xs font-medium">{label}</span>
      </div>
      <p className="text-white font-bold text-lg leading-none">{value}</p>
    </div>
  );
}
