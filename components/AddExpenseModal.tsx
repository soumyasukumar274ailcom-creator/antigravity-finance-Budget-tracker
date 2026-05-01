"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, CATEGORY_ICONS, Category } from "@/lib/types";
import { getTodayString } from "@/lib/calculations";
import { toast } from "sonner";

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: { amount: number; category: string; note: string; date: string }) => void;
}

export function AddExpenseModal({ open, onClose, onAdd }: AddExpenseModalProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food & Dining");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(getTodayString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    onAdd({ amount: parsed, category, note, date });
    toast.success(`₹${parsed.toLocaleString("en-IN")} added!`);
    setAmount("");
    setNote("");
    setDate(getTodayString());
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#111118] border-[#1e1e2e] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Add Expense
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Amount */}
          <div className="space-y-1.5">
            <Label className="text-zinc-400 text-sm">Amount (₹)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">₹</span>
              <Input
                id="expense-amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 bg-[#0a0a0f] border-[#1e1e2e] text-white placeholder:text-zinc-600 focus:border-indigo-500 text-lg font-semibold h-12"
                autoFocus
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-zinc-400 text-sm">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger
                id="expense-category"
                className="bg-[#0a0a0f] border-[#1e1e2e] text-white h-11"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#111118] border-[#1e1e2e] text-white">
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c} className="focus:bg-indigo-500/20 focus:text-white">
                    {CATEGORY_ICONS[c]} {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label className="text-zinc-400 text-sm">Note (optional)</Label>
            <Input
              id="expense-note"
              placeholder="e.g. Lunch at office"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-[#0a0a0f] border-[#1e1e2e] text-white placeholder:text-zinc-600 focus:border-indigo-500 h-11"
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label className="text-zinc-400 text-sm">Date</Label>
            <Input
              id="expense-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-[#0a0a0f] border-[#1e1e2e] text-white focus:border-indigo-500 h-11"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-[#1e1e2e] text-zinc-400 bg-transparent hover:bg-[#1e1e2e] hover:text-white"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              id="expense-submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
            >
              Add Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
