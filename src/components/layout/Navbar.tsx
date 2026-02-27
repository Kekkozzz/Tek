"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/interview", label: "Intervista" },
  { href: "/history", label: "Cronologia" },
  { href: "/topics", label: "Argomenti" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();

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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
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

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="cursor-pointer md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-bg-elevated transition-colors"
          aria-label="Menu"
        >
          <svg className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* User area (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {authLoading ? (
            <div className="h-8 w-8 rounded-full bg-bg-elevated animate-pulse" />
          ) : user ? (
            <>
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="h-8 w-8 rounded-full border border-border"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <span className="font-mono text-xs text-accent">
                    {(user.email?.[0] || "U").toUpperCase()}
                  </span>
                </div>
              )}
              <button
                onClick={signOut}
                className="cursor-pointer font-mono text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                Esci
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="font-mono text-sm text-accent hover:text-accent/80 transition-colors"
            >
              Accedi
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-bg-primary/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    block px-4 py-3 rounded-lg font-mono text-sm tracking-wide transition-all
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
            <div className="border-t border-border mt-2 pt-2">
              {user ? (
                <button
                  onClick={() => { setMobileOpen(false); signOut(); }}
                  className="cursor-pointer block w-full text-left px-4 py-3 rounded-lg font-mono text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all"
                >
                  Esci
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg font-mono text-sm text-accent hover:bg-bg-elevated transition-all"
                >
                  Accedi
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
