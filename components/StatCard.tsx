"use client";

import { useApp } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/financeEngine";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant: "cyan" | "coral" | "lavender" | "amber";
  prefix?: string;
  animDelay?: string;
  trend?: number;
}

const variantMap = {
  cyan:     { text: "text-[var(--cyan)]",    glow: "glow-cyan",  border: "border-[var(--cyan)]/20",    bg: "bg-[var(--cyan-dim)]" },
  coral:    { text: "text-[var(--coral)]",   glow: "glow-coral", border: "border-[var(--coral)]/20",   bg: "bg-[var(--coral-dim)]" },
  lavender: { text: "text-[var(--lavender)]",glow: "glow-lav",   border: "border-[var(--lavender)]/20",bg: "bg-[var(--lavender-dim)]" },
  amber:    { text: "text-[var(--amber)]",   glow: "",           border: "border-[var(--amber)]/20",   bg: "bg-[var(--amber-dim)]" },
};

export function StatCard({ label, value, icon, variant, animDelay = "0ms", trend }: StatCardProps) {
  const { currency } = useApp();
  const v = variantMap[variant];
  const isNeg = value < 0;

  return (
    <div
      className={`glass glass-hover rounded-2xl p-5 border ${v.border} animate-drift-in flex flex-col gap-3`}
      style={{ animationDelay: animDelay }}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl ${v.bg} flex items-center justify-center`}>
        {icon}
      </div>

      {/* Label */}
      <p className="text-[var(--text-2)] text-xs font-medium tracking-wide uppercase">{label}</p>

      {/* Value & Trend */}
      <div className="flex items-end justify-between gap-2">
        <p className={`font-bold text-2xl leading-none ghost-val ${isNeg ? "text-[var(--coral)]" : v.text}`}>
          {isNeg ? "-" : ""}{formatCurrency(Math.abs(value), currency)}
        </p>

        {trend !== undefined && trend !== 0 && (
          <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
            trend > 0
              ? (variant === "coral" ? "text-[var(--coral)] bg-[var(--coral-dim)]" : "text-[var(--cyan)] bg-[var(--cyan-dim)]")
              : (variant === "coral" ? "text-[var(--cyan)] bg-[var(--cyan-dim)]" : "text-[var(--coral)] bg-[var(--coral-dim)]")
          }`}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}
