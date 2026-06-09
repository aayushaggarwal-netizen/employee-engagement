"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Avatar, Badge, Button, Card, Eyebrow } from "@/components/ui";
import { cn, NOMINATION_STATUS_LABEL, NOMINATION_STATUS_TONE } from "@/lib/utils";
import { ChevronDown, Mail, Phone, UserCheck, ArrowRight } from "lucide-react";

interface Program {
  id: string;
  name: string;
  orgName: string;
}

interface Nomination {
  id: string;
  nomineeName: string;
  nomineeEmail: string;
  nomineePhone: string;
  relationship: string;
  reason: string;
  status: string;
  createdAt: Date;
  program: Program;
}

interface Props {
  nominations: Nomination[];
}

const STATUS_STEPS = ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "SELECTED"];

function StatusProgress({ status }: { status: string }) {
  const idx = STATUS_STEPS.indexOf(status);
  const isRejected = status === "NOT_SELECTED";

  if (isRejected) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
        Not selected for this cohort
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-0">
        {STATUS_STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 transition-colors",
              i <= idx ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            )}>
              {i < idx ? "✓" : i + 1}
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={cn("flex-1 h-0.5 min-w-[20px]", i < idx ? "bg-primary" : "bg-muted")} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between">
        {STATUS_STEPS.map((s) => (
          <span key={s} className={cn("text-[10px] text-muted-foreground", s === status && "text-primary font-medium")}>
            {NOMINATION_STATUS_LABEL[s]}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MyNominationsClient({ nominations }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const total = nominations.length;
  const inReview = nominations.filter((n) => n.status === "UNDER_REVIEW" || n.status === "SHORTLISTED").length;
  const selected = nominations.filter((n) => n.status === "SELECTED").length;

  return (
    <div className="max-w-[var(--page-max)] mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      <div>
        <Eyebrow>Your nominations</Eyebrow>
        <h1 className="text-2xl font-semibold text-foreground mt-1">My nominations</h1>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: total.toString() },
          { label: "In review", value: inReview.toString() },
          { label: "Selected", value: selected.toString(), highlight: selected > 0 },
        ].map((s) => (
          <Card key={s.label} className="p-4 space-y-1">
            <p className="text-helper">{s.label}</p>
            <p className={cn("text-xl font-bold", s.highlight ? "text-success" : "text-foreground")}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Nomination list */}
      {nominations.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-muted flex items-center justify-center mx-auto">
            <UserCheck className="w-7 h-7 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">No nominations yet</p>
            <p className="text-muted-foreground text-sm mt-1">Nominate a deserving student for a scholarship programme.</p>
          </div>
          <Link href="/programs">
            <Button className="gap-1.5">
              Browse programmes
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {nominations.map((n) => {
            const isExpanded = expanded === n.id;
            const tone = NOMINATION_STATUS_TONE[n.status] as "muted" | "success" | "warning" | "destructive" | "info";

            return (
              <Card key={n.id} className="overflow-hidden">
                {/* Header row */}
                <button
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-surface-muted transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : n.id)}
                >
                  <Avatar name={n.nomineeName} size={44} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground">{n.nomineeName}</span>
                      <Badge tone={tone}>{NOMINATION_STATUS_LABEL[n.status] ?? n.status}</Badge>
                    </div>
                    <p className="text-helper mt-0.5">
                      {n.relationship} · {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <p className="text-helper truncate">{n.program.name}</p>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform", isExpanded && "rotate-180")} />
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-border px-5 py-4 space-y-4">
                    {/* Status progress */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Application progress</p>
                      <StatusProgress status={n.status} />
                    </div>

                    {/* Contact details */}
                    <div className="space-y-2 pt-2 border-t border-border-soft">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contact</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        {n.nomineeEmail}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        +91 {n.nomineePhone}
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="space-y-2 pt-2 border-t border-border-soft">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your nomination reason</p>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{n.reason}</p>
                    </div>

                    <Link href={`/program/${n.program.id}`} className="block">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        View programme
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
