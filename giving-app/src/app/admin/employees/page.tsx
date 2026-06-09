import { prisma } from "@/lib/prisma";
import { EmployeesClient } from "./EmployeesClient";

async function getEmployees() {
  const users = await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    orderBy: { joinedAt: "desc" },
    include: {
      donations: {
        select: { amount: true, createdAt: true, type: true, program: { select: { name: true } } },
      },
      nominations: {
        select: { id: true, nomineeName: true, status: true, createdAt: true, program: { select: { name: true } } },
      },
    },
  });
  return users;
}

export default async function EmployeesPage() {
  const employees = await getEmployees();
  return <EmployeesClient initialEmployees={employees} />;
}
