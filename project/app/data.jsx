// ── Mock data: Bright Futures Scholarship 2025 · Infosys Foundation ──
const PROGRAM = {
  name: "Bright Futures Scholarship 2025",
  org: "Infosys Foundation",
  tagline: "Helping first-generation students reach the colleges they earned a place in.",
  mission: "Every year, thousands of students earn a seat at a great college and then lose it — not for lack of merit, but for lack of fees. Bright Futures closes that gap. Your gift covers tuition, hostel, and study materials for students who are the first in their family to attend college, so a hard-won admission letter actually turns into a degree.",
  raised: 2500000,
  goal: 5000000,
  donors: 1284,
  scholarsFunded: 38,
  avgGift: 1950,
  nominations: 129,
  endDate: new Date("2026-08-31T23:59:59"),
  payrollCapPerMonth: 25000,
  howItWorks: [
    { icon: "gift", title: "You give", body: "Give once, monthly, or pledge straight from payroll — every rupee goes to a verified student." },
    { icon: "user", title: "We match", body: "Our reviewer panel matches your gift to a first-generation student who has earned their place." },
    { icon: "graduationCap", title: "They graduate", body: "Funds reach the college directly, in tranches, so the student can focus on studying — not fees." },
  ],
  eligibility: [
    "First-generation college student",
    "Family income below ₹4,00,000 / year",
    "Secured admission on merit",
    "Verified marks & income proof on file",
  ],
};

const STUDENTS = [
  { id: "s1", first: "Priya", name: "Priya Sharma", college: "Lady Shri Ram College, Delhi",
    course: "B.A. Economics", year: "1st year", hometown: "Sitapur, UP", photo: "student-priya",
    story: "Daughter of a cycle-repair shop owner, Priya topped her district and earned a seat in Delhi her family couldn't afford.",
    aspiration: "Shape rural economic policy" },
  { id: "s2", first: "Arjun", name: "Arjun Nair", college: "NIT Calicut",
    course: "B.Tech Civil", year: "2nd year", hometown: "Wayanad, Kerala", photo: "student-arjun",
    story: "Raised on a tea estate by a daily-wage mother, Arjun cleared the entrance with a rank that stunned his village.",
    aspiration: "Build roads for villages like his own" },
  { id: "s3", first: "Meena", name: "Meena Pillai", college: "St. Xavier's College, Mumbai",
    course: "B.Sc Mathematics", year: "1st year", hometown: "Alappuzha, Kerala", photo: "student-meena",
    story: "Meena lost her father young and was raised by her mother, a tailor in a small coastal town.",
    aspiration: "Teach maths where she grew up" },
  { id: "s4", first: "Imran", name: "Imran Sheikh", college: "VJTI, Mumbai",
    course: "B.Tech Mechanical", year: "1st year", hometown: "Nanded, Maharashtra", photo: "student-imran",
    story: "After losing his father two years ago, Imran kept his grades steady and became the first in his family at college.",
    aspiration: "Become a mechanical engineer" },
  { id: "s5", first: "Kavya", name: "Kavya Reddy", college: "Osmania University, Hyderabad",
    course: "B.Sc Computer Science", year: "1st year", hometown: "Warangal, Telangana", photo: "student-kavya",
    story: "Kavya tutors younger kids in her lane every evening while supporting her family's tailoring work.",
    aspiration: "Work in software and lift her family" },
  { id: "s6", first: "Ananya", name: "Ananya Das", college: "Maulana Azad Medical College, Delhi",
    course: "MBBS", year: "1st year", hometown: "Howrah, West Bengal", photo: "student-ananya",
    story: "Ananya scored in the top 2% of NEET from a government school with no coaching at all.",
    aspiration: "Become a doctor for her community" },
];

