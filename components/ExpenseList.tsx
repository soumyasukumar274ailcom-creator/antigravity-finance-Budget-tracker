"use client";

import { Expense } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/types";
import { formatCurrency, formatDateLabel, getTodayString } from "@/lib/calculations";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const categoryBgMap: Record<string, string> = {
  "Food & Dining": "bg-orange-500/10 text-orange-400",
  Transport: "bg-blue-500/10 text-blue-400",
  Shopping: "bg-pink-500/10 text-pink-400",
  Entertainment: "bg-purple-500/10 text-purple-400",
  Health: "bg-emerald-500/10 text-emerald-400",
  Utilities: "bg-yellow-500/10 text-yellow-400",
  Other: "bg-zinc-500/10 text-zinc-400",
};

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const today = getTodayString();

  const grouped = expenses.reduce<Record<string, Expense[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#1e1e2e]">
        <h2 className="text-white font-semibold text-base">Expenses</h2>
        <p className="text-zinc-600 text-xs mt-0.5">
          {expenses.length} transaction{expenses.length !== 1 ? "s" : ""} recorded
        </p>
      </div>

      {expenses.length === 0 && (
        <p className="text-zinc-600 text-sm text-center py-10">
          No expenses yet. Tap &quot;Quick Add Expense&quot; to log one.
        </p>
      )}

      <div className="divide-y divide-[#1e1e2e]">
        {sortedDates.map((date) => (
          <div key={date}>
            <div className="px-5 py-2 bg-[#0d0d14] flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                {formatDateLabel(date)}
                {date === today && <span className="ml-2 text-indigo-400">· Today</span>}
              </span>
              <span className="text-xs text-zinc-600">
                {formatCurrency(grouped[date].reduce((s, e) => s + e.amount, 0))}
              </span>
            </div>
            {grouped[date].map((expense) => (
              <div key={expense.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#0d0d14] transition-colors group">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${categoryBgMap[expense.category] ?? "bg-zinc-800 text-zinc-400"}`}>
                  {CATEGORY_ICONS[expense.category as keyof typeof CATEGORY_ICONS] ?? "📌"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {expense.note || expense.category}
                  </p>
                  <p className="text-zinc-600 text-xs">{expense.category}</p>
                </div>
                <span className="text-white font-semibold text-sm flex-shrink-0">
                  -{formatCurrency(expense.amount)}
                </span>
                <button
                  onClick={() => { onDelete(expense.id); toast.success("Expense removed."); }}
                  className="text-zinc-800 group-hover:text-zinc-600 hover:text-red-400 transition-colors flex-shrink-0"
                  title="Delete expense"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
