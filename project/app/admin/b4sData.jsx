// ── B4S Superadmin (platform) mock data ──
const B4S_USER = { name: "Aditi Krishnan", email: "aditi@buddy4study.com", role: "Platform Admin" };

// 10 client organisations
const B4S_CLIENTS = [
  { id: "c1", name: "Infosys", foundation: "Infosys Foundation", plan: "Enterprise", status: "Active", since: "Jan 2026",
    employees: 1840, programmes: 3, raised: 2500000, goal: 5000000, scholars: 38, csr: "Sana Verma", csrEmail: "sana.verma@infosys.com", industry: "Information Technology", isHome: true },
  { id: "c2", name: "Tata Steel", foundation: "Tata Steel Foundation", plan: "Enterprise", status: "Active", since: "Nov 2025",
    employees: 4200, programmes: 2, raised: 6800000, goal: 10000000, scholars: 92, csr: "Rajeev Menon", csrEmail: "rajeev@tatasteel.com", industry: "Manufacturing" },
  { id: "c3", name: "HDFC Bank", foundation: "HDFC Parivartan", plan: "Enterprise", status: "Active", since: "Feb 2026",
    employees: 3100, programmes: 1, raised: 4100000, goal: 7500000, scholars: 54, csr: "Nandita Shah", csrEmail: "nandita@hdfcbank.com", industry: "Financial Services" },
  { id: "c4", name: "Wipro", foundation: "Wipro Cares", plan: "Growth", status: "Active", since: "Mar 2026",
    employees: 2400, programmes: 1, raised: 1900000, goal: 4000000, scholars: 27, csr: "Arvind Pillai", csrEmail: "arvind@wipro.com", industry: "Information Technology" },
  { id: "c5", name: "Mahindra Group", foundation: "Mahindra Foundation", plan: "Growth", status: "Active", since: "Dec 2025",
    employees: 1600, programmes: 1, raised: 2200000, goal: 3500000, scholars: 31, csr: "Kavita Rao", csrEmail: "kavita@mahindra.com", industry: "Manufacturing" },
  { id: "c6", name: "Flipkart", foundation: "Flipkart Foundation", plan: "Growth", status: "Pending", since: "May 2026",
    employees: 980, programmes: 1, raised: 320000, goal: 2000000, scholars: 4, csr: "Dev Anand", csrEmail: "dev@flipkart.com", industry: "Retail" },
  { id: "c7", name: "Zomato", foundation: "Feeding Futures", plan: "Starter", status: "Active", since: "Apr 2026",
    employees: 720, programmes: 1, raised: 540000, goal: 1500000, scholars: 9, csr: "Riya Kapoor", csrEmail: "riya@zomato.com", industry: "Technology" },
  { id: "c8", name: "Asian Paints", foundation: "Asian Paints Cares", plan: "Growth", status: "Active", since: "Oct 2025",
    employees: 1350, programmes: 2, raised: 3300000, goal: 5000000, scholars: 46, csr: "Mohan Iyer", csrEmail: "mohan@asianpaints.com", industry: "Manufacturing" },
  { id: "c9", name: "Swiggy", foundation: "Swiggy Saath", plan: "Starter", status: "Suspended", since: "Feb 2026",
    employees: 650, programmes: 1, raised: 210000, goal: 1000000, scholars: 3, csr: "Tara Bose", csrEmail: "tara@swiggy.com", industry: "Technology" },
  { id: "c10", name: "Larsen & Toubro", foundation: "L&T Vidya", plan: "Enterprise", status: "Active", since: "Sep 2025",
    employees: 5400, programmes: 3, raised: 9200000, goal: 12000000, scholars: 128, csr: "Suresh Nair", csrEmail: "suresh@lnt.com", industry: "Engineering & Construction" },
];

const B4S_PLAN_TONE = { Enterprise: "foreground", Growth: "success", Starter: "muted" };
const B4S_CLIENT_STATUS_TONE = { Pending: "warning", Active: "success", Suspended: "destructive" };

