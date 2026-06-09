"use client";

import React, { useState } from "react";
import { cn, formatINR, formatLakh, DISBURSEMENT_STATUS_LABEL } from "@/lib/utils";
import { Button, Card, Badge, Avatar, Progress } from "@/components/ui";
import {
  GraduationCap,
  MapPin,
  BookOpen,
  X,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Wallet,
} from "lucide-react";

type Disbursement = {
  id: string;
  tranche: number;
  amount: number;
  scheduledDate: Date;
  status: string;
  note: string | null;
  releasedAt: Date | null;
};

type Scholar = {
  id: string;
  name: string;
  college: string;
  course: string;
  year: string;
  hometown: string;
  totalAmount: number;
  disbursedAmount: number;
  nextDisbursement: Date | null;
  utilizationStatus: string;
  notes: string | null;
  program: { id: string; name: string };
  disbursements: Disbursement[];
};

function UtilizationBadge({ status }: { status: string }) {
  if (status.toLowerCase().includes("good") || status.toLowerCase().includes("on track")) {
    return <Badge tone="success">{status}</Badge>;
  }
  if (status.toLowerCase().includes("pending")) {
    return <Badge tone="warning">{status}</Badge>;
  }
  return <Badge tone="muted">{status}</Badge>;
}

function DisbursementStatusBadge({ status }: { status: string }) {
  const map: Record<string, { tone: "muted" | "success" | "warning" | "info" }> = {
    SCHEDULED: { tone: "muted" },
    RELEASED: { tone: "warning" },
    CONFIRMED: { tone: "success" },
  };
  const cfg = map[status] ?? { tone: "muted" };
  return <Badge tone={cfg.tone}>{DISBURSEMENT_STATUS_LABEL[status] ?? status}</Badge>;
}

