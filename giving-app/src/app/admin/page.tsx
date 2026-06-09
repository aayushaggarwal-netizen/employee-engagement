import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR, formatLakh } from "@/lib/utils";
import { Card, Badge, IconTile, Progress } from "@/components/ui";
import {
  Users,
  Award,
  TrendingUp,
  Clipboard,
  GraduationCap,
  Wallet,
  Heart,
  Calendar,
} from "lucide-react";

async function getDashboardData() {
  const [
    donations,
    users,
    scholars,
    nominations,
    programs,
    recentDonations,
    recentNominations,
  ] = await Promise.all([
    prisma.donation.aggregate({ _sum: { amount: true }, _count: true }),
    prisma.user.count({ where: { role: "EMPLOYEE" } }),
    prisma.scholar.count(),
    prisma.nomination.count(),
    prisma.program.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { _count: { select: { nominationsList: true, scholars: true } } },
    }),
    prisma.donation.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true, program: true },
    }),
    prisma.nomination.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true, program: true },
    }),
  ]);

  const donorCount = await prisma.donation.groupBy({
    by: ["userId"],
    _count: true,
  });

  const pendingNominations = await prisma.nomination.count({
    where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
  });

  return {
    totalRaised: donations._sum.amount ?? 0,
    totalDonations: donations._count,
    employeeCount: users,
    scholarCount: scholars,
    nominationCount: nominations,
    pendingNominations,
    participationPct: users > 0 ? Math.round((donorCount.length / users) * 100) : 0,
    programs,
    recentDonations,
    recentNominations,
  };
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

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const kpis = [
    {
      label: "Total Raised",
      value: formatLakh(data.totalRaised),
      sub: `${data.totalDonations} donations`,
      icon: <Wallet size={20} />,
      tone: "primary" as const,
    },
    {
      label: "Active Scholars",
      value: data.scholarCount.toString(),
      sub: "currently enrolled",
      icon: <GraduationCap size={20} />,
      tone: "success" as const,
    },
    {
      label: "Employee Participation",
      value: `${data.participationPct}%`,
      sub: `${data.employeeCount} employees`,
      icon: <Users size={20} />,
      tone: "warning" as const,
    },
    {
      label: "Nominations",
      value: data.nominationCount.toString(),
      sub: `${data.pendingNominations} pending review`,
      icon: <Clipboard size={20} />,
      tone: "primary" as const,
    },
  ];

  // Merge and sort recent activity
  const activity: Array<{
    type: "donation" | "nomination";
    name: string;
    description: string;
    time: Date;
  }> = [
    ...data.recentDonations.map((d) => ({
      type: "donation" as const,
      name: d.user.name,
      description: `Donated ${formatINR(d.amount)} to ${d.program.name}`,
      time: d.createdAt,
    })),
    ...data.recentNominations.map((n) => ({
      type: "nomination" as const,
      name: n.user.name,
      description: `Nominated ${n.nomineeName} for ${n.program.name}`,
      time: n.createdAt,
    })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Overview of your employee giving programme
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[12.5px] font-medium text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-helper">{kpi.sub}</p>
              </div>
              <IconTile size={40} tone={kpi.tone}>
                {kpi.icon}
              </IconTile>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Program Portfolio */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-primary" />
              <h2 className="font-semibold text-[14px]">Program Portfolio</h2>
            </div>
            <Link href="/admin/programs" className="text-[12px] text-primary hover:underline font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {data.programs.length === 0 && (
              <div className="px-5 py-10 text-center text-muted-foreground text-sm">
                No programs yet
              </div>
            )}
            {data.programs.map((prog) => {
              const pct = prog.goal > 0 ? Math.round((prog.raised / prog.goal) * 100) : 0;
              return (
                <div key={prog.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/programs/${prog.id}`}
                        className="font-medium text-[13.5px] text-foreground hover:text-primary transition-colors truncate block"
                      >
                        {prog.name}
                      </Link>
                      <p className="text-helper">{prog.orgName}</p>
                    </div>
                    <StatusBadge status={prog.status} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-muted-foreground">{formatLakh(prog.raised)} raised</span>
                      <span className="font-medium text-foreground">{pct}%</span>
                    </div>
                    <Progress value={pct} height={5} />
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-helper flex items-center gap-1">
                      <GraduationCap size={11} />
                      {prog._count.scholars} scholars
                    </span>
                    <span className="text-helper flex items-center gap-1">
                      <Clipboard size={11} />
                      {prog._count.nominationsList} nominations
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            <h2 className="font-semibold text-[14px]">Recent Activity</h2>
          </div>
          <div className="divide-y divide-border max-h-[420px] overflow-y-auto no-scrollbar">
            {activity.length === 0 && (
              <div className="px-5 py-10 text-center text-muted-foreground text-sm">
                No recent activity
              </div>
            )}
            {activity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <div className="shrink-0 mt-0.5">
                  {item.type === "donation" ? (
                    <div className="w-7 h-7 rounded-full bg-success-soft flex items-center justify-center">
                      <Heart size={13} className="text-success" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clipboard size={13} className="text-primary" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-helper truncate">{item.description}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(item.time).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
