"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button, Card, Field, Input, Badge, Modal, Avatar } from "@/components/ui";
import {
  Building,
  Users,
  Bell,
  HelpCircle,
  X,
  Plus,
  ChevronDown,
  CheckCircle,
  Upload,
  Mail,
  Phone,
} from "lucide-react";

type Tab = "company" | "users" | "notifications" | "helpdesk";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "company", label: "Company Profile", icon: <Building size={15} /> },
  { id: "users", label: "User Management", icon: <Users size={15} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={15} /> },
  { id: "helpdesk", label: "Help Desk", icon: <HelpCircle size={15} /> },
];

const MOCK_ADMINS = [
  { id: "1", name: "Aisha Patel", email: "aisha.patel@b4s.org", role: "Super Admin", joinedAt: "2024-01-15" },
  { id: "2", name: "Ravi Kumar", email: "ravi.kumar@b4s.org", role: "Admin", joinedAt: "2024-03-08" },
  { id: "3", name: "Sunita Reddy", email: "sunita.reddy@b4s.org", role: "Admin", joinedAt: "2024-06-22" },
];

const FAQS = [
  {
    q: "How do I activate a program?",
    a: "Go to Programs, click on your draft program, and click 'Publish Program'. Once published, employees can view and donate to it.",
  },
  {
    q: "What formats are supported for CSV uploads?",
    a: "CSV files should have columns: Name, Email, Department (for employees) or Name, Email, College, Course, Year, Hometown (for students).",
  },
  {
    q: "How are disbursements tracked?",
    a: "All disbursements go through SCHEDULED → RELEASED → CONFIRMED states. Admins manually mark them as Released after funds are transferred.",
  },
  {
    q: "Can employees see scholarship recipients?",
    a: "Yes, scholar profiles are visible to employees in the programs they have donated to, helping them see the impact of their contribution.",
  },
  {
    q: "How do I generate a tax receipt (80G)?",
    a: "Navigate to the donor's profile, click 'Generate 80G Certificate', and the PDF will be sent to their registered email address.",
  },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative inline-flex w-10 h-5.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? "bg-primary" : "bg-muted"
      )}
      style={{ height: 22, width: 40 }}
    >
      <span
        className={cn(
          "absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-[19px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-[var(--radius-lg)] overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-surface-muted transition-colors"
      >
        <span className="font-medium text-[13.5px] text-foreground">{q}</span>
        <ChevronDown
          size={15}
          className={cn("text-muted-foreground transition-transform shrink-0 ml-2", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 text-[13px] text-muted-foreground leading-relaxed border-t border-border bg-surface-muted">
          <div className="pt-3">{a}</div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("company");

  // Company profile form
  const [company, setCompany] = useState({
    name: "Buddy4Study Foundation",
    website: "https://www.buddy4study.com",
    industry: "Education & Scholarship",
  });
  const [companySaved, setCompanySaved] = useState(false);

  // Notifications
  const [notifs, setNotifs] = useState({
    employeeInvited: true,
    nominationShortlisted: true,
    scholarSelected: true,
    disbursementReleased: false,
  });

  // Admins
  const [admins, setAdmins] = useState(MOCK_ADMINS);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: "", email: "", role: "Admin" });

  function saveCompany(e: React.FormEvent) {
    e.preventDefault();
    setCompanySaved(true);
    setTimeout(() => setCompanySaved(false), 2000);
  }

  function addAdmin(e: React.FormEvent) {
    e.preventDefault();
    setAdmins((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        ...adminForm,
        joinedAt: new Date().toISOString().slice(0, 10),
      },
    ]);
    setShowAddAdmin(false);
    setAdminForm({ name: "", email: "", role: "Admin" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure your giving programme settings
        </p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Company Profile */}
      {activeTab === "company" && (
        <form onSubmit={saveCompany} className="space-y-5 max-w-[560px]">
          {/* Logo upload */}
          <Card className="p-5">
            <h3 className="font-semibold text-[14px] mb-4">Organisation Logo</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xl font-bold text-primary">B4S</span>
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-foreground font-medium mb-1">Buddy4Study Foundation</p>
                <p className="text-helper mb-2">PNG, JPG or SVG · max 2MB</p>
                <Button type="button" variant="secondary" size="sm" className="gap-1.5">
                  <Upload size={13} />
                  Upload Logo
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-[14px]">Basic Information</h3>
            <Field label="Company Name" htmlFor="compName">
              <Input
                id="compName"
                value={company.name}
                onChange={(e) => setCompany((c) => ({ ...c, name: e.target.value }))}
              />
            </Field>
            <Field label="Website" htmlFor="compWeb">
              <Input
                id="compWeb"
                type="url"
                value={company.website}
                onChange={(e) => setCompany((c) => ({ ...c, website: e.target.value }))}
              />
            </Field>
            <Field label="Industry" htmlFor="compIndustry">
              <Input
                id="compIndustry"
                value={company.industry}
                onChange={(e) => setCompany((c) => ({ ...c, industry: e.target.value }))}
              />
            </Field>
          </Card>

          <div className="flex items-center gap-2">
            <Button type="submit" size="sm" className="gap-1.5">
              {companySaved ? (
                <>
                  <CheckCircle size={14} />
                  Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      )}

      {/* User Management */}
      {activeTab === "users" && (
        <div className="space-y-4 max-w-[720px]">
          <div className="flex items-center justify-between">
            <p className="text-[13.5px] font-medium text-foreground">Admin Users ({admins.length})</p>
            <Button size="sm" onClick={() => setShowAddAdmin(true)} className="gap-1.5">
              <Plus size={14} />
              Add Admin
            </Button>
          </div>

          <Card className="overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  {["Name", "Email", "Role", "Joined", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground text-[12px] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={admin.name} size={28} />
                        <span className="font-medium text-foreground">{admin.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{admin.email}</td>
                    <td className="px-4 py-3">
                      <Badge tone={admin.role === "Super Admin" ? "info" : "muted"}>
                        {admin.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(admin.joinedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        onClick={() => setAdmins((a) => a.filter((x) => x.id !== admin.id))}
                        title="Remove admin"
                      >
                        <X size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Modal open={showAddAdmin} onClose={() => setShowAddAdmin(false)}>
            <form onSubmit={addAdmin} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold">Add Admin</h2>
                <button type="button" onClick={() => setShowAddAdmin(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
              <Field label="Full Name" htmlFor="adminName">
                <Input
                  id="adminName"
                  required
                  placeholder="Priya Sharma"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm((f) => ({ ...f, name: e.target.value }))}
                />
              </Field>
              <Field label="Email" htmlFor="adminEmail">
                <Input
                  id="adminEmail"
                  type="email"
                  required
                  placeholder="priya@company.com"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm((f) => ({ ...f, email: e.target.value }))}
                />
              </Field>
              <Field label="Role" htmlFor="adminRole">
                <select
                  id="adminRole"
                  value={adminForm.role}
                  onChange={(e) => setAdminForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full h-10 pl-3 pr-9 rounded-[var(--radius)] border border-input bg-surface text-sm"
                >
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </Field>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowAddAdmin(false)}>Cancel</Button>
                <Button type="submit" size="sm">Add Admin</Button>
              </div>
            </form>
          </Modal>
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <div className="space-y-3 max-w-[560px]">
          <p className="text-[13px] text-muted-foreground">
            Choose which events trigger email notifications to admins.
          </p>
          <Card className="divide-y divide-border">
            {[
              {
                key: "employeeInvited" as const,
                label: "Employee Invited",
                description: "When a new employee is invited to the platform",
              },
              {
                key: "nominationShortlisted" as const,
                label: "Nomination Shortlisted",
                description: "When a nomination is moved to shortlisted status",
              },
              {
                key: "scholarSelected" as const,
                label: "Scholar Selected",
                description: "When a nominee is officially selected as a scholar",
              },
              {
                key: "disbursementReleased" as const,
                label: "Disbursement Released",
                description: "When a disbursement tranche is marked as released",
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-[13.5px] font-medium text-foreground">{item.label}</p>
                  <p className="text-helper">{item.description}</p>
                </div>
                <Toggle
                  checked={notifs[item.key]}
                  onChange={() => setNotifs((n) => ({ ...n, [item.key]: !n[item.key] }))}
                />
              </div>
            ))}
          </Card>
          <Button size="sm" onClick={() => {}} className="gap-1.5">
            <CheckCircle size={14} />
            Save Preferences
          </Button>
        </div>
      )}

      {/* Help Desk */}
      {activeTab === "helpdesk" && (
        <div className="space-y-6 max-w-[640px]">
          <div>
            <h3 className="font-semibold text-[15px] text-foreground mb-3">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {FAQS.map((faq) => (
                <FAQItem key={faq.q} {...faq} />
              ))}
            </div>
          </div>

          <Card className="p-5">
            <h3 className="font-semibold text-[14px] mb-3">Contact Support</h3>
            <p className="text-[13px] text-muted-foreground mb-4">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <Mail size={14} className="shrink-0" />
                support@buddy4study.com
              </div>
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <Phone size={14} className="shrink-0" />
                +91 11 4321 5678
              </div>
            </div>
            <Button size="sm" variant="outline" className="mt-4 gap-1.5">
              <Mail size={14} />
              Open Support Ticket
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