// Platform-wide programmes (across clients)
const B4S_PROGRAMMES = [
  { id: "bp1", name: "Bright Futures Scholarship 2025", client: "Infosys", status: "Active", raised: 2500000, goal: 5000000, scholars: 38, approval: "Approved", end: "31 Aug 2026" },
  { id: "bp1b", name: "Infosys Women in Tech 2026", client: "Infosys", status: "Active", raised: 1400000, goal: 3000000, scholars: 18, approval: "Approved", end: "30 Sep 2026" },
  { id: "bp1c", name: "Bright Futures Scholarship 2024", client: "Infosys", status: "Ended", raised: 4200000, goal: 4000000, scholars: 71, approval: "Approved", end: "31 Aug 2025" },
  { id: "bp2", name: "Steel Scholars 2026", client: "Tata Steel", status: "Active", raised: 4200000, goal: 6000000, scholars: 58, approval: "Approved", end: "30 Sep 2026" },
  { id: "bp3", name: "Tata Women in Trades", client: "Tata Steel", status: "Active", raised: 2600000, goal: 4000000, scholars: 34, approval: "Approved", end: "31 Dec 2026" },
  { id: "bp4", name: "Parivartan Merit Grant", client: "HDFC Bank", status: "Active", raised: 4100000, goal: 7500000, scholars: 54, approval: "Approved", end: "31 Jul 2026" },
  { id: "bp5", name: "Wipro First-Gen Engineers", client: "Wipro", status: "Active", raised: 1900000, goal: 4000000, scholars: 27, approval: "Approved", end: "31 Oct 2026" },
  { id: "bp6", name: "Rise STEM Grant 2026", client: "Mahindra Group", status: "Active", raised: 2200000, goal: 3500000, scholars: 31, approval: "Approved", end: "15 Nov 2026" },
  { id: "bp7", name: "Flipkart Learn Forward", client: "Flipkart", status: "Draft", raised: 320000, goal: 2000000, scholars: 4, approval: "Pending review", end: "—" },
  { id: "bp8", name: "Feeding Futures Scholars", client: "Zomato", status: "Active", raised: 540000, goal: 1500000, scholars: 9, approval: "Approved", end: "31 Aug 2026" },
  { id: "bp9", name: "Asian Paints Colour of Hope", client: "Asian Paints", status: "Active", raised: 1800000, goal: 2500000, scholars: 28, approval: "Approved", end: "30 Jun 2026" },
  { id: "bp10", name: "L&T Vidya Engineering", client: "Larsen & Toubro", status: "Active", raised: 5200000, goal: 6000000, scholars: 72, approval: "Approved", end: "31 Dec 2026" },
  { id: "bp11", name: "Swiggy Saath Grant", client: "Swiggy", status: "Paused", raised: 210000, goal: 1000000, scholars: 3, approval: "Approved", end: "—" },
];

const B4S_PROG_APPROVAL_TONE = { Approved: "success", "Pending review": "warning", Rejected: "destructive" };

