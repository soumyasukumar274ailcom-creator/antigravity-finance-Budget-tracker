"use client";

import { useState } from "react";
import { Bill } from "@/lib/types";
import { formatCurrency, formatDateLabel, getTodayString } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface BillsPanelProps {
  bills: Bill[];
  onAdd: (data: Omit<Bill, "id">) => void;
  onDelete: (id: string) => void;
  onTogglePaid: (id: string) => void;
}

export function BillsPanel({ bills, onAdd, onDelete, onTogglePaid }: BillsPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const today = getTodayString();
  const currentYM = today.slice(0, 7);
  const thisMonthBills = bills.filter((b) => b.dueDate.startsWith(currentYM));
  const otherBills = bills.filter((b) => !b.dueDate.startsWith(currentYM));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!name.trim() || !parsed || !dueDate) {
      toast.error("Please fill all fields.");
      return;
    }
    onAdd({ name: name.trim(), amount: parsed, dueDate, isPaid: false, isRecurring: false });
    toast.success("Bill added!");
    setName("");
    setAmount("");
    setDueDate("");
    setShowForm(false);
  };

  return (
    <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e2e]">
        <div>
          <h2 className="text-white font-semibold text-base">Upcoming Bills</h2>
          <p className="text-zinc-600 text-xs mt-0.5">This month</p>
        </div>
        <Button
          id="add-bill-btn"
          variant="outline"
          size="sm"
          onClick={() => setShowForm((v) => !v)}
          className="border-[#1e1e2e] text-zinc-400 bg-transparent hover:bg-[#1e1e2e] hover:text-white h-8 text-xs gap-1.5"
        >
          {showForm ? <ChevronUp className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? "Close" : "Add Bill"}
        </Button>
      </div>

      {/* Add Bill Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="px-5 py-4 border-b border-[#1e1e2e] bg-[#0d0d14] space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-zinc-500 text-xs">Bill Name</Label>
              <Input
                id="bill-name"
                placeholder="e.g. Rent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#0a0a0f] border-[#1e1e2e] text-white placeholder:text-zinc-700 h-9 text-sm focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-zinc-500 text-xs">Amount (₹)</Label>
              <Input
                id="bill-amount"
                type="number"
                min="1"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-[#0a0a0f] border-[#1e1e2e] text-white placeholder:text-zinc-700 h-9 text-sm focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-zinc-500 text-xs">Due Date</Label>
            <Input
              id="bill-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-[#0a0a0f] border-[#1e1e2e] text-white h-9 text-sm focus:border-indigo-500"
            />
          </div>
          <Button
            id="bill-submit"
            type="submit"
            className="w-full h-9 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium"
          >
            Save Bill
          </Button>
        </form>
      )}

      {/* Bill List */}
      <div className="divide-y divide-[#1e1e2e]">
        {bills.length === 0 && (
          <p className="text-zinc-600 text-sm text-center py-8">
            No bills added yet. Hit &quot;Add Bill&quot; above.
          </p>
        )}

        {thisMonthBills.map((bill) => (
          <BillRow
            key={bill.id}
            bill={bill}
            onTogglePaid={onTogglePaid}
            onDelete={onDelete}
            isCurrentMonth
          />
        ))}

        {otherBills.length > 0 && (
          <>
            <div className="px-5 py-2 bg-[#0d0d14]">
              <p className="text-zinc-600 text-xs font-medium uppercase tracking-widest">Other Months</p>
            </div>
            {otherBills.map((bill) => (
              <BillRow key={bill.id} bill={bill} onTogglePaid={onTogglePaid} onDelete={onDelete} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function BillRow({
  bill,
  onTogglePaid,
  onDelete,
  isCurrentMonth,
}: {
  bill: Bill;
  onTogglePaid: (id: string) => void;
  onDelete: (id: string) => void;
  isCurrentMonth?: boolean;
}) {
  const today = getTodayString();
  const isOverdue = !bill.isPaid && bill.dueDate < today;

  return (
    <div className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${bill.isPaid ? "opacity-50" : ""}`}>
      {/* Paid toggle */}
      <button
        onClick={() => onTogglePaid(bill.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          bill.isPaid
            ? "bg-emerald-500 border-emerald-500"
            : "border-zinc-600 hover:border-emerald-500"
        }`}
        title={bill.isPaid ? "Mark unpaid" : "Mark paid"}
      >
        {bill.isPaid && <Check className="w-3 h-3 text-white" />}
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${bill.isPaid ? "line-through text-zinc-600" : "text-white"}`}>
          {bill.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-zinc-600">{formatDateLabel(bill.dueDate)}</span>
          {isOverdue && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">Overdue</Badge>
          )}
          {isCurrentMonth && !bill.isPaid && !isOverdue && (
            <Badge className="text-[10px] px-1.5 py-0 h-4 bg-indigo-500/20 text-indigo-400 border-indigo-500/20">
              Due soon
            </Badge>
          )}
        </div>
      </div>

      {/* Amount */}
      <span className={`text-sm font-semibold flex-shrink-0 ${bill.isPaid ? "text-zinc-600" : "text-white"}`}>
        {formatCurrency(bill.amount)}
      </span>

      {/* Delete */}
      <button
        onClick={() => { onDelete(bill.id); toast.success("Bill removed."); }}
        className="text-zinc-700 hover:text-red-400 transition-colors flex-shrink-0"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
