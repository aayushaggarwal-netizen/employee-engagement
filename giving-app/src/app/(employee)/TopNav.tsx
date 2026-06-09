"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, Button } from "@/components/ui";
import { Menu, X, Gift, Heart, GraduationCap, User, LogOut, ChevronRight } from "lucide-react";

interface NavUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
}

export default function TopNav({ user }: { user: NavUser }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const navLinks = [
    { href: "/programs", label: "Programmes", icon: Gift },
    { href: "/my-donations", label: "My donations", icon: Heart },
    { href: "/my-nominations", label: "My nominations", icon: User },
    { href: "/my-scholars", label: "Scholars", icon: GraduationCap },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-surface border-b border-border flex items-center px-4 sm:px-6">
        <div className="flex items-center justify-between w-full max-w-[var(--page-max)] mx-auto">
          {/* Logo */}
          <Link href="/programs" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-semibold text-foreground hidden sm:block">Buddy4Study Foundation</span>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* User info (hidden on mobile) */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-foreground leading-none">{user.name}</span>
              <span className="text-helper leading-none mt-0.5">{user.department}</span>
            </div>

            <Avatar name={user.name} size={36} />

            <Button
              variant="ghostNeutral"
              size="iconSm"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Overlay menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          style={{ background: "hsl(222 25% 14% / 0.35)" }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) setMenuOpen(false); }}
        >
          <div className="bg-surface w-72 h-full shadow-lg animate-scale-in flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <Avatar name={user.name} size={36} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="text-helper">{user.department}</p>
                </div>
              </div>
              <Button variant="ghostNeutral" size="iconSm" onClick={() => setMenuOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 p-3 space-y-0.5">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-surface-muted transition-colors"
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  {label}
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                </Link>
              ))}
            </nav>

            {/* Sign out */}
            <div className="p-3 border-t border-border">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive-soft transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
