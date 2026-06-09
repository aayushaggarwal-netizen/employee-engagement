import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const rawUrl = process.env.DATABASE_URL || "file:./dev.db";
const libsqlUrl = rawUrl.startsWith("file:./") ? rawUrl.replace("file:./", "file:") : rawUrl;
const adapter = new PrismaLibSql({ url: libsqlUrl });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("Seeding database...");

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
  const rohan = await prisma.user.create({
    data: {
      email: "rohan.mehta@infosys.com",
      name: "Rohan Mehta",
      department: "Product",
      role: "EMPLOYEE",
    },
  });

  const sneha = await prisma.user.create({
    data: { email: "sneha.kapoor@infosys.com", name: "Sneha Kapoor", department: "Engineering", role: "EMPLOYEE" },
  });
  const amit = await prisma.user.create({
    data: { email: "amit.joshi@infosys.com", name: "Amit Joshi", department: "Sales", role: "EMPLOYEE" },
  });
  const divya = await prisma.user.create({
    data: { email: "divya.nair@infosys.com", name: "Divya Nair", department: "Marketing", role: "EMPLOYEE" },
  });
  const karan = await prisma.user.create({
    data: { email: "karan.patel@infosys.com", name: "Karan Patel", department: "Operations", role: "EMPLOYEE" },
  });
  const priyanka = await prisma.user.create({
    data: { email: "priyanka.sinha@infosys.com", name: "Priyanka Sinha", department: "Engineering", role: "EMPLOYEE" },
  });
  const aisha = await prisma.user.create({
    data: { email: "aisha.khan@infosys.com", name: "Aisha Khan", department: "Product", role: "EMPLOYEE" },
  });
  const vikram = await prisma.user.create({
    data: { email: "vikram.rao@infosys.com", name: "Vikram Rao", department: "Product", role: "EMPLOYEE" },
  });

  // Admin user
  const admin = await prisma.user.create({
    data: {
      email: "admin@infosys.com",
      name: "Sunita Sharma",
      department: "HR",
      role: "ADMIN",
    },
  });

  // Program 1 — Bright Futures Scholarship 2025 (ACTIVE)
  const p1 = await prisma.program.create({
    data: {
      name: "Bright Futures Scholarship 2025",
      orgName: "Infosys Foundation",
      tagline: "Helping first-generation students reach the colleges they earned a place in.",
      mission:
        "Every year, thousands of students earn a seat at a great college and then lose it — not for lack of merit, but for lack of fees. Bright Futures closes that gap. Your gift covers tuition, hostel, and study materials for students who are the first in their family to attend college, so a hard-won admission letter actually turns into a degree.",
      goal: 5000000,
      raised: 2500000,
      donors: 1284,
      scholarsFunded: 38,
      nominations: 129,
      avgGift: 1950,
      status: "ACTIVE",
      category: "First-generation college",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2026-08-31T23:59:59"),
      maxScholars: 50,
      eligibility: JSON.stringify([
        "First-generation college student",
        "Family income below ₹4,00,000 / year",
        "Secured admission on merit",
        "Verified marks & income proof on file",
      ]),
      howItWorks: JSON.stringify([
        { icon: "gift", title: "You give", body: "Give once, monthly, or pledge straight from payroll — every rupee goes to a verified student." },
        { icon: "user", title: "We match", body: "Our reviewer panel matches your gift to a first-generation student who has earned their place." },
        { icon: "graduationCap", title: "They graduate", body: "Funds reach the college directly, in tranches, so the student can focus on studying — not fees." },
      ]),
      payrollCap: 25000,
    },
  });

  // Program 2 — Girls in STEM Fellowship 2026 (ACTIVE)
  const p2 = await prisma.program.create({
    data: {
      name: "Girls in STEM Fellowship 2026",
      orgName: "Infosys Foundation",
      tagline: "Backing young women who've earned a place in engineering and science — so fees never end the dream.",
      mission:
        "Across India, bright young women win seats in engineering and science programmes, then drop out when families can't stretch to fees and hostel costs. The Girls in STEM Fellowship keeps them enrolled — funding tuition, lab fees, and living costs for women who are often the first in their family to study a technical degree.",
      goal: 3000000,
      raised: 820000,
      donors: 540,
      scholarsFunded: 12,
      nominations: 41,
      avgGift: 1750,
      status: "ACTIVE",
      category: "Women in STEM",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-09-30T23:59:59"),
      maxScholars: 30,
      eligibility: JSON.stringify([
        "Woman pursuing a STEM degree",
        "Family income below ₹5,00,000 / year",
        "Secured admission on merit",
        "Verified marks & income proof on file",
      ]),
      howItWorks: JSON.stringify([
        { icon: "gift", title: "You give", body: "Give once, monthly, or pledge from payroll — every rupee funds a young woman in STEM." },
        { icon: "user", title: "We match", body: "Our reviewer panel matches your gift to a fellow who has earned her place on merit." },
        { icon: "graduationCap", title: "She graduates", body: "Funds reach the college directly, in tranches, so she can focus on her degree — not fees." },
      ]),
      payrollCap: 25000,
    },
  });

  // Program 3 — Bright Futures 2024 (ENDED)
  await prisma.program.create({
    data: {
      name: "Bright Futures Scholarship 2024",
      orgName: "Infosys Foundation",
      tagline: "The 2024 cohort — fully funded, now graduating across India.",
      mission: "The 2024 cohort of Bright Futures scholars — fully funded and now studying across India.",
      goal: 4000000,
      raised: 4200000,
      donors: 1520,
      scholarsFunded: 71,
      nominations: 210,
      avgGift: 2100,
      status: "ENDED",
      category: "First-generation college",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-08-31"),
      maxScholars: 80,
      eligibility: JSON.stringify(["First-generation college student", "Family income below ₹4,00,000 / year"]),
      howItWorks: JSON.stringify([]),
    },
  });

  // Program 4 — Merit Excellence 2024 (ENDED)
  await prisma.program.create({
    data: {
      name: "Merit Excellence Grant 2024",
      orgName: "Infosys Foundation",
      tagline: "Merit-first grants for high-achieving students from low-income families.",
      mission: "Recognising outstanding academic achievement in students who lack the means to fulfil their potential.",
      goal: 2000000,
      raised: 1850000,
      donors: 880,
      scholarsFunded: 24,
      nominations: 96,
      avgGift: 1600,
      status: "ENDED",
      category: "Merit grant",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-12-31"),
      maxScholars: 30,
      eligibility: JSON.stringify(["Merit-based selection", "Family income below ₹5,00,000 / year"]),
      howItWorks: JSON.stringify([]),
    },
  });

  // Donations for Rohan
  await prisma.donation.createMany({
    data: [
      { userId: rohan.id, programId: p1.id, amount: 1000, type: "RECURRING", status: "ACTIVE", frequency: "monthly", startDate: new Date("2026-01-12"), createdAt: new Date("2026-01-12") },
      { userId: rohan.id, programId: p1.id, amount: 500, type: "PAYROLL", status: "ACTIVE", honour: "Smt. Lalita Mehta", frequency: "per paycheck", startDate: new Date("2026-05-01"), createdAt: new Date("2026-05-01") },
      { userId: rohan.id, programId: p1.id, amount: 2500, type: "ONE_TIME", status: "COMPLETED", createdAt: new Date("2026-04-18") },
      { userId: rohan.id, programId: p1.id, amount: 1000, type: "ONE_TIME", status: "COMPLETED", honour: "My professor, Dr. Rao", createdAt: new Date("2026-03-02") },
      { userId: rohan.id, programId: p1.id, amount: 3500, type: "ONE_TIME", status: "COMPLETED", createdAt: new Date("2026-01-14") },
    ],
  });

  // Donations for other users
  await prisma.donation.createMany({
    data: [
      { userId: sneha.id, programId: p1.id, amount: 2000, type: "ONE_TIME", status: "COMPLETED" },
      { userId: amit.id, programId: p1.id, amount: 5000, type: "RECURRING", status: "ACTIVE", frequency: "monthly" },
      { userId: priyanka.id, programId: p1.id, amount: 7500, type: "ONE_TIME", status: "COMPLETED" },
      { userId: karan.id, programId: p1.id, amount: 1000, type: "PAYROLL", status: "ACTIVE", frequency: "per paycheck" },
      { userId: vikram.id, programId: p1.id, amount: 2000, type: "RECURRING", status: "ACTIVE", frequency: "monthly" },
      { userId: aisha.id, programId: p1.id, amount: 3000, type: "PAYROLL", status: "ACTIVE", frequency: "per paycheck" },
      { userId: divya.id, programId: p1.id, amount: 6000, type: "PAYROLL", status: "ACTIVE", frequency: "per paycheck" },
    ],
  });

  // Nominations by Rohan
  const nom1 = await prisma.nomination.create({
    data: {
      userId: rohan.id, programId: p1.id,
      nomineeName: "Kavya Reddy", nomineeEmail: "kavya.reddy@gmail.com", nomineePhone: "98480 11223",
      relationship: "Student or mentee",
      reason: "Kavya tutors younger kids in her neighbourhood every evening after her own classes. She topped her board exams while supporting her family's tailoring work. She wants to study computer science but the family can't cover the fees.",
      status: "UNDER_REVIEW",
      createdAt: new Date("2026-05-20"),
    },
  });
  const nom2 = await prisma.nomination.create({
    data: {
      userId: rohan.id, programId: p1.id,
      nomineeName: "Imran Sheikh", nomineeEmail: "imran.sheikh@gmail.com", nomineePhone: "99701 44556",
      relationship: "Known to family",
      reason: "Imran lost his father two years ago and has kept his grades steady through it. He's been accepted into a mechanical engineering programme and is the first in his family to reach college.",
      status: "SHORTLISTED",
      createdAt: new Date("2026-05-08"),
    },
  });
  const nom3 = await prisma.nomination.create({
    data: {
      userId: rohan.id, programId: p1.id,
      nomineeName: "Ananya Das", nomineeEmail: "ananya.das@gmail.com", nomineePhone: "90510 77889",
      relationship: "Family friend",
      reason: "Ananya has wanted to be a doctor since she was nine. She scored in the top 2% of NEET while studying in a government school with no coaching. A scholarship would cover her first-year MBBS fees.",
      status: "SELECTED",
      createdAt: new Date("2026-04-26"),
    },
  });
  const nom4 = await prisma.nomination.create({
    data: {
      userId: rohan.id, programId: p1.id,
      nomineeName: "Rahul Verma", nomineeEmail: "rahul.verma@gmail.com", nomineePhone: "88260 33445",
      relationship: "Others",
      reason: "Rahul is a hardworking student from my hometown who needs support for his polytechnic diploma.",
      status: "NOT_SELECTED",
      createdAt: new Date("2026-03-30"),
    },
  });
  const nom5 = await prisma.nomination.create({
    data: {
      userId: rohan.id, programId: p1.id,
      nomineeName: "Sneha Joshi", nomineeEmail: "sneha.joshi@gmail.com", nomineePhone: "70420 99001",
      relationship: "Student or mentee",
      reason: "Sneha is a brilliant student I mentor through a weekend programme. She's aiming for a degree in architecture and has the portfolio to back it up, but no means to pay for it.",
      status: "SUBMITTED",
      createdAt: new Date("2026-03-22"),
    },
  });

  // Nominations from other users
  const nom6 = await prisma.nomination.create({
    data: {
      userId: karan.id, programId: p1.id,
      nomineeName: "Imran Sheikh", nomineeEmail: "imran.sheikh2@gmail.com", nomineePhone: "99701 55678",
      relationship: "Known to family",
      reason: "Imran is the brightest student from our village. He needs support to continue his engineering studies.",
      status: "SHORTLISTED",
      createdAt: new Date("2026-04-15"),
    },
  });
  const nom7 = await prisma.nomination.create({
    data: {
      userId: sneha.id, programId: p1.id,
      nomineeName: "Faizan Ahmed", nomineeEmail: "faizan.ahmed@gmail.com", nomineePhone: "70456 22334",
      relationship: "Student or mentee",
      reason: "Faizan is exceptionally talented and needs support to pursue his electrical engineering degree.",
      status: "SELECTED",
      createdAt: new Date("2026-03-10"),
    },
  });

  // Scholars
  const sc1 = await prisma.scholar.create({
    data: {
      name: "Priya Sharma", college: "Lady Shri Ram College, Delhi", course: "B.A. Economics",
      year: "1st year", hometown: "Sitapur, UP", programId: p1.id,
      totalAmount: 80000, disbursedAmount: 80000, utilizationStatus: "Verified",
    },
  });
  const sc2 = await prisma.scholar.create({
    data: {
      name: "Arjun Nair", college: "NIT Calicut", course: "B.Tech Civil Engineering",
      year: "2nd year", hometown: "Wayanad, Kerala", programId: p1.id,
      totalAmount: 120000, disbursedAmount: 80000, utilizationStatus: "Submitted",
      nextDisbursement: new Date("2026-07-01"),
    },
  });
  const sc3 = await prisma.scholar.create({
    data: {
      name: "Meena Pillai", college: "St. Xavier's College, Mumbai", course: "B.Sc Mathematics",
      year: "1st year", hometown: "Alappuzha, Kerala", programId: p1.id,
      totalAmount: 90000, disbursedAmount: 0, utilizationStatus: "Pending update",
      nextDisbursement: new Date("2026-06-15"),
    },
  });
  const sc4 = await prisma.scholar.create({
    data: {
      name: "Ananya Das", college: "Maulana Azad Medical College, Delhi", course: "MBBS",
      year: "1st year", hometown: "Howrah, WB", programId: p1.id, nominationId: nom3.id,
      totalAmount: 150000, disbursedAmount: 150000, utilizationStatus: "Verified",
    },
  });
  const sc5 = await prisma.scholar.create({
    data: {
      name: "Imran Sheikh", college: "VJTI, Mumbai", course: "B.Tech Mechanical",
      year: "1st year", hometown: "Nanded, Maharashtra", programId: p1.id,
      totalAmount: 100000, disbursedAmount: 0, utilizationStatus: "Pending update",
      nextDisbursement: new Date("2026-07-01"),
    },
  });
  const sc6 = await prisma.scholar.create({
    data: {
      name: "Faizan Ahmed", college: "Jadavpur University, Kolkata", course: "B.Tech Electrical",
      year: "1st year", hometown: "Asansol, WB", programId: p1.id, nominationId: nom7.id,
      totalAmount: 80000, disbursedAmount: 80000, utilizationStatus: "Submitted",
    },
  });

  // Disbursements
  await prisma.disbursement.createMany({
    data: [
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
    ],
  });

  console.log("Seeding complete.");
  console.log("\nTest accounts:");
  console.log("  Employee: rohan.mehta@infosys.com");
  console.log("  Admin:    admin@infosys.com");
  console.log("\nNote: OTP is sent via Resend. Check email or use mock OTP '1234' if RESEND_API_KEY is not set.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
