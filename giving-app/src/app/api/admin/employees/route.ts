import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { department: { contains: search } },
      ];
    }

    const employees = await prisma.user.findMany({
      where,
      include: {
        donations: true,
        nominations: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const result = employees.map((emp) => {
      const totalDonated = emp.donations
        .filter((d) => d.status === "ACTIVE" || d.status === "COMPLETED")
        .reduce((sum, d) => sum + d.amount, 0);

      return {
        id: emp.id,
        email: emp.email,
        name: emp.name,
        department: emp.department,
        role: emp.role,
        status: emp.status,
        joinedAt: emp.joinedAt,
        createdAt: emp.createdAt,
        updatedAt: emp.updatedAt,
        totalDonated,
        donationCount: emp.donations.length,
        nominationCount: emp.nominations.length,
      };
    });

    return NextResponse.json(result);
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
    const { email, name, department, role, status } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "email and name are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        department: department ?? "General",
        role: role ?? "EMPLOYEE",
        status: status ?? "Active",
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
