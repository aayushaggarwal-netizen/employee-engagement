// ── Admin mock data — Infosys Foundation · Bright Futures Scholarship 2025 ──

const COMPANY = { name: "Infosys", foundation: "Infosys Foundation", website: "infosysfoundation.org", industry: "Information Technology", totalEmployees: 1840 };

const ADMIN_USER = { name: "Sana Verma", email: "sana.verma@infosys.com", role: "Program Admin" };

// ── Programs ──
const PROGRAMS = [
  { id: "p1", name: "Bright Futures Scholarship 2025", org: "Infosys Foundation", status: "Active",
    goal: 5000000, raised: 2500000, start: "01 Jan 2026", end: "31 Aug 2026", maxScholars: 50, donors: 1284, applicants: 612, scholars: 38,
    description: "Helping first-generation students reach the colleges they earned a place in. Covers tuition, hostel, and learning materials for selected scholars across India." },
  { id: "p0", name: "Bright Futures Scholarship 2024", org: "Infosys Foundation", status: "Ended",
    goal: 4000000, raised: 4200000, start: "01 Jan 2025", end: "31 Aug 2025", maxScholars: 70, donors: 1520, applicants: 740, scholars: 71,
    description: "The 2024–25 cohort of Bright Futures. Funded tuition, hostel, and learning materials for first-generation scholars across India." },
  { id: "pm", name: "Merit Excellence Grant 2024", org: "Infosys Foundation", status: "Ended",
    goal: 2000000, raised: 1850000, start: "01 Mar 2024", end: "31 Dec 2024", maxScholars: 25, donors: 880, applicants: 410, scholars: 24,
    description: "A merit-first grant for high-achieving students from low-income families, covering one academic year of fees." },
];

// ── Portfolio (account-level, Home only) — lifetime view across all programmes ──
// The Programs listing intentionally shows only the active programme; these past
// programmes feed Home's lifetime totals and the "all programmes" strip.
const PROGRAM_PORTFOLIO = [
  { id: "p1", name: "Bright Futures Scholarship 2025", status: "Active", raised: 2500000, goal: 5000000, scholars: 38, year: "2025–26" },
  { id: "p0", name: "Bright Futures Scholarship 2024", status: "Ended", raised: 4200000, goal: 4000000, scholars: 71, year: "2024–25" },
  { id: "pm", name: "Merit Excellence Grant 2024", status: "Ended", raised: 1850000, goal: 2000000, scholars: 24, year: "2024" },
];
const PORTFOLIO_TOTALS = {
  raised: PROGRAM_PORTFOLIO.reduce((s, p) => s + p.raised, 0),
  scholars: PROGRAM_PORTFOLIO.reduce((s, p) => s + p.scholars, 0),
  active: PROGRAM_PORTFOLIO.filter(p => p.status === "Active").length,
  ended: PROGRAM_PORTFOLIO.filter(p => p.status === "Ended").length,
  totalEmployees: 1840,
  lifetimeDonors: 1612,
};

