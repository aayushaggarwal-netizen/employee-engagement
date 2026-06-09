// ── Settings: Company · Users · Notifications · Help ──
function SettingsPage() {
  const toast = useToast();
  const [tab, setTab] = React.useState("company");
  return (
    <>
      <AdminPageHead title="Settings" subtitle="Manage your company profile, admins, and notifications." />
      <Tabs value={tab} onChange={setTab} className="mb-6"
        tabs={[{ id: "company", label: "Company profile" }, { id: "users", label: "User management" }, { id: "help", label: "Help desk" }]} />

      {tab === "company" && <CompanyProfile toast={toast} />}
      {tab === "users" && <UserManagement toast={toast} />}
      {tab === "help" && <HelpDesk toast={toast} />}
    </>
  );
}

function ProfileSection({ icon, title, desc, children }) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-3 mb-5">
        <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon name={icon} size={17} /></span>
        <div>
          <p className="text-card-title">{title}</p>
          {desc && <p className="text-helper mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className="h-px bg-border-soft mb-5" />
      {children}
    </Card>
  );
}

function CompanyProfile({ toast }) {
  const fileRef = React.useRef(null);
  const [logo, setLogo] = React.useState("assets/b4s-foundation-logo.png");
  const [f, setF] = React.useState({
    // company profile
    name: COMPANY.name, foundation: COMPANY.foundation, website: COMPANY.website, industry: COMPANY.industry, size: "5,000+",
    // billing
    legalName: "Infosys Limited", billingEmail: "finance@infosys.com", gstin: "29AAACI4741P1ZL", pan: "AAACI4741P",
    address: "Electronics City, Hosur Road, Bengaluru 560100",
    tan: "BLRI09521F", reg80g: "AAACI4741PF20214", reg12a: "AAACI4741PE20198",
    // key contacts
    csrName: "Sana Verma", csrEmail: "sana.verma@infosys.com", csrPhone: "9845098450", csrDesignation: "CSR Head",
    hrName: "Vikram Iyer", hrEmail: "vikram.iyer@infosys.com", hrPhone: "9845067890", hrDesignation: "HR Director",
    billName: "Anita Rao", billEmail: "anita.rao@infosys.com", billPhone: "9845012345", billDesignation: "Finance Manager",
  });
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const pickLogo = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-[760px] space-y-5">
      {/* Company profile */}
      <ProfileSection icon="building" title="Company profile" desc="Shown on the employee giving site and on scholar award letters.">
        <div className="flex items-center gap-4 mb-5">
          <div className="h-16 w-16 rounded-xl border border-border-soft bg-surface-muted flex items-center justify-center shrink-0 overflow-hidden">
            <img src={logo} alt="" className="h-12 w-12 object-contain" />
          </div>
          <div>
            <p className="text-[13.5px] font-medium text-foreground">Company logo</p>
            <p className="text-helper mb-2">PNG or SVG, square, up to 2 MB.</p>
            <Button variant="outline" size="sm" onClick={() => fileRef.current && fileRef.current.click()}><Icon name="upload" size={14} />Update logo</Button>
            <input ref={fileRef} type="file" accept="image/*" onChange={pickLogo} className="hidden" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Company name" htmlFor="cp-name"><Input id="cp-name" value={f.name} onChange={e => set("name", e.target.value)} /></Field>
          <Field label="Foundation / CSR entity" htmlFor="cp-found"><Input id="cp-found" value={f.foundation} onChange={e => set("foundation", e.target.value)} /></Field>
          <Field label="Website" htmlFor="cp-web"><Input id="cp-web" value={f.website} onChange={e => set("website", e.target.value)} /></Field>
          <Field label="Industry" htmlFor="cp-ind">
            <NativeSelect value={f.industry} onChange={e => set("industry", e.target.value)}>
              {["Information Technology", "Financial Services", "Manufacturing", "Healthcare", "Consulting", "Retail", "Other"].map(o => <option key={o}>{o}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Company size" htmlFor="cp-size">
            <NativeSelect value={f.size} onChange={e => set("size", e.target.value)}>
              {["1–200", "201–1,000", "1,001–5,000", "5,000+"].map(o => <option key={o}>{o}</option>)}
            </NativeSelect>
          </Field>
        </div>
      </ProfileSection>

      {/* Billing details */}
      <ProfileSection icon="coin" title="Billing details" desc="Used for donation receipts and 80G certificates.">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Registered legal name" htmlFor="b-legal"><Input id="b-legal" value={f.legalName} onChange={e => set("legalName", e.target.value)} /></Field>
          <Field label="Billing email" htmlFor="b-email"><Input id="b-email" type="email" value={f.billingEmail} onChange={e => set("billingEmail", e.target.value)} /></Field>
          <Field label="GSTIN" htmlFor="b-gstin"><Input id="b-gstin" value={f.gstin} onChange={e => set("gstin", e.target.value)} /></Field>
          <Field label="PAN" htmlFor="b-pan"><Input id="b-pan" value={f.pan} onChange={e => set("pan", e.target.value)} /></Field>
          <Field label="TAN" htmlFor="b-tan"><Input id="b-tan" value={f.tan} onChange={e => set("tan", e.target.value)} /></Field>
          <Field label="80G registration number" htmlFor="b-80g"><Input id="b-80g" value={f.reg80g} onChange={e => set("reg80g", e.target.value)} /></Field>
          <Field label="12A registration number" htmlFor="b-12a"><Input id="b-12a" value={f.reg12a} onChange={e => set("reg12a", e.target.value)} /></Field>
          <div className="sm:col-span-2">
            <Field label="Billing address" htmlFor="b-addr"><Textarea id="b-addr" rows={2} value={f.address} onChange={e => set("address", e.target.value)} /></Field>
          </div>
          <div className="sm:col-span-2 rounded-xl border border-border-soft bg-surface-muted/40 p-4">
            <div className="flex items-center gap-2 mb-1"><Icon name="landmark" size={15} className="text-muted-foreground" /><p className="text-eyebrow">Settlement account · Buddy4Study</p></div>
            <p className="text-helper mb-4">Your donations settle to this Buddy4Study account. These details are fixed and managed by Buddy4Study.</p>
            <dl className="divide-y divide-border-soft">
              {[["Account holder name", "Buddy4Study India Foundation"], ["Bank name", "HDFC Bank"], ["Account number", "5010 0234 5678 90"], ["IFSC code", "HDFC0000456"]].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-[13px] text-muted-foreground">{k}</dt>
                  <dd className="text-[13px] font-medium text-foreground tabular-nums text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </ProfileSection>

      {/* Key contacts */}
      <ProfileSection icon="users" title="Key contacts" desc="The people we reach for approvals, payroll coordination, and billing.">
        <div className="space-y-5">
          {[
            { eyebrow: "Primary admin", keys: ["csrName", "csrDesignation", "csrPhone", "csrEmail"] },
            { eyebrow: "HR head / CSR head", keys: ["hrName", "hrDesignation", "hrPhone", "hrEmail"] },
            { eyebrow: "Billing contact person", keys: ["billName", "billDesignation", "billPhone", "billEmail"] },
          ].map((c, i) => (
            <React.Fragment key={c.eyebrow}>
              {i > 0 && <div className="h-px bg-border-soft" />}
              <div>
                <p className="text-eyebrow mb-3">{c.eyebrow}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Name" htmlFor={c.keys[0]}><Input id={c.keys[0]} value={f[c.keys[0]]} onChange={e => set(c.keys[0], e.target.value)} /></Field>
                  <Field label="Designation" htmlFor={c.keys[1]}><Input id={c.keys[1]} value={f[c.keys[1]]} onChange={e => set(c.keys[1], e.target.value)} /></Field>
                  <Field label="Phone" htmlFor={c.keys[2]}>
                    <div className="flex h-10 w-full rounded-md border border-input bg-surface overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                      <span className="flex items-center px-3 text-sm text-muted-foreground bg-surface-muted border-r border-input shrink-0">+91</span>
                      <input id={c.keys[2]} inputMode="numeric" maxLength={10} value={f[c.keys[2]]} onChange={e => set(c.keys[2], e.target.value.replace(/\D/g, "").slice(0, 10))} className="flex-1 min-w-0 px-3 text-sm bg-transparent focus:outline-none" />
                    </div>
                  </Field>
                  <Field label="Email" htmlFor={c.keys[3]}><Input id={c.keys[3]} type="email" value={f[c.keys[3]]} onChange={e => set(c.keys[3], e.target.value)} /></Field>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </ProfileSection>

      <div className="flex justify-end"><Button onClick={() => toast("Company profile saved", { sub: "All sections updated.", icon: "checkCircle" })}>Save changes</Button></div>
    </div>
  );
}

function UserManagement({ toast }) {
  const [users, setUsers] = React.useState(ADMIN_USERS);
  const [open, setOpen] = React.useState(false);
  const [f, setF] = React.useState({ name: "", email: "" });
  const [query, setQuery] = React.useState("");
  const [listOpen, setListOpen] = React.useState(false);
  const [menuRow, setMenuRow] = React.useState(null);
  React.useEffect(() => { if (open) { setF({ name: "", email: "" }); setQuery(""); setListOpen(false); } }, [open]);
  const valid = f.name.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email);
  const existingNames = new Set(users.map(u => u.name));
  const candidates = ADMIN_EMPLOYEES
    .filter(e => !existingNames.has(e.name))
    .filter(e => (e.name + " " + e.email).toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6);
  const pick = (e) => { setF({ name: e.name, email: e.email }); setQuery(e.name); setListOpen(false); };
  return (
    <div className="max-w-[760px]">
      <div className="flex justify-end mb-3"><Button onClick={() => setOpen(true)}><Icon name="plus" size={16} />Add admin</Button></div>
      <Card className="p-0 overflow-hidden">
        <Table columns={[{ label: "Name" }, { label: "Role" }, { label: "Status" }, { label: "", align: "right" }]}>
          {users.map((u, i) => (
            <tr key={i} className="border-b border-border-soft last:border-0">
              <Td><div className="flex items-center gap-3"><Avatar name={u.name} size={32} /><div><div className="font-medium text-foreground">{u.name}</div><div className="text-helper">{u.email}</div></div></div></Td>
              <Td className="text-muted-foreground">{u.role}</Td>
              <Td><Badge tone={u.status === "Active" ? "success" : "warning"}>{u.status}</Badge></Td>
              <Td align="right">
                <button onClick={(ev) => { const r = ev.currentTarget.getBoundingClientRect(); setMenuRow(menuRow && menuRow.i === i ? null : { i, x: r.right, y: r.bottom }); }}
                  className="h-8 w-8 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"><Icon name="more" size={16} /></button>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>
      {menuRow && ReactDOM.createPortal(
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setMenuRow(null)} />
          <div className="fixed z-[91] w-44 rounded-lg border border-border bg-popover shadow-lg p-1 animate-fade-in"
            style={{ top: menuRow.y + 4, left: menuRow.x - 176 }}>
            {users[menuRow.i] && users[menuRow.i].status === "Active" ? (
              <button onClick={() => { const u = users[menuRow.i]; setUsers(list => list.filter((_, j) => j !== menuRow.i)); setMenuRow(null); toast("Admin removed", { sub: `${u.name} no longer has admin access.`, icon: "x" }); }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-destructive hover:bg-destructive-soft/60 transition-colors text-left"><Icon name="logout" size={15} />Remove admin</button>
            ) : (
              <button onClick={() => { const u = users[menuRow.i]; setUsers(list => list.filter((_, j) => j !== menuRow.i)); setMenuRow(null); toast("Invite revoked", { sub: `${u.name}'s invite was cancelled.`, icon: "x" }); }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-destructive hover:bg-destructive-soft/60 transition-colors text-left"><Icon name="x" size={15} />Revoke invite</button>
            )}
          </div>
        </>,
        document.body
      )}
      <Overlay open={open} onClose={() => setOpen(false)}>
        <div className="p-6 w-full sm:w-[420px]">
          <div className="flex items-center justify-between mb-5"><h2 className="text-section-title">Add admin</h2><button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button></div>
          <div className="space-y-4">
            <Field label="Full name" htmlFor="au-name" helper="Search and pick an existing employee.">
              <div className="relative">
                <div className="relative">
                  <Icon name="search" size={15} className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input id="au-name" value={query} autoComplete="off"
                    onChange={e => { setQuery(e.target.value); setListOpen(true); if (f.name && e.target.value !== f.name) setF({ name: "", email: "" }); }}
                    onFocus={() => setListOpen(true)}
                    placeholder="Search employees…" className="pl-9" />
                </div>
                {listOpen && query && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setListOpen(false)} />
                    <div className="absolute z-20 left-0 right-0 mt-1 rounded-lg border border-border bg-popover shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                      {candidates.length ? candidates.map(e => (
                        <button key={e.id} onClick={() => pick(e)} className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-surface-muted transition-colors">
                          <Avatar name={e.name} size={28} />
                          <div className="min-w-0"><p className="text-[13px] font-medium text-foreground truncate">{e.name}</p><p className="text-helper truncate">{e.dept} · {e.email}</p></div>
                        </button>
                      )) : <p className="px-3 py-3 text-[13px] text-muted-foreground">No matching employees.</p>}
                    </div>
                  </>
                )}
              </div>
            </Field>
            <Field label="Email" htmlFor="au-email"><Input id="au-email" type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="Auto-filled from selection" /></Field>
          </div>
          <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="flex-1" disabled={!valid} onClick={() => { setUsers(u => [...u, { ...f, role: "Reviewer", status: "Invited" }]); toast("Admin invited", { sub: `${f.name} invited as Reviewer.`, icon: "mail" }); setOpen(false); }}>Add &amp; invite</Button></div>
        </div>
      </Overlay>
    </div>
  );
}

function NotificationPrefs() {
  const [prefs, setPrefs] = React.useState(NOTIFICATION_PREFS);
  return (
    <div className="max-w-[620px]">
      <Card className="p-2">
        {prefs.map((p, i) => (
          <div key={p.id} className={cn("flex items-center justify-between gap-4 px-4 py-4", i < prefs.length - 1 && "border-b border-border-soft")}>
            <div><p className="text-[14px] font-medium text-foreground">{p.label}</p><p className="text-helper mt-0.5">{p.desc}</p></div>
            <Toggle on={p.on} onChange={(v) => setPrefs(list => list.map(x => x.id === p.id ? { ...x, on: v } : x))} />
          </div>
        ))}
      </Card>
    </div>
  );
}

function HelpDesk({ toast }) {
  const [open, setOpen] = React.useState(0);
  return (
    <div className="max-w-[680px] space-y-6">
      <Card className="p-2">
        {FAQS.map((f, i) => (
          <div key={i} className={cn(i < FAQS.length - 1 && "border-b border-border-soft")}>
            <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-4 py-4 text-left">
              <span className="text-[14px] font-medium text-foreground">{f.q}</span>
              <Icon name="chevDown" size={16} className={cn("text-muted-foreground shrink-0 transition-transform", open === i && "rotate-180")} />
            </button>
            {open === i && <p className="px-4 pb-4 -mt-1 text-body text-muted-foreground animate-fade-in">{f.a}</p>}
          </div>
        ))}
      </Card>
      <Card className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <IconTile name="mail" size={44} tone="primary" />
        <div className="flex-1"><p className="text-card-title">Still need help?</p><p className="text-helper mt-0.5">Reach the Buddy4Study support team — we usually reply within a day.</p></div>
        <Button variant="outline" onClick={() => toast("Support request sent", { sub: "Our team will be in touch.", icon: "mail" })}>Contact support</Button>
      </Card>
    </div>
  );
}

window.SettingsPage = SettingsPage;
