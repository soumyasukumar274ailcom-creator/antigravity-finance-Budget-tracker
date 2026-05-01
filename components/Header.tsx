"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { CURRENCIES } from "@/lib/types";
import { formatCurrency } from "@/lib/financeEngine";
import { Eye, EyeOff, Search, ChevronDown, TrendingUp, Sun, Moon } from "lucide-react";

interface HeaderProps {
  netWorth: number;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function Header({ netWorth }: HeaderProps) {
  const { currency, setCurrency, isGhostMode, toggleGhostMode, theme, toggleTheme } = useApp();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [displayWorth, setDisplayWorth] = useState(netWorth);

  // Smooth ticker animation
  useEffect(() => {
    setDisplayWorth(netWorth);
  }, [netWorth]);

  const filtered = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );
  const selected = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];
  const isPositive = displayWorth >= 0;

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.05] bg-background/70 backdrop-blur-2xl">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        {/* Left: Greeting */}
        <div className="hidden sm:block">
          <p className="text-xs text-[var(--text-3)] font-medium">{getGreeting()}</p>
          <h1 className="text-base font-bold text-[var(--text-1)] leading-tight">Your Financial Overview</h1>
        </div>

        {/* Center: Net Worth Ticker */}
        <div className="flex items-center gap-3 glass rounded-2xl px-6 py-3 border-white/[0.1] shadow-2xl">
          <TrendingUp className="w-5 h-5 text-[var(--cyan)] shrink-0 glow-cyan" />
          <div>
            <p className="text-[10px] text-[var(--text-2)] tracking-[0.15em] uppercase font-bold opacity-80">Total Net Worth</p>
            <p
              className={`font-black text-2xl leading-tight ghost-val animate-ticker glow-north-star ${isPositive ? "text-[var(--cyan)]" : "text-[var(--coral)]"}`}
              key={displayWorth}
            >
              {isPositive ? "+" : ""}{formatCurrency(displayWorth, currency)}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Currency Dropdown */}
          <div className="relative">
            <button
              id="header-currency-btn"
              onClick={() => setCurrencyOpen((v) => !v)}
              className="flex items-center gap-1.5 glass rounded-xl px-3 py-2 text-sm font-medium text-[var(--text-1)] hover:border-white/[0.14] transition-all"
            >
              <span className="font-mono font-bold text-[var(--lavender)]">{selected.code}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-3)] transition-transform ${currencyOpen ? "rotate-180" : ""}`} />
            </button>

            {currencyOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 glass border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl z-50">
                <div className="p-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2 bg-white/[0.05] rounded-lg px-3 py-2">
                    <Search className="w-3.5 h-3.5 text-[var(--text-3)]" />
                    <input
                      autoFocus
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search ISO code or name…"
                      className="bg-transparent text-xs text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none w-full"
                    />
                  </div>
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {filtered.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => { setCurrency(c.code); setCurrencyOpen(false); setSearch(""); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs text-left hover:bg-white/[0.06] transition-colors ${c.code === currency ? "text-[var(--lavender)] bg-[var(--lavender-dim)]" : "text-[var(--text-2)]"}`}
                    >
                      <span className="font-mono font-bold w-10 shrink-0">{c.code}</span>
                      <span className="text-[var(--text-3)] w-6 shrink-0">{c.symbol}</span>
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-xl glass text-[var(--text-2)] hover:text-[var(--text-1)] transition-all"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Ghost Mode */}
          <button
            id="header-ghost-btn"
            onClick={toggleGhostMode}
            title={isGhostMode ? "Disable Ghost Mode" : "Enable Ghost Mode"}
            className={`p-2 rounded-xl transition-all duration-300 ${
              isGhostMode
                ? "bg-[var(--lavender-dim)] text-[var(--lavender)] border border-[var(--lavender)]/30"
                : "glass text-[var(--text-2)] hover:text-[var(--text-1)]"
            }`}
          >
            {isGhostMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