// ── Employees ──
const ADMIN_EMPLOYEES = [
  { id: "e1", name: "Rohan Mehta", email: "rohan.mehta@infosys.com", dept: "Product", status: "Active", joined: "12 Jan 2026", donated: 8500,
    pledges: [{ type: "recurring", amount: 1000, freq: "monthly", status: "Active" }, { type: "payroll", amount: 500, freq: "per paycheck", status: "Pending HR" }],
    history: [
      { date: "12 May 2026", amount: 1000, type: "Recurring" },
      { date: "18 Apr 2026", amount: 2500, type: "One-time" },
      { date: "02 Mar 2026", amount: 1000, type: "One-time" },
      { date: "14 Jan 2026", amount: 3500, type: "One-time" },
    ],
    noms: [{ name: "Kavya Reddy", status: "Under review" }, { name: "Imran Sheikh", status: "Shortlisted" }, { name: "Ananya Das", status: "Selected" }] },
  { id: "e2", name: "Sneha Kapoor", email: "sneha.kapoor@infosys.com", dept: "Engineering", status: "Active", joined: "08 Jan 2026", donated: 12000,
    pledges: [{ type: "recurring", amount: 2000, freq: "monthly", status: "Active" }],
    history: [{ date: "10 May 2026", amount: 2000, type: "Recurring" }, { date: "10 Apr 2026", amount: 2000, type: "Recurring" }, { date: "15 Feb 2026", amount: 5000, type: "One-time" }],
    noms: [{ name: "Faizan Ahmed", status: "Pending" }] },
  { id: "e3", name: "Amit Joshi", email: "amit.joshi@infosys.com", dept: "Sales", status: "Active", joined: "15 Jan 2026", donated: 5000,
    pledges: [], history: [{ date: "20 Mar 2026", amount: 5000, type: "One-time" }], noms: [] },
  { id: "e4", name: "Divya Nair", email: "divya.nair@infosys.com", dept: "Marketing", status: "Pending", joined: "—", donated: 0, pledges: [], history: [], noms: [] },
  { id: "e5", name: "Karan Patel", email: "karan.patel@infosys.com", dept: "Operations", status: "Active", joined: "20 Jan 2026", donated: 3000,
    pledges: [{ type: "payroll", amount: 1000, freq: "per paycheck", status: "Active" }],
    history: [{ date: "01 May 2026", amount: 1000, type: "Payroll" }, { date: "01 Apr 2026", amount: 1000, type: "Payroll" }, { date: "12 Feb 2026", amount: 1000, type: "One-time" }], noms: [] },
  { id: "e6", name: "Priyanka Sinha", email: "priyanka.sinha@infosys.com", dept: "Engineering", status: "Active", joined: "22 Jan 2026", donated: 7500,
    pledges: [], history: [{ date: "28 Apr 2026", amount: 7500, type: "One-time" }], noms: [{ name: "Sneha Joshi", status: "Pending" }] },
  { id: "e7", name: "Vikram Rao", email: "vikram.rao@infosys.com", dept: "Product", status: "Active", joined: "05 Feb 2026", donated: 2000,
    pledges: [], history: [{ date: "06 Feb 2026", amount: 2000, type: "One-time" }], noms: [] },
  { id: "e8", name: "Anjali Desai", email: "anjali.desai@infosys.com", dept: "Sales", status: "Pending", joined: "—", donated: 0, pledges: [], history: [], noms: [] },
  { id: "e9", name: "Mohit Bansal", email: "mohit.bansal@infosys.com", dept: "Operations", status: "Offboarded", joined: "10 Jan 2026", donated: 4000,
    pledges: [], history: [{ date: "11 Jan 2026", amount: 4000, type: "One-time" }], noms: [] },
  { id: "e10", name: "Neha Gupta", email: "neha.gupta@infosys.com", dept: "Marketing", status: "Active", joined: "18 Feb 2026", donated: 1500,
    pledges: [], history: [{ date: "19 Feb 2026", amount: 1500, type: "One-time" }], noms: [] },
];

const DEPARTMENTS = ["Engineering", "Product", "Sales", "Marketing", "Operations"];
const EMP_STATUS_TONE = { Active: "success", Pending: "warning", Offboarded: "muted" };

// ── Nominations (reviewer console) ──
const ADMIN_NOM_STATUS_TONE = { Pending: "muted", "Under review": "info", Shortlisted: "warning", Selected: "success", Rejected: "destructive" };

// Unified applicant pipeline stages (Registered → … → Scholar, with Reject as an off-ramp)
const STAGE_ORDER = ["Registered", "Applied", "Shortlisted", "Document verified", "Video interview done", "Audio interview done", "Selected", "Scholar"];
const APPLICANT_STAGE_TONE = {
  "Registered": "muted", "Applied": "info", "Shortlisted": "warning",
  "Document verified": "info", "Video interview done": "info", "Audio interview done": "info",
  "Selected": "success", "Scholar": "success", "Reject": "destructive",
};

