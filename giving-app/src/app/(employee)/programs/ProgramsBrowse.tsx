"use client";
import React from "react";
import Link from "next/link";
import { Badge, Button, Card, Eyebrow, Progress } from "@/components/ui";
import { daysLeft, formatINR, formatLakh } from "@/lib/utils";
import { ArrowRight, Users, GraduationCap, Calendar, Building } from "lucide-react";

interface Program {
  id: string;
  name: string;
  orgName: string;
  tagline: string;
  mission: string;
  goal: number;
  raised: number;
  donors: number;
  scholarsFunded: number;
  nominations: number;
  status: string;
  category: string;
  endDate: Date;
}

interface User {
  id: string;
  name: string;
  department: string;
}

interface Props {
  user: User;
  programs: Program[];
}

export default function ProgramsBrowse({ user, programs }: Props) {
  const firstName = user.name.split(" ")[0];
  const active = programs.filter((p) => p.status === "ACTIVE");
  const past = programs.filter((p) => p.status === "ENDED" || p.status === "DRAFT");

  return (
    <div className="max-w-[var(--page-max)] mx-auto px-4 sm:px-6 py-10 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <Eyebrow>Employee giving</Eyebrow>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
          Hello {firstName} — choose a programme to support
        </h1>
      </div>

      {/* Active programmes */}
      {active.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
            </span>
            <h2 className="text-base font-semibold text-foreground">Live now</h2>
          </div>

          {active.length === 1 ? (
            <FeaturedProgram program={active[0]} />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {active.map((p) => (
                <LiveProgramCard key={p.id} program={p} />
              ))}
            </div>
          )}
        </section>
      )}

      {active.length === 0 && (
        <div className="rounded-xl border border-border-soft bg-surface-muted p-10 text-center">
          <p className="text-muted-foreground">No active programmes at the moment. Check back soon!</p>
        </div>
      )}

      {/* Past programmes */}
      {past.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-foreground">Past programmes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map((p) => (
              <PastProgram key={p.id} program={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FeaturedProgram({ program: p }: { program: Program }) {
  const pct = Math.min(100, Math.round((p.raised / p.goal) * 100));
  const days = daysLeft(new Date(p.endDate));

  return (
    <Card className="overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_340px]">
        {/* Left: identity */}
        <div className="p-7 sm:p-9 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="success">
              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
              Active
            </Badge>
            <Badge tone="muted">{p.category}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Building className="w-3.5 h-3.5" />
              <span>{p.orgName}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">{p.name}</h2>
            <p className="text-base text-muted-foreground leading-relaxed">{p.tagline}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Stat label="Donors" value={p.donors.toString()} icon={<Users className="w-4 h-4" />} />
            <Stat label="Scholars" value={p.scholarsFunded.toString()} icon={<GraduationCap className="w-4 h-4" />} />
            <Stat label="Days left" value={days.toString()} icon={<Calendar className="w-4 h-4" />} />
          </div>

          <Link href={`/program/${p.id}`}>
            <Button size="lg" className="gap-2">
              View programme
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Right: progress panel */}
        <div className="border-t lg:border-t-0 lg:border-l border-border bg-surface-muted p-7 space-y-5 flex flex-col justify-center">
          <div>
            <p className="text-helper mb-1">Raised so far</p>
            <p className="text-2xl font-bold text-foreground">{formatLakh(p.raised)}</p>
            <p className="text-helper">of {formatLakh(p.goal)} goal</p>
          </div>

          <Progress value={pct} height={10} />

          <p className="text-sm font-semibold text-primary">{pct}% funded</p>

          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nominations</span>
              <span className="font-medium">{p.nominations}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Target</span>
              <span className="font-medium">{formatINR(p.goal)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function LiveProgramCard({ program: p }: { program: Program }) {
  const pct = Math.min(100, Math.round((p.raised / p.goal) * 100));
  const days = daysLeft(new Date(p.endDate));

  return (
    <Card className="p-6 hover:shadow-md transition-shadow space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-helper">
            <Building className="w-3.5 h-3.5" />
            {p.orgName}
          </div>
          <h3 className="font-semibold text-foreground text-[15px] leading-tight">{p.name}</h3>
        </div>
        <Badge tone="success" className="shrink-0">Active</Badge>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">{p.tagline}</p>

      <div className="space-y-1.5">
        <Progress value={pct} height={6} />
        <div className="flex justify-between text-helper">
          <span>{formatLakh(p.raised)} raised</span>
          <span>{pct}%</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center py-1 border-t border-border-soft">
        <div>
          <p className="text-sm font-semibold">{p.donors}</p>
          <p className="text-helper">donors</p>
        </div>
        <div>
          <p className="text-sm font-semibold">{p.scholarsFunded}</p>
          <p className="text-helper">scholars</p>
        </div>
        <div>
          <p className="text-sm font-semibold">{days}d</p>
          <p className="text-helper">left</p>
        </div>
      </div>

      <Link href={`/program/${p.id}`} className="block">
        <Button variant="outline" className="w-full gap-1.5" size="sm">
          View programme <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </Link>
    </Card>
  );
}

function PastProgram({ program: p }: { program: Program }) {
  return (
    <div className="rounded-xl border border-border p-5 space-y-3 bg-card">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-helper">
          <Building className="w-3.5 h-3.5" />
          {p.orgName}
        </div>
        <h3 className="font-semibold text-foreground">{p.name}</h3>
        <p className="text-helper line-clamp-2">{p.tagline}</p>
      </div>
      <div className="flex items-center gap-4 pt-1 border-t border-border-soft">
        <div>
          <p className="text-sm font-semibold text-foreground">{formatLakh(p.raised)}</p>
          <p className="text-helper">raised</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{p.scholarsFunded}</p>
          <p className="text-helper">scholars</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{p.donors}</p>
          <p className="text-helper">donors</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
        {icon}
        {label}
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}
