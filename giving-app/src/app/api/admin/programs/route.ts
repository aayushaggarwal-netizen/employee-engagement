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
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const programs = await prisma.program.findMany({
      include: {
        _count: {
          select: {
            donationsList: true,
            nominationsList: true,
            scholars: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(programs.map(parseProgram));
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
        status: "DRAFT",
      },
    });

    return NextResponse.json(parseProgram(program), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
