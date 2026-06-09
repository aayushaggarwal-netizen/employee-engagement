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

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      orderBy: [{ status: "asc" }, { endDate: "asc" }],
      include: {
        _count: {
          select: {
            donationsList: true,
            nominationsList: true,
            scholars: true,
          },
        },
      },
    });

    // Sort so ACTIVE comes first
    const sorted = [...programs].sort((a, b) => {
      if (a.status === "ACTIVE" && b.status !== "ACTIVE") return -1;
      if (a.status !== "ACTIVE" && b.status === "ACTIVE") return 1;
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    });

    return NextResponse.json(sorted.map(parseProgram));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const {
      name,
      orgName,
      tagline,
      mission,
      goal,
      startDate,
      endDate,
      maxScholars,
      eligibility,
      howItWorks,
      category,
      payrollCap,
      status,
    } = body;

    if (!name || !orgName || !tagline || !mission || !goal || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const program = await prisma.program.create({
      data: {
        name,
        orgName,
        tagline,
        mission,
        goal: Number(goal),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxScholars: maxScholars ? Number(maxScholars) : 50,
        eligibility: Array.isArray(eligibility) ? JSON.stringify(eligibility) : "[]",
        howItWorks: Array.isArray(howItWorks) ? JSON.stringify(howItWorks) : "[]",
        category: category ?? "General",
        payrollCap: payrollCap ? Number(payrollCap) : 25000,
        status: status ?? "DRAFT",
      },
    });

    return NextResponse.json(parseProgram(program), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
