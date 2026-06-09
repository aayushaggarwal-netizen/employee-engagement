import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

function parseProgram(program: {
  eligibility: string;
  howItWorks: string;
  [key: string]: unknown;
}) {
  return {
    ...program,
    eligibility: (() => {
      try {
        return JSON.parse(program.eligibility);
      } catch {
        return [];
      }
    })(),
    howItWorks: (() => {
      try {
        return JSON.parse(program.howItWorks);
      } catch {
        return [];
      }
    })(),
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        donationsList: {
          include: { user: true },
        },
        _count: {
          select: {
            scholars: true,
            nominationsList: true,
          },
        },
      },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json(parseProgram(program));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;

    const existing = await prisma.program.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      tagline,
      mission,
      goal,
      endDate,
      status,
      orgName,
      category,
      payrollCap,
      maxScholars,
      eligibility,
      howItWorks,
    } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (tagline !== undefined) updateData.tagline = tagline;
    if (mission !== undefined) updateData.mission = mission;
    if (goal !== undefined) updateData.goal = Number(goal);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (status !== undefined) updateData.status = status;
    if (orgName !== undefined) updateData.orgName = orgName;
    if (category !== undefined) updateData.category = category;
    if (payrollCap !== undefined) updateData.payrollCap = Number(payrollCap);
    if (maxScholars !== undefined) updateData.maxScholars = Number(maxScholars);
    if (eligibility !== undefined)
      updateData.eligibility = Array.isArray(eligibility)
        ? JSON.stringify(eligibility)
        : eligibility;
    if (howItWorks !== undefined)
      updateData.howItWorks = Array.isArray(howItWorks)
        ? JSON.stringify(howItWorks)
        : howItWorks;

    const updated = await prisma.program.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(parseProgram(updated));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
