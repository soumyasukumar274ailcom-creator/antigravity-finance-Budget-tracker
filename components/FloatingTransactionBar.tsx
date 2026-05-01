"use client";

import { useRef, useState } from "react";
import {
  CURRENCIES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  INVESTMENT_CATEGORIES,
  Transaction,
  TransactionType,
} from "@/lib/types";
import { useApp } from "@/contexts/AppContext";
import { getTodayString, formatCurrency } from "@/lib/financeEngine";
import { ArrowDownLeft, ArrowUpRight, TrendingUp, X, Plus, ChevronDown, Search, CalendarDays } from "lucide-react";
import { toast } from "sonner";

interface FloatingTransactionBarProps {
  onAdd: (data: Omit<Transaction, "id" | "createdAt">) => void;
  onSuccess?: () => void;
}

const QUICK_CHIPS = ["Coffee", "Groceries", "Rent", "Salary", "Investment"];

/* ─── Date helpers ────────────────────────────────────────────────────────── */
function isoToDisplay(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
}
function displayToIso(display: string) {
  const [m, d, y] = display.split("/");
  if (!m || !d || !y) return "";
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}
function isValidDisplay(s: string) {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(s);
}

/* ─── Currency Picker Modal ───────────────────────────────────────────────── */
function CurrencyPicker({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (code: string) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const filtered = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(q.toLowerCase()) ||
      c.name.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="absolute bottom-full left-0 mb-2 w-64 glass border border-white/[0.12] rounded-2xl overflow-hidden shadow-2xl z-50">
      <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-white/[0.06]">
        <span className="text-xs font-semibold text-[var(--text-2)]">Select Currency</span>
        <button onClick={onClose}><X className="w-3.5 h-3.5 text-[var(--text-3)]" /></button>
      </div>
      <div className="p-2">
        <div className="flex items-center gap-2 bg-white/[0.05] rounded-lg px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-[var(--text-3)]" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="bg-transparent text-xs text-[var(--text-1)] placeholder:text-[var(--text-3)] outline-none w-full"
          />
        </div>
      </div>
      <div className="max-h-52 overflow-y-auto">
        {filtered.map((c) => (
          <button
            key={c.code}
            onClick={() => { onChange(c.code); onClose(); }}
            className={`w-full flex items-center gap-2 px-4 py-2 text-xs text-left hover:bg-white/[0.06] transition-colors ${c.code === value ? "text-[var(--lavender)] bg-[var(--lavender-dim)]" : "text-[var(--text-2)]"}`}
          >
            <span className="font-mono font-bold w-9 shrink-0">{c.code}</span>
            <span className="text-[var(--text-3)] w-5 shrink-0">{c.symbol}</span>
            <span className="truncate">{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export function FloatingTransactionBar({ onAdd }: FloatingTransactionBarProps) {
  const { currency: globalCurrency } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(globalCurrency);
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [displayDate, setDisplayDate] = useState(isoToDisplay(getTodayString()));
  const [note, setNote] = useState("");
  const [currencyPickerOpen, setCurrencyPickerOpen] = useState(false);
  const [successPulse, setSuccessPulse] = useState(false);

  const dateInputRef = useRef<HTMLInputElement>(null);

  const isIncome = type === "income";
  const isInvestment = type === "investment";
  const categories = isIncome
    ? INCOME_CATEGORIES
    : isInvestment
    ? INVESTMENT_CATEGORIES
    : EXPENSE_CATEGORIES;
  const accentColor = isIncome
    ? "var(--cyan)"
    : isInvestment
    ? "var(--amber)"
    : "var(--coral)";

  const selectedCurrency = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  // When type switches, reset category to first of that type
  const handleTypeSwitch = (t: TransactionType) => {
    setType(t);
    if (t === "income") setCategory(INCOME_CATEGORIES[0]);
    else if (t === "investment") setCategory(INVESTMENT_CATEGORIES[0]);
    else setCategory(EXPENSE_CATEGORIES[0]);
  };

  // Handle date manual typing in MM/DD/YYYY format
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
    if (val.length >= 6) val = val.slice(0, 5) + "/" + val.slice(5, 9);
    setDisplayDate(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) { toast.error("Enter a valid amount."); return; }
    const isoDate = displayToIso(displayDate);
    if (!isValidDisplay(displayDate) || !isoDate) { toast.error("Enter a valid date (MM/DD/YYYY)."); return; }

    onAdd({ type, amount: parsed, currency, category, note, date: isoDate });
    const msg = currency !== globalCurrency 
      ? `${isIncome ? "Income" : "Expense"} of ${selectedCurrency.symbol}${parsed.toFixed(2)} added! (≈ ${formatCurrency(parsed, globalCurrency)})`
      : `${isIncome ? "Income" : "Expense"} of ${selectedCurrency.symbol}${parsed.toFixed(2)} added!`;
    toast.success(msg);
    
    // Trigger pulse
    setSuccessPulse(true);
    setTimeout(() => setSuccessPulse(false), 600);

    // Reset
    setAmount("");
    setNote("");
    setDisplayDate(isoToDisplay(getTodayString()));
    setIsOpen(false);
    onSuccess?.();
  };

  const handleChipClick = (chip: string) => {
    setCategory(chip);
    if (chip === "Salary") setType("income");
    else if (chip === "Investment") setType("investment");
    else setType("expense");
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center pb-6 px-4 pointer-events-none">
        <div
          className="w-full max-w-2xl pointer-events-auto"
          style={{
            filter: isOpen ? `drop-shadow(0 0 40px color-mix(in srgb, ${accentColor} 30%, transparent))` : "none",
            transition: "filter 0.4s ease",
          }}
        >
          {/* Expanded Form */}
          {isOpen && (
            <form
              onSubmit={handleSubmit}
              className="glass border border-white/[0.1] rounded-2xl p-5 mb-3 space-y-4 animate-drift-in"
              style={{ borderColor: `color-mix(in srgb, ${accentColor} 25%, rgba(255,255,255,0.08))` }}
            >
              {/* Type Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex rounded-xl overflow-hidden border border-white/[0.08] p-0.5 gap-0.5">
                  <button
                    type="button"
                    id="type-expense-btn"
                    onClick={() => handleTypeSwitch("expense")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-xs font-semibold transition-all duration-300 ${
                      type === "expense"
                        ? "bg-[var(--coral-dim)] text-[var(--coral)]"
                        : "text-[var(--text-3)] hover:text-[var(--text-2)]"
                    }`}
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" /> Expense
                  </button>
                  <button
                    type="button"
                    id="type-income-btn"
                    onClick={() => handleTypeSwitch("income")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-xs font-semibold transition-all duration-300 ${
                      type === "income"
                        ? "bg-[var(--cyan-dim)] text-[var(--cyan)]"
                        : "text-[var(--text-3)] hover:text-[var(--text-2)]"
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" /> Income
                  </button>
                  <button
                    type="button"
                    id="type-investment-btn"
                    onClick={() => handleTypeSwitch("investment")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-xs font-semibold transition-all duration-300 ${
                      type === "investment"
                        ? "bg-[var(--amber-dim)] text-[var(--amber)]"
                        : "text-[var(--text-3)] hover:text-[var(--text-2)]"
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" /> Invest
                  </button>
                </div>
                <button type="button" onClick={() => setIsOpen(false)} className="p-1.5 text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Amount + Currency Row */}
              <div className="flex gap-2">
                {/* Currency Picker */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    id="txn-currency-btn"
                    onClick={() => setCurrencyPickerOpen((v) => !v)}
                    className="h-12 px-3 glass rounded-xl border-white/[0.08] flex items-center gap-1.5 text-sm hover:border-white/[0.14] transition-all"
                  >
                    <span className="font-mono font-bold text-[var(--lavender)]">{selectedCurrency.code}</span>
                    <ChevronDown className="w-3 h-3 text-[var(--text-3)]" />
                  </button>
                  {currencyPickerOpen && (
                    <CurrencyPicker
                      value={currency}
                      onChange={setCurrency}
                      onClose={() => setCurrencyPickerOpen(false)}
                    />
                  )}
                </div>

                {/* Amount */}
                <div className="relative flex-1">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-lg"
                    style={{ color: accentColor }}
                  >
                    {selectedCurrency.symbol}
                  </span>
                  <input
                    id="txn-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    autoFocus
                    className="w-full h-12 pl-10 pr-4 glass rounded-xl border border-white/[0.08] text-[var(--text-1)] text-lg font-bold placeholder:text-[var(--text-3)] outline-none focus:border-[var(--lavender)]/40 transition-colors"
                  />
                </div>
              </div>

              {/* Category + Date Row */}
              <div className="flex gap-2">
                {/* Category */}
                <div className="flex-1 relative">
                  <select
                    id="txn-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-3 glass rounded-xl border border-white/[0.08] text-[var(--text-1)] text-sm outline-none focus:border-[var(--lavender)]/40 transition-colors appearance-none cursor-pointer bg-transparent"
                    style={{ colorScheme: "dark" }}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-[#0D1220] text-[var(--text-1)]">{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-3)] pointer-events-none" />
                </div>

                {/* Date (manual MM/DD/YYYY + calendar icon) */}
                <div className="relative flex-1">
                  <input
                    id="txn-date-text"
                    type="text"
                    value={displayDate}
                    onChange={handleDateChange}
                    placeholder="MM/DD/YYYY"
                    maxLength={10}
                    className="w-full h-11 pl-3 pr-10 glass rounded-xl border border-white/[0.08] text-[var(--text-1)] text-sm outline-none focus:border-[var(--lavender)]/40 transition-colors placeholder:text-[var(--text-3)]"
                  />
                  {/* Hidden native date input triggered by calendar icon */}
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={displayToIso(displayDate)}
                    onChange={(e) => setDisplayDate(isoToDisplay(e.target.value))}
                    className="absolute inset-0 opacity-0 pointer-events-none"
                  />
                  <button
                    type="button"
                    onClick={() => dateInputRef.current?.showPicker?.()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--lavender)] transition-colors"
                    title="Open calendar"
                  >
                    <CalendarDays className="w-4 h-4" />
                  </button>
                </div>
              </div>

                <textarea
                  id="txn-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note… (optional)"
                  rows={1}
                  className="w-full px-4 py-2 glass rounded-xl border border-white/[0.08] text-[var(--text-1)] text-sm resize-none outline-none focus:border-[var(--lavender)]/40 transition-colors placeholder:text-[var(--text-3)]"
                />

                {/* Quick Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleChipClick(chip)}
                      className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${
                        category === chip
                          ? "bg-[var(--lavender-dim)] text-[var(--lavender)] border-[var(--lavender)]/30"
                          : "glass text-[var(--text-3)] border-white/[0.06] hover:border-white/[0.12] hover:text-[var(--text-2)]"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

              {/* Submit */}
              <button
                type="submit"
                id="txn-submit-btn"
                className="w-full h-12 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${accentColor} 0%, ${isIncome ? "#9B8EDF" : "#9B8EDF"} 100%)`,
                  color: "#0A0E14",
                  boxShadow: `0 8px 32px color-mix(in srgb, ${accentColor} 35%, transparent)`,
                }}
              >
                {isIncome ? "Add Income" : isInvestment ? "Log Investment" : "Add Expense"}
              </button>
            </form>
          )}

          {/* Collapsed Bar (always visible) */}
          {!isOpen && (
            <div
              className={`glass border border-white/[0.08] rounded-2xl px-5 py-3.5 flex items-center justify-between cursor-pointer hover:border-white/[0.14] transition-all duration-300 hover:-translate-y-1 ${
                successPulse ? "scale-[1.02] border-[var(--cyan)] shadow-[0_0_30px_var(--cyan-dim)]" : ""
              }`}
              onClick={() => setIsOpen(true)}
              id="txn-bar-collapsed"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `color-mix(in srgb, var(--lavender) 15%, transparent)` }}
                >
                  <Plus className="w-5 h-5" style={{ color: "var(--lavender)" }} />
                </div>
                <span className="text-[var(--text-2)] text-sm font-medium">Add transaction…</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] text-[var(--text-3)] glass rounded-lg px-2 py-1 border border-white/[0.06]">Income</span>
                <span className="text-[10px] text-[var(--text-3)] glass rounded-lg px-2 py-1 border border-white/[0.06]">Expense</span>
                <span className="text-[10px] text-[var(--text-3)] glass rounded-lg px-2 py-1 border border-white/[0.06]">Invest</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