const ADMIN_NOMINATIONS = [
  { id: "an1", name: "Ananya Das", email: "ananya.das@gmail.com", phone: "+91 98201 44521", college: "Maulana Azad Medical College, Delhi", course: "MBBS", year: "1st year",
    nominatedBy: "Rohan Mehta", relationship: "Family friend", date: "26 Apr 2026", source: "Nomination", status: "Selected", needScore: 92,
    reason: "Ananya has wanted to be a doctor since she was nine. She scored in the top 2% of NEET while studying in a government school with no coaching. Her father drives an auto-rickshaw and her mother does tailoring work from home. A scholarship would cover her first-year MBBS fees, which the family cannot afford on their own.",
    docs: [{ name: "NEET scorecard", type: "marksheet" }, { name: "Income certificate", type: "income" }],
    log: [{ s: "Submitted", by: "Rohan Mehta", d: "26 Apr 2026" }, { s: "Under review", by: "Sana Verma", d: "28 Apr 2026" }, { s: "Shortlisted", by: "Sana Verma", d: "02 May 2026" }, { s: "Selected", by: "Sana Verma", d: "08 May 2026" }] },
  { id: "an2", name: "Imran Sheikh", email: "imran.sheikh@gmail.com", phone: "+91 99876 21344", college: "VJTI, Mumbai", course: "B.Tech Mechanical Engineering", year: "1st year",
    nominatedBy: "Rohan Mehta", relationship: "Known to family", date: "08 May 2026", source: "Nomination", status: "Video interview done", needScore: 86,
    reason: "Imran lost his father two years ago and has kept his grades steady through it. He's been accepted into a mechanical engineering programme and is the first in his family to reach college. His mother supports three children on a single income.",
    docs: [{ name: "Class 12 marksheet", type: "marksheet" }, { name: "Income proof", type: "income" }],
    log: [{ s: "Submitted", by: "Rohan Mehta", d: "08 May 2026" }, { s: "Under review", by: "Sana Verma", d: "10 May 2026" }, { s: "Shortlisted", by: "Sana Verma", d: "14 May 2026" }] },
  { id: "an3", name: "Kavya Reddy", email: "kavya.reddy@gmail.com", phone: "+91 90123 88765", college: "Osmania University, Hyderabad", course: "B.Sc Computer Science", year: "1st year",
    nominatedBy: "Rohan Mehta", relationship: "Student or mentee", date: "20 May 2026", source: "Nomination", status: "Shortlisted", needScore: 88,
    reason: "Kavya tutors younger kids in her neighbourhood every evening after her own classes. She topped her board exams while supporting her family's tailoring work. She wants to study computer science but the family can't cover the fees.",
    docs: [{ name: "Board marksheet", type: "marksheet" }],
    log: [{ s: "Submitted", by: "Rohan Mehta", d: "20 May 2026" }, { s: "Under review", by: "Sana Verma", d: "22 May 2026" }] },
  { id: "an4", name: "Faizan Ahmed", email: "faizan.ahmed@gmail.com", phone: "+91 98330 71229", college: "Jadavpur University, Kolkata", course: "B.Tech Electrical Engineering", year: "1st year",
    nominatedBy: "Sneha Kapoor", relationship: "Student or mentee", date: "24 May 2026", source: "Nomination", status: "Registered", needScore: null,
    reason: "Faizan is a bright student I've mentored at a coding bootcamp for underprivileged youth. He cleared the state engineering entrance with an excellent rank. His family runs a small grocery shop and cannot fund his hostel and tuition together.",
    docs: [{ name: "Entrance rank card", type: "marksheet" }],
    log: [{ s: "Submitted", by: "Sneha Kapoor", d: "24 May 2026" }] },
  { id: "an5", name: "Sneha Joshi", email: "sneha.joshi@gmail.com", phone: "+91 91456 33210", college: "CEPT University, Ahmedabad", course: "B.Arch", year: "1st year",
    nominatedBy: "Priyanka Sinha", relationship: "Student or mentee", date: "22 May 2026", source: "Nomination", status: "Applied", needScore: null,
    reason: "Sneha is a brilliant student I mentor through a weekend programme. She's aiming for a degree in architecture and has the portfolio to back it up, but no means to pay for it.",
    docs: [],
    log: [{ s: "Submitted", by: "Priyanka Sinha", d: "22 May 2026" }] },
  { id: "an6", name: "Rahul Verma", email: "rahul.verma@gmail.com", phone: "+91 97001 55432", college: "Government Polytechnic, Pune", course: "Diploma in Civil Engineering", year: "1st year",
    nominatedBy: "Amit Joshi", relationship: "Others", date: "30 Mar 2026", source: "Nomination", status: "Reject", needScore: 54,
    reason: "Rahul is a hardworking student from my hometown who needs support for his polytechnic diploma.",
    docs: [],
    log: [{ s: "Submitted", by: "Amit Joshi", d: "30 Mar 2026" }, { s: "Under review", by: "Sana Verma", d: "02 Apr 2026" }, { s: "Rejected", by: "Sana Verma", d: "06 Apr 2026", note: "Nomination lacked supporting documents and detail; income criteria not evidenced." }] },
  { id: "an7", name: "Meera Krishnan", email: "meera.k@gmail.com", phone: "+91 99445 67120", college: "Stella Maris College, Chennai", course: "B.Com", year: "1st year",
    nominatedBy: "Karan Patel", relationship: "Known to family", date: "18 May 2026", source: "Nomination", status: "Document verified", needScore: 79,
    reason: "Meera is the eldest of four children. She scored 94% in commerce and wants to become a chartered accountant. Her father is a daily-wage worker and the family's income is irregular.",
    docs: [{ name: "Class 12 marksheet", type: "marksheet" }, { name: "Income affidavit", type: "income" }],
    log: [{ s: "Submitted", by: "Karan Patel", d: "18 May 2026" }, { s: "Under review", by: "Sana Verma", d: "21 May 2026" }] },
  { id: "an8", name: "Aditya Pawar", email: "aditya.pawar@gmail.com", phone: "+91 90909 12345", college: "COEP Pune", course: "B.Tech Computer Engineering", year: "1st year",
    nominatedBy: "Vikram Rao", relationship: "Family friend", date: "12 May 2026", source: "Nomination", status: "Audio interview done", needScore: 83,
    reason: "Aditya is a focused student who has overcome a difficult home situation. He scored among the top in his entrance exam and has been admitted to one of the state's best engineering colleges.",
    docs: [{ name: "Entrance scorecard", type: "marksheet" }],
    log: [{ s: "Submitted", by: "Vikram Rao", d: "12 May 2026" }, { s: "Under review", by: "Sana Verma", d: "15 May 2026" }, { s: "Shortlisted", by: "Sana Verma", d: "19 May 2026" }] },
];

