"use client";
import React, { useState } from "react";
import { Avatar, Badge, Card, Eyebrow } from "@/components/ui";
import { cn, formatINR, DISBURSEMENT_STATUS_LABEL } from "@/lib/utils";
import { GraduationCap, MapPin, BookOpen } from "lucide-react";

interface Program {
  id: string;
  name: string;
  orgName: string;
}

interface Nomination {
  user: { name: string; department: string } | null;
}

interface Disbursement {
  id: string;
  status: string;
  amount: number;
  scheduledDate: Date;
}

interface Scholar {
  id: string;
  name: string;
  college: string;
  course: string;
  year: string;
  hometown: string;
  totalAmount: number;
  disbursedAmount: number;
  utilizationStatus: string;
  nominationId: string | null;
  program: Program;
  nomination: Nomination | null;
  disbursements: Disbursement[];
}

interface Props {
  scholars: Scholar[];
}

type Filter = "all" | "nominations" | "pool";

const UTIL_TONE: Record<string, "muted" | "success" | "warning" | "info"> = {
  "Confirmed": "success",
  "Pending update": "warning",
  "Scheduled": "info",
  "Released": "success",
};

export default function MyScholarsClient({ scholars }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const fromNominations = scholars.filter((s) => s.nominationId);
  const fromPool = scholars.filter((s) => !s.nominationId);

  const filtered =
    filter === "nominations" ? fromNominations :
    filter === "pool" ? fromPool :
    scholars;

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All scholars", count: scholars.length },
    { key: "nominations", label: "Employee nominations", count: fromNominations.length },
    { key: "pool", label: "Pre-verified pool", count: fromPool.length },
  ];

  return (
    <div className="max-w-[var(--page-max)] mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      <div>
        <Eyebrow>Scholar cohort</Eyebrow>
        <h1 className="text-2xl font-semibold text-foreground mt-1">Scholars supported</h1>
        <p className="text-muted-foreground mt-1 text-sm">Students receiving scholarship funding through this programme.</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total scholars", value: scholars.length.toString() },
          { label: "From nominations", value: fromNominations.length.toString() },
          { label: "Pre-verified pool", value: fromPool.length.toString() },
        ].map((s) => (
          <Card key={s.label} className="p-4 space-y-1">
            <p className="text-helper">{s.label}</p>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-surface-muted rounded-xl p-1 w-fit">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              filter === f.key
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
            <span className={cn(
              "text-[10px] font-semibold px-1.5 rounded-full",
              filter === f.key ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Scholar cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-surface-muted flex items-center justify-center mx-auto">
            <GraduationCap className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">No scholars in this category yet</p>
          <p className="text-muted-foreground text-sm">Scholars will appear here once they have been selected.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => {
            const latestDisbursement = s.disbursements[0];
            const disbStatus = latestDisbursement?.status ?? "SCHEDULED";
            const tone: "muted" | "success" | "warning" | "info" = UTIL_TONE[DISBURSEMENT_STATUS_LABEL[disbStatus] ?? s.utilizationStatus] ?? "muted";

            return (
              <Card key={s.id} className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <Avatar name={s.name} size={48} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{s.name}</p>
                    <div className="flex items-center gap-1 text-helper mt-0.5">
                      <BookOpen className="w-3 h-3 shrink-0" />
                      <span className="truncate">{s.course}</span>
                    </div>
                    <p className="text-helper">{s.year} · {s.college}</p>
                  </div>
                </div>

                {/* Hometown */}
                <div className="flex items-center gap-1.5 text-helper">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                  {s.hometown}
                </div>

                {/* Programme */}
                <div className="rounded-lg bg-surface-muted px-3 py-2">
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Programme</p>
                  <p className="text-xs font-medium text-foreground mt-0.5 truncate">{s.program.name}</p>
                </div>

                {/* Disbursement status */}
                <div className="flex items-center justify-between pt-2 border-t border-border-soft">
                  <div>
                    <p className="text-helper">Disbursed</p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatINR(s.disbursedAmount)}
                      {s.totalAmount > 0 && (
                        <span className="font-normal text-muted-foreground"> of {formatINR(s.totalAmount)}</span>
                      )}
                    </p>
                  </div>
                  <Badge tone={tone}>
                    {DISBURSEMENT_STATUS_LABEL[disbStatus] ?? s.utilizationStatus}
                  </Badge>
                </div>

                {/* Source badge */}
                {s.nominationId && (
                  <div className="text-helper flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                    Employee nomination
                    {s.nomination?.user && (
                      <span className="text-muted-foreground"> · {s.nomination.user.name}</span>
                    )}
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
