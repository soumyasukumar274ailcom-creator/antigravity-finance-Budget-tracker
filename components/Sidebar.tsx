"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/contexts/AppContext";
import { CURRENCIES } from "@/lib/types";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  Search,
  Zap,
} from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",    href: "#dashboard" },
  { icon: ArrowLeftRight,  label: "Transactions",  href: "#transactions" },
  { icon: BarChart3,       label: "Analytics",     href: "#analytics" },
];

export function Sidebar() {
  const { currency, setCurrency, isGhostMode, toggleGhostMode } = useApp();
  const [activeHref, setActiveHref] = useState("#dashboard");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selected = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen sticky top-0 shrink-0 border-r border-white/[0.06] bg-[var(--bg-surface)]/80 backdrop-blur-xl overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 pt-8 pb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#9B8EDF] to-[#00F5D4] shadow-lg">
          <Zap className="w-5 h-5 text-[#0A0E14]" fill="currentColor" />
        </div>
        <div>
          <p className="font-bold text-sm text-[#E8F0FF] tracking-tight">Antigravity</p>
          <p className="text-[10px] text-[var(--text-3)] tracking-widest">FINANCE OS</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV.map(({ icon: Icon, label, href }) => {
          const active = activeHref === href;
          return (
            <a
              key={href}
              href={href}
              id={`nav-${label.toLowerCase()}`}
              onClick={() => setActiveHref(href)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-[var(--lavender-dim)] text-[var(--lavender)] border border-[var(--lavender)]/20"
                  : "text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.05]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </a>
          );
        })}
      </nav>

      {/* Currency Selector */}
      <div className="px-3 pb-4 relative">
        <p className="text-[10px] font-semibold tracking-widest text-[var(--text-3)] uppercase px-3 mb-2">
          Display Currency
        </p>
        <button
          id="sidebar-currency-btn"
          onClick={() => setCurrencyOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl glass border-white/[0.08] text-sm text-[var(--text-1)] hover:border-white/[0.14] transition-all"
        >
          <span className="font-mono font-semibold text-[var(--lavender)]">{selected.code}</span>
          <span className="text-[var(--text-2)] text-xs truncate mx-2">{selected.symbol} {selected.name.split(" ")[0]}</span>
          <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-[var(--text-3)] transition-transform ${currencyOpen ? "rotate-180" : ""}`} />
        </button>

        {currencyOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 glass border border-white/[0.1] rounded-xl overflow-hidden shadow-2xl z-50">
            <div className="p-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 bg-white/[0.05] rounded-lg px-3 py-1.5">
                <Search className="w-3.5 h-3.5 text-[var(--text-3)]" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search currency…"
                  className="bg-transparent text-xs text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none w-full"
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c.code}
                  onClick={() => { setCurrency(c.code); setCurrencyOpen(false); setSearch(""); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs text-left hover:bg-white/[0.06] transition-colors ${c.code === currency ? "text-[var(--lavender)]" : "text-[var(--text-2)]"}`}
                >
                  <span className="font-mono font-bold w-10">{c.code}</span>
                  <span className="text-[var(--text-3)]">{c.symbol}</span>
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ghost Mode */}
      <div className="px-3 pb-6">
        <button
          id="ghost-mode-btn"
          onClick={toggleGhostMode}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
            isGhostMode
              ? "bg-[var(--lavender-dim)] text-[var(--lavender)] border border-[var(--lavender)]/30"
              : "text-[var(--text-2)] hover:bg-white/[0.05] hover:text-[var(--text-1)]"
          }`}
        >
          {isGhostMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          Ghost Mode
          {isGhostMode && (
            <span className="ml-auto text-[10px] bg-[var(--lavender)]/20 text-[var(--lavender)] px-1.5 py-0.5 rounded-full">ON</span>
          )}
        </button>
      </div>
    </aside>
  );
}