// ── Scholars (Selected nominees being funded) ──
const ADMIN_SCHOLARS = [
  { id: "as1", name: "Priya Sharma", college: "IIT Bombay", course: "B.Tech Computer Science", currentClass: "2nd year", source: "Pre-verified", nominatedBy: null, program: "Bright Futures Scholarship 2025",
    total: 120000, disbursed: 80000, nextDate: "15 Jul 2026", utilization: "Verified",
    tranches: [
      { n: 1, amount: 40000, date: "15 Jan 2026", status: "Confirmed" },
      { n: 2, amount: 40000, date: "15 Apr 2026", status: "Released" },
      { n: 3, amount: 40000, date: "15 Jul 2026", status: "Scheduled" },
    ],
    updates: [{ date: "20 Apr 2026", text: "Used tranche 2 for semester tuition and hostel mess fees.", doc: "Fee receipt — Sem 2" }],
    notes: "Strong academic record. Maintaining 9.1 CGPA. Utilization proofs submitted promptly.",
    gratitude: "This scholarship lifted a weight off my parents that they had carried for years. I no longer sit in class worrying about the next fee deadline — I get to just learn. I promise to make every rupee count, and one day to do this for someone else.",
    gratitudeDate: "22 Apr 2026",
    media: [
      { type: "video", label: "A thank-you message", caption: "Priya recorded this after getting her scholarship", duration: "0:52" },
      { type: "image", label: "In the campus lab", caption: "First robotics project" },
      { type: "image", label: "With my parents", caption: "Sharing the news at home" },
    ] },
  { id: "as2", name: "Arjun Nair", college: "NIT Trichy", course: "B.Tech Civil Engineering", currentClass: "1st year", source: "Nominated", nominatedBy: "Rohan Mehta", program: "Bright Futures Scholarship 2025",
    total: 90000, disbursed: 45000, nextDate: "10 Aug 2026", utilization: "Submitted",
    tranches: [
      { n: 1, amount: 45000, date: "20 Jan 2026", status: "Confirmed" },
      { n: 2, amount: 45000, date: "10 Aug 2026", status: "Scheduled" },
    ],
    updates: [{ date: "10 Mar 2026", text: "Tranche 1 covered first-year tuition. Receipt attached.", doc: "Tuition receipt — Year 1" }],
    notes: "Awaiting verification of latest utilization document.",
    gratitude: "I am the first in my family to go to an engineering college. Rohan believed in me before anyone else did, and this scholarship made it real. Thank you for seeing a future in a boy from a tea estate.",
    gratitudeDate: "12 Mar 2026",
    media: [
      { type: "video", label: "My first month at NIT", caption: "Arjun's video diary", duration: "1:14" },
      { type: "image", label: "Hostel room", caption: "Settling in" },
    ] },
  { id: "as3", name: "Meena Pillai", college: "Delhi University", course: "B.Sc Mathematics", currentClass: "1st year", source: "Pre-verified", nominatedBy: null, program: "Bright Futures Scholarship 2025",
    total: 60000, disbursed: 0, nextDate: "01 Jun 2026", utilization: "Pending update",
    tranches: [
      { n: 1, amount: 30000, date: "01 Jun 2026", status: "Scheduled" },
      { n: 2, amount: 30000, date: "01 Oct 2026", status: "Scheduled" },
    ],
    updates: [],
    notes: "Recently selected. First tranche scheduled. No utilization update yet.",
    gratitude: null,
    gratitudeDate: null,
    media: [] },
  { id: "as4", name: "Ananya Das", college: "Maulana Azad Medical College, Delhi", course: "MBBS", currentClass: "1st year", source: "Nominated", nominatedBy: "Priyanka Sinha", program: "Bright Futures Scholarship 2025",
    total: 150000, disbursed: 50000, nextDate: "01 Sep 2026", utilization: "Submitted",
    tranches: [
      { n: 1, amount: 50000, date: "12 May 2026", status: "Released" },
      { n: 2, amount: 50000, date: "01 Sep 2026", status: "Scheduled" },
      { n: 3, amount: 50000, date: "01 Jan 2027", status: "Scheduled" },
    ],
    updates: [{ date: "18 May 2026", text: "First-year MBBS admission fee paid using tranche 1.", doc: "Admission receipt" }],
    notes: "Newly onboarded scholar from the current cycle.",
    gratitude: "Becoming a doctor felt impossible for a family like mine. With this support, the dream is finally within reach. I will carry your kindness into every patient I treat.",
    gratitudeDate: "19 May 2026",
    media: [
      { type: "image", label: "White coat ceremony", caption: "Day one of MBBS" },
    ] },
];

