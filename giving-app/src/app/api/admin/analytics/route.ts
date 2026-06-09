import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Fetch raw data in parallel
    const [programs, allDonations, allScholars, allDisbursements, allUsers] =
      await Promise.all([
        prisma.program.findMany({
          include: { _count: { select: { scholars: true } } },
        }),
        prisma.donation.findMany({
          include: { user: true },
          orderBy: { createdAt: "asc" },
        }),
        prisma.scholar.findMany(),
        prisma.disbursement.findMany(),
        prisma.user.findMany({ include: { donations: true } }),
      ]);

    // Top-level aggregates
    const totalRaised = programs.reduce((sum, p) => sum + p.raised, 0);
    const totalDonors = programs.reduce((sum, p) => sum + p.donors, 0);
    const totalScholars = allScholars.length;
    const participationRate =
      allUsers.length > 0
        ? Math.round(
            (allUsers.filter((u) => u.donations.length > 0).length / allUsers.length) * 100
          )
        : 0;

    // Donations over time: last 12 weeks
    const now = new Date();
    const twelveWeeksAgo = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);

    const weeklyMap = new Map<
      string,
      { date: string; amount: number; count: number }
    >();

    // Pre-populate 12 weeks
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      // Normalize to Monday of that week
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
      weekStart.setDate(diff);
      weekStart.setHours(0, 0, 0, 0);
      const key = weekStart.toISOString().split("T")[0];
      if (!weeklyMap.has(key)) {
        weeklyMap.set(key, { date: key, amount: 0, count: 0 });
      }
    }

    for (const donation of allDonations) {
      if (donation.createdAt < twelveWeeksAgo) continue;
      const d = new Date(donation.createdAt);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const weekStart = new Date(d);
      weekStart.setDate(diff);
      weekStart.setHours(0, 0, 0, 0);
      const key = weekStart.toISOString().split("T")[0];
      const entry = weeklyMap.get(key) ?? { date: key, amount: 0, count: 0 };
      entry.amount += donation.amount;
      entry.count += 1;
      weeklyMap.set(key, entry);
    }

    const donationsOverTime = Array.from(weeklyMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // Disbursement status counts and amounts
    const disbursementStatus = {
      SCHEDULED: { count: 0, amount: 0 },
      RELEASED: { count: 0, amount: 0 },
      CONFIRMED: { count: 0, amount: 0 },
    };

    for (const d of allDisbursements) {
      const key = d.status as keyof typeof disbursementStatus;
      if (disbursementStatus[key]) {
        disbursementStatus[key].count += 1;
        disbursementStatus[key].amount += d.amount;
      }
    }

    // Top departments by donation amount
    const deptMap = new Map<string, { name: string; amount: number; donors: Set<string> }>();

    for (const donation of allDonations) {
      const dept = donation.user.department;
      const entry = deptMap.get(dept) ?? {
        name: dept,
        amount: 0,
        donors: new Set<string>(),
      };
      entry.amount += donation.amount;
      entry.donors.add(donation.userId);
      deptMap.set(dept, entry);
    }

    const topDepartments = Array.from(deptMap.values())
      .map((d) => ({ name: d.name, amount: d.amount, donors: d.donors.size }))
      .sort((a, b) => b.amount - a.amount);

    // Program stats
    const programStats = programs.map((p) => ({
      programId: p.id,
      name: p.name,
      raised: p.raised,
      goal: p.goal,
      donors: p.donors,
      scholars: p._count.scholars,
    }));

    return NextResponse.json({
      totalRaised,
      totalDonors,
      totalScholars,
      participationRate,
      donationsOverTime,
      disbursementStatus,
      topDepartments,
      programStats,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
