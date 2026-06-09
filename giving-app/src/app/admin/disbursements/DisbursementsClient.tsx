"use client";

import React, { useState, useMemo } from "react";
import { cn, formatINR, formatLakh, DISBURSEMENT_STATUS_LABEL } from "@/lib/utils";
import { Button, Card, Badge, IconTile, Modal, Field, Input, NativeSelect } from "@/components/ui";
import {
  Wallet,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  X,
  Filter,
} from "lucide-react";

type Disbursement = {
  id: string;
  tranche: number;
  amount: number;
  scheduledDate: Date;
  status: string;
  note: string | null;
  scholar: { id: string; name: string };
  program: { id: string; name: string };
};

type Scholar = { id: string; name: string };
type Program = { id: string; name: string };

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { tone: "muted" | "success" | "warning" | "info" }> = {
    SCHEDULED: { tone: "muted" },
    RELEASED: { tone: "warning" },
    CONFIRMED: { tone: "success" },
  };
  const cfg = map[status] ?? { tone: "muted" };
  return <Badge tone={cfg.tone}>{DISBURSEMENT_STATUS_LABEL[status] ?? status}</Badge>;
}

interface Props {
  disbursements: Disbursement[];
  scholars: Scholar[];
  programs: Program[];
  totalDisbursed: number;
  upcomingThisMonth: number;
}

export function DisbursementsClient({
  disbursements: initial,
  scholars,
  programs,
  totalDisbursed,
  upcomingThisMonth,
}: Props) {
  const [disbursements, setDisbursements] = useState(initial);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    scholarId: "",
    programId: "",
    amount: "",
    scheduledDate: "",
    note: "",
    tranche: "1",
  });
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (statusFilter === "All") return disbursements;
    return disbursements.filter((d) => d.status === statusFilter);
  }, [disbursements, statusFilter]);

  async function markReleased(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/disbursements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RELEASED" }),
      });
      if (res.ok) {
        setDisbursements((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status: "RELEASED" } : d))
        );
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault();
    setScheduleLoading(true);
    try {
      const res = await fetch("/api/admin/disbursements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarId: scheduleForm.scholarId,
          programId: scheduleForm.programId,
          amount: parseInt(scheduleForm.amount),
          scheduledDate: scheduleForm.scheduledDate,
          note: scheduleForm.note,
          tranche: parseInt(scheduleForm.tranche),
        }),
      });
      if (res.ok) {
        const newDisb = await res.json();
        setDisbursements((prev) => [newDisb, ...prev]);
        setShowScheduleModal(false);
        setScheduleForm({ scholarId: "", programId: "", amount: "", scheduledDate: "", note: "", tranche: "1" });
      }
    } finally {
      setScheduleLoading(false);
    }
  }

  const STATUS_OPTIONS = ["All", "SCHEDULED", "RELEASED", "CONFIRMED"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Disbursements</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track and manage scholarship disbursements
          </p>
        </div>
        <Button size="sm" onClick={() => setShowScheduleModal(true)} className="gap-1.5">
          <Plus size={14} />
          Schedule Disbursement
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-helper mb-1">Total Disbursed</p>
              <p className="text-2xl font-bold text-foreground">{formatLakh(totalDisbursed)}</p>
              <p className="text-helper mt-0.5">Across all programs</p>
            </div>
            <IconTile size={44} tone="success">
              <CheckCircle size={20} />
            </IconTile>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-helper mb-1">Upcoming This Month</p>
              <p className="text-2xl font-bold text-foreground">{formatLakh(upcomingThisMonth)}</p>
              <p className="text-helper mt-0.5">Scheduled disbursements</p>
            </div>
            <IconTile size={44} tone="warning">
              <Calendar size={20} />
            </IconTile>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-muted-foreground" />
        <div className="flex items-center gap-1.5">
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
              {s === "All" ? "All" : DISBURSEMENT_STATUS_LABEL[s] ?? s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                {["Scholar", "Program", "Tranche", "Amount", "Scheduled Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground text-[12px] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground text-sm">
                    No disbursements found
                  </td>
                </tr>
              )}
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-surface-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{d.scholar.name}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[160px] truncate">{d.program.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                      {d.tranche}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground">{formatINR(d.amount)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(d.scheduledDate).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-3">
                    {d.status === "SCHEDULED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading === d.id}
                        onClick={() => markReleased(d.id)}
                        className="gap-1.5 text-[12px] h-8"
                      >
                        <Wallet size={12} />
                        {actionLoading === d.id ? "…" : "Mark Released"}
                      </Button>
                    )}
                    {d.status === "RELEASED" && (
                      <span className="text-helper flex items-center gap-1">
                        <Clock size={11} />
                        Awaiting confirmation
                      </span>
                    )}
                    {d.status === "CONFIRMED" && (
                      <span className="text-helper flex items-center gap-1 text-success">
                        <CheckCircle size={11} />
                        Confirmed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Schedule modal */}
      <Modal open={showScheduleModal} onClose={() => setShowScheduleModal(false)} className="sm:max-w-[480px]">
        <form onSubmit={handleSchedule} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold">Schedule Disbursement</h2>
            <button
              type="button"
              onClick={() => setShowScheduleModal(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>

          <Field label="Scholar" htmlFor="schId">
            <NativeSelect
              id="schId"
              required
              value={scheduleForm.scholarId}
              onChange={(e) => setScheduleForm((f) => ({ ...f, scholarId: e.target.value }))}
              placeholder="Select scholar"
            >
              {scholars.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </NativeSelect>
          </Field>

          <Field label="Program" htmlFor="progId">
            <NativeSelect
              id="progId"
              required
              value={scheduleForm.programId}
              onChange={(e) => setScheduleForm((f) => ({ ...f, programId: e.target.value }))}
              placeholder="Select program"
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </NativeSelect>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount (₹)" htmlFor="disbAmount">
              <Input
                id="disbAmount"
                type="number"
                required
                placeholder="e.g. 25000"
                value={scheduleForm.amount}
                onChange={(e) => setScheduleForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </Field>
            <Field label="Tranche #" htmlFor="trancheNum">
              <Input
                id="trancheNum"
                type="number"
                min="1"
                required
                value={scheduleForm.tranche}
                onChange={(e) => setScheduleForm((f) => ({ ...f, tranche: e.target.value }))}
              />
            </Field>
          </div>

          <Field label="Scheduled Date" htmlFor="disbDate">
            <Input
              id="disbDate"
              type="date"
              required
              value={scheduleForm.scheduledDate}
              onChange={(e) => setScheduleForm((f) => ({ ...f, scheduledDate: e.target.value }))}
            />
          </Field>

          <Field label="Note" htmlFor="disbNote" optional>
            <Input
              id="disbNote"
              placeholder="Optional note"
              value={scheduleForm.note}
              onChange={(e) => setScheduleForm((f) => ({ ...f, note: e.target.value }))}
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={scheduleLoading}>
              {scheduleLoading ? "Scheduling…" : "Schedule"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