const UTIL_TONE = { "Verified": "success", "Submitted": "info", "Pending update": "warning" };
const TRANCHE_TONE = { "Confirmed": "success", "Released": "info", "Scheduled": "muted" };

// ── Unified applicant pipeline: nominations (Registered → Selected) + scholars (both pre-verified and nominated) ──
const ADMIN_APPLICANTS = [
  ...ADMIN_NOMINATIONS,
  ...ADMIN_SCHOLARS
    .filter(s => !ADMIN_NOMINATIONS.some(n => n.name === s.name))
    .map(s => ({
      id: "ap-" + s.id, scholarId: s.id, name: s.name, email: null, phone: null,
      college: s.college, course: s.course, year: s.currentClass,
      source: s.source === "Nominated" ? "Nomination" : "Pre-verified",
      nominatedBy: s.nominatedBy || null,
      relationship: s.source === "Nominated" ? "Family friend" : null,
      date: null, status: "Scholar", needScore: null,
      reason: null, docs: [],
      log: [{ s: "Selected", by: "Sana Verma", d: "—" }, { s: "Scholar", by: "Sana Verma", d: "—" }],
    })),
];

// ── Disbursements (flattened across scholars) ──
const DISBURSEMENTS = ADMIN_SCHOLARS.flatMap(s => s.tranches.map(t => ({
  id: s.id + "-" + t.n, scholar: s.name, program: s.program, tranche: t.n, amount: t.amount, date: t.date, status: t.status,
}))).sort((a, b) => new Date(a.date.split(" ").reverse().join(" ")) - new Date(b.date.split(" ").reverse().join(" ")));

const DISB_STATUS_TONE = { Scheduled: "muted", Released: "info", Confirmed: "success" };