export function ScholarsClient({ initialScholars }: { initialScholars: Scholar[] }) {
  const [selected, setSelected] = useState<Scholar | null>(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);

  async function saveNotes() {
    if (!selected) return;
    setNotesLoading(true);
    try {
      await fetch(`/api/admin/scholars/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notesValue }),
      });
      setSelected((s) => s ? { ...s, notes: notesValue } : s);
      setEditingNotes(false);
    } finally {
      setNotesLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Scholars</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {initialScholars.length} scholar{initialScholars.length !== 1 ? "s" : ""} enrolled
        </p>
      </div>

      <div className="flex gap-5 items-start">
        {/* Card grid */}
        <div className={cn("flex-1", selected ? "hidden lg:block" : "")}>
          {initialScholars.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <GraduationCap size={22} className="text-primary" />
              </div>
              <p className="font-medium text-foreground">No scholars yet</p>
              <p className="text-helper mt-1">Scholars are added when nominations are selected</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {initialScholars.map((scholar) => {
                const pct = scholar.totalAmount > 0
                  ? Math.round((scholar.disbursedAmount / scholar.totalAmount) * 100)
                  : 0;
                return (
                  <Card
                    key={scholar.id}
                    onClick={() => {
                      setSelected(scholar);
                      setNotesValue(scholar.notes ?? "");
                      setEditingNotes(false);
                    }}
                    className={cn(
                      "p-4 cursor-pointer hover:shadow-md transition-all",
                      selected?.id === scholar.id && "ring-2 ring-primary"
                    )}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar name={scholar.name} size={40} />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[14px] text-foreground truncate">{scholar.name}</p>
                        <p className="text-helper truncate">{scholar.program.name}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
                        <BookOpen size={12} className="shrink-0" />
                        {scholar.course} · {scholar.year}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
                        <GraduationCap size={12} className="shrink-0" />
                        {scholar.college}
                      </div>
                      {scholar.hometown && (
                        <div className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
                          <MapPin size={12} className="shrink-0" />
                          {scholar.hometown}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 border-t border-border pt-3">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-muted-foreground">Disbursed</span>
                        <span className="font-medium text-foreground">
                          {formatLakh(scholar.disbursedAmount)} / {formatLakh(scholar.totalAmount)}
                        </span>
                      </div>
                      <Progress value={pct} height={4} />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <UtilizationBadge status={scholar.utilizationStatus} />
                      {scholar.nextDisbursement && (
                        <span className="text-helper flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(scholar.nextDisbursement).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <Card className="w-full lg:w-[380px] shrink-0 animate-fade-in">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
              <span className="font-semibold text-[14px]">Scholar Profile</span>
              <button
                onClick={() => setSelected(null)}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-muted text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-250px)]">
              {/* Profile header */}
              <div className="flex items-center gap-3">
                <Avatar name={selected.name} size={52} />
                <div>
                  <p className="font-bold text-[16px] text-foreground">{selected.name}</p>
                  <p className="text-helper">{selected.college}</p>
                  <p className="text-helper">{selected.course} · {selected.year}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-surface-muted border border-border-soft">
                  <p className="text-helper">Total Amount</p>
                  <p className="font-bold text-[15px] text-foreground mt-0.5">{formatLakh(selected.totalAmount)}</p>
                </div>
                <div className="p-3 rounded-lg bg-surface-muted border border-border-soft">
                  <p className="text-helper">Disbursed</p>
                  <p className="font-bold text-[15px] text-success mt-0.5">{formatLakh(selected.disbursedAmount)}</p>
                </div>
              </div>

              {/* Program */}
              <div>
                <p className="text-eyebrow mb-1">Program</p>
                <p className="text-[13px] font-medium text-foreground">{selected.program.name}</p>
              </div>

              {/* Utilization */}
              <div>
                <p className="text-eyebrow mb-1">Utilization Status</p>
                <UtilizationBadge status={selected.utilizationStatus} />
              </div>

              {/* Disbursement timeline */}
              <div>
                <p className="text-eyebrow mb-2">Disbursement Timeline</p>
                {selected.disbursements.length === 0 ? (
                  <p className="text-helper">No disbursements scheduled</p>
                ) : (
                  <div className="space-y-2">
                    {selected.disbursements.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border"
                      >
                        <div className="mt-0.5">
                          {d.status === "CONFIRMED" ? (
                            <CheckCircle size={16} className="text-success" />
                          ) : d.status === "RELEASED" ? (
                            <Wallet size={16} className="text-warning" />
                          ) : (
                            <Clock size={16} className="text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[12.5px] font-medium text-foreground">
                              Tranche {d.tranche}
                            </p>
                            <DisbursementStatusBadge status={d.status} />
                          </div>
                          <p className="text-helper mt-0.5">
                            {formatINR(d.amount)} · {new Date(d.scheduledDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                          {d.note && (
                            <p className="text-helper mt-0.5 italic">{d.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-eyebrow">Notes</p>
                  {!editingNotes && (
                    <button
                      onClick={() => {
                        setEditingNotes(true);
                        setNotesValue(selected.notes ?? "");
                      }}
                      className="flex items-center gap-1 text-[12px] text-primary hover:underline"
                    >
                      <Edit size={12} />
                      Edit
                    </button>
                  )}
                </div>
                {editingNotes ? (
                  <div className="space-y-2">
                    <textarea
                      rows={4}
                      value={notesValue}
                      onChange={(e) => setNotesValue(e.target.value)}
                      className="w-full rounded-[var(--radius)] border border-input bg-surface px-3 py-2 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background resize-none"
                      placeholder="Add notes about this scholar…"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={saveNotes}
                        disabled={notesLoading}
                        className="text-[12px] h-8"
                      >
                        {notesLoading ? "Saving…" : "Save"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingNotes(false)}
                        className="text-[12px] h-8"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[13px] text-foreground bg-surface-muted rounded-lg px-3 py-2.5 border border-border-soft min-h-[60px]">
                    {selected.notes || <span className="text-muted-foreground italic">No notes yet</span>}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