// Recent donations feed (program level) — floating ticker
const RECENT_DONATIONS = [
  { name: "Sneha Kapoor", amount: 2000, t: "just now" },
  { name: "Amit Joshi", amount: 5000, t: "3 min ago" },
  { name: "Priyanka Sinha", amount: 7500, t: "12 min ago" },
  { name: "Karan Patel", amount: 1000, t: "40 min ago" },
  { name: "Vikram Rao", amount: 2000, t: "2 hours ago" },
  { name: "Neha Gupta", amount: 1500, t: "5 hours ago" },
  { name: "Aisha Khan", amount: 3000, t: "Yesterday" },
  { name: "Mohit Bansal", amount: 4000, t: "2 days ago" },
];

const TEAMS = [
  { name: "Engineering", amount: 412000, donors: 410, total: 520 },
  { name: "Product", amount: 318500, donors: 240, total: 300 },
  { name: "Sales", amount: 264000, donors: 240, total: 380 },
  { name: "Operations", amount: 191000, donors: 210, total: 340 },
  { name: "Marketing", amount: 142500, donors: 184, total: 300 },
  { name: "Customer Success", amount: 128000, donors: 96, total: 120 },
  { name: "Finance", amount: 112000, donors: 78, total: 110 },
  { name: "Design", amount: 98000, donors: 62, total: 80 },
  { name: "People & Culture", amount: 86000, donors: 54, total: 75 },
  { name: "Data Science", amount: 81000, donors: 88, total: 130 },
  { name: "Quality Assurance", amount: 74000, donors: 70, total: 115 },
  { name: "IT & Security", amount: 69000, donors: 60, total: 105 },
  { name: "Legal", amount: 52000, donors: 28, total: 45 },
  { name: "Procurement", amount: 44000, donors: 33, total: 60 },
  { name: "Facilities", amount: 38000, donors: 40, total: 90 },
  { name: "Research", amount: 35000, donors: 31, total: 70 },
  { name: "Partnerships", amount: 31000, donors: 22, total: 50 },
  { name: "Support", amount: 28000, donors: 64, total: 160 },
  { name: "Pre-Sales", amount: 24000, donors: 26, total: 70 },
  { name: "Admin", amount: 16000, donors: 18, total: 55 },
].map(t => ({ ...t, pct: Math.round((t.donors / t.total) * 100) })).sort((a, b) => b.pct - a.pct);

// Nomination leaderboard — departments ranked by students put forward
const TEAMS_NOMINATIONS = [
  { name: "Engineering", count: 38 },
  { name: "Operations", count: 31 },
  { name: "Product", count: 27 },
  { name: "Marketing", count: 19 },
  { name: "Sales", count: 14 },
  { name: "Customer Success", count: 12 },
  { name: "Data Science", count: 11 },
  { name: "Finance", count: 9 },
  { name: "Design", count: 8 },
  { name: "People & Culture", count: 7 },
  { name: "IT & Security", count: 6 },
  { name: "Quality Assurance", count: 5 },
  { name: "Legal", count: 4 },
  { name: "Support", count: 4 },
  { name: "Research", count: 3 },
  { name: "Procurement", count: 3 },
  { name: "Partnerships", count: 2 },
  { name: "Facilities", count: 2 },
  { name: "Pre-Sales", count: 1 },
  { name: "Admin", count: 1 },
].sort((a, b) => b.count - a.count);

// Reward for the winning team
const LEADERBOARD_REWARD = "Lunch on us — ₹750 food coupons for every member of the #1 team when the programme closes.";

const EMPLOYEE = { name: "Rohan Mehta", team: "Product", totalDonated: 8500, scholarsSupported: 3, nominationsSubmitted: 5 };

