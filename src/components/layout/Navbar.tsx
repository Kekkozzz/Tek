"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/interview", label: "Intervista" },
  { href: "/history", label: "Cronologia" },
  { href: "/topics", label: "Argomenti" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 group-hover:glow-border transition-all duration-300">
            <span className="font-mono text-sm font-bold text-accent">T</span>
          </div>
          <span className="font-display text-lg font-semibold text-text-primary tracking-tight">
            Tek<span className="text-accent">Interview</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-4 py-2 rounded-lg font-mono text-sm tracking-wide transition-all duration-200
                  ${
                    isActive
                      ? "text-accent bg-accent/10 border border-accent/20"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* User area */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-bg-elevated border border-border flex items-center justify-center">
            <span className="font-mono text-xs text-text-secondary">U</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
