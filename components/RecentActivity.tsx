"use client";

import { Transaction } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/types";
import { formatCurrency } from "@/lib/financeEngine";
import { useApp } from "@/contexts/AppContext";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface RecentActivityProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

function groupByDate(transactions: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  sorted.forEach((t) => {
    if (!groups[t.date]) groups[t.date] = [];
    groups[t.date].push(t);
  });
  return groups;
}

function dateLabel(dateStr: string): string {
  const today = new Date();
  const d = new Date(dateStr + "T00:00:00");
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yestStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
  if (dateStr === todayStr) return "Today";
  if (dateStr === yestStr) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined });
}

export function RecentActivity({ transactions, onDelete }: RecentActivityProps) {
  const { currency } = useApp();
  const groups = groupByDate(transactions);
  const dates = Object.keys(groups).sort((a, b) => b.localeCompare(a)).slice(0, 10);

  return (
    <div id="transactions" className="glass glass-hover rounded-2xl border border-white/[0.07] overflow-hidden animate-drift-in" style={{ animationDelay: "150ms" }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <div>
          <h2 className="text-[var(--text-1)] font-semibold text-sm">Recent Activity</h2>
          <p className="text-[var(--text-3)] text-xs mt-0.5">{transactions.length} transaction{transactions.length !== 1 ? "s" : ""} total</p>
        </div>
      </div>

      {transactions.length === 0 && (
        <p className="text-[var(--text-3)] text-sm text-center py-12">
          No transactions yet. Use the + button below to add one.
        </p>
      )}

      <div className="max-h-[480px] overflow-y-auto divide-y divide-white/[0.04]">
        {dates.map((date) => (
          <div key={date}>
            {/* Date header */}
            <div className="flex items-center justify-between px-5 py-2.5 bg-white/[0.02]">
              <span className="text-[10px] font-semibold text-[var(--text-3)] uppercase tracking-widest">
                {dateLabel(date)}
              </span>
              <span className="text-[10px] text-[var(--text-3)] ghost-val">
                {formatCurrency(
                  groups[date].reduce((s, t) => t.type === "income" ? s + t.amount : s - t.amount, 0),
                  currency
                )}
              </span>
            </div>

            {/* Rows */}
            {groups[date].map((t) => {
              const isIncome = t.type === "income";
              const isInvestment = t.type === "investment";
              const icon = CATEGORY_ICONS[t.category] ?? "📌";
              const iconBg = isIncome ? "bg-[var(--cyan-dim)]" : isInvestment ? "bg-[var(--amber-dim)]" : "bg-[var(--coral-dim)]";
              const amtColor = isIncome ? "text-[var(--cyan)]" : isInvestment ? "text-[var(--amber)]" : "text-[var(--coral)]";
              const amtPrefix = isIncome ? "+" : isInvestment ? "~" : "-";
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.03] transition-colors group"
                >
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${iconBg}`}>
                    {icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--text-1)] text-sm font-medium truncate">
                      {t.note || t.category}
                    </p>
                    <p className="text-[var(--text-3)] text-xs">{t.category} · {t.currency}</p>
                  </div>

                  {/* Amount */}
                  <div className="flex flex-col items-end shrink-0">
                    <span className={`font-semibold text-sm ghost-val ${amtColor}`}>
                      {amtPrefix}{formatCurrency(t.amount, t.currency)}
                    </span>
                    {t.currency !== currency && (
                      <span className="text-[10px] text-[var(--text-3)] font-medium">
                        ≈ {formatCurrency(t.amount, currency)}
                      </span>
                    )}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => { onDelete(t.id); toast.success("Transaction removed."); }}
                    className="text-transparent group-hover:text-[var(--text-3)] hover:!text-[var(--coral)] transition-colors shrink-0"
                    title="Delete transaction"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