// Achievement badges — the employee's own
const MY_BADGES = [
  { id: "b1", name: "First gift", desc: "Made your first donation", icon: "gift", tone: "primary", earned: true, date: "14 Jan 2026" },
  { id: "b2", name: "Recurring giver", desc: "Set up a monthly donation", icon: "repeat", tone: "primary", earned: true, date: "12 Jan 2026" },
  { id: "b3", name: "Payroll pledger", desc: "Pledged straight from salary", icon: "wallet", tone: "primary", earned: true, date: "1 May 2026" },
  { id: "b4", name: "Talent scout", desc: "Nominated 5 students", icon: "userCheck", tone: "success", earned: true, date: "20 May 2026" },
  { id: "b5", name: "In their honour", desc: "Gave in honour of someone", icon: "heart", tone: "success", earned: true, date: "2 Mar 2026" },
  { id: "b6", name: "Scholar circle", desc: "Support 5 scholars", icon: "graduationCap", earned: false, progress: { value: 3, target: 5 } },
  { id: "b7", name: "Champion giver", desc: "Give ₹25,000 in total", icon: "trophy", earned: false, progress: { value: 8500, target: 25000, money: true } },
];

// Achievement badges — the employee's team (Product)
const TEAM_BADGES = [
  { id: "t1", name: "Half on board", desc: "Half the team has given", icon: "users", tone: "primary", earned: true },
  { id: "t2", name: "Podium finish", desc: "Top 3 on the leaderboard", icon: "trophy", tone: "success", earned: true },
  { id: "t3", name: "Early movers", desc: "Gave in the first week", icon: "rocket", tone: "primary", earned: true },
  { id: "t4", name: "Full house", desc: "Every member donates", icon: "checkCircle", earned: false, progress: { value: 14, target: 22 } },
  { id: "t5", name: "Century of nominations", desc: "100 nominations from the team", icon: "userCheck", earned: false, progress: { value: 27, target: 100 } },
];

// Peer employees for sharing the celebration
const PEERS = [
  { name: "Aisha Khan", team: "Product" },
  { name: "Vikram Rao", team: "Product" },
  { name: "Neha Gupta", team: "Engineering" },
  { name: "Sandeep Iyer", team: "Operations" },
  { name: "Divya Menon", team: "Sales" },
];

// The user's own team roster — who has and hasn't donated yet (for the post-donation nudge)
const MY_TEAM_MEMBERS = [
  { name: "Rohan Mehta", donated: true, nominated: true },
  { name: "Aisha Khan", donated: true, nominated: true },
  { name: "Vikram Rao", donated: true, nominated: false },
  { name: "Sara DSouza", donated: false, nominated: false },
  { name: "Nikhil Jain", donated: false, nominated: false },
  { name: "Pooja Hegde", donated: false, nominated: true },
  { name: "Tarun Malhotra", donated: false, nominated: false },
  { name: "Ritika Bose", donated: false, nominated: false },
];

// Donations — includes one active recurring and one payroll pledge so the manage flow is visible
const DONATIONS = [
  { id: "d1", date: "12 May 2026", amount: 1000, type: "recurring", program: PROGRAM.name,
    honour: null, frequency: "monthly", startDate: "12 Jan 2026", status: "active" },
  { id: "d2", date: "01 May 2026", amount: 500, type: "payroll", program: PROGRAM.name,
    honour: "Smt. Lalita Mehta", frequency: "per paycheck", startDate: "01 May 2026", status: "pending" },
  { id: "d3", date: "18 Apr 2026", amount: 2500, type: "one-time", program: PROGRAM.name, honour: null, status: "completed" },
  { id: "d4", date: "02 Mar 2026", amount: 1000, type: "one-time", program: PROGRAM.name, honour: "My professor, Dr. Rao", status: "completed" },
  { id: "d5", date: "14 Jan 2026", amount: 3500, type: "one-time", program: PROGRAM.name, honour: null, status: "completed" },
];

