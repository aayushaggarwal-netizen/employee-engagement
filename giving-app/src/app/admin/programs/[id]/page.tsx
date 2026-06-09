import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR, formatLakh } from "@/lib/utils";
import { Card, Badge, Button, Progress, Avatar } from "@/components/ui";
import {
  ArrowLeft,
  Award,
  GraduationCap,
  Users,
  Clipboard,
  Calendar,
  Building,
  CheckCircle,
} from "lucide-react";

async function getProgram(id: string) {
  return prisma.program.findUnique({
    where: { id },
    include: {
      scholars: { take: 10 },
      nominationsList: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      },
      donationsList: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      },
    },
  });
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const program = await getProgram(id);
  if (!program) notFound();

  const pct = program.goal > 0 ? Math.round((program.raised / program.goal) * 100) : 0;

  const statusMap: Record<string, { tone: "success" | "muted" | "warning"; label: string }> = {
    ACTIVE: { tone: "success", label: "Active" },
    DRAFT: { tone: "muted", label: "Draft" },
    ENDED: { tone: "muted", label: "Ended" },
  };
  const statusCfg = statusMap[program.status] ?? { tone: "muted", label: program.status };

  let eligibilityItems: string[] = [];
  let howItWorksItems: string[] = [];
  try { eligibilityItems = JSON.parse(program.eligibility); } catch { /* empty */ }
  try { howItWorksItems = JSON.parse(program.howItWorks); } catch { /* empty */ }

  return (
    <div className="space-y-6">
      {/* Back nav */}
      <div>
        <Link
          href="/admin/programs"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Programs
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Award size={22} className="text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-foreground">{program.name}</h1>
              <Badge tone={statusCfg.tone}>{statusCfg.label}</Badge>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Building size={13} />
                {program.orgName}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar size={13} />
                {new Date(program.endDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/admin/programs/new?edit=${program.id}`}>
            <Button variant="secondary" size="sm">Edit</Button>
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Raised", value: formatLakh(program.raised), icon: <Award size={16} />, tone: "primary" as const },
          { label: "Scholars", value: program.scholarsFunded.toString(), icon: <GraduationCap size={16} />, tone: "success" as const },
          { label: "Donors", value: program.donors.toString(), icon: <Users size={16} />, tone: "warning" as const },
          { label: "Nominations", value: program.nominations.toString(), icon: <Clipboard size={16} />, tone: "primary" as const },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-helper mb-1">{s.label}</p>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Progress card */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13.5px] font-semibold text-foreground">Fundraising Progress</p>
          <div className="flex items-center gap-3 text-[13px]">
            <span className="text-muted-foreground">Goal: {formatLakh(program.goal)}</span>
            <span className="font-bold text-primary">{pct}%</span>
          </div>
        </div>
        <Progress value={pct} height={8} />
        <div className="flex items-center justify-between mt-2 text-[12px] text-muted-foreground">
          <span>{formatLakh(program.raised)} raised</span>
          <span>{formatLakh(program.goal - program.raised)} remaining</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eligibility */}
        {eligibilityItems.length > 0 && (
          <Card className="p-5">
            <h3 className="font-semibold text-[14px] mb-3">Eligibility Criteria</h3>
            <ul className="space-y-2">
              {eligibilityItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-foreground">
                  <CheckCircle size={14} className="text-success mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* How it works */}
        {howItWorksItems.length > 0 && (
          <Card className="p-5">
            <h3 className="font-semibold text-[14px] mb-3">How it Works</h3>
            <ol className="space-y-2">
              {howItWorksItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] text-foreground">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </Card>
        )}
      </div>

      {/* Recent donations */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-[14px]">Recent Donations</h3>
        </div>
        <div className="divide-y divide-border">
          {program.donationsList.length === 0 ? (
            <p className="px-5 py-8 text-center text-muted-foreground text-sm">No donations yet</p>
          ) : (
            program.donationsList.map((d) => (
              <div key={d.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={d.user.name} size={32} />
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{d.user.name}</p>
                    <p className="text-helper">{d.type} · {new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  </div>
                </div>
                <span className="font-semibold text-[14px] text-foreground">{formatINR(d.amount)}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
