"use client";

import { useEffect, useRef } from "react";
import { CATEGORY_ICONS } from "@/lib/types";
import { useApp } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/financeEngine";

interface OrbData {
  category: string;
  spent: number;
  limit: number;
  pct: number;
}

interface CategoryOrbsProps {
  data: OrbData[];
}

const COLORS = [
  "#00F5D4", // cyan
  "#9B8EDF", // lavender
  "#FFBB38", // amber
  "#FF5E5B", // coral
  "#60A5FA", // blue
  "#A3E635", // lime
  "#F472B6", // pink
];

import { CategoryBudget, EXPENSE_CATEGORIES } from "@/lib/types";
import { useState } from "react";
import { Settings2, Check, X } from "lucide-react";
import { toast } from "sonner";

function CategoryOrb({
  category,
  spent,
  limit,
  pct,
  color,
  currency,
}: OrbData & { color: string; currency: string }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const isGhost = limit === 0;
  
  const strokeDashoffset = isGhost ? circumference * 0.95 : circumference * (1 - pct);
  const glowIntensity = isGhost ? 0 : Math.round(pct * 32);
  const icon = CATEGORY_ICONS[category] ?? "📌";

  const trackColor = pct >= 0.9 ? "rgba(255,94,91,0.15)" : "rgba(255,255,255,0.06)";
  const strokeColor = isGhost ? "rgba(255,255,255,0.1)" : (pct >= 0.9 ? "#FF5E5B" : color);

  return (
    <div className="flex flex-col items-center gap-2 group">
      <div
        className={`relative transition-transform duration-300 group-hover:-translate-y-2 ${isGhost ? "animate-pulse-ring" : ""}`}
        style={{ filter: isGhost ? "none" : `drop-shadow(0 0 ${glowIntensity}px ${strokeColor})` }}
      >
        <svg width="84" height="84" viewBox="0 0 90 90">
          {/* Track */}
          <circle
            cx="45" cy="45" r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth="6"
            strokeDasharray={isGhost ? "4 6" : "none"}
          />
          {/* Progress arc */}
          <circle
            cx="45" cy="45" r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={isGhost ? "2" : "6"}
            strokeLinecap="round"
            strokeDasharray={isGhost ? "4 6" : circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90, 45, 45)"
            style={{
              transition: "all 1.2s cubic-bezier(0.23,1,0.32,1)",
            }}
          />
          {/* Icon/Pct text */}
          {!isGhost ? (
            <text x="45" y="48" textAnchor="middle" dominantBaseline="middle"
              fill={strokeColor} fontSize="14" fontWeight="800" fontFamily="Inter, sans-serif">
              {Math.round(pct * 100)}%
            </text>
          ) : (
            <text x="45" y="48" textAnchor="middle" dominantBaseline="middle"
              fill="rgba(255,255,255,0.2)" fontSize="20" opacity="0.5">
              +
            </text>
          )}
        </svg>

        {/* Icon badge */}
        <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#0A0E14] border border-white/[0.1] flex items-center justify-center text-xs shadow-lg">
          {icon}
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p className={`text-xs font-bold leading-tight truncate max-w-[80px] ${isGhost ? "text-[var(--text-3)]" : "text-[var(--text-1)]"}`}>
          {category}
        </p>
        <p className="text-[var(--text-3)] text-[9px] ghost-val font-medium mt-0.5">
          {isGhost ? "No limit set" : `${formatCurrency(spent, currency)} / ${formatCurrency(limit, currency)}`}
        </p>
      </div>
    </div>
  );
}

export function CategoryOrbs({ data, budgets, onSaveBudgets }: CategoryOrbsProps & { budgets: CategoryBudget[], onSaveBudgets: (b: CategoryBudget[]) => void }) {
  const { currency } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [localBudgets, setLocalBudgets] = useState<Record<string, string>>(() => {
    return Object.fromEntries(budgets.map(b => [b.category, String(b.monthlyLimit)]));
  });

  const handleSave = () => {
    const updated = (EXPENSE_CATEGORIES as unknown as string[]).map(cat => ({
      category: cat as any,
      monthlyLimit: parseFloat(localBudgets[cat]) || 0
    }));
    onSaveBudgets(updated);
    setIsSettingsOpen(false);
    toast.success("Budget limits updated!");
  };

  return (
    <div className="glass glass-hover rounded-2xl border border-white/[0.07] overflow-hidden animate-drift-in" style={{ animationDelay: "300ms" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.05]">
        <div>
          <h2 className="text-[var(--text-1)] font-bold text-sm tracking-wide uppercase flex items-center gap-2">
            Category Pulse
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] animate-pulse" />
          </h2>
          <p className="text-[var(--text-3)] text-[11px] mt-0.5 font-medium">Monthly budget allocation & spending</p>
        </div>
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold ${
            isSettingsOpen
              ? "bg-[var(--lavender)] text-[#0A0E14] border-[var(--lavender)]"
              : "glass border-white/[0.08] text-[var(--text-2)] hover:text-[var(--text-1)]"
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          {isSettingsOpen ? "Exit Editor" : "Set Budgets"}
        </button>
      </div>

      {/* Content */}
      <div className="p-6 pb-12">
        {isSettingsOpen ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 animate-ticker">
            {EXPENSE_CATEGORIES.map((cat) => (
              <div key={cat} className="space-y-1.5 p-3 glass rounded-xl border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <label className="text-[var(--text-2)] text-[11px] font-bold uppercase tracking-tight flex items-center gap-2">
                    <span className="text-sm">{CATEGORY_ICONS[cat]}</span> {cat}
                  </label>
                  <span className="text-[var(--text-3)] text-[9px] font-black">{currency}</span>
                </div>
                <input
                  type="number"
                  value={localBudgets[cat] || ""}
                  onChange={(e) => setLocalBudgets(prev => ({ ...prev, [cat]: e.target.value }))}
                  placeholder="0.00"
                  className="w-full h-9 px-3 glass rounded-lg border border-white/[0.08] text-[var(--text-1)] text-sm font-bold outline-none focus:border-[var(--lavender)]/50 transition-all placeholder:opacity-30"
                />
              </div>
            ))}
            <div className="sm:col-span-2 lg:col-span-3 pt-4 flex gap-3">
              <button onClick={handleSave} className="flex-1 h-11 rounded-xl bg-[var(--lavender)] text-[#0A0E14] font-black text-sm shadow-xl shadow-[var(--lavender-glow)] flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Save Configuration
              </button>
              <button onClick={() => setIsSettingsOpen(false)} className="px-6 h-11 rounded-xl glass border-white/[0.1] text-[var(--text-2)] font-bold text-sm">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-8 justify-items-center">
            {data.slice(0, 6).map((orb, i) => (
              <CategoryOrb
                key={orb.category}
                {...orb}
                color={COLORS[i % COLORS.length]}
                currency={currency}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