// ── Activity feed ──
const ACTIVITY = [
  { who: "Rohan Mehta", action: "donated", detail: "₹1,000", icon: "heart", t: "2 hours ago" },
  { who: "Priyanka Sinha", action: "nominated", detail: "Sneha Joshi", icon: "userPlus", t: "5 hours ago" },
  { who: "Scholar Arjun Nair", action: "received disbursement", detail: "₹45,000", icon: "coin", t: "Yesterday" },
  { who: "Sneha Kapoor", action: "nominated", detail: "Faizan Ahmed", icon: "userPlus", t: "Yesterday" },
  { who: "Sana Verma", action: "shortlisted", detail: "Aditya Pawar", icon: "check", t: "2 days ago" },
  { who: "Karan Patel", action: "set up a payroll pledge of", detail: "₹1,000 / paycheck", icon: "wallet", t: "3 days ago" },
  { who: "Amit Joshi", action: "donated", detail: "₹5,000", icon: "heart", t: "5 days ago" },
];

// ── Leaderboards ──
// Donations: ranked by participation %. Trend vs last week.
const LB_DONATIONS = [
  { rank: 1, team: "Engineering", total: 412000, donors: 410, headcount: 520, trend: "up",
    members: [{ name: "Sneha Kapoor", amount: 12000 }, { name: "Priyanka Sinha", amount: 7500 }, { name: "Arvind Rao", amount: 6000 }, { name: "Lata Menon", amount: 4500 }] },
  { rank: 2, team: "Product", total: 318500, donors: 240, headcount: 300, trend: "up",
    members: [{ name: "Rohan Mehta", amount: 8500 }, { name: "Vikram Rao", amount: 2000 }, { name: "Tara Shah", amount: 5500 }, { name: "Nikhil Jain", amount: 3000 }] },
  { rank: 3, team: "Sales", total: 264000, donors: 240, headcount: 380, trend: "down",
    members: [{ name: "Amit Joshi", amount: 5000 }, { name: "Ravi Kumar", amount: 4000 }, { name: "Pooja Shetty", amount: 3500 }] },
  { rank: 4, team: "Operations", total: 191000, donors: 210, headcount: 340, trend: "up",
    members: [{ name: "Karan Patel", amount: 3000 }, { name: "Sunil Das", amount: 2500 }] },
  { rank: 5, team: "Marketing", total: 142500, donors: 184, headcount: 300, trend: "down",
    members: [{ name: "Divya Nair", amount: 0 }, { name: "Neha Gupta", amount: 1500 }] },
].map(t => ({ ...t, participation: Math.round((t.donors / t.headcount) * 100) }));

const LB_NOMINATIONS = [
  { rank: 1, team: "Engineering", submitted: 38, shortlisted: 14, selected: 5,
    members: [{ name: "Sneha Kapoor", submitted: 6 }, { name: "Priyanka Sinha", submitted: 5 }] },
  { rank: 2, team: "Operations", submitted: 31, shortlisted: 9, selected: 3,
    members: [{ name: "Karan Patel", submitted: 7 }, { name: "Sunil Das", submitted: 4 }] },
  { rank: 3, team: "Product", submitted: 27, shortlisted: 11, selected: 4,
    members: [{ name: "Rohan Mehta", submitted: 8 }, { name: "Vikram Rao", submitted: 3 }] },
  { rank: 4, team: "Marketing", submitted: 19, shortlisted: 5, selected: 2,
    members: [{ name: "Divya Nair", submitted: 4 }, { name: "Neha Gupta", submitted: 3 }] },
  { rank: 5, team: "Sales", submitted: 14, shortlisted: 4, selected: 1,
    members: [{ name: "Amit Joshi", submitted: 3 }] },
];

// ── Nudges ──
const NUDGE_SEGMENTS = [
  { id: "all", label: "All employees", icon: "users", tone: "info", count: 1840, blurb: "Send a general update or reminder to everyone",
    subject: "An update on Bright Futures Scholarship 2025",
    body: "Hi team,\n\nWe're halfway to our ₹50,00,000 goal for the Bright Futures Scholarship — thank you to everyone who has given so far. Every contribution helps a first-generation student stay in college.\n\nIf you haven't yet, take two minutes to give or nominate a student you believe in." },
  { id: "non-donors", label: "Non-donors", icon: "heart", tone: "destructive", count: 556, blurb: "Haven't donated yet",
    subject: "Your gift can keep a student in college",
    body: "Hi there,\n\nYou haven't had a chance to donate to Bright Futures yet — and that's okay. Even ₹500 covers a month of a scholar's learning materials.\n\nGiving takes under two minutes, and you can give once, monthly, or straight from payroll." },
  { id: "non-nominators", label: "Non-nominators", icon: "userPlus", tone: "warning", count: 1402, blurb: "Haven't nominated yet",
    subject: "Know a student who deserves a chance?",
    body: "Hi there,\n\nYou can put forward a deserving student for the Bright Futures Scholarship. If you know someone — a relative, a mentee, a neighbour — who has earned their place but can't afford it, nominate them.\n\nThe reviewer panel reads every nomination." },
  { id: "engaged", label: "Already engaged", icon: "star", tone: "success", count: 438, blurb: "Donors + nominators",
    subject: "Thank you — and one more way to help",
    body: "Hi there,\n\nThank you for being part of Bright Futures, whether you donated, nominated, or both. You've already made a difference.\n\nIf you can, share the programme with a colleague who hasn't joined yet — word from you carries further than any email from us." },
];

