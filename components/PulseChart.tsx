"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  defs,
  linearGradient,
  stop,
} from "recharts";
import { DayData } from "@/lib/financeEngine";
import { useApp } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/financeEngine";

interface PulseChartProps {
  data: DayData[];
}

function CustomTooltip({ active, payload, label, currency }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string; currency: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-white/[0.1] rounded-xl px-4 py-3 shadow-2xl text-xs space-y-1">
      <p className="text-[var(--text-3)] font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className={p.name === "income" ? "text-[var(--cyan)]" : "text-[var(--coral)]"}>
          <span className="capitalize font-semibold">{p.name}</span>: {formatCurrency(p.value, currency)}
        </p>
      ))}
    </div>
  );
}

export function PulseChart({ data }: PulseChartProps) {
  const { currency } = useApp();

  // Show every 5th label to avoid crowding
  const tickFormatter = (_: string, idx: number) => {
    if (idx % 5 !== 0) return "";
    return data[idx]?.label ?? "";
  };

  return (
    <div className="glass glass-hover rounded-2xl p-5 border border-white/[0.07] animate-drift-in" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[var(--text-1)] font-semibold text-sm">Pulse Chart</h2>
          <p className="text-[var(--text-3)] text-xs mt-0.5">Last 30 days spending trends</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-[var(--cyan)]">
            <span className="w-2 h-2 rounded-full bg-[var(--cyan)]" />Income
          </span>
          <span className="flex items-center gap-1.5 text-[var(--coral)]">
            <span className="w-2 h-2 rounded-full bg-[var(--coral)]" />Expenses
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00F5D4" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#00F5D4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradCoral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF5E5B" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#FF5E5B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="label"
            tickFormatter={tickFormatter}
            tick={{ fontSize: 10, fill: "rgba(232,240,255,0.4)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "rgba(232,240,255,0.4)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => {
              if (v === 0) return "0";
              if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
              return String(v);
            }}
          />
          <Tooltip content={<CustomTooltip currency={currency} />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#00F5D4"
            strokeWidth={2}
            fill="url(#gradCyan)"
            dot={false}
            activeDot={{ r: 5, fill: "#00F5D4", strokeWidth: 0, style: { filter: "drop-shadow(0 0 6px #00F5D4)" } }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#FF5E5B"
            strokeWidth={2}
            fill="url(#gradCoral)"
            dot={false}
            activeDot={{ r: 5, fill: "#FF5E5B", strokeWidth: 0, style: { filter: "drop-shadow(0 0 6px #FF5E5B)" } }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
