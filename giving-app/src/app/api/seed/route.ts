import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  return POST(req);
}

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Create tables if they don't exist (replaces prisma migrate deploy for Turso)
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL, "name" TEXT NOT NULL, "department" TEXT NOT NULL DEFAULT 'General', "role" TEXT NOT NULL DEFAULT 'EMPLOYEE', "status" TEXT NOT NULL DEFAULT 'Active', "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "OtpCode" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "code" TEXT NOT NULL, "expiresAt" DATETIME NOT NULL, "used" BOOLEAN NOT NULL DEFAULT false, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE)`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Session" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "token" TEXT NOT NULL, "expiresAt" DATETIME NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE)`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Session_token_key" ON "Session"("token")`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Program" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "orgName" TEXT NOT NULL, "tagline" TEXT NOT NULL, "mission" TEXT NOT NULL, "goal" INTEGER NOT NULL, "raised" INTEGER NOT NULL DEFAULT 0, "donors" INTEGER NOT NULL DEFAULT 0, "scholarsFunded" INTEGER NOT NULL DEFAULT 0, "nominations" INTEGER NOT NULL DEFAULT 0, "avgGift" INTEGER NOT NULL DEFAULT 0, "status" TEXT NOT NULL DEFAULT 'DRAFT', "category" TEXT NOT NULL DEFAULT 'General', "startDate" DATETIME NOT NULL, "endDate" DATETIME NOT NULL, "maxScholars" INTEGER NOT NULL DEFAULT 50, "eligibility" TEXT NOT NULL DEFAULT '[]', "howItWorks" TEXT NOT NULL DEFAULT '[]', "payrollCap" INTEGER NOT NULL DEFAULT 25000, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Donation" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "programId" TEXT NOT NULL, "amount" INTEGER NOT NULL, "type" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'ACTIVE', "anonymous" BOOLEAN NOT NULL DEFAULT false, "want80G" BOOLEAN NOT NULL DEFAULT true, "honour" TEXT, "frequency" TEXT, "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE, FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE)`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Nomination" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "programId" TEXT NOT NULL, "nomineeName" TEXT NOT NULL, "nomineeEmail" TEXT NOT NULL, "nomineePhone" TEXT NOT NULL, "relationship" TEXT NOT NULL, "reason" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'SUBMITTED', "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE, FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE)`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Scholar" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "college" TEXT NOT NULL, "course" TEXT NOT NULL, "year" TEXT NOT NULL, "hometown" TEXT NOT NULL, "programId" TEXT NOT NULL, "nominationId" TEXT, "totalAmount" INTEGER NOT NULL DEFAULT 0, "disbursedAmount" INTEGER NOT NULL DEFAULT 0, "nextDisbursement" DATETIME, "utilizationStatus" TEXT NOT NULL DEFAULT 'Pending update', "notes" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE, FOREIGN KEY ("nominationId") REFERENCES "Nomination" ("id") ON DELETE SET NULL)`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Scholar_nominationId_key" ON "Scholar"("nominationId")`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "Disbursement" ("id" TEXT NOT NULL PRIMARY KEY, "scholarId" TEXT NOT NULL, "programId" TEXT NOT NULL, "tranche" INTEGER NOT NULL DEFAULT 1, "amount" INTEGER NOT NULL, "scheduledDate" DATETIME NOT NULL, "status" TEXT NOT NULL DEFAULT 'SCHEDULED', "note" TEXT, "releasedAt" DATETIME, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("scholarId") REFERENCES "Scholar" ("id") ON DELETE CASCADE, FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE)`);

    // Clear existing data
    await prisma.disbursement.deleteMany();
    await prisma.scholar.deleteMany();
    await prisma.nomination.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.session.deleteMany();
    await prisma.otpCode.deleteMany();
    await prisma.user.deleteMany();
    await prisma.program.deleteMany();

    // Users
    const rohan = await prisma.user.create({ data: { email: "rohan.mehta@infosys.com", name: "Rohan Mehta", department: "Product", role: "EMPLOYEE" } });
    const sneha = await prisma.user.create({ data: { email: "sneha.kapoor@infosys.com", name: "Sneha Kapoor", department: "Engineering", role: "EMPLOYEE" } });
    const amit = await prisma.user.create({ data: { email: "amit.joshi@infosys.com", name: "Amit Joshi", department: "Sales", role: "EMPLOYEE" } });
    const divya = await prisma.user.create({ data: { email: "divya.nair@infosys.com", name: "Divya Nair", department: "Marketing", role: "EMPLOYEE" } });
    const karan = await prisma.user.create({ data: { email: "karan.patel@infosys.com", name: "Karan Patel", department: "Operations", role: "EMPLOYEE" } });
    const priyanka = await prisma.user.create({ data: { email: "priyanka.sinha@infosys.com", name: "Priyanka Sinha", department: "Engineering", role: "EMPLOYEE" } });
    const aisha = await prisma.user.create({ data: { email: "aisha.khan@infosys.com", name: "Aisha Khan", department: "Product", role: "EMPLOYEE" } });
    const vikram = await prisma.user.create({ data: { email: "vikram.rao@infosys.com", name: "Vikram Rao", department: "Product", role: "EMPLOYEE" } });
    await prisma.user.create({ data: { email: "admin@infosys.com", name: "Sunita Sharma", department: "HR", role: "ADMIN" } });

    // Programs
    const p1 = await prisma.program.create({ data: {
      name: "Bright Futures Scholarship 2025", orgName: "Infosys Foundation",
      tagline: "Helping first-generation students reach the colleges they earned a place in.",
      mission: "Every year, thousands of students earn a seat at a great college and then lose it — not for lack of merit, but for lack of fees. Bright Futures closes that gap.",
      goal: 5000000, raised: 2500000, donors: 1284, scholarsFunded: 38, nominations: 129, avgGift: 1950,
      status: "ACTIVE", category: "First-generation college",
      startDate: new Date("2025-01-01"), endDate: new Date("2026-08-31T23:59:59"), maxScholars: 50,
      eligibility: JSON.stringify(["First-generation college student", "Family income below ₹4,00,000 / year", "Secured admission on merit", "Verified marks & income proof on file"]),
      howItWorks: JSON.stringify([
        { icon: "gift", title: "You give", body: "Give once, monthly, or pledge straight from payroll — every rupee goes to a verified student." },
        { icon: "user", title: "We match", body: "Our reviewer panel matches your gift to a first-generation student who has earned their place." },
        { icon: "graduationCap", title: "They graduate", body: "Funds reach the college directly, in tranches, so the student can focus on studying — not fees." },
      ]),
      payrollCap: 25000,
    }});

    const p2 = await prisma.program.create({ data: {
      name: "Girls in STEM Fellowship 2026", orgName: "Infosys Foundation",
      tagline: "Backing young women who've earned a place in engineering and science.",
      mission: "The Girls in STEM Fellowship keeps bright young women enrolled — funding tuition, lab fees, and living costs.",
      goal: 3000000, raised: 820000, donors: 540, scholarsFunded: 12, nominations: 41, avgGift: 1750,
      status: "ACTIVE", category: "Women in STEM",
      startDate: new Date("2026-01-01"), endDate: new Date("2026-09-30T23:59:59"), maxScholars: 30,
      eligibility: JSON.stringify(["Woman pursuing a STEM degree", "Family income below ₹5,00,000 / year", "Secured admission on merit"]),
      howItWorks: JSON.stringify([
        { icon: "gift", title: "You give", body: "Give once, monthly, or pledge from payroll — every rupee funds a young woman in STEM." },
        { icon: "user", title: "We match", body: "Our reviewer panel matches your gift to a fellow who has earned her place on merit." },
        { icon: "graduationCap", title: "She graduates", body: "Funds reach the college directly, in tranches." },
      ]),
      payrollCap: 25000,
    }});

    await prisma.program.createMany({ data: [
      { name: "Bright Futures Scholarship 2024", orgName: "Infosys Foundation", tagline: "The 2024 cohort — fully funded.", mission: "The 2024 cohort of Bright Futures scholars.", goal: 4000000, raised: 4200000, donors: 1520, scholarsFunded: 71, nominations: 210, avgGift: 2100, status: "ENDED", category: "First-generation college", startDate: new Date("2024-01-01"), endDate: new Date("2025-08-31"), maxScholars: 80, eligibility: JSON.stringify(["First-generation college student"]), howItWorks: JSON.stringify([]) },
      { name: "Merit Excellence Grant 2024", orgName: "Infosys Foundation", tagline: "Merit-first grants.", mission: "Recognising outstanding academic achievement.", goal: 2000000, raised: 1850000, donors: 880, scholarsFunded: 24, nominations: 96, avgGift: 1600, status: "ENDED", category: "Merit grant", startDate: new Date("2024-03-01"), endDate: new Date("2024-12-31"), maxScholars: 30, eligibility: JSON.stringify(["Merit-based selection"]), howItWorks: JSON.stringify([]) },
    ]});

    // Donations
    await prisma.donation.createMany({ data: [
      { userId: rohan.id, programId: p1.id, amount: 1000, type: "RECURRING", status: "ACTIVE", frequency: "monthly", startDate: new Date("2026-01-12"), createdAt: new Date("2026-01-12") },
      { userId: rohan.id, programId: p1.id, amount: 500, type: "PAYROLL", status: "ACTIVE", honour: "Smt. Lalita Mehta", frequency: "per paycheck", startDate: new Date("2026-05-01"), createdAt: new Date("2026-05-01") },
      { userId: rohan.id, programId: p1.id, amount: 2500, type: "ONE_TIME", status: "COMPLETED", createdAt: new Date("2026-04-18") },
      { userId: rohan.id, programId: p1.id, amount: 1000, type: "ONE_TIME", status: "COMPLETED", createdAt: new Date("2026-03-02") },
      { userId: sneha.id, programId: p1.id, amount: 2000, type: "ONE_TIME", status: "COMPLETED" },
      { userId: amit.id, programId: p1.id, amount: 5000, type: "RECURRING", status: "ACTIVE", frequency: "monthly" },
      { userId: priyanka.id, programId: p1.id, amount: 7500, type: "ONE_TIME", status: "COMPLETED" },
      { userId: karan.id, programId: p1.id, amount: 1000, type: "PAYROLL", status: "ACTIVE", frequency: "per paycheck" },
      { userId: vikram.id, programId: p1.id, amount: 2000, type: "RECURRING", status: "ACTIVE", frequency: "monthly" },
      { userId: aisha.id, programId: p1.id, amount: 3000, type: "PAYROLL", status: "ACTIVE", frequency: "per paycheck" },
      { userId: divya.id, programId: p1.id, amount: 6000, type: "PAYROLL", status: "ACTIVE", frequency: "per paycheck" },
    ]});

    // Nominations
    const nom3 = await prisma.nomination.create({ data: { userId: rohan.id, programId: p1.id, nomineeName: "Ananya Das", nomineeEmail: "ananya.das@gmail.com", nomineePhone: "90510 77889", relationship: "Family friend", reason: "Ananya scored in the top 2% of NEET while studying in a government school with no coaching. A scholarship would cover her first-year MBBS fees.", status: "SELECTED", createdAt: new Date("2026-04-26") } });
    const nom7 = await prisma.nomination.create({ data: { userId: sneha.id, programId: p1.id, nomineeName: "Faizan Ahmed", nomineeEmail: "faizan.ahmed@gmail.com", nomineePhone: "70456 22334", relationship: "Student or mentee", reason: "Faizan is exceptionally talented and needs support to pursue his electrical engineering degree.", status: "SELECTED", createdAt: new Date("2026-03-10") } });
    await prisma.nomination.createMany({ data: [
      { userId: rohan.id, programId: p1.id, nomineeName: "Kavya Reddy", nomineeEmail: "kavya.reddy@gmail.com", nomineePhone: "98480 11223", relationship: "Student or mentee", reason: "Kavya tutors younger kids in her neighbourhood every evening. She topped her board exams while supporting her family's tailoring work.", status: "UNDER_REVIEW", createdAt: new Date("2026-05-20") },
      { userId: rohan.id, programId: p1.id, nomineeName: "Imran Sheikh", nomineeEmail: "imran.sheikh@gmail.com", nomineePhone: "99701 44556", relationship: "Known to family", reason: "Imran lost his father two years ago and has kept his grades steady. He's been accepted into a mechanical engineering programme.", status: "SHORTLISTED", createdAt: new Date("2026-05-08") },
      { userId: rohan.id, programId: p1.id, nomineeName: "Rahul Verma", nomineeEmail: "rahul.verma@gmail.com", nomineePhone: "88260 33445", relationship: "Others", reason: "Rahul is a hardworking student from my hometown who needs support for his polytechnic diploma.", status: "NOT_SELECTED", createdAt: new Date("2026-03-30") },
      { userId: rohan.id, programId: p1.id, nomineeName: "Sneha Joshi", nomineeEmail: "sneha.joshi@gmail.com", nomineePhone: "70420 99001", relationship: "Student or mentee", reason: "Sneha is a brilliant student I mentor. She's aiming for a degree in architecture and has the portfolio to back it up.", status: "SUBMITTED", createdAt: new Date("2026-03-22") },
      { userId: karan.id, programId: p1.id, nomineeName: "Imran Sheikh", nomineeEmail: "imran.sheikh2@gmail.com", nomineePhone: "99701 55678", relationship: "Known to family", reason: "Imran is the brightest student from our village.", status: "SHORTLISTED", createdAt: new Date("2026-04-15") },
    ]});

    // Scholars
    const sc1 = await prisma.scholar.create({ data: { name: "Priya Sharma", college: "Lady Shri Ram College, Delhi", course: "B.A. Economics", year: "1st year", hometown: "Sitapur, UP", programId: p1.id, totalAmount: 80000, disbursedAmount: 80000, utilizationStatus: "Verified" } });
    const sc2 = await prisma.scholar.create({ data: { name: "Arjun Nair", college: "NIT Calicut", course: "B.Tech Civil Engineering", year: "2nd year", hometown: "Wayanad, Kerala", programId: p1.id, totalAmount: 120000, disbursedAmount: 80000, utilizationStatus: "Submitted", nextDisbursement: new Date("2026-07-01") } });
    const sc3 = await prisma.scholar.create({ data: { name: "Meena Pillai", college: "St. Xavier's College, Mumbai", course: "B.Sc Mathematics", year: "1st year", hometown: "Alappuzha, Kerala", programId: p1.id, totalAmount: 90000, disbursedAmount: 0, utilizationStatus: "Pending update", nextDisbursement: new Date("2026-06-15") } });
    const sc4 = await prisma.scholar.create({ data: { name: "Ananya Das", college: "Maulana Azad Medical College, Delhi", course: "MBBS", year: "1st year", hometown: "Howrah, WB", programId: p1.id, nominationId: nom3.id, totalAmount: 150000, disbursedAmount: 150000, utilizationStatus: "Verified" } });
    const sc5 = await prisma.scholar.create({ data: { name: "Imran Sheikh", college: "VJTI, Mumbai", course: "B.Tech Mechanical", year: "1st year", hometown: "Nanded, Maharashtra", programId: p1.id, totalAmount: 100000, disbursedAmount: 0, utilizationStatus: "Pending update", nextDisbursement: new Date("2026-07-01") } });
    const sc6 = await prisma.scholar.create({ data: { name: "Faizan Ahmed", college: "Jadavpur University, Kolkata", course: "B.Tech Electrical", year: "1st year", hometown: "Asansol, WB", programId: p1.id, nominationId: nom7.id, totalAmount: 80000, disbursedAmount: 80000, utilizationStatus: "Submitted" } });

    // Disbursements
    await prisma.disbursement.createMany({ data: [
      { scholarId: sc1.id, programId: p1.id, tranche: 1, amount: 40000, scheduledDate: new Date("2026-02-01"), status: "CONFIRMED", releasedAt: new Date("2026-02-01") },
      { scholarId: sc1.id, programId: p1.id, tranche: 2, amount: 40000, scheduledDate: new Date("2026-04-01"), status: "CONFIRMED", releasedAt: new Date("2026-04-01") },
      { scholarId: sc2.id, programId: p1.id, tranche: 1, amount: 40000, scheduledDate: new Date("2026-02-01"), status: "CONFIRMED", releasedAt: new Date("2026-02-01") },
      { scholarId: sc2.id, programId: p1.id, tranche: 2, amount: 40000, scheduledDate: new Date("2026-04-01"), status: "RELEASED", releasedAt: new Date("2026-04-15") },
      { scholarId: sc2.id, programId: p1.id, tranche: 3, amount: 40000, scheduledDate: new Date("2026-07-01"), status: "SCHEDULED" },
      { scholarId: sc3.id, programId: p1.id, tranche: 1, amount: 45000, scheduledDate: new Date("2026-06-15"), status: "SCHEDULED" },
      { scholarId: sc3.id, programId: p1.id, tranche: 2, amount: 45000, scheduledDate: new Date("2026-09-15"), status: "SCHEDULED" },
      { scholarId: sc4.id, programId: p1.id, tranche: 1, amount: 75000, scheduledDate: new Date("2026-02-15"), status: "CONFIRMED", releasedAt: new Date("2026-02-15") },
      { scholarId: sc4.id, programId: p1.id, tranche: 2, amount: 75000, scheduledDate: new Date("2026-05-15"), status: "CONFIRMED", releasedAt: new Date("2026-05-15") },
      { scholarId: sc5.id, programId: p1.id, tranche: 1, amount: 50000, scheduledDate: new Date("2026-07-01"), status: "SCHEDULED" },
      { scholarId: sc5.id, programId: p1.id, tranche: 2, amount: 50000, scheduledDate: new Date("2026-10-01"), status: "SCHEDULED" },
      { scholarId: sc6.id, programId: p1.id, tranche: 1, amount: 80000, scheduledDate: new Date("2026-03-01"), status: "CONFIRMED", releasedAt: new Date("2026-03-01") },
    ]});

    // ignore unused p2 lint warning
    void p2;

    return NextResponse.json({ success: true, message: "Database seeded successfully", accounts: { employee: "rohan.mehta@infosys.com", admin: "admin@infosys.com" } });
  } catch (e) {
    console.error("Seed error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