// Platform-wide scholars (sample)
const B4S_SCHOLARS = [
  { id: "bs1", name: "Priya Sharma", client: "Infosys", programme: "Bright Futures Scholarship 2025", institute: "IIT Bombay", course: "B.Tech CSE", amount: 120000, disbursed: 80000, status: "Active", source: "Nominated" },
  { id: "bs2", name: "Arjun Nair", client: "Infosys", programme: "Bright Futures Scholarship 2025", institute: "NIT Calicut", course: "B.Tech Civil", amount: 90000, disbursed: 90000, status: "Active", source: "Pre-verified" },
  { id: "bs3", name: "Faizan Ahmed", client: "Tata Steel", programme: "Tata Merit Scholarship 2025", institute: "IIT Kharagpur", course: "B.Tech Metallurgy", amount: 140000, disbursed: 70000, status: "Active", source: "Pre-verified" },
  { id: "bs4", name: "Lakshmi Menon", client: "HDFC Bank", programme: "Parivartan Education Grant", institute: "Delhi University", course: "B.Com Hons", amount: 80000, disbursed: 80000, status: "Graduated", source: "Nominated" },
  { id: "bs5", name: "Rahul Verma", client: "Wipro", programme: "Wipro Cares Scholarship", institute: "VIT Vellore", course: "B.Tech ECE", amount: 110000, disbursed: 55000, status: "Active", source: "Pre-verified" },
  { id: "bs6", name: "Sneha Joshi", client: "Mahindra Group", programme: "Mahindra Rise Scholarship", institute: "COEP Pune", course: "B.Tech Mech", amount: 100000, disbursed: 50000, status: "Active", source: "Nominated" },
  { id: "bs7", name: "Imran Sheikh", client: "L&T", programme: "L&T Build India Scholarship", institute: "IIT Madras", course: "B.Tech Civil", amount: 150000, disbursed: 100000, status: "Active", source: "Pre-verified" },
  { id: "bs8", name: "Ananya Das", client: "Asian Paints", programme: "Asian Paints Shaping Futures", institute: "Jadavpur University", course: "B.Sc Chemistry", amount: 70000, disbursed: 35000, status: "Active", source: "Nominated" },
];

// Platform-wide disbursements
const B4S_DISBURSEMENTS = [
  { id: "bd1", scholar: "Priya Sharma", client: "Infosys", tranche: 2, amount: 40000, date: "28 May 2026", status: "Released" },
  { id: "bd2", scholar: "Faizan Ahmed", client: "Tata Steel", tranche: 1, amount: 70000, date: "26 May 2026", status: "Confirmed" },
  { id: "bd3", scholar: "Imran Sheikh", client: "L&T", tranche: 2, amount: 50000, date: "01 Jun 2026", status: "Scheduled" },
  { id: "bd4", scholar: "Sneha Joshi", client: "Mahindra Group", tranche: 1, amount: 50000, date: "30 May 2026", status: "Released" },
  { id: "bd5", scholar: "Rahul Verma", client: "Wipro", tranche: 1, amount: 55000, date: "22 May 2026", status: "Confirmed" },
  { id: "bd6", scholar: "Ananya Das", client: "Asian Paints", tranche: 2, amount: 35000, date: "03 Jun 2026", status: "Scheduled" },
];

// Billing / invoicing to clients
const B4S_INVOICES = [
  { id: "INV-2026-041", client: "Infosys", plan: "Enterprise", amount: 250000, issued: "01 May 2026", due: "31 May 2026", status: "Paid" },
  { id: "INV-2026-042", client: "Tata Steel", plan: "Enterprise", amount: 250000, issued: "01 May 2026", due: "31 May 2026", status: "Paid" },
  { id: "INV-2026-043", client: "HDFC Bank", plan: "Enterprise", amount: 250000, issued: "01 May 2026", due: "31 May 2026", status: "Overdue" },
  { id: "INV-2026-044", client: "Wipro", plan: "Growth", amount: 120000, issued: "01 May 2026", due: "31 May 2026", status: "Paid" },
  { id: "INV-2026-045", client: "Mahindra Group", plan: "Growth", amount: 120000, issued: "01 May 2026", due: "31 May 2026", status: "Pending" },
  { id: "INV-2026-046", client: "Zomato", plan: "Starter", amount: 45000, issued: "01 May 2026", due: "31 May 2026", status: "Pending" },
  { id: "INV-2026-047", client: "L&T", plan: "Enterprise", amount: 375000, issued: "01 May 2026", due: "31 May 2026", status: "Paid" },
];
const B4S_INVOICE_TONE = { Paid: "success", Pending: "warning", Overdue: "destructive" };

