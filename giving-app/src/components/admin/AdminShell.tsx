"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, Avatar, Tooltip } from "@/components/ui";
import {
  LayoutGrid,
  Award,
  Users,
  Settings,
  ChevronDown,
  ArrowLeft,
  PanelLeft,
  GraduationCap,
  Wallet,
  BarChart3,
  Clipboard,
  LogOut,
  BookOpen,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutGrid size={18} /> },
  { href: "/admin/programs", label: "Programs", icon: <Award size={18} /> },
  { href: "/admin/employees", label: "Employees", icon: <Users size={18} /> },
  { href: "/admin/nominations", label: "Nominations", icon: <Clipboard size={18} /> },
  { href: "/admin/scholars", label: "Scholars", icon: <GraduationCap size={18} /> },
  { href: "/admin/disbursements", label: "Disbursements", icon: <Wallet size={18} /> },
  { href: "/admin/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
];

function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let path = "";

  for (const seg of segments) {
    path += "/" + seg;
    let label = seg.charAt(0).toUpperCase() + seg.slice(1);
    if (seg === "admin") label = "Admin";
    else if (seg === "programs") label = "Programs";
    else if (seg === "employees") label = "Employees";
    else if (seg === "nominations") label = "Nominations";
    else if (seg === "scholars") label = "Scholars";
    else if (seg === "disbursements") label = "Disbursements";
    else if (seg === "analytics") label = "Analytics";
    else if (seg === "settings") label = "Settings";
    else if (seg === "new") label = "New";
    crumbs.push({ label, href: path });
  }
  return crumbs;
}

interface AdminShellProps {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}

export function AdminShell({ children, userName, userEmail }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const breadcrumbs = getBreadcrumbs(pathname);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col shrink-0 bg-sidebar border-r border-sidebar-border transition-[width] duration-200 ease-in-out overflow-hidden",
          collapsed ? "w-[68px]" : "w-[228px]"
        )}
      >
        {/* Logo zone */}
        <div className="flex items-center gap-3 h-16 px-4 border-b border-sidebar-border shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0">
            <BookOpen size={16} className="text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-[13px] font-bold text-foreground leading-tight">Buddy4Study</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Admin Portal</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Tooltip key={item.href} label={item.label} show={collapsed}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--radius-lg)] px-3 h-9 text-[13px] font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom user */}
        <div className="border-t border-sidebar-border p-3 shrink-0">
          <div className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
            <Avatar name={userName} size={32} className="shrink-0" />
            {!collapsed && (
              <div className="overflow-hidden flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-foreground truncate">{userName}</p>
                <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-3 h-16 px-5 bg-surface border-b border-border shrink-0">
          <Button
            variant="ghostNeutral"
            size="iconSm"
            onClick={() => setCollapsed((c) => !c)}
            className="shrink-0"
          >
            <PanelLeft size={17} />
          </Button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-[13px] flex-1 min-w-0">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={crumb.href}>
                {i > 0 && (
                  <ChevronDown
                    size={13}
                    className="text-muted-foreground rotate-[-90deg] shrink-0"
                  />
                )}
                {i === breadcrumbs.length - 1 ? (
                  <span className="font-semibold text-foreground truncate">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0 relative">
            <Button
              variant="ghostNeutral"
              size="sm"
              onClick={() => router.push("/programs")}
              className="gap-1.5 text-[13px]"
            >
              <ArrowLeft size={14} />
              Employee View
            </Button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 h-9 px-2 rounded-[var(--radius-lg)] hover:bg-surface-muted transition-colors"
              >
                <Avatar name={userName} size={28} />
                <span className="text-[13px] font-medium text-foreground hidden sm:block max-w-[120px] truncate">
                  {userName}
                </span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-44 bg-surface border border-border rounded-[var(--radius-lg)] shadow-md z-50 py-1 animate-scale-in">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-destructive hover:bg-destructive-soft transition-colors"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1180px] mx-auto px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
