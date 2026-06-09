import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function makeLibsqlUrl(raw: string) {
  // libsql needs file:relative (no ./) or file:/absolute
  if (raw.startsWith("file:./")) return raw.replace("file:./", "file:");
  return raw;
}

function createPrismaClient() {
  const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  const authToken = process.env.DATABASE_AUTH_TOKEN; // required for Turso, omit for local SQLite
  const adapter = new PrismaLibSql({
    url: makeLibsqlUrl(rawUrl),
    ...(authToken ? { authToken } : {}),
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