// Nominations — mixed statuses so all chips are visible
const NOMINATIONS = [
  { id: "n1", name: "Kavya Reddy", date: "20 May 2026", relationship: "Student or mentee", email: "kavya.reddy@gmail.com", phone: "98480 11223",
    status: "Under review", reason: "Kavya tutors younger kids in her neighbourhood every evening after her own classes. She topped her board exams while supporting her family's tailoring work. She wants to study computer science but the family can't cover the fees." },
  { id: "n2", name: "Imran Sheikh", date: "08 May 2026", relationship: "Known to family", email: "imran.sheikh@gmail.com", phone: "99701 44556",
    status: "Shortlisted", reason: "Imran lost his father two years ago and has kept his grades steady through it. He's been accepted into a mechanical engineering programme and is the first in his family to reach college." },
  { id: "n3", name: "Ananya Das", date: "26 Apr 2026", relationship: "Family friend", email: "ananya.das@gmail.com", phone: "90510 77889",
    status: "Selected", reason: "Ananya has wanted to be a doctor since she was nine. She scored in the top 2% of NEET while studying in a government school with no coaching. A scholarship would cover her first-year MBBS fees." },
  { id: "n4", name: "Rahul Verma", date: "30 Mar 2026", relationship: "Others", email: "rahul.verma@gmail.com", phone: "88260 33445",
    status: "Not selected", reason: "Rahul is a hardworking student from my hometown who needs support for his polytechnic diploma." },
  { id: "n5", name: "Sneha Joshi", date: "22 Mar 2026", relationship: "Student or mentee", email: "sneha.joshi@gmail.com", phone: "70420 99001",
    status: "Submitted", reason: "Sneha is a brilliant student I mentor through a weekend programme. She's aiming for a degree in architecture and has the portfolio to back it up, but no means to pay for it." },
];

// All scholars funded under the active programme
const SCHOLARS = [
  { id: "sc1", name: "Priya Sharma", college: "Lady Shri Ram College, Delhi", course: "B.A. Economics", year: "1st year", hometown: "Sitapur, UP", status: "Disbursed", source: "pool" },
  { id: "sc2", name: "Arjun Nair", college: "NIT Calicut", course: "B.Tech Civil Engineering", year: "2nd year", hometown: "Wayanad, Kerala", status: "Disbursed", source: "pool" },
  { id: "sc3", name: "Meena Pillai", college: "St. Xavier's College, Mumbai", course: "B.Sc Mathematics", year: "1st year", hometown: "Alappuzha, Kerala", status: "Processing", source: "nomination", nominator: "Rohan Mehta", nominatorTeam: "Product", you: true },
  { id: "sc4", name: "Ananya Das", college: "Maulana Azad Medical College, Delhi", course: "MBBS", year: "1st year", hometown: "Howrah, WB", status: "Disbursed", source: "nomination", nominator: "Rohan Mehta", nominatorTeam: "Product", you: true },
  { id: "sc5", name: "Imran Sheikh", college: "VJTI, Mumbai", course: "B.Tech Mechanical", year: "1st year", hometown: "Nanded, Maharashtra", status: "Processing", source: "nomination", nominator: "Karan Patel", nominatorTeam: "Operations" },
  { id: "sc6", name: "Aditya Pawar", college: "COEP, Pune", course: "B.Tech Computer Engineering", year: "1st year", hometown: "Solapur, Maharashtra", status: "Disbursed", source: "pool" },
  { id: "sc7", name: "Meera Krishnan", college: "Stella Maris College, Chennai", course: "B.Com", year: "1st year", hometown: "Madurai, Tamil Nadu", status: "Upcoming", source: "pool" },
  { id: "sc8", name: "Faizan Ahmed", college: "Jadavpur University, Kolkata", course: "B.Tech Electrical", year: "1st year", hometown: "Asansol, WB", status: "Disbursed", source: "nomination", nominator: "Sneha Kapoor", nominatorTeam: "Engineering" },
];

const SCHOLAR_STATUS_TONE = { Disbursed: "success", Processing: "warning", Upcoming: "muted" };

const RELATIONSHIPS = ["Family friend", "Known to family", "Student or mentee", "Others"];

const NOM_STATUS_TONE = {
  "Submitted": "muted",
  "Under review": "info",
  "Shortlisted": "warning",
  "Selected": "success",
  "Not selected": "destructive",
};

function daysLeft(end) {
  return Math.max(0, Math.ceil((end - new Date("2026-05-29")) / 86400000));
}

