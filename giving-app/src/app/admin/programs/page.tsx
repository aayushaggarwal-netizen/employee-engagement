import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatLakh } from "@/lib/utils";
import { Card, Badge, Button, Progress } from "@/components/ui";
import { Plus, Award, GraduationCap, Calendar } from "lucide-react";

async function getPrograms() {
  return prisma.program.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { scholars: true, nominationsList: true, donationsList: true } },
    },
  });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { tone: "success" | "muted" | "warning"; label: string }> = {
    ACTIVE: { tone: "success", label: "Active" },
    DRAFT: { tone: "muted", label: "Draft" },
    ENDED: { tone: "muted", label: "Ended" },
  };
  const cfg = map[status] ?? { tone: "muted", label: status };
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Programs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your scholarship and giving programs
          </p>
        </div>
        <Link href="/admin/programs/new">
          <Button size="sm" className="gap-1.5">
            <Plus size={15} />
            Create Program
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-[12px] uppercase tracking-wide">
                  Program
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-[12px] uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-[12px] uppercase tracking-wide">
                  Goal
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-[12px] uppercase tracking-wide min-w-[140px]">
                  Raised
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-[12px] uppercase tracking-wide">
                  Scholars
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-[12px] uppercase tracking-wide">
                  End Date
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {programs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">
                    No programs yet.{" "}
                    <Link href="/admin/programs/new" className="text-primary hover:underline">
                      Create your first program
                    </Link>
                  </td>
                </tr>
              )}
              {programs.map((prog) => {
                const pct = prog.goal > 0 ? Math.round((prog.raised / prog.goal) * 100) : 0;
                return (
                  <tr key={prog.id} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Award size={15} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/programs/${prog.id}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors block truncate max-w-[200px]"
                          >
                            {prog.name}
                          </Link>
                          <p className="text-helper truncate max-w-[200px]">{prog.orgName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={prog.status} />
                    </td>
                    <td className="px-4 py-4 text-foreground font-medium">
                      {formatLakh(prog.goal)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1.5 min-w-[120px]">
                        <div className="flex items-center justify-between text-[12px]">
                          <span className="text-foreground font-medium">{formatLakh(prog.raised)}</span>
                          <span className="text-muted-foreground">{pct}%</span>
                        </div>
                        <Progress value={pct} height={4} />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-foreground">
                        <GraduationCap size={13} className="text-muted-foreground" />
                        {prog._count.scholars}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar size={13} />
                        {new Date(prog.endDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/admin/programs/${prog.id}`}>
                        <Button variant="secondary" size="sm">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
