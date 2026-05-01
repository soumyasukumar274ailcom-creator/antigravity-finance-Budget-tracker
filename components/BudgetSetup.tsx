"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/calculations";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

interface BudgetSetupProps {
  monthlyBudget: number;
  onSave: (amount: number) => void;
}

export function BudgetSetup({ monthlyBudget, onSave }: BudgetSetupProps) {
  const [editing, setEditing] = useState(monthlyBudget === 0);
  const [value, setValue] = useState(monthlyBudget > 0 ? String(monthlyBudget) : "");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(value);
    if (!parsed || parsed <= 0) {
      toast.error("Enter a valid budget amount.");
      return;
    }
    onSave(parsed);
    setEditing(false);
    toast.success(`Monthly budget set to ${formatCurrency(parsed)}`);
  };

  if (!editing) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-[#111118] border border-[#1e1e2e] px-5 py-3.5">
        <div>
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Monthly Budget</p>
          <p className="text-white font-bold text-xl mt-0.5">{formatCurrency(monthlyBudget)}</p>
        </div>
        <Button
          id="edit-budget-btn"
          variant="outline"
          size="sm"
          onClick={() => { setValue(String(monthlyBudget)); setEditing(true); }}
          className="border-[#1e1e2e] text-zinc-400 bg-transparent hover:bg-[#1e1e2e] hover:text-white h-8 gap-1.5 text-xs"
        >
          <Pencil className="w-3.5 h-3.5" /> Edit
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="rounded-xl bg-[#111118] border border-indigo-500/30 px-5 py-4 space-y-3">
      <Label className="text-zinc-400 text-sm font-medium">Set Monthly Budget (₹)</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">₹</span>
          <Input
            id="budget-input"
            type="number"
            min="1"
            step="1"
            placeholder="50000"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="pl-7 bg-[#0a0a0f] border-[#1e1e2e] text-white placeholder:text-zinc-700 focus:border-indigo-500 h-11 text-lg font-semibold"
            autoFocus
          />
        </div>
        <Button
          id="budget-save-btn"
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-11 px-5"
        >
          Save
        </Button>
      </div>
      <p className="text-zinc-600 text-xs">
        This is your total spending limit for the current month.
      </p>
    </form>
  );
}