// Full donor wall — names, amounts, dates (most recent first)
const DONOR_LIST = [
  { name: "Sneha Kapoor", amount: 2000, date: "29 May 2026", team: "Engineering", type: "one-time" },
  { name: "Amit Joshi", amount: 5000, date: "29 May 2026", team: "Sales", type: "recurring" },
  { name: "Priyanka Sinha", amount: 7500, date: "28 May 2026", team: "Engineering", type: "one-time" },
  { name: "Karan Patel", amount: 1000, date: "28 May 2026", team: "Operations", type: "payroll" },
  { name: "Vikram Rao", amount: 2000, date: "27 May 2026", team: "Product", type: "recurring" },
  { name: "Neha Gupta", amount: 1500, date: "27 May 2026", team: "Marketing", type: "one-time" },
  { name: "Aisha Khan", amount: 3000, date: "26 May 2026", team: "Product", type: "payroll" },
  { name: "Mohit Bansal", amount: 4000, date: "25 May 2026", team: "Operations", type: "one-time" },
  { name: "Rohan Mehta", amount: 2500, date: "24 May 2026", team: "Product", type: "recurring" },
  { name: "Sandeep Iyer", amount: 1000, date: "23 May 2026", team: "Operations", type: "one-time" },
  { name: "Divya Menon", amount: 6000, date: "22 May 2026", team: "Sales", type: "payroll" },
  { name: "Anjali Desai", amount: 500, date: "21 May 2026", team: "Sales", type: "one-time" },
  { name: "Rahul Verma", amount: 2000, date: "20 May 2026", team: "Marketing", type: "recurring" },
  { name: "Pooja Reddy", amount: 3500, date: "19 May 2026", team: "Engineering", type: "one-time" },
  { name: "Tanvi Shah", amount: 1000, date: "18 May 2026", team: "Marketing", type: "payroll" },
  { name: "Arjun Khanna", amount: 10000, date: "16 May 2026", team: "Engineering", type: "one-time" },
  { name: "Meera Iyer", amount: 1500, date: "15 May 2026", team: "Operations", type: "recurring" },
  { name: "Suresh Nair", amount: 2500, date: "14 May 2026", team: "Product", type: "payroll" },
];
const DONATION_TYPE_LABEL = { "one-time": "One-time", recurring: "Recurring", payroll: "Payroll giving" };
const DONATION_TYPE_TONE = { "one-time": "muted", recurring: "info", payroll: "warning" };

// Programme FAQs (accordion)
const PROGRAM_FAQS = [
  { q: "Where does my donation go?", a: "Every rupee is sent directly to a verified student's college towards tuition, hostel, or study materials. Funds are released in tranches against fee receipts, so they are only used for the purpose intended." },
  { q: "Can I choose which student I support?", a: "You can give to the programme and let our reviewer panel match your gift to the student who needs it most, or nominate a specific student yourself. Either way, every recipient is verified for merit and need." },
  { q: "Is my donation eligible for tax benefits?", a: "Donations to the Infosys Foundation programme are eligible for tax exemption under Section 80G. You'll receive a receipt by email after each contribution." },
  { q: "What is a payroll pledge?", a: "A payroll pledge lets you give a fixed amount each pay cycle, deducted automatically by HR. No payment is needed up front, and you can pause or cancel anytime from My Donations." },
  { q: "Can I cancel or change a recurring donation?", a: "Yes. Recurring donations and payroll pledges can be paused, edited, or cancelled at any time from the My Donations page — future deductions stop immediately." },
  { q: "How do I know my gift made a difference?", a: "You can follow the students you've funded under Scholars I Funded, including their disbursement status. Where students share updates, you'll see them there too." },
];

// Code of practice — our promises to donors
const CODE_OF_PRACTICE = [
  { icon: "heart", title: "No guilt-tripping or pressure", body: "Every appeal respects your choice to give, without emotional coercion." },
  { icon: "shieldCheck", title: "Transparent use of funds", body: "Donations are tracked and used only for verified needs, with clear updates where possible." },
  { icon: "bellOff", title: "No spam for donations", body: "You'll never receive phone calls or WhatsApp messages asking you to donate more." },
];

