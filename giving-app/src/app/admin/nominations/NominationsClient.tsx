"use client";

import React, { useState, useMemo } from "react";
import { cn, NOMINATION_STATUS_LABEL, NOMINATION_STATUS_TONE } from "@/lib/utils";
import { Button, Card, Badge, Avatar, Input } from "@/components/ui";
import {
  Search,
  X,
  Mail,
  Phone,
  CheckCircle,
  Star,
  AlertCircle,
  Clock,
  Building,
} from "lucide-react";

type Nomination = {
  id: string;
  nomineeName: string;
  nomineeEmail: string;
  nomineePhone: string;
  relationship: string;
  reason: string;
  status: string;
  createdAt: Date;
  user: { id: string; name: string; email: string; department: string };
  program: { id: string; name: string };
};

const STATUS_OPTIONS = ["All", "SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "SELECTED", "NOT_SELECTED"];

export function NominationsClient({ initialNominations }: { initialNominations: Nomination[] }) {
  const [nominations, setNominations] = useState(initialNominations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Nomination | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = useMemo(() => {
    return nominations.filter((n) => {
      const matchStatus = statusFilter === "All" || n.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        n.nomineeName.toLowerCase().includes(q) ||
        n.user.name.toLowerCase().includes(q) ||
        n.program.name.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [nominations, search, statusFilter]);

  async function updateStatus(id: string, newStatus: string) {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/nominations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setNominations((prev) =>
          prev.map((n) => (n.id === id ? { ...n, status: newStatus } : n))
        );
        setSelected((prev) => (prev?.id === id ? { ...prev, status: newStatus } : prev));
      }
    } finally {
      setActionLoading(false);
    }
  }

  const statusFilterLabels: Record<string, string> = {
    All: "All",
    SUBMITTED: "Pending",
    UNDER_REVIEW: "Under Review",
    SHORTLISTED: "Shortlisted",
    SELECTED: "Selected",
    NOT_SELECTED: "Rejected",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nominations</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Review and process scholarship nominations
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search nominations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "h-8 px-3 rounded-full text-[12.5px] font-medium transition-colors",
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              )}
            >
              {statusFilterLabels[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-5">
        {/* Table */}
        <Card className={cn("overflow-hidden flex-1", selected ? "hidden lg:block" : "")}>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  {["Nominee", "Nominated By", "Program", "Date", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground text-[12px] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground text-sm">
                      No nominations found
                    </td>
                  </tr>
                )}
                {filtered.map((nom) => (
                  <tr
                    key={nom.id}
                    onClick={() => setSelected(nom)}
                    className={cn(
                      "hover:bg-surface-muted/50 transition-colors cursor-pointer",
                      selected?.id === nom.id && "bg-primary/5"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={nom.nomineeName} size={30} />
                        <div>
                          <p className="font-medium text-foreground">{nom.nomineeName}</p>
                          <p className="text-helper">{nom.relationship}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-foreground">{nom.user.name}</p>
                      <p className="text-helper">{nom.user.department}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[160px] truncate">
                      {nom.program.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(nom.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={NOMINATION_STATUS_TONE[nom.status] as "muted" | "success" | "warning" | "destructive" | "info"}>
                        {NOMINATION_STATUS_LABEL[nom.status] ?? nom.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); setSelected(nom); }}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Detail panel */}
        {selected && (
          <Card className="w-full lg:w-[380px] shrink-0 overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border sticky top-0 bg-card z-10">
              <span className="font-semibold text-[14px]">Nomination Review</span>
              <button
                onClick={() => setSelected(null)}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-muted text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-250px)]">
              {/* Nominee */}
              <div>
                <p className="text-eyebrow mb-2">Nominee</p>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={selected.nomineeName} size={44} />
                  <div>
                    <p className="font-semibold text-[15px] text-foreground">{selected.nomineeName}</p>
                    <Badge tone={NOMINATION_STATUS_TONE[selected.status] as "muted" | "success" | "warning" | "destructive" | "info"}>
                      {NOMINATION_STATUS_LABEL[selected.status] ?? selected.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <Mail size={13} className="shrink-0" />{selected.nomineeEmail}
                  </div>
                  {selected.nomineePhone && (
                    <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                      <Phone size={13} className="shrink-0" />{selected.nomineePhone}
                    </div>
                  )}
                </div>
              </div>

              {/* Nominated by */}
              <div>
                <p className="text-eyebrow mb-2">Nominated By</p>
                <div className="flex items-center gap-2.5">
                  <Avatar name={selected.user.name} size={32} />
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{selected.user.name}</p>
                    <p className="text-helper flex items-center gap-1">
                      <Building size={11} className="shrink-0" />
                      {selected.user.department} · {selected.relationship}
                    </p>
                  </div>
                </div>
              </div>

              {/* Program */}
              <div>
                <p className="text-eyebrow mb-1">Program</p>
                <p className="text-[13px] font-medium text-foreground">{selected.program.name}</p>
              </div>

              {/* Reason */}
              <div>
                <p className="text-eyebrow mb-2">Reason for Nomination</p>
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/15">
                  <p className="text-[13px] text-foreground leading-relaxed">{selected.reason}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-1.5 text-helper">
                <Clock size={12} />
                Submitted {new Date(selected.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-border space-y-2">
                <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Update Status
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionLoading || selected.status === "UNDER_REVIEW"}
                    onClick={() => updateStatus(selected.id, "UNDER_REVIEW")}
                    className="gap-1.5 text-[12px]"
                  >
                    <Clock size={13} />
                    Under Review
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionLoading || selected.status === "SHORTLISTED"}
                    onClick={() => updateStatus(selected.id, "SHORTLISTED")}
                    className="gap-1.5 text-[12px] border-warning/30 text-warning hover:bg-warning-soft"
                  >
                    <Star size={13} />
                    Shortlist
                  </Button>
                  <Button
                    size="sm"
                    disabled={actionLoading || selected.status === "SELECTED"}
                    onClick={() => updateStatus(selected.id, "SELECTED")}
                    className="gap-1.5 text-[12px] bg-success hover:bg-success/90"
                  >
                    <CheckCircle size={13} />
                    Select
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={actionLoading || selected.status === "NOT_SELECTED"}
                    onClick={() => updateStatus(selected.id, "NOT_SELECTED")}
                    className="gap-1.5 text-[12px]"
                  >
                    <AlertCircle size={13} />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