// B4S internal team
const B4S_TEAM = [
  { name: "Aditi Krishnan", email: "aditi@buddy4study.com", role: "Platform Admin", status: "Active", clients: "All" },
  { name: "Rohit Saxena", email: "rohit@buddy4study.com", role: "Client Success", status: "Active", clients: "Infosys, Wipro, Zomato" },
  { name: "Meghna Pillai", email: "meghna@buddy4study.com", role: "Verification Lead", status: "Active", clients: "All" },
  { name: "Karthik Reddy", email: "karthik@buddy4study.com", role: "Finance", status: "Active", clients: "All" },
  { name: "Sara Thomas", email: "sara@buddy4study.com", role: "Client Success", status: "Invited", clients: "Tata Steel, L&T" },
];
const B4S_ROLE_TONE = { "Platform Admin": "foreground", "Client Success": "info", "Verification Lead": "success", "Finance": "warning" };

// Verified student pool (master DB)
const B4S_POOL = [
  { id: "VP-0001", name: "Ankit Yadav", institute: "IIT Delhi", course: "B.Tech CSE", income: 240000, status: "Verified", state: "Uttar Pradesh" },
  { id: "VP-0002", name: "Deepa Krishnan", institute: "NIT Trichy", course: "B.Tech ECE", income: 180000, status: "Verified", state: "Tamil Nadu" },
  { id: "VP-0003", name: "Mohammed Aslam", institute: "Jamia Millia", course: "B.Arch", income: 150000, status: "Pending", state: "Delhi" },
  { id: "VP-0004", name: "Sunita Pawar", institute: "COEP Pune", course: "B.Tech Mech", income: 200000, status: "Verified", state: "Maharashtra" },
  { id: "VP-0005", name: "Ritu Singh", institute: "BHU Varanasi", course: "B.Sc Physics", income: 120000, status: "Verified", state: "Uttar Pradesh" },
  { id: "VP-0006", name: "Joseph Mathew", institute: "CUSAT Kochi", course: "B.Tech Civil", income: 220000, status: "Flagged", state: "Kerala" },
  { id: "VP-0007", name: "Pallavi Nair", institute: "Christ University", course: "BBA", income: 280000, status: "Verified", state: "Karnataka" },
  { id: "VP-0008", name: "Harsh Patel", institute: "SVNIT Surat", course: "B.Tech Chemical", income: 160000, status: "Pending", state: "Gujarat" },
];
const B4S_POOL_TONE = { Verified: "success", Pending: "warning", Flagged: "destructive" };
const B4S_POOL_STATS = { total: 48200, verified: 41800, pending: 4900, flagged: 1500 };

// Audit log
const B4S_AUDIT = [
  { who: "Aditi Krishnan", action: "approved programme", target: "Steel Scholars 2026 · Tata Steel", icon: "checkCircle", t: "2 hours ago" },
  { who: "Meghna Pillai", action: "verified 240 students into the pool", target: "Bulk import · May batch", icon: "userCheck", t: "5 hours ago" },
  { who: "Karthik Reddy", action: "marked invoice paid", target: "INV-2026-041 · Infosys", icon: "coin", t: "Yesterday" },
  { who: "Aditi Krishnan", action: "suspended client", target: "Swiggy · Swiggy Saath", icon: "pause", t: "Yesterday" },
  { who: "Rohit Saxena", action: "onboarded a new client", target: "Flipkart · Pending", icon: "plus", t: "2 days ago" },
  { who: "Aditi Krishnan", action: "flagged a pool record", target: "VP-0006 · Joseph Mathew", icon: "info", t: "3 days ago" },
  { who: "Karthik Reddy", action: "issued invoices", target: "May 2026 billing cycle · 7 clients", icon: "fileText", t: "4 days ago" },
];

// Platform aggregate KPIs
const B4S_KPIS = {
  clients: B4S_CLIENTS.length,
  activeClients: B4S_CLIENTS.filter(c => c.status === "Active").length,
  raised: B4S_CLIENTS.reduce((s, c) => s + c.raised, 0),
  scholars: B4S_CLIENTS.reduce((s, c) => s + c.scholars, 0),
  employees: B4S_CLIENTS.reduce((s, c) => s + c.employees, 0),
  nominations: B4S_CLIENTS.reduce((s, c) => s + Math.round(c.scholars * 5.5), 0),
  programmes: B4S_PROGRAMMES.length,
};

