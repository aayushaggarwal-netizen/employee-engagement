// ── Employees: table, filters, invite/add modals, profile drawer ──
function empCode(e) { return "EMP" + (1000 + parseInt(e.id.replace(/\D/g, ""), 10)); }
const DEPT_TITLE = { Engineering: "Software Engineer", Product: "Product Manager", Sales: "Account Executive", Marketing: "Marketing Specialist", Operations: "Operations Analyst" };
function empDesignation(e) { return e.designation || DEPT_TITLE[e.dept] || "Team member"; }
function empPhone(e) { return e.phone || ("9" + (800000000 + (parseInt(e.id.replace(/\D/g, ""), 10) * 1234567) % 99999999)).slice(0, 10); }
const _DOB_SAMPLE = ["14 Mar 1996", "22 Aug 1994", "03 Nov 1992", "09 Jul 1998", "27 Jan 1991", "18 Jun 1997", "05 Dec 1995", "30 Apr 1993"];
function empDob(e) { return e.dob || _DOB_SAMPLE[parseInt(e.id.replace(/\D/g, ""), 10) % _DOB_SAMPLE.length]; }
function empDoj(e) { return e.doj || (e.joined && e.joined !== "—" ? e.joined : "12 Jan 2026"); }

function EmployeesPage({ go }) {
  const toast = useToast();
  const [employees, setEmployees] = React.useState(ADMIN_EMPLOYEES);
  const [departments, setDepartments] = React.useState(DEPARTMENTS);
  const addDepartment = (name) => { const t = name.trim(); if (t && !departments.includes(t)) setDepartments(d => [...d, t]); return t; };
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [deptFilter, setDeptFilter] = React.useState("All");
  const [q, setQ] = React.useState("");
  const [profile, setProfile] = React.useState(null);
  const [modal, setModal] = React.useState(null); // "invite" | "add"

  const filtered = employees.filter(e =>
    (statusFilter === "All" || e.status === statusFilter) &&
    (deptFilter === "All" || e.dept === deptFilter) &&
    (e.name.toLowerCase().includes(predQ(q)) || e.email.toLowerCase().includes(predQ(q)) || empCode(e).toLowerCase().includes(predQ(q)))
  );

  return (
    <>
      <AdminPageHead title="People" subtitle={`${employees.length} people across ${DEPARTMENTS.length} departments.`}
        actions={<>
          <Button variant="outline" onClick={() => setModal("invite")}><Icon name="upload" size={15} />Invite via CSV</Button>
          <Button onClick={() => setModal("add")}><Icon name="plus" size={16} />Add individual</Button>
        </>} />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <FilterPills options={["All", "Active", "Pending", "Offboarded"]} value={statusFilter} onChange={setStatusFilter} />
        <div className="flex items-center gap-3 sm:ml-auto">
          <NativeSelect value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="w-40">
            <option value="All">All departments</option>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </NativeSelect>
          <SearchInput value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, email or ID" className="sm:w-64" />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table columns={[
          { label: "Employee" }, { label: "Emp ID" }, { label: "Department" },
          { label: "Total donations", align: "right" }, { label: "Total nominations", align: "right" }, { label: "", align: "right" },
        ]}>
          {filtered.map(e => (
            <tr key={e.id} onClick={() => setProfile(e)} className="border-b border-border-soft last:border-0 hover:bg-surface-muted/40 transition-colors cursor-pointer">
              <Td>
                <div className="flex items-center gap-3">
                  <Avatar name={e.name} size={34} />
                  <div><div className="font-medium text-foreground">{e.name}</div><div className="text-helper">{e.email}</div></div>
                </div>
              </Td>
              <Td className="text-muted-foreground tabular-nums font-mono text-[12.5px]">{empCode(e)}</Td>
              <Td className="text-muted-foreground">{e.dept}</Td>
              <Td align="right" className="tabular-nums font-medium">{e.donated ? formatINR(e.donated) : <span className="text-muted-foreground font-normal">—</span>}</Td>
              <Td align="right" className="tabular-nums">{e.noms.length ? e.noms.length : <span className="text-muted-foreground">—</span>}</Td>
              <Td align="right"><span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-primary">View detail<Icon name="chevRight" size={15} /></span></Td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && <div className="py-12 text-center text-[13px] text-muted-foreground">No people match your filters.</div>}
      </Card>

      {/* profile drawer */}
      <EmployeeDrawer employee={profile} departments={departments} onAddDepartment={addDepartment}
        onClose={() => setProfile(null)}
        onSave={(updated) => {
          setEmployees(list => list.map(x => x.id === updated.id ? updated : x));
          setProfile(updated);
          toast("Employee updated", { sub: `${updated.name}'s details saved.`, icon: "checkCircle" });
        }} />

      {/* invite via CSV modal */}
      <InviteCsvModal open={modal === "invite"} onClose={() => setModal(null)} onConfirm={(n) => { toast("Invites sent", { sub: `${n} people invited by email.`, icon: "mail" }); setModal(null); }} />

      {/* add individual modal */}
      <AddEmployeeModal open={modal === "add"} onClose={() => setModal(null)} onAdd={(emp) => {
        setEmployees(list => [{ ...emp, id: "e" + (list.length + 1), status: "Pending", joined: "—", donated: 0, pledges: [], history: [], noms: [] }, ...list]);
        toast("Person added", { sub: `${emp.name} invited to ${emp.dept}.`, icon: "user" });
        setModal(null);
      }} />
    </>
  );
}

function EmployeeDrawer({ employee, onClose, onSave, departments = DEPARTMENTS, onAddDepartment }) {
  const e = employee;
  const [editing, setEditing] = React.useState(false);
  const [addingDept, setAddingDept] = React.useState(false);
  const [newDept, setNewDept] = React.useState("");
  const [confirmOffboard, setConfirmOffboard] = React.useState(false);
  const [offboardText, setOffboardText] = React.useState("");
  const blank = { name: "", dept: "", designation: "", email: "", phone: "" };
  const [draft, setDraft] = React.useState(blank);
  React.useEffect(() => {
    setEditing(false); setAddingDept(false); setNewDept("");
    if (e) setDraft({ name: e.name, dept: e.dept, designation: empDesignation(e), email: e.email, phone: empPhone(e) });
  }, [e && e.id]);
  const setD = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const save = () => { onSave && onSave({ ...e, ...draft, name: draft.name.trim() || e.name }); setEditing(false); };
  const confirmAddDept = () => {
    const t = (onAddDepartment ? onAddDepartment(newDept) : newDept.trim());
    if (t) setD("dept", t);
    setAddingDept(false); setNewDept("");
  };
  React.useEffect(() => { setConfirmOffboard(false); setOffboardText(""); }, [e && e.id]);

  const headerAction = e && (
    editing
      ? <div className="flex items-center gap-2"><Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button><Button size="sm" onClick={save}><Icon name="check" size={14} />Save</Button></div>
      : <Button variant="outline" size="sm" onClick={() => setEditing(true)}><Icon name="pencil" size={14} />Edit details</Button>
  );

  return (
    <Drawer open={!!e} onClose={onClose} eyebrow="People · detail" title={e ? e.name : ""} width={520} headerAction={headerAction}>
      {e && (
        <div className="space-y-6">
          {/* header band */}
          <div className="rounded-xl border border-border-soft bg-surface-muted/40 p-5">
            {editing ? (
              <div className="flex items-start gap-4">
                <Avatar name={draft.name || e.name} size={56} />
                <div className="flex-1 min-w-0 space-y-3">
                  <Field label="Full name"><Input value={draft.name} onChange={(ev) => setD("name", ev.target.value)} /></Field>
                  <Field label="Designation"><Input value={draft.designation} onChange={(ev) => setD("designation", ev.target.value)} placeholder="e.g. Product Manager" /></Field>
                  <Field label="Team">
                    {addingDept ? (
                      <div className="flex items-center gap-2">
                        <Input value={newDept} autoFocus onChange={(ev) => setNewDept(ev.target.value)}
                          onKeyDown={(ev) => { if (ev.key === "Enter") { ev.preventDefault(); confirmAddDept(); } }} placeholder="New team name" />
                        <Button size="sm" onClick={confirmAddDept} disabled={!newDept.trim()}>Add</Button>
                        <Button variant="secondary" size="sm" onClick={() => { setAddingDept(false); setNewDept(""); }}>Cancel</Button>
                      </div>
                    ) : (
                      <NativeSelect value={draft.dept} onChange={(ev) => { if (ev.target.value === "__add__") { setAddingDept(true); } else { setD("dept", ev.target.value); } }}>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        {draft.dept && !departments.includes(draft.dept) && <option value={draft.dept}>{draft.dept}</option>}
                        <option value="__add__">+ Add new team…</option>
                      </NativeSelect>
                    )}
                  </Field>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Avatar name={e.name} size={56} />
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-semibold text-foreground leading-tight">{e.name}</p>
                  <p className="text-[13px] text-muted-foreground">{empDesignation(e)}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge tone={EMP_STATUS_TONE[e.status]}>{e.status}</Badge>
                    <Badge tone="foreground" className="gap-1"><Icon name="users" size={11} />{e.dept}</Badge>
                    <Badge tone="foreground" className="gap-1 font-mono"><Icon name="clipboard" size={11} />{empCode(e)}</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border-soft p-3.5">
              <p className="text-helper">Donated</p>
              <p className="text-[18px] font-semibold text-foreground tabular-nums mt-0.5">{formatINR(e.donated)}</p>
            </div>
            <div className="rounded-xl border border-border-soft p-3.5">
              <p className="text-helper">Nominations</p>
              <p className="text-[18px] font-semibold text-foreground tabular-nums mt-0.5">{e.noms.length}</p>
            </div>
            <div className="rounded-xl border border-border-soft p-3.5">
              <p className="text-helper">Active pledges</p>
              <p className="text-[18px] font-semibold text-foreground tabular-nums mt-0.5">{e.pledges.length}</p>
            </div>
          </div>

          {/* contact + joined */}
          {editing ? (
            <div className="space-y-3">
              <Field label="Work email"><Input type="email" value={draft.email} onChange={(ev) => setD("email", ev.target.value)} /></Field>
              <Field label="Contact number">
                <div className="flex h-10 w-full rounded-md border border-input bg-surface overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                  <span className="flex items-center px-3 text-sm text-muted-foreground bg-surface-muted border-r border-input shrink-0">+91</span>
                  <input inputMode="numeric" maxLength={10} value={draft.phone} placeholder="98765 43210"
                    onChange={(ev) => setD("phone", ev.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="flex-1 min-w-0 px-3 text-sm bg-transparent placeholder:text-muted-foreground focus:outline-none" />
                </div>
              </Field>
            </div>
          ) : (
            <div className="rounded-xl border border-border-soft divide-y divide-border-soft">
              <div className="flex items-center gap-3 px-4 py-3">
                <Icon name="mail" size={15} className="text-muted-foreground shrink-0" />
                <span className="text-[13px] text-muted-foreground flex-1">Work email</span>
                <span className="text-[13px] font-medium text-foreground truncate">{e.email}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Icon name="phone" size={15} className="text-muted-foreground shrink-0" />
                <span className="text-[13px] text-muted-foreground flex-1">Contact number</span>
                <span className="text-[13px] font-medium text-foreground">{`+91 ${empPhone(e)}`}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Icon name="calendar" size={15} className="text-muted-foreground shrink-0" />
                <span className="text-[13px] text-muted-foreground flex-1">Date of birth</span>
                <span className="text-[13px] font-medium text-foreground">{empDob(e)}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Icon name="calendar" size={15} className="text-muted-foreground shrink-0" />
                <span className="text-[13px] text-muted-foreground flex-1">Date of joining</span>
                <span className="text-[13px] font-medium text-foreground">{empDoj(e)}</span>
              </div>
            </div>
          )}

          {/* status management */}
          {!editing && onSave && (
            <div className="rounded-xl border border-border-soft p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium text-foreground">Account status</p>
                  <p className="text-helper mt-0.5">{e.status === "Offboarded" ? "This person has left the organisation." : e.status === "Pending" ? "Invited — not yet activated." : "Active on the giving platform."}</p>
                </div>
                <Badge tone={EMP_STATUS_TONE[e.status]}>{e.status}</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-3.5">
                {e.status === "Pending" && <Button variant="outline" size="sm" onClick={() => onSave({ ...e, status: "Active", joined: e.joined && e.joined !== "—" ? e.joined : "01 Jun 2026" })}><Icon name="checkCircle" size={14} />Mark active</Button>}
                {e.status === "Active" && <Button variant="outline" size="sm" onClick={() => setConfirmOffboard(true)}><Icon name="logout" size={14} />Offboard</Button>}
                {e.status === "Offboarded" && <span className="text-helper">Offboarding is permanent — this person can't be reactivated.</span>}
              </div>
            </div>
          )}
          {e.pledges.length > 0 && (
            <div>
              <Eyebrow className="mb-2.5">Active pledges</Eyebrow>
              <div className="space-y-2">
                {e.pledges.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border-soft p-3">
                    <IconTile name={p.type === "recurring" ? "repeat" : "wallet"} size={36} tone="primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-medium text-foreground">{formatINR(p.amount)} <span className="text-muted-foreground font-normal">{p.freq}</span></p>
                      <p className="text-helper capitalize">{p.type}</p>
                    </div>
                    <Badge tone={p.status === "Active" ? "success" : "warning"}>{p.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* donation history */}
          <div>
            <Eyebrow className="mb-2.5">Donation history</Eyebrow>
            {e.history.length > 0 ? (
              <div className="rounded-lg border border-border-soft overflow-hidden">
                <Table columns={[{ label: "Date" }, { label: "Type" }, { label: "Amount", align: "right" }]} className="min-w-0">
                  {e.history.map((h, i) => (
                    <tr key={i} className="border-b border-border-soft last:border-0">
                      <Td className="text-muted-foreground whitespace-nowrap">{h.date}</Td>
                      <Td>{h.type}</Td>
                      <Td align="right" className="tabular-nums font-medium">{formatINR(h.amount)}</Td>
                    </tr>
                  ))}
                </Table>
              </div>
            ) : <p className="text-[13px] text-muted-foreground">No donations yet.</p>}
          </div>

          {/* nominations */}
          <div>
            <Eyebrow className="mb-2.5">Nominations made</Eyebrow>
            {e.noms.length > 0 ? (
              <div className="space-y-2">
                {e.noms.map((n, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border-soft p-3">
                    <div className="flex items-center gap-2.5"><Avatar name={n.name} size={30} /><span className="text-[13.5px] font-medium text-foreground">{n.name}</span></div>
                    <Badge tone={(ADMIN_NOM_STATUS_TONE[n.status]) || "muted"}>{n.status}</Badge>
                  </div>
                ))}
              </div>
            ) : <p className="text-[13px] text-muted-foreground">No nominations yet.</p>}
          </div>
        </div>
      )}
      {confirmOffboard && e && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" onClick={() => setConfirmOffboard(false)}>
          <div className="absolute inset-0 bg-foreground/30" />
          <div onClick={(ev) => ev.stopPropagation()} className="relative w-full sm:w-[400px] rounded-xl border border-border bg-popover shadow-lg p-5 animate-scale-in">
            <div className="flex items-start gap-3">
              <span className="h-9 w-9 rounded-lg bg-destructive-soft text-destructive flex items-center justify-center shrink-0"><Icon name="logout" size={18} /></span>
              <div>
                <p className="text-[15px] font-semibold text-foreground">Offboard {e.name}?</p>
                <p className="text-[13px] text-muted-foreground mt-1">This is permanent — they'll no longer be able to donate or be nudged, and <span className="font-medium text-foreground">cannot be reactivated</span>. Past donations and nominations stay on record.</p>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-[13px] font-medium text-foreground">Type <span className="font-mono text-destructive">offboard</span> to confirm</label>
              <Input value={offboardText} autoFocus onChange={(ev) => setOffboardText(ev.target.value)}
                onKeyDown={(ev) => { if (ev.key === "Enter" && offboardText.trim().toLowerCase() === "offboard") { onSave({ ...e, status: "Offboarded" }); setConfirmOffboard(false); setOffboardText(""); } }}
                placeholder="offboard" className="mt-1.5" />
            </div>
            <div className="flex gap-2.5 mt-5">
              <Button variant="outline" className="flex-1" onClick={() => { setConfirmOffboard(false); setOffboardText(""); }}>Cancel</Button>
              <Button variant="destructive" className="flex-1" disabled={offboardText.trim().toLowerCase() !== "offboard"}
                onClick={() => { onSave({ ...e, status: "Offboarded" }); setConfirmOffboard(false); setOffboardText(""); }}>Offboard</Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </Drawer>
  );
}

function InviteCsvModal({ open, onClose, onConfirm }) {
  const [rows, setRows] = React.useState(null);
  const sample = [
    { name: "Tanvi Shah", empId: "EMP2101", designation: "Software Engineer", dept: "Engineering", email: "tanvi.shah@infosys.com", phone: "9876543210", dob: "14 Mar 1998", doj: "05 Jan 2026" },
    { name: "Rohit Verma", empId: "EMP2102", designation: "Account Executive", dept: "Sales", email: "rohit.verma@infosys.com", phone: "9811122233", dob: "22 Aug 1995", doj: "12 Feb 2026" },
    { name: "Pooja Reddy", empId: "EMP2103", designation: "Product Manager", dept: "Product", email: "pooja.reddy@infosys.com", phone: "9700088811", dob: "03 Nov 1993", doj: "01 Mar 2026" },
  ];
  React.useEffect(() => { if (!open) setRows(null); }, [open]);
  const downloadTemplate = () => {
    const header = ["Name", "Employee ID", "Designation", "Team", "Work email", "Contact number", "Date of birth", "Date of joining"];
    const body = [["Tanvi Shah", "EMP2101", "Software Engineer", "Engineering", "tanvi.shah@infosys.com", "9876543210", "14 Mar 1998", "05 Jan 2026"]];
    const csv = [header, ...body].map(r => r.map(v => /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "employee-invite-template.csv"; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Overlay open={open} onClose={onClose}>
      <div className="p-6 w-full sm:w-[520px]">
        <div className="flex items-center justify-between mb-1"><h2 className="text-section-title">Invite via CSV</h2><button onClick={onClose} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button></div>
        <p className="text-helper mb-5">Download the template, fill in your team, and upload it back. Columns: Name, Employee ID, Designation, Team, Work email, Contact number, Date of birth, Date of joining.</p>

        <div className="rounded-lg border border-border-soft bg-surface-muted/40 p-4 flex items-center gap-3 mb-4">
          <span className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon name="sheet" size={18} /></span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-medium text-foreground">Step 1 — download the template</p>
            <p className="text-helper">A sample CSV with the right column headers.</p>
          </div>
          <Button variant="outline" size="sm" onClick={downloadTemplate}><Icon name="download" size={14} />Template</Button>
        </div>

        {!rows ? (
          <button onClick={() => setRows(sample)} className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/40 transition-colors p-8 flex flex-col items-center text-center">
            <IconTile name="upload" size={44} tone="muted" />
            <p className="text-[13.5px] font-medium text-foreground mt-3">Step 2 — upload filled template</p>
            <p className="text-helper mt-1">.csv · demo loads a sample file</p>
          </button>
        ) : (
          <>
            <div className="rounded-lg border border-border-soft overflow-hidden mb-4 overflow-x-auto">
              <Table columns={[{ label: "Name" }, { label: "Emp ID" }, { label: "Team" }, { label: "DOB" }, { label: "Joined" }, { label: "Email" }]} className="min-w-0">
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-border-soft last:border-0"><Td className="font-medium">{r.name}</Td><Td className="text-muted-foreground font-mono">{r.empId}</Td><Td className="text-muted-foreground">{r.dept}</Td><Td className="text-muted-foreground whitespace-nowrap">{r.dob}</Td><Td className="text-muted-foreground whitespace-nowrap">{r.doj}</Td><Td className="text-muted-foreground">{r.email}</Td></tr>
                ))}
              </Table>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setRows(null)}>Choose another</Button>
              <Button className="flex-1" onClick={() => onConfirm(rows.length)}>Send {rows.length} invites</Button>
            </div>
          </>
        )}
      </div>
    </Overlay>
  );
}

function AddEmployeeModal({ open, onClose, onAdd }) {
  const [f, setF] = React.useState({ name: "", empId: "", designation: "", dept: "Engineering", email: "", phone: "", dob: "", doj: "" });
  React.useEffect(() => { if (open) setF({ name: "", empId: "", designation: "", dept: "Engineering", email: "", phone: "", dob: "", doj: "" }); }, [open]);
  const valid = f.name.trim() && f.empId.trim() && f.designation.trim()
    && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email) && f.phone.replace(/\D/g, "").length === 10;
  return (
    <Overlay open={open} onClose={onClose}>
      <div className="p-6 w-full sm:w-[460px]">
        <div className="flex items-center justify-between mb-5"><h2 className="text-section-title">Add individual</h2><button onClick={onClose} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button></div>
        <div className="space-y-4">
          <Field label="Full name" htmlFor="ae-name"><Input id="ae-name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="Employee name" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Employee ID" htmlFor="ae-id"><Input id="ae-id" value={f.empId} onChange={e => setF({ ...f, empId: e.target.value })} placeholder="EMP1234" /></Field>
            <Field label="Team" htmlFor="ae-dept"><NativeSelect value={f.dept} onChange={e => setF({ ...f, dept: e.target.value })}>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</NativeSelect></Field>
          </div>
          <Field label="Designation" htmlFor="ae-desig"><Input id="ae-desig" value={f.designation} onChange={e => setF({ ...f, designation: e.target.value })} placeholder="e.g. Product Manager" /></Field>
          <Field label="Work email" htmlFor="ae-email"><Input id="ae-email" type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="name@infosys.com" /></Field>
          <Field label="Contact number" htmlFor="ae-phone">
            <div className="flex h-10 w-full rounded-md border border-input bg-surface overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
              <span className="flex items-center px-3 text-sm text-muted-foreground bg-surface-muted border-r border-input shrink-0">+91</span>
              <input id="ae-phone" inputMode="numeric" maxLength={10} value={f.phone} placeholder="98765 43210"
                onChange={e => setF({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                className="flex-1 min-w-0 px-3 text-sm bg-transparent placeholder:text-muted-foreground focus:outline-none" />
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date of birth" htmlFor="ae-dob"><Input id="ae-dob" type="date" value={f.dob} onChange={e => setF({ ...f, dob: e.target.value })} /></Field>
            <Field label="Date of joining" htmlFor="ae-doj"><Input id="ae-doj" type="date" value={f.doj} onChange={e => setF({ ...f, doj: e.target.value })} /></Field>
          </div>
        </div>
        <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button><Button className="flex-1" disabled={!valid} onClick={() => onAdd(f)}>Add &amp; invite</Button></div>
      </div>
    </Overlay>
  );
}

window.EmployeesPage = EmployeesPage;
window.InviteCsvModal = InviteCsvModal;