const NUDGE_HISTORY = [
  { date: "24 May 2026", segment: "Non-donors", subject: "Your gift can keep a student in college", recipients: 612, openRate: 48 },
  { date: "18 May 2026", segment: "All employees", subject: "An update on Bright Futures Scholarship 2025", recipients: 1840, openRate: 64 },
  { date: "10 May 2026", segment: "Non-nominators", subject: "Know a student who deserves a chance?", recipients: 1455, openRate: 39 },
  { date: "02 May 2026", segment: "Already engaged", subject: "Thank you for backing Bright Futures", recipients: 402, openRate: 71 },
];

// ── Student stories ──
const STORY_LIST = [
  { id: "st1", first: "Priya", name: "Priya Sharma", college: "Lady Shri Ram College, Delhi", course: "B.A. Economics", year: "1st year", aspiration: "shape rural policy as an economist", quote: "The first in my family to study economics, Priya cleared the cut-off by a margin that surprised even her teachers.", status: "Published" },
  { id: "st2", first: "Arjun", name: "Arjun Nair", college: "NIT Calicut", course: "B.Tech Civil", year: "2nd year", aspiration: "build roads for villages like his own", quote: "Raised on a tea estate by a daily-wage mother, Arjun cleared the entrance with a rank that stunned his village.", status: "Published" },
  { id: "st3", first: "Meena", name: "Meena Pillai", college: "St. Xavier's College, Mumbai", course: "B.Sc Mathematics", year: "1st year", aspiration: "teach maths in her coastal hometown", quote: "Meena studied by lamplight through the monsoon and still topped her district board exams.", status: "Published" },
  { id: "st4", first: "Imran", name: "Imran Sheikh", college: "VJTI, Mumbai", course: "B.Tech Mechanical", year: "1st year", aspiration: "be the first engineer in his family", quote: "Imran balanced an evening shift at a garage with classes to keep his seat — and his grades never slipped.", status: "Draft" },
  { id: "st5", first: "Sana", name: "Sana Qureshi", college: "Miranda House, Delhi", course: "B.Sc Botany", year: "1st year", aspiration: "research drought-resistant crops", quote: "From a farming family hit by failed harvests, Sana wants to make sure no crop fails the way theirs did.", status: "Published" },
  { id: "st6", first: "Karthik", name: "Karthik Reddy", college: "BITS Pilani, Hyderabad", course: "B.E. Computer Science", year: "2nd year", aspiration: "build tools for rural schools", quote: "Karthik taught himself to code on a borrowed phone and earned a seat at one of the country's best institutes.", status: "Published" },
  { id: "st7", first: "Lakshmi", name: "Lakshmi Menon", college: "Government Medical College, Kozhikode", course: "MBBS", year: "1st year", aspiration: "open a free clinic in her hometown", quote: "After losing a parent to a treatable illness, Lakshmi is determined to bring care to where she grew up.", status: "Published" },
];