// Illustrative per-client samples (recent rows) — counts come from the client's totals.
const B4S_SAMPLE_DONORS = [
  { name: "Rohan Mehta", team: "Engineering", amount: 5000, date: "02 Jun 2026", type: "Recurring" },
  { name: "Sneha Kapoor", team: "Product", amount: 2000, date: "02 Jun 2026", type: "One-time" },
  { name: "Amit Joshi", team: "Sales", amount: 1000, date: "01 Jun 2026", type: "Payroll giving" },
  { name: "Divya Nair", team: "Operations", amount: 7500, date: "31 May 2026", type: "One-time" },
  { name: "Karan Patel", team: "Marketing", amount: 1500, date: "30 May 2026", type: "Recurring" },
  { name: "Priyanka Sinha", team: "Engineering", amount: 3000, date: "29 May 2026", type: "One-time" },
  { name: "Vikram Rao", team: "Finance", amount: 2500, date: "28 May 2026", type: "Payroll giving" },
  { name: "Neha Gupta", team: "Design", amount: 1000, date: "27 May 2026", type: "One-time" },
];
const B4S_SAMPLE_EMPLOYEES = [
  { name: "Rohan Mehta", team: "Engineering", status: "Active", donated: 8500 },
  { name: "Sneha Kapoor", team: "Product", status: "Active", donated: 2000 },
  { name: "Amit Joshi", team: "Sales", status: "Active", donated: 1000 },
  { name: "Divya Nair", team: "Operations", status: "Active", donated: 7500 },
  { name: "Karan Patel", team: "Marketing", status: "Pending", donated: 0 },
  { name: "Priyanka Sinha", team: "Engineering", status: "Active", donated: 3000 },
  { name: "Vikram Rao", team: "Finance", status: "Active", donated: 2500 },
  { name: "Meera Iyer", team: "People & Culture", status: "Offboarded", donated: 4000 },
];
const B4S_SAMPLE_NOMINATIONS = [
  { nominee: "Ananya Iyer", by: "Sneha Kapoor", institute: "IIT Bombay", status: "Selected" },
  { nominee: "Faizan Ahmed", by: "Rohan Mehta", institute: "NIT Trichy", status: "Shortlisted" },
  { nominee: "Sneha Joshi", by: "Priyanka Sinha", institute: "Delhi University", status: "Under review" },
  { nominee: "Aditya Pawar", by: "Karan Patel", institute: "VJTI Mumbai", status: "Applied" },
  { nominee: "Ritika Bose", by: "Vikram Rao", institute: "Jadavpur University", status: "Selected" },
  { nominee: "Mohit Saini", by: "Amit Joshi", institute: "BITS Pilani", status: "Reject" },
];
const B4S_EMP_STATUS_TONE = { Active: "success", Pending: "warning", Offboarded: "muted" };
const B4S_NOM_STATUS_TONE = { Selected: "success", Shortlisted: "warning", "Under review": "info", Applied: "info", Reject: "destructive", Registered: "muted" };

Object.assign(window, {
  B4S_USER, B4S_CLIENTS, B4S_PLAN_TONE, B4S_CLIENT_STATUS_TONE, B4S_PROGRAMMES, B4S_PROG_APPROVAL_TONE,
  B4S_SCHOLARS, B4S_DISBURSEMENTS, B4S_INVOICES, B4S_INVOICE_TONE, B4S_TEAM, B4S_ROLE_TONE,
  B4S_POOL, B4S_POOL_TONE, B4S_POOL_STATS, B4S_AUDIT, B4S_KPIS,
  B4S_SAMPLE_DONORS, B4S_SAMPLE_EMPLOYEES, B4S_SAMPLE_NOMINATIONS, B4S_EMP_STATUS_TONE, B4S_NOM_STATUS_TONE,
});
