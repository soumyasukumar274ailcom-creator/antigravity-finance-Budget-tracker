"use client";

import { LayoutDashboard, ArrowLeftRight, BarChart3, Settings } from "lucide-react";

const ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "#dashboard" },
  { icon: ArrowLeftRight,  label: "Txns",      href: "#transactions" },
  { icon: BarChart3,       label: "Analytics",  href: "#analytics" },
];

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 glass border-t border-white/[0.06] safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {ITEMS.map(({ icon: Icon, label, href }) => (
          <a
            key={href}
            href={href}
            id={`bottom-nav-${label.toLowerCase()}`}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-[var(--text-3)] hover:text-[var(--lavender)] transition-colors"
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