// ── Analytics ──
const ANALYTICS = {
  // donation type split (employees by giving mode)
  donationTypes: [
    { label: "One-time", value: 740 }, { label: "Recurring", value: 312 }, { label: "Payroll", value: 232 },
  ],
  participation: { donors: 1284, total: 1840 },
  // logins
  loginsByWeek: [
    { label: "21 Apr", value: 612 }, { label: "28 Apr", value: 740 }, { label: "5 May", value: 690 },
    { label: "12 May", value: 815 }, { label: "19 May", value: 902 }, { label: "26 May", value: 848 },
  ],
  loginsByMonth: [
    { label: "Jan", value: 1320 }, { label: "Feb", value: 1560 }, { label: "Mar", value: 1490 },
    { label: "Apr", value: 1710 }, { label: "May", value: 1880 }, { label: "Jun", value: 1240 },
  ],
  // engagement funnel — clicks vs actual actions
  donate: { clicks: 2140, actual: 1284 },
  nominate: { clicks: 1380, actual: 612 },
  // nomination trend (counts)
  nominationsByWeek: [
    { label: "21 Apr", value: 18 }, { label: "28 Apr", value: 26 }, { label: "5 May", value: 21 },
    { label: "12 May", value: 34 }, { label: "19 May", value: 29 }, { label: "26 May", value: 24 },
  ],
  nominationsByMonth: [
    { label: "Jan", value: 42 }, { label: "Feb", value: 61 }, { label: "Mar", value: 55 },
    { label: "Apr", value: 78 }, { label: "May", value: 69 }, { label: "Jun", value: 31 },
  ],
  donationsByMonth: [
    { label: "Jan", value: 320000 }, { label: "Feb", value: 410000 }, { label: "Mar", value: 380000 },
    { label: "Apr", value: 520000 }, { label: "May", value: 610000 }, { label: "Jun", value: 260000 },
  ],
  donationsByWeek: [
    { label: "21 Apr", value: 92000 }, { label: "28 Apr", value: 138000 }, { label: "5 May", value: 121000 },
    { label: "12 May", value: 159000 }, { label: "19 May", value: 184000 }, { label: "26 May", value: 142000 },
  ],
  disbursementStatus: [
    { label: "Scheduled", value: 8 }, { label: "Released", value: 3 }, { label: "Confirmed", value: 2 },
  ],
  topDepartments: [
    { name: "Engineering", amount: 412000 }, { name: "Product", amount: 318500 },
    { name: "Sales", amount: 264000 }, { name: "Operations", amount: 191000 }, { name: "Marketing", amount: 142500 },
  ],
};

// ── Settings ──
const ADMIN_USERS = [
  { name: "Sana Verma", email: "sana.verma@infosys.com", role: "Program Admin", status: "Active" },
  { name: "Rajesh Iyer", email: "rajesh.iyer@infosys.com", role: "Finance Admin", status: "Active" },
  { name: "Deepa Menon", email: "deepa.menon@infosys.com", role: "Reviewer", status: "Invited" },
];

const NOTIFICATION_PREFS = [
  { id: "np1", label: "Employee invited", desc: "Send an invite email when an employee is added.", on: true },
  { id: "np2", label: "Nomination shortlisted", desc: "Notify the employee who made the nomination.", on: true },
  { id: "np3", label: "Scholar selected", desc: "Send the award letter to the scholar.", on: true },
  { id: "np4", label: "Disbursement released", desc: "Notify the scholar when a tranche is released.", on: false },
];

const FAQS = [
  { q: "How do I publish a new programme?", a: "Go to Programs → Create Program, complete the five steps, and choose Publish on the final step. The programme goes live on the employee-facing side immediately." },
  { q: "Can employees nominate any student?", a: "Employees can nominate students from the pre-verified list uploaded during programme setup. Each nomination is reviewed before shortlisting." },
  { q: "How are disbursements scheduled?", a: "Once a scholar is selected, schedule tranches from the Disbursements page. Each tranche moves from Scheduled to Released to Confirmed." },
  { q: "Who can review nominations?", a: "Program Admins and Reviewers can access the reviewer console under Nominations. All actions are logged in the status history." },
];

Object.assign(window, {
  COMPANY, ADMIN_USER, PROGRAMS, PROGRAM_PORTFOLIO, PORTFOLIO_TOTALS, ADMIN_EMPLOYEES, DEPARTMENTS, EMP_STATUS_TONE,
  ADMIN_NOMINATIONS, ADMIN_NOM_STATUS_TONE, ADMIN_APPLICANTS, APPLICANT_STAGE_TONE, STAGE_ORDER, ADMIN_SCHOLARS, UTIL_TONE, TRANCHE_TONE,
  DISBURSEMENTS, DISB_STATUS_TONE, ACTIVITY, ANALYTICS, ADMIN_USERS, NOTIFICATION_PREFS, FAQS,
  LB_DONATIONS, LB_NOMINATIONS, NUDGE_SEGMENTS, NUDGE_HISTORY, STORY_LIST,
});