// A second live programme — proves the listing handles multiple active programmes.
const PROGRAM2 = {
  name: "Girls in STEM Fellowship 2026",
  org: "Infosys Foundation",
  tagline: "Backing young women who've earned a place in engineering and science — so fees never end the dream.",
  mission: "Across India, bright young women win seats in engineering and science programmes, then drop out when families can't stretch to fees and hostel costs. The Girls in STEM Fellowship keeps them enrolled — funding tuition, lab fees, and living costs for women who are often the first in their family to study a technical degree.",
  raised: 820000,
  goal: 3000000,
  donors: 540,
  scholarsFunded: 12,
  avgGift: 1750,
  nominations: 41,
  endDate: new Date("2026-09-30T23:59:59"),
  payrollCapPerMonth: 25000,
  howItWorks: [
    { icon: "gift", title: "You give", body: "Give once, monthly, or pledge from payroll — every rupee funds a young woman in STEM." },
    { icon: "user", title: "We match", body: "Our reviewer panel matches your gift to a fellow who has earned her place on merit." },
    { icon: "graduationCap", title: "She graduates", body: "Funds reach the college directly, in tranches, so she can focus on her degree — not fees." },
  ],
  eligibility: [
    "Woman pursuing a STEM degree",
    "Family income below ₹5,00,000 / year",
    "Secured admission on merit",
    "Verified marks & income proof on file",
  ],
};

// Programmes the employee can browse — live programmes (with full detail) + past cohorts.
const EMPLOYEE_PROGRAMS = [
  { id: "bright-2025", live: true, status: "Active", category: "First-generation college",
    name: PROGRAM.name, org: PROGRAM.org, tagline: PROGRAM.tagline,
    raised: PROGRAM.raised, goal: PROGRAM.goal, donors: PROGRAM.donors, scholars: PROGRAM.scholarsFunded, endDate: PROGRAM.endDate,
    detail: PROGRAM },
  { id: "girls-stem-2026", live: true, status: "Active", category: "Women in STEM",
    name: PROGRAM2.name, org: PROGRAM2.org, tagline: PROGRAM2.tagline,
    raised: PROGRAM2.raised, goal: PROGRAM2.goal, donors: PROGRAM2.donors, scholars: PROGRAM2.scholarsFunded, endDate: PROGRAM2.endDate,
    detail: PROGRAM2 },
  { id: "bright-2024", live: false, status: "Completed", category: "First-generation college",
    name: "Bright Futures Scholarship 2024", org: "Infosys Foundation",
    tagline: "The 2024 cohort — fully funded, now graduating across India.",
    raised: 4200000, goal: 4000000, donors: 1520, scholars: 71, closedOn: "Aug 2025" },
  { id: "merit-2024", live: false, status: "Completed", category: "Merit grant",
    name: "Merit Excellence Grant 2024", org: "Infosys Foundation",
    tagline: "Merit-first grants for high-achieving students from low-income families.",
    raised: 1850000, goal: 2000000, donors: 880, scholars: 24, closedOn: "Dec 2024" },
];

// The programme currently being viewed (set when an employee opens one from the listing).
window.ACTIVE_PROGRAM = PROGRAM;
window.setActiveProgram = (p) => { window.ACTIVE_PROGRAM = p || PROGRAM; };

Object.assign(window, { PROGRAM, PROGRAM2, EMPLOYEE_PROGRAMS, STUDENTS, RECENT_DONATIONS, DONOR_LIST, DONATION_TYPE_LABEL, DONATION_TYPE_TONE, PROGRAM_FAQS, CODE_OF_PRACTICE, TEAMS, TEAMS_NOMINATIONS, LEADERBOARD_REWARD, MY_TEAM_MEMBERS, EMPLOYEE, MY_BADGES, TEAM_BADGES, PEERS, DONATIONS, NOMINATIONS, SCHOLARS, SCHOLAR_STATUS_TONE, RELATIONSHIPS, NOM_STATUS_TONE, daysLeft });
