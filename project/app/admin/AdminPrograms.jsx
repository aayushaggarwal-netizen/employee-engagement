// ── Programs: list + multi-step Create Program builder ──
// Create flow ported from the "Employee giving old" project, exactly:
// Basics → Eligibility (criteria builder) → Cohort & budget → Timeline → Review.
const PROG_STATUS_TONE = { Active: "success", Draft: "muted", Ended: "destructive", Archived: "destructive" };

// Local currency helpers (prefixed to avoid global collisions)
function cpInr(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }
function cpInrShort(n) {
  if (n >= 1e7) return "₹" + (n / 1e7).toFixed(2) + " Cr";
  if (n >= 1e5) return "₹" + (n / 1e5).toFixed(1) + " L";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

// ---------- Local primitives (mirror the old project) ----------
function CpField({ label, required, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[13px] font-medium text-foreground">{label}{required && <span className="text-destructive ml-0.5">*</span>}</label>}
      {children}
      {hint && <p className="text-[12px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function CpSelect({ value, onChange, options, className = "", width, placeholder = "Select…" }) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find(o => o.value === value);
  return (
    <div className={cn("relative", className)} style={width ? { width } : undefined}>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full h-10 px-3 rounded-md border border-input bg-surface flex items-center justify-between text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <span className={cn("truncate", !selected && "text-muted-foreground")}>{selected ? selected.label : placeholder}</span>
        <Icon name="chevDown" size={14} className="text-muted-foreground ml-2 shrink-0" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute z-40 mt-1 w-full bg-popover rounded-md border border-border shadow-md py-1 max-h-64 overflow-auto">
            {options.map(o => (
              <button key={o.value} onClick={() => { onChange(o.value); setOpen(false); }}
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent flex items-center justify-between">
                {o.label}{o.value === value && <Icon name="check" size={14} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CpSegmented({ value, onChange, options, className = "" }) {
  return (
    <div className={cn("inline-flex p-0.5 bg-muted rounded-md", className)}>
      {options.map(o => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)}
            className={cn("px-3 h-8 rounded text-[12.5px] font-medium transition-colors",
              active ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>{o.label}</button>
        );
      })}
    </div>
  );
}

function CpModal({ open, onClose, title, description, children, footer, size = "md" }) {
  if (!open) return null;
  const widths = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" };
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: "hsl(222 25% 14% / 0.4)" }} onClick={onClose} />
      <div className={cn("relative bg-card rounded-xl border border-border shadow-lg w-full max-h-[90vh] flex flex-col animate-scale-in", widths[size])}>
        <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4 border-b border-border-soft">
          <div>
            {title && <h2 className="text-section-title">{title}</h2>}
            {description && <p className="text-[13px] text-muted-foreground mt-1">{description}</p>}
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground rounded-md p-1.5 hover:bg-surface-muted"><Icon name="x" size={16} /></button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-border-soft flex items-center justify-end gap-2 bg-surface-muted/50">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

function CpStepper({ steps, current, onStepClick }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const done = i < current, active = i === current;
        const clickable = !!onStepClick;
        return (
          <React.Fragment key={s}>
            <button type="button" disabled={!clickable} onClick={() => clickable && onStepClick(i)}
              className={cn("flex items-center gap-2 shrink-0 rounded-md", clickable && "cursor-pointer hover:opacity-80 transition-opacity")}>
              <div className={cn("h-7 w-7 rounded-full flex items-center justify-center text-[12px] font-semibold tabular-nums transition-colors",
                done && "bg-success text-success-foreground", active && "bg-primary text-primary-foreground ring-4 ring-primary/10",
                !done && !active && "bg-muted text-muted-foreground")}>
                {done ? <Icon name="check" size={12} stroke={2.5} /> : i + 1}
              </div>
              <span className={cn("text-[12.5px] font-medium hidden sm:inline", active || done ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            </button>
            {i < steps.length - 1 && <div className={cn("flex-1 h-px min-w-[16px]", done ? "bg-success/40" : "bg-border")} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ============================================================
// PROGRAMS LIST
// ============================================================
function ProgramsList({ go, openProgram }) {
  const [open, setOpen] = React.useState(false);
  const toast = useToast();
  return (
    <>
      <AdminPageHead title="Programs" subtitle="Design, configure, and launch scholarship programmes."
        actions={<Button onClick={() => setOpen(true)}><Icon name="plus" size={16} />New programme</Button>} />

      <div className="space-y-4">
        {PROGRAMS.map(p => {
          const pct = p.goal ? Math.round((p.raised / p.goal) * 100) : 0;
          return (
            <button key={p.id} onClick={() => openProgram(p.id)}
              className="w-full text-left rounded-xl border border-border bg-card shadow-sm p-5 sm:p-6 hover:border-foreground/20 transition-colors">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}><Icon name="graduationCap" size={22} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-[16px] font-semibold text-foreground">{p.name}</h3>
                    <Badge tone={PROG_STATUS_TONE[p.status]}>{p.status}</Badge>
                  </div>
                  <p className="text-helper mt-0.5">{p.org}</p>

                  {/* progress */}
                  <div className="mt-4 max-w-[560px]">
                    <div className="flex items-end justify-between gap-3 mb-1.5">
                      <span className="text-[14px] tabular-nums"><span className="font-semibold text-foreground">{cpInrShort(p.raised)}</span><span className="text-muted-foreground"> of {cpInrShort(p.goal)}</span></span>
                      <span className="text-[12.5px] font-medium text-primary tabular-nums">{p.status === "Draft" ? "Not started" : pct + "%"}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: Math.min(100, pct) + "%" }} /></div>
                  </div>

                  {/* meta */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 mt-4 text-[12.5px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Icon name="calendar" size={14} />{p.status === "Ended" ? "Ended" : "Ends"} {p.end}</span>
                    <span className="inline-flex items-center gap-1.5"><Icon name="users" size={14} /><span className="tabular-nums">{p.donors.toLocaleString("en-IN")}</span> donors</span>
                    <span className="inline-flex items-center gap-1.5"><Icon name="userCheck" size={14} /><span className="tabular-nums">{p.scholars}</span> scholars</span>
                  </div>
                </div>
                <Icon name="chevRight" size={20} className="text-muted-foreground shrink-0 mt-1" />
              </div>
            </button>
          );
        })}
      </div>

      <CreateProgramModal open={open} onClose={() => setOpen(false)}
        onLaunch={() => { setOpen(false); toast("Programme created · saved as draft", { sub: "First-gen Engineers 2026 · ready to launch", icon: "checkCircle" }); }} />
    </>
  );
}

// ============================================================
// CREATE PROGRAM MODAL (multi-step)
// ============================================================
// Thin wrapper: the builder rendered inside a centered modal (Programs page use)
function CreateProgramModal({ open, onClose, onLaunch }) {
  if (!open) return null;
  return <ProgramBuilder variant="modal" onClose={onClose} onLaunch={onLaunch} />;
}

// The multi-step builder. variant "modal" renders inside CpModal; "page" renders full-screen.
function ProgramBuilder({ variant = "modal", onClose, onLaunch }) {
  const [step, setStep] = React.useState(0);
  const [preview, setPreview] = React.useState(false);
  const steps = ["Basics", "Eligibility & budget", "Student stories", "Review"];
  const toast = useToast();

  const [form, setForm] = React.useState({
    name: "First-gen Engineers 2026",
    desc: "Tuition support for first-generation engineering undergraduates in tier-2 cities.",
    about: "First-gen Engineers 2026 funds first-generation engineering undergraduates from tier-2 and tier-3 cities who have earned a seat on merit but can't cover tuition, hostel, and learning materials. Each scholar receives need-based support disbursed in tranches across the academic year, with utilisation tracked end to end. The programme prioritises students with the highest financial need first.",
    category: "merit-need",
    criteria: [
      { id: "c1", param: "income", op: "lte", value: 300000 },
      { id: "c2", param: "marks12", op: "gte", value: 85 },
      { id: "c3", param: "course", op: "in", value: ["cse", "ece", "mech", "civil"] },
    ],
    open: "2026-06-15", close: "2026-08-31",
    allowNominations: true,
    donationModes: { oneTime: true, recurring: true, payroll: true },
    capPerScholar: false, capAmount: 100000,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setMode = (k, v) => setForm(f => ({ ...f, donationModes: { ...f.donationModes, [k]: v } }));

  // qualifying students, highest financial need first
  const pool = React.useMemo(() => filterPool(VERIFIED_POOL, form.criteria).slice().sort((a, b) => b.need - a.need), [form.criteria]);
  const matched = pool.length;
  const fullBudget = React.useMemo(() => pool.reduce((s, p) => s + p.need, 0), [pool]);

  // the final cohort is the set of selected student ids
  const [selected, setSelected] = React.useState(() => new Set(pool.map(p => p.id)));
  // when the eligible pool changes, default-select everyone in it
  React.useEffect(() => { setSelected(new Set(pool.map(p => p.id))); }, [pool]);

  const supportedList = pool.filter(p => selected.has(p.id));
  const supported = supportedList.length;
  const amount = supportedList.reduce((s, p) => s + p.need, 0);

  // budget controls select the top-N by need
  const selectTopN = (n) => { const k = Math.max(0, Math.min(matched, n)); setSelected(new Set(pool.slice(0, k).map(p => p.id))); };
  const setSupported = selectTopN;
  // editing corpus → snap selection to the cohort whose cumulative need is closest
  const setAmountTarget = (target) => {
    let cum = 0, best = 0, bestDiff = Math.abs(target);
    for (let i = 0; i < pool.length; i++) { cum += pool[i].need; const d = Math.abs(cum - target); if (d < bestDiff) { bestDiff = d; best = i + 1; } }
    selectTopN(best);
  };
  const toggleStudent = (id) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  // featured stories — up to 6 selected students shown on the programme page.
  // First 6 of the cohort are auto-selected until the admin manually edits the set.
  const MAX_STORIES = 6;
  const storiesTouched = React.useRef(false);
  const [featured, setFeatured] = React.useState(() => new Set(supportedList.slice(0, MAX_STORIES).map(p => p.id)));
  React.useEffect(() => {
    if (storiesTouched.current) {
      // keep featured a subset of the current cohort
      setFeatured(f => new Set([...f].filter(id => selected.has(id))));
    } else {
      // auto-fill the first 6 of the cohort
      setFeatured(new Set(supportedList.slice(0, MAX_STORIES).map(p => p.id)));
    }
  }, [selected]);
  const toggleFeatured = (id) => {
    storiesTouched.current = true;
    setFeatured(f => {
      const n = new Set(f);
      if (n.has(id)) n.delete(id);
      else if (n.size < MAX_STORIES) n.add(id);
      return n;
    });
  };

  const exportCsv = () => {
    const rows = [
      ["id", "name", "email", "college", "course", "year", "marks12", "cgpa", "income_yr", "need", "category", "state"],
      ...supportedList.map(s => [s.id, s.name, s.email, s.college, s.course, s.year, s.marks12, s.cgpa, s.income, s.need, s.category, s.state]),
    ];
    const csv = rows.map(r => r.map(v => {
      const s = String(v == null ? "" : v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-cohort.csv`; a.click();
    URL.revokeObjectURL(url);
    toast("Exported " + supportedList.length + " students", { sub: a.download, icon: "download" });
  };

  const footer = (
    <div className="w-full flex items-center justify-between gap-3">
      <div>
        {step === steps.length - 1 && (
          <button onClick={() => setPreview(true)} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline">
            <Icon name="image" size={15} />Preview programme page
          </button>
        )}
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="secondary" onClick={() => { onClose(); toast("Saved as draft", { sub: form.name, icon: "save" }); }}><Icon name="save" size={14} />Save as draft</Button>
        {step < steps.length - 1
          ? <Button onClick={() => setStep(step + 1)}>Continue<Icon name="arrowRight" size={14} /></Button>
          : <Button onClick={onLaunch}><Icon name="send" size={14} />Launch programme</Button>}
      </div>
    </div>
  );

  const body = (
    <>
      <div className="mb-6"><CpStepper steps={steps} current={step} onStepClick={(i) => setStep(i)} /></div>

      {/* 1. Basics */}
      {step === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CpField label="Programme name" required><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></CpField>
          <CpField label="Funding category" required>
            <CpSelect value={form.category} onChange={(v) => set("category", v)} options={[
              { value: "merit-need", label: "Merit-cum-need" }, { value: "merit", label: "Merit only" },
              { value: "need", label: "Need-based" }, { value: "diversity", label: "Diversity & inclusion" },
            ]} />
          </CpField>
          <div className="sm:col-span-2">
            <CpField label="Short description" required hint="One line shown on programme cards and the leaderboard. Keep it under ~120 characters.">
              <Input value={form.desc} onChange={(e) => set("desc", e.target.value)} maxLength={140} />
            </CpField>
          </div>
          <div className="sm:col-span-2">
            <CpField label="About programme" required hint="The full story shown on the employee programme page — who it's for, what it covers, and why it matters.">
              <Textarea rows={5} value={form.about} onChange={(e) => set("about", e.target.value)} />
            </CpField>
          </div>
          {/* Participation config */}
          <div className="sm:col-span-2 rounded-xl border border-border-soft p-5">
            <Eyebrow className="mb-1">How employees can take part</Eyebrow>
            <p className="text-helper mb-4">Control what employees can do on this programme's page. All options are on by default.</p>

            <div className="flex items-start justify-between gap-4 py-3 border-b border-border-soft">
              <div className="min-w-0">
                <p className="text-[13.5px] font-medium text-foreground">Allow nominations</p>
                <p className="text-helper mt-0.5">Employees can put forward a student they know to be considered for this programme.</p>
              </div>
              <Toggle on={form.allowNominations} onChange={(v) => set("allowNominations", v)} />
            </div>

            {form.allowNominations && (
              <div className="py-4 border-b border-border-soft animate-fade-in">
                <p className="text-[13.5px] font-medium text-foreground">Nomination timeline</p>
                <p className="text-helper mt-0.5 mb-3">When employees can nominate, and when the panel reviews.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CpField label="Nominations open" required><Input type="date" value={form.open} onChange={(e) => set("open", e.target.value)} /></CpField>
                  <CpField label="Nominations close" required><Input type="date" value={form.close} onChange={(e) => set("close", e.target.value)} /></CpField>
                </div>
              </div>
            )}

            <div className="pt-4">
              <p className="text-[13.5px] font-medium text-foreground">Donation options</p>
              <p className="text-helper mt-0.5 mb-3">Choose how employees can give. At least one must stay on.</p>
              <div className="space-y-2.5">
                {[
                  { k: "oneTime", icon: "gift", label: "One-time gift", desc: "A single donation, paid now." },
                  { k: "recurring", icon: "repeat", label: "Recurring (monthly)", desc: "An auto-pay gift every month." },
                  { k: "payroll", icon: "wallet", label: "Payroll giving", desc: "Deducted from salary each month by HR." },
                ].map(m => {
                  const on = form.donationModes[m.k];
                  const onCount = Object.values(form.donationModes).filter(Boolean).length;
                  const lockOff = on && onCount === 1; // can't turn off the last one
                  return (
                    <div key={m.k} className="flex items-center gap-3 rounded-lg border border-border-soft px-3.5 py-3">
                      <span className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", on ? "bg-primary/10 text-primary" : "bg-surface-muted text-muted-foreground")}><Icon name={m.icon} size={17} /></span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-medium text-foreground">{m.label}</p>
                        <p className="text-helper">{m.desc}</p>
                      </div>
                      <Toggle on={on} onChange={(v) => { if (!lockOff) setMode(m.k, v); }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Eligibility & budget — single step */}
      {step === 1 && (
        <div className="space-y-6">
          <EligibilityBuilder criteria={form.criteria} onChange={(c) => set("criteria", c)} pool={pool.length} total={VERIFIED_POOL.length} />
          <CohortStep criteria={form.criteria} matched={matched} supported={supported}
            setSupported={setSupported} amount={amount} fullBudget={fullBudget} setAmount={setAmountTarget}
            supportedList={supportedList} totalPool={VERIFIED_POOL.length} hideTable />
        </div>
      )}

      {/* 3. Student stories */}
      {step === 2 && (
        <StoriesStep pool={supportedList} featured={featured} onToggle={toggleFeatured} max={MAX_STORIES} />
      )}

      {/* 4. Review */}
      {step === 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReviewBlock title="Programme">
            <li><span className="text-muted-foreground">Name</span><span>{form.name}</span></li>
            <li><span className="text-muted-foreground">Category</span><span>{PARAM_LABELS_CATEGORY[form.category]}</span></li>
            <li><span className="text-muted-foreground">Applications close</span><span>{form.close}</span></li>
          </ReviewBlock>
          <ReviewBlock title="Budget & cohort">
            <li><span className="text-muted-foreground">Total corpus</span><span className="tabular-nums">{cpInr(amount)}</span></li>
            <li><span className="text-muted-foreground">Scholars supported</span><span className="tabular-nums">{supported} of {matched} matched</span></li>
            <li><span className="text-muted-foreground">Featured stories</span><span className="tabular-nums">{featured.size}</span></li>
            <li><span className="text-muted-foreground">CSV exported</span><span className="text-success">Yes · {supportedList.length} rows</span></li>
          </ReviewBlock>
          <div className="sm:col-span-2 rounded-lg border bg-surface p-4">
            <p className="text-eyebrow mb-2.5">Eligibility · {form.criteria.length} rule{form.criteria.length === 1 ? "" : "s"}</p>
            <div className="flex flex-wrap gap-1.5">{form.criteria.map(c => <CriterionChip key={c.id} criterion={c} />)}</div>
          </div>
          <div className="sm:col-span-2 rounded-lg border bg-surface p-4">
            <p className="text-eyebrow mb-2.5">Participation</p>
            <div className="flex flex-wrap gap-1.5">
              <Badge tone={form.allowNominations ? "success" : "muted"}><Icon name={form.allowNominations ? "check" : "x"} size={11} stroke={2.5} />Nominations {form.allowNominations ? "allowed" : "off"}</Badge>
              {[["oneTime", "One-time"], ["recurring", "Recurring"], ["payroll", "Payroll giving"]].map(([k, label]) =>
                form.donationModes[k]
                  ? <Badge key={k} tone="success"><Icon name="check" size={11} stroke={2.5} />{label}</Badge>
                  : <Badge key={k} tone="muted">{label} off</Badge>
              )}
            </div>
          </div>
          <ReviewBlock title="Timeline">
            <li><span className="text-muted-foreground">Nominations open</span><span>{form.allowNominations ? form.open : "—"}</span></li>
            <li><span className="text-muted-foreground">Nominations close</span><span>{form.allowNominations ? form.close : "—"}</span></li>
          </ReviewBlock>
          <ReviewBlock title="What happens next">
            <li><span className="text-muted-foreground">Step 1</span><span>Leadership alignment</span></li>
            <li><span className="text-muted-foreground">Step 2</span><span>Employee onboarding</span></li>
            <li><span className="text-muted-foreground">Step 3</span><span>Engagement kickoff</span></li>
          </ReviewBlock>
        </div>
      )}
      {preview && <ProgramPreview form={form} amount={amount} supported={supported} onClose={() => setPreview(false)} />}
    </>
  );

  if (variant === "page") {
    return (
      <div className="fixed inset-0 z-40 bg-background overflow-y-auto flex flex-col">
        <header className="sticky top-0 z-10 h-16 bg-surface/95 backdrop-blur-sm border-b border-border flex items-center px-5 sm:px-8 shrink-0">
          <div className="flex items-center gap-2.5">
            <img src="assets/b4s-logo.png" alt="" className="h-8 w-8 object-contain" />
            <div className="leading-tight"><p className="text-[14px] font-bold tracking-tight text-foreground">Create programme</p><p className="text-[10.5px] text-muted-foreground -mt-0.5">Step {step + 1} of {steps.length} · {steps[step]}</p></div>
          </div>
        </header>
        <div className="flex-1">
          <div className="mx-auto max-w-[920px] px-5 sm:px-8 py-8">{body}</div>
        </div>
        <footer className="sticky bottom-0 bg-surface/95 backdrop-blur-sm border-t border-border px-5 sm:px-8 py-3.5">
          <div className="mx-auto max-w-[920px] flex items-center justify-end gap-2.5">{footer}</div>
        </footer>
      </div>
    );
  }

  return (
    <CpModal open onClose={onClose} size="xl"
      title="Create scholarship programme"
      description="Five short steps. You can save as draft at any point."
      footer={footer}>
      {body}
    </CpModal>
  );
}

// Employee-facing programme page preview — renders the real employee Program view
function ProgramPreview({ form, amount, supported, onClose }) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[110] bg-foreground/40 flex flex-col" onClick={onClose}>
      <div className="shrink-0 flex items-center justify-between gap-3 px-5 h-14 bg-foreground text-background" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 text-[13px]"><Icon name="image" size={16} /><span className="font-medium">Preview · employee programme page</span></div>
        <button onClick={onClose} className="h-9 px-3 rounded-md text-[13px] font-medium hover:bg-white/15 transition-colors inline-flex items-center gap-1.5"><Icon name="x" size={16} />Close preview</button>
      </div>
      <div className="flex-1 overflow-y-auto bg-background" onClick={(e) => e.stopPropagation()}>
        <Program navigate={() => {}} />
        <p className="text-center text-[12px] text-muted-foreground pb-8 -mt-2">This is a preview of the live employee page. Publishing makes it active.</p>
      </div>
    </div>,
    document.body
  );
}

const PARAM_LABELS_CATEGORY = { "merit-need": "Merit-cum-need", "merit": "Merit only", "need": "Need-based", "diversity": "Diversity & inclusion" };

function ReviewBlock({ title, children }) {
  return (
    <div className="rounded-lg border bg-surface p-4">
      <p className="text-eyebrow mb-2.5">{title}</p>
      <ul className="flex flex-col gap-1.5 text-[13px]">
        {React.Children.map(children, (c, i) => React.cloneElement(c, { key: i, className: "flex items-center justify-between gap-3" }))}
      </ul>
    </div>
  );
}

// ============================================================
// ELIGIBILITY — parameter library + criteria builder
// ============================================================
const PARAMS = {
  income: { label: "Annual family income", type: "number", unit: "₹", icon: "wallet", ops: ["lte", "gte", "between"] },
  need: { label: "Maximum financial need", type: "number", unit: "₹", icon: "coin", ops: ["lte"] },
  marks12: { label: "Previous class marks", type: "number", unit: "%", icon: "graduationCap", ops: ["gte", "lte", "between"] },
  cgpa: { label: "Previous class CGPA", type: "number", unit: "/10", icon: "trendingUp", ops: ["gte", "lte", "between"] },
  course: { label: "Course", type: "multi", icon: "bookOpen", ops: ["in", "notin"], options: [
    { value: "cse", label: "Computer Science" }, { value: "ece", label: "Electronics" }, { value: "mech", label: "Mechanical" },
    { value: "civil", label: "Civil" }, { value: "ee", label: "Electrical" }, { value: "it", label: "Information Tech" }, { value: "chem", label: "Chemical" },
  ] },
  gender: { label: "Gender", type: "multi", icon: "user", ops: ["in"], options: [
    { value: "female", label: "Female" }, { value: "male", label: "Male" }, { value: "nb", label: "Non-binary" },
  ] },
  state: { label: "Location (state)", type: "multi", icon: "globe", ops: ["in", "notin"], options: [
    { value: "MH", label: "Maharashtra" }, { value: "KA", label: "Karnataka" }, { value: "TN", label: "Tamil Nadu" }, { value: "DL", label: "Delhi" },
    { value: "UP", label: "Uttar Pradesh" }, { value: "BR", label: "Bihar" }, { value: "WB", label: "West Bengal" }, { value: "TG", label: "Telangana" },
    { value: "RJ", label: "Rajasthan" }, { value: "OD", label: "Odisha" }, { value: "MP", label: "Madhya Pradesh" }, { value: "AP", label: "Andhra Pradesh" },
    { value: "CG", label: "Chhattisgarh" }, { value: "GJ", label: "Gujarat" }, { value: "PB", label: "Punjab" }, { value: "KL", label: "Kerala" },
    { value: "AS", label: "Assam" }, { value: "JH", label: "Jharkhand" },
  ] },
  pwd: { label: "Person with disability (PWD)", type: "bool", icon: "shield", ops: ["eq"], options: [{ value: true, label: "Yes" }, { value: false, label: "No" }] },
  crisis: { label: "Crisis / hardship", type: "multi", icon: "info", ops: ["in"], options: [
    { value: "single-parent", label: "Single-parent household" }, { value: "orphan", label: "Orphan / no guardian" },
    { value: "medical", label: "Medical emergency in family" }, { value: "disaster", label: "Natural disaster affected" },
    { value: "job-loss", label: "Parent job loss" }, { value: "farmer-distress", label: "Farmer distress" },
  ] },
};

const OP_LABELS = { gte: "is at least", lte: "is at most", between: "is between", in: "is one of", notin: "is not", eq: "is" };

const VERIFIED_POOL = (() => {
  const firstM = ["Aarav", "Vihaan", "Aditya", "Vivaan", "Arjun", "Sai", "Reyansh", "Krishna", "Ishaan", "Shaurya", "Atharv", "Advik", "Pranav", "Rohan", "Yash", "Karthik", "Mohan", "Rahul", "Imran", "Tanish"];
  const firstF = ["Aadya", "Ananya", "Anika", "Pari", "Saanvi", "Diya", "Myra", "Aarohi", "Sara", "Riya", "Meera", "Priya", "Kavya", "Sneha", "Tanvi", "Lakshmi", "Anjali", "Ishita", "Aditi", "Nidhi"];
  const last = ["Sharma", "Patel", "Reddy", "Khanna", "Verma", "Iyer", "Rao", "Singh", "Kumar", "Roy", "Joshi", "Menon", "Mehta", "Gupta", "Das", "Bose", "Naidu", "Pillai", "Mukherjee", "Banerjee", "Khan", "Qureshi", "Ali", "Dube", "Tripathi"];
  const colleges = {
    iit: ["IIT Bhilai", "IIT Guwahati", "IIT Hyderabad", "IIT Bombay", "IIT Madras", "IIT Patna", "IIT Bhubaneswar"],
    nit: ["NIT Warangal", "NIT Calicut", "NIT Trichy", "NIT Surathkal", "NIT Rourkela", "NIT Durgapur", "NIT Allahabad"],
    iiit: ["IIIT Hyderabad", "IIIT Bangalore", "IIIT Delhi", "IIIT Allahabad"],
    govt: ["DTU Delhi", "COEP Pune", "Jadavpur University", "Anna University", "Jamia Millia Islamia"],
    private: ["BITS Pilani", "VIT Vellore", "SRM Chennai", "Manipal Institute", "Thapar University", "Amrita Coimbatore"],
  };
  const courses = ["cse", "ece", "mech", "civil", "ee", "it", "chem"];
  const states = ["MH", "KA", "TN", "DL", "UP", "BR", "WB", "TG", "RJ", "OD", "MP", "AP", "CG", "GJ", "PB", "KL", "AS", "JH"];
  const cats = ["general", "obc-ncl", "sc", "st", "ews"];
  const years = ["I", "II", "III", "IV"];
  const crises = ["single-parent", "orphan", "medical", "disaster", "job-loss", "farmer-distress"];
  const seed = (n) => { let x = n * 9301 + 49297; return ((x % 233280) / 233280); };
  const pool = [];
  for (let i = 0; i < 2400; i++) {
    const isF = seed(i * 7 + 1) > 0.62;
    const fn = isF ? firstF[Math.floor(seed(i * 3 + 5) * firstF.length)] : firstM[Math.floor(seed(i * 3 + 5) * firstM.length)];
    const ln = last[Math.floor(seed(i * 13 + 9) * last.length)];
    const instType = (seed(i * 17 + 3) < 0.15) ? "iit" : (seed(i * 17 + 3) < 0.35) ? "nit" : (seed(i * 17 + 3) < 0.45) ? "iiit" : (seed(i * 17 + 3) < 0.65) ? "govt" : "private";
    const collegeList = colleges[instType];
    const college = collegeList[Math.floor(seed(i * 5 + 11) * collegeList.length)];
    const course = courses[Math.floor(seed(i * 19 + 2) * courses.length)];
    const year = years[Math.floor(seed(i * 23 + 7) * years.length)];
    const cat = cats[Math.floor(seed(i * 29 + 13) * cats.length)];
    const state = states[Math.floor(seed(i * 31 + 17) * states.length)];
    const marks12 = +(70 + seed(i * 37 + 23) * 30).toFixed(1);
    const cgpa = +(6.0 + seed(i * 41 + 27) * 4.0).toFixed(2);
    const income = Math.round(60000 + seed(i * 43 + 31) * 740000);
    // financial need: gap between annual cost of study and what the family can contribute.
    // IITs/NITs cost more; lower household income → higher need. Rounded to ₹1,000.
    const costBase = { iit: 230000, nit: 180000, iiit: 175000, govt: 110000, private: 200000 }[instType];
    const familyShare = income * 0.18;
    const needRaw = costBase - familyShare + (seed(i * 59 + 41) - 0.5) * 20000;
    const need = Math.max(25000, Math.min(250000, Math.round(needRaw / 1000) * 1000));
    pool.push({
      id: `V-${(i + 1).toString().padStart(4, "0")}`, name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${college.toLowerCase().split(" ")[0]}.ac.in`,
      college, instType, course, year, category: cat, state, gender: isF ? "female" : "male",
      marks12, cgpa, income, need, firstGen: seed(i * 47 + 33) > 0.55,
      pwd: seed(i * 53 + 37) > 0.92,
      crisis: seed(i * 61 + 19) > 0.7 ? crises[Math.floor(seed(i * 67 + 23) * crises.length)] : null,
    });
  }
  return pool;
})();

function filterPool(pool, criteria) { return pool.filter(p => criteria.every(c => matchCriterion(p, c))); }
function matchCriterion(row, c) {
  const v = row[c.param];
  if (v === undefined) return true;
  switch (c.op) {
    case "gte": return Number(v) >= Number(c.value);
    case "lte": return Number(v) <= Number(c.value);
    case "between": return Number(v) >= Number((c.value && c.value[0]) || 0) && Number(v) <= Number((c.value && c.value[1]) || 0);
    case "in": return Array.isArray(c.value) ? c.value.includes(v) : v === c.value;
    case "notin": return Array.isArray(c.value) ? !c.value.includes(v) : v !== c.value;
    case "eq": return v === c.value;
    default: return true;
  }
}

function EligibilityBuilder({ criteria, onChange, pool, total }) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState(null);
  const addBtnRef = React.useRef(null);
  const usedParams = new Set(criteria.map(c => c.param));
  const availableParams = Object.entries(PARAMS).filter(([k]) => !usedParams.has(k));
  const pct = total ? Math.round((pool / total) * 100) : 0;

  const openMenu = () => {
    const r = addBtnRef.current && addBtnRef.current.getBoundingClientRect();
    if (r) {
      const menuH = Math.min(288, 44 + availableParams.length * 38);
      const below = window.innerHeight - r.bottom;
      const openUp = below < menuH + 12;
      let top = openUp ? r.top - menuH - 6 : r.bottom + 6;
      top = Math.max(8, Math.min(top, window.innerHeight - menuH - 8));
      setMenuPos({ left: r.left, top });
    }
    setAddOpen(true);
  };

  const addCriterion = (param) => {
    const def = PARAMS[param];
    const op = def.ops[0];
    let value;
    if (def.type === "number") value = param === "marks12" ? 80 : param === "cgpa" ? 7.5 : param === "income" ? 300000 : 0;
    else if (def.type === "bool") value = true;
    else value = def.options.slice(0, 1).map(o => o.value);
    onChange([...criteria, { id: `c${Date.now()}`, param, op, value }]);
    setAddOpen(false);
  };
  const updateCriterion = (id, patch) => onChange(criteria.map(c => c.id === id ? { ...c, ...patch } : c));
  const removeCriterion = (id) => onChange(criteria.filter(c => c.id !== id));

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg border bg-surface-muted/40 p-4 flex items-center gap-4">
        <div className="h-10 w-10 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: "hsl(var(--primary) / 0.10)", color: "hsl(var(--primary))" }}><Icon name="filter" size={16} /></div>
        <div className="flex-1">
          <p className="text-[13.5px] font-medium"><span className="tabular-nums">{pool.toLocaleString("en-IN")}</span> of <span className="tabular-nums">{total.toLocaleString("en-IN")}</span> verified students match these rules</p>
          <p className="text-[12px] text-muted-foreground mt-0.5">Pre-verified means Aadhaar, marks and income proof are already on file. They skip the eligibility check during application.</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[20px] font-semibold tabular-nums leading-tight tracking-[-0.01em]">{pct}%</p>
          <p className="text-[11px] text-muted-foreground uppercase tracking-[0.08em] font-semibold">of pool</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {criteria.length === 0 && (
          <div className="rounded-lg border border-dashed border-border-soft p-6 text-center">
            <p className="text-[13px] text-muted-foreground">No criteria yet — every verified student would qualify. Add at least one rule to narrow the cohort.</p>
          </div>
        )}
        {criteria.map((c, i) => <CriterionRow key={c.id} index={i} criterion={c} onChange={(p) => updateCriterion(c.id, p)} onRemove={() => removeCriterion(c.id)} />)}
      </div>

      <div>
        <span ref={addBtnRef} className="inline-block">
          <Button variant="outline" size="sm" onClick={() => addOpen ? setAddOpen(false) : openMenu()} disabled={availableParams.length === 0}><Icon name="plus" size={13} />Add criterion</Button>
        </span>
        {addOpen && menuPos && ReactDOM.createPortal(
          <>
            <div className="fixed inset-0 z-[90]" onClick={() => setAddOpen(false)} />
            <div className="fixed z-[91] w-72 bg-popover rounded-md border border-border shadow-lg py-1.5 max-h-72 overflow-auto" style={{ left: menuPos.left, top: menuPos.top }}>
              <p className="px-3 py-1.5 text-[10.5px] uppercase tracking-[0.12em] font-semibold text-muted-foreground">Add eligibility rule</p>
              {availableParams.map(([k, def]) => (
                <button key={k} onClick={() => addCriterion(k)} className="w-full px-3 py-2 text-left text-[13px] hover:bg-accent flex items-center gap-2.5">
                  <Icon name={def.icon} size={14} className="text-muted-foreground" />{def.label}
                </button>
              ))}
              {availableParams.length === 0 && <p className="px-3 py-3 text-[12.5px] text-muted-foreground">Every parameter is in use.</p>}
            </div>
          </>,
          document.body
        )}
      </div>
    </div>
  );
}

function CriterionRow({ index, criterion, onChange, onRemove }) {
  const def = PARAMS[criterion.param];
  return (
    <div className="rounded-lg border bg-surface p-3 flex flex-wrap items-center gap-2">
      <div className="h-8 w-8 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: "hsl(var(--primary) / 0.08)", color: "hsl(var(--primary))" }}><Icon name={def.icon} size={14} /></div>
      <span className="text-[10.5px] uppercase tracking-[0.10em] font-semibold text-muted-foreground tabular-nums">{(index + 1).toString().padStart(2, "0")}</span>
      <span className="text-[13.5px] font-medium">{def.label}</span>
      {def.ops.length > 1
        ? <CpSelect value={criterion.op} onChange={(op) => onChange({ op })} width={120} options={def.ops.map(o => ({ value: o, label: OP_LABELS[o] }))} />
        : <span className="text-[12.5px] text-muted-foreground">{OP_LABELS[criterion.op]}</span>}
      <CriterionValue criterion={criterion} def={def} onChange={onChange} />
      <div className="flex-1" />
      <button onClick={onRemove} className="h-8 w-8 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors inline-flex items-center justify-center" title="Remove"><Icon name="x" size={14} /></button>
    </div>
  );
}

function CriterionValue({ criterion, def, onChange }) {
  if (def.type === "number") {
    if (criterion.op === "between") {
      const [lo, hi] = Array.isArray(criterion.value) ? criterion.value : [0, 0];
      return (
        <>
          <Input className="h-8 w-24 tabular-nums" value={lo} onChange={(e) => onChange({ value: [Number(e.target.value.replace(/\D/g, "") || 0), hi] })} />
          <span className="text-[12.5px] text-muted-foreground">and</span>
          <Input className="h-8 w-24 tabular-nums" value={hi} onChange={(e) => onChange({ value: [lo, Number(e.target.value.replace(/\D/g, "") || 0)] })} />
          <span className="text-[12.5px] text-muted-foreground">{def.unit}</span>
        </>
      );
    }
    return (
      <>
        <Input className="h-8 w-28 tabular-nums" value={criterion.value} onChange={(e) => onChange({ value: Number(e.target.value.replace(/[^\d.]/g, "") || 0) })} />
        <span className="text-[12.5px] text-muted-foreground">{def.unit}</span>
      </>
    );
  }
  if (def.type === "bool") {
    return <CpSegmented value={String(criterion.value)} onChange={(v) => onChange({ value: v === "true" })} options={def.options.map(o => ({ value: String(o.value), label: o.label }))} />;
  }
  return <MultiPicker selected={criterion.value || []} options={def.options} onChange={(value) => onChange({ value })} />;
}

function MultiPicker({ selected, options, onChange }) {
  const [open, setOpen] = React.useState(false);
  const labels = options.filter(o => selected.includes(o.value)).map(o => o.label);
  const summary = labels.length === 0 ? "Select…" : labels.length <= 2 ? labels.join(", ") : `${labels[0]} +${labels.length - 1} more`;
  const toggle = (v) => onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="h-8 min-w-[180px] max-w-[280px] px-3 rounded-md border border-input bg-surface flex items-center justify-between text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <span className={cn("truncate", labels.length === 0 && "text-muted-foreground")}>{summary}</span>
        <Icon name="chevDown" size={13} className="text-muted-foreground ml-2 shrink-0" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute z-40 mt-1 w-64 bg-popover rounded-md border border-border shadow-md py-1 max-h-64 overflow-auto">
            {options.map(o => {
              const on = selected.includes(o.value);
              return (
                <button key={o.value} onClick={() => toggle(o.value)} className="w-full px-3 py-1.5 text-left text-[13px] hover:bg-accent flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className={cn("h-3.5 w-3.5 rounded border flex items-center justify-center", on ? "bg-primary border-primary text-primary-foreground" : "border-input")}>{on && <Icon name="check" size={9} stroke={3} />}</span>
                    {o.label}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function CriterionChip({ criterion }) {
  const def = PARAMS[criterion.param];
  let valueStr;
  if (def.type === "number") {
    const fmt = (n) => def.unit === "₹" ? cpInrShort(Number(n)) : `${n}${def.unit}`;
    valueStr = criterion.op === "between" ? `${fmt(criterion.value[0])}–${fmt(criterion.value[1])}` : fmt(criterion.value);
  } else if (def.type === "bool") {
    valueStr = criterion.value ? "Yes" : "No";
  } else {
    const labels = def.options.filter(o => criterion.value.includes(o.value)).map(o => o.label);
    valueStr = labels.length <= 2 ? labels.join(", ") : `${labels[0]} +${labels.length - 1}`;
  }
  return (
    <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[12px] border border-primary/15 whitespace-nowrap max-w-full" style={{ backgroundColor: "hsl(var(--primary) / 0.06)" }}>
      <Icon name={def.icon} size={11} className="text-primary shrink-0" />
      <span className="font-medium text-foreground">{def.label}</span>
      <span className="text-muted-foreground">{OP_LABELS[criterion.op]}</span>
      <span className="font-medium text-foreground truncate">{valueStr}</span>
    </span>
  );
}

// ============================================================
// COHORT & BUDGET
// ============================================================
function CohortStep({ criteria, matched, supported, setSupported, amount, fullBudget, setAmount, supportedList, totalPool, onExport, hideTable }) {
  const pctOfCohort = matched ? Math.round((supported / matched) * 100) : 0;
  const avgNeed = supported ? Math.round(amount / supported) : 0;
  const [amtText, setAmtText] = React.useState(String(amount));
  const editingAmt = React.useRef(false);
  React.useEffect(() => { if (!editingAmt.current) setAmtText(String(amount)); }, [amount]);
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg border bg-surface px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-eyebrow">Matching {criteria.length} eligibility rule{criteria.length === 1 ? "" : "s"}</p>
          <span className="text-[11.5px] text-muted-foreground tabular-nums">{matched.toLocaleString("en-IN")} of {totalPool.toLocaleString("en-IN")} verified students</span>
        </div>
        <div className="flex flex-wrap gap-1.5">{criteria.map(c => <CriterionChip key={c.id} criterion={c} />)}</div>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <BudgetStat label="Matched students" value={matched.toLocaleString("en-IN")} hint={`Pool of ${totalPool.toLocaleString("en-IN")} verified`} icon="users" />
          <BudgetStat label="Average need" value={avgNeed ? cpInrShort(avgNeed) : "—"} hint="Across funded scholars" icon="banknote" />
          <BudgetStat label="Corpus for full cohort" value={cpInrShort(fullBudget)} hint={`Sum of all ${matched} students' need`} icon="wallet" />
        </div>

        <div className="mt-6 pt-5 border-t border-border-soft">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border-soft p-4">
              <p className="text-[10.5px] uppercase tracking-[0.10em] font-semibold text-muted-foreground">Corpus required</p>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <span className="text-[20px] font-semibold text-muted-foreground">₹</span>
                <input type="text" inputMode="numeric" value={Number(amtText || 0).toLocaleString("en-IN")}
                  onChange={(e) => { const raw = e.target.value.replace(/\D/g, ""); setAmtText(raw); setAmount(Number(raw || 0)); }}
                  onFocus={() => { editingAmt.current = true; }}
                  onBlur={() => { editingAmt.current = false; setAmtText(String(amount)); }}
                  className="text-[26px] font-semibold tracking-[-0.01em] tabular-nums bg-transparent w-full focus:outline-none border-b border-border focus:border-primary" />
              </div>
              <p className="text-[12px] text-muted-foreground mt-1.5">Snaps to the nearest cohort · max {cpInr(fullBudget)}</p>
            </div>
            <div className="rounded-xl border border-border-soft p-4">
              <p className="text-[10.5px] uppercase tracking-[0.10em] font-semibold text-muted-foreground">Scholars supported</p>
              <div className="flex items-baseline gap-2 mt-1.5">
                <input type="text" inputMode="numeric" value={supported} onChange={(e) => setSupported(Number(e.target.value.replace(/\D/g, "") || 0))}
                  className="text-[26px] font-semibold tracking-[-0.01em] tabular-nums bg-transparent w-[90px] focus:outline-none border-b border-border focus:border-primary" />
                <span className="text-[15px] text-muted-foreground">/ {matched} matched · {pctOfCohort}%</span>
              </div>
              <p className="text-[12px] text-muted-foreground mt-1.5">Average need {avgNeed ? cpInr(avgNeed) : "—"} per scholar</p>
            </div>
          </div>

          {supported < matched && (
            <div className="mt-4 rounded-lg border border-warning/30 px-3.5 py-2.5 flex items-start gap-2.5" style={{ backgroundColor: "hsl(var(--warning-soft))" }}>
              <Icon name="alertCircle" size={14} className="text-warning mt-0.5" />
              <p className="text-[12.5px]" style={{ color: "hsl(var(--warning-foreground))" }}>
                <span className="font-medium">{matched - supported} matched students</span> won't get an award. The cohort is filled by financial need — students with the highest need are funded first.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden" style={{ display: hideTable ? "none" : undefined }}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-soft gap-3">
          <div>
            <p className="text-[13.5px] font-medium">Cohort preview</p>
            <p className="text-[11.5px] text-muted-foreground">First {Math.min(8, supportedList.length)} of {supportedList.length} · sorted by need</p>
          </div>
          <Button variant="secondary" size="sm" onClick={onExport} disabled={!onExport || supportedList.length === 0}><Icon name="download" size={13} />Export {supportedList.length.toLocaleString("en-IN")}-row CSV</Button>
        </div>
        <div className="overflow-auto max-h-[320px]">
          <table className="w-full text-[13px]">
            <thead className="bg-surface-muted/40 text-muted-foreground sticky top-0">
              <tr className="text-left">
                <th className="font-medium px-5 py-2.5">Student</th>
                <th className="font-medium px-3 py-2.5">College · course</th>
                <th className="font-medium px-3 py-2.5 tabular-nums">Marks XII</th>
                <th className="font-medium px-3 py-2.5 tabular-nums">CGPA</th>
                <th className="font-medium px-3 py-2.5 tabular-nums">Need</th>
              </tr>
            </thead>
            <tbody>
              {supportedList.slice(0, 8).map(s => (
                <tr key={s.id} className="border-t border-border-soft">
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={s.name} size={26} />
                      <div><p className="font-medium leading-tight">{s.name}</p><p className="text-[11px] text-muted-foreground tabular-nums">{s.id} · year {s.year}</p></div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="leading-tight">{s.college}</p>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-[0.05em]">{(PARAMS.course.options.find(o => o.value === s.course) || {}).label}</p>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">{s.marks12}%</td>
                  <td className="px-3 py-2.5 tabular-nums">{s.cgpa}</td>
                  <td className="px-3 py-2.5 tabular-nums font-medium">{cpInr(s.need)}</td>
                </tr>
              ))}
              {supportedList.length === 0 && (
                <tr><td colSpan={5} className="py-12 text-center">
                  <p className="text-[13.5px] font-medium text-foreground">No students match yet</p>
                  <p className="text-[12.5px] text-muted-foreground mt-1">Loosen one of the eligibility rules to bring more students into the cohort.</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BudgetStat({ label, value, hint, icon }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: "hsl(var(--primary) / 0.08)", color: "hsl(var(--primary))" }}><Icon name={icon} size={15} /></div>
      <div className="min-w-0">
        <p className="text-[10.5px] uppercase tracking-[0.10em] font-semibold text-muted-foreground">{label}</p>
        <p className="text-[20px] font-semibold tabular-nums tracking-[-0.01em] mt-0.5 leading-tight">{value}</p>
        <p className="text-[11.5px] text-muted-foreground mt-0.5">{hint}</p>
      </div>
    </div>
  );
}

function storyFor(s) {
  const fn = s.name.split(" ")[0];
  const opts = [
    `Raised by a single parent, ${fn} cleared the entrance with a rank that stunned the whole neighbourhood.`,
    `The first in the family to reach college, ${fn} balanced part-time work with classes to stay enrolled.`,
    `${fn} grew up helping at a roadside shop and still topped the district board exams.`,
    `After losing a parent early, ${fn} kept grades steady and earned a hard-won seat on merit.`,
    `From a small village with no coaching, ${fn} self-studied into one of the country's best institutes.`,
  ];
  const asp = [
    "build roads for villages like their own",
    "become a teacher back home",
    "design climate-resilient infrastructure",
    "be the first engineer in the family",
    "open a free clinic in their hometown",
  ];
  const i = Math.abs([...s.id].reduce((a, c) => a + c.charCodeAt(0), 0));
  return { story: opts[i % opts.length], aspiration: asp[i % asp.length] };
}

function StoriesStep({ pool, featured, onToggle, max }) {
  const [q, setQ] = React.useState("");
  const courseLabel = (v) => (PARAMS.course.options.find(o => o.value === v) || {}).label || v;
  const filtered = pool.filter(s => !q || (s.name + " " + s.college).toLowerCase().includes(predQ(q)));
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-surface-muted/40 p-4 flex items-center gap-4">
        <div className="h-10 w-10 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: "hsl(var(--primary) / 0.10)", color: "hsl(var(--primary))" }}><Icon name="image" size={16} /></div>
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-medium">Feature up to {max} student stories</p>
          <p className="text-[12px] text-muted-foreground mt-0.5">Pick from your selected cohort. These appear on the employee programme page to build context before the ask.</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[20px] font-semibold tabular-nums leading-tight">{featured.size}<span className="text-muted-foreground text-[14px]">/{max}</span></p>
          <p className="text-[11px] text-muted-foreground uppercase tracking-[0.08em] font-semibold">featured</p>
        </div>
      </div>

      {pool.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-soft p-8 text-center">
          <p className="text-[13.5px] font-medium text-foreground">No students selected yet</p>
          <p className="text-[12.5px] text-muted-foreground mt-1">Go back and select your cohort first — you can feature their stories here.</p>
        </div>
      ) : (
        <>
          <SearchInput value={q} onChange={e => setQ(e.target.value)} placeholder="Search your cohort…" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.slice(0, 24).map(s => {
              const on = featured.has(s.id);
              const atMax = !on && featured.size >= max;
              const st = storyFor(s);
              return (
                <button key={s.id} onClick={() => onToggle(s.id)} disabled={atMax}
                  className={cn("text-left rounded-xl border p-5 transition-colors relative", on ? "border-primary ring-1 ring-primary/20 bg-primary/[0.03]" : atMax ? "border-border-soft opacity-50 cursor-not-allowed" : "border-border-soft hover:border-foreground/20")}>
                  <span className={cn("absolute top-3.5 right-3.5 h-5 w-5 rounded-full border flex items-center justify-center", on ? "bg-primary border-primary" : "border-input bg-surface")}>
                    {on && <Icon name="check" size={12} stroke={3} className="text-primary-foreground" />}
                  </span>
                  <div className="flex items-center gap-3.5">
                    <Avatar name={s.name} size={56} />
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold text-foreground leading-tight pr-5">{s.name}</p>
                      <p className="text-helper mt-1">{courseLabel(s.course)} · year {s.year}</p>
                      <p className="text-helper truncate">{s.college}</p>
                    </div>
                  </div>
                  <p className="text-[13.5px] text-foreground/90 leading-relaxed mt-4">{st.story}</p>
                  <div className="flex items-center gap-2 mt-3.5 pt-3.5 border-t border-border-soft">
                    <Icon name="target" size={15} className="text-primary shrink-0" />
                    <span className="text-[12.5px] text-foreground"><span className="text-muted-foreground">Aspires to </span>{st.aspiration}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function StudentSelectStep({ pool, selected, onToggle, onAll, onNone, amount, onExport }) {
  const [q, setQ] = React.useState("");
  const courseLabel = (v) => (PARAMS.course.options.find(o => o.value === v) || {}).label || v;
  const filtered = pool.filter(s => !q || (s.name + " " + s.college + " " + s.id).toLowerCase().includes(predQ(q)));
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border-soft">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[13.5px] font-medium">Eligible students</p>
            <p className="text-[11.5px] text-muted-foreground"><span className="font-medium text-foreground tabular-nums">{selected.size}</span> of {pool.length} selected · corpus {cpInr(amount)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onAll} className="text-[12.5px] font-medium text-primary hover:underline">Select all</button>
            <span className="text-border">·</span>
            <button onClick={onNone} className="text-[12.5px] font-medium text-muted-foreground hover:text-foreground">Clear</button>
            {onExport && <Button variant="secondary" size="sm" onClick={onExport} disabled={selected.size === 0}><Icon name="download" size={13} />Export</Button>}
          </div>
        </div>
        <div className="mt-3"><SearchInput value={q} onChange={e => setQ(e.target.value)} placeholder="Search eligible students…" /></div>
      </div>
      <div className="overflow-auto max-h-[420px]">
        <table className="w-full text-[13px]">
          <thead className="bg-surface-muted/40 text-muted-foreground sticky top-0">
            <tr className="text-left">
              <th className="font-medium pl-5 pr-2 py-2.5 w-10"></th>
              <th className="font-medium px-3 py-2.5">Student</th>
              <th className="font-medium px-3 py-2.5">College · course</th>
              <th className="font-medium px-3 py-2.5 tabular-nums">Need</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const on = selected.has(s.id);
              return (
                <tr key={s.id} className={cn("border-t border-border-soft cursor-pointer transition-colors", on ? "hover:bg-surface-muted/40" : "bg-surface-muted/20 opacity-60 hover:opacity-100")} onClick={() => onToggle(s.id)}>
                  <td className="pl-5 pr-2 py-2.5">
                    <span className={cn("h-5 w-5 rounded-[5px] border flex items-center justify-center transition-colors", on ? "bg-primary border-primary" : "border-input bg-surface")}>
                      {on && <Icon name="check" size={12} stroke={3} className="text-primary-foreground" />}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={s.name} size={26} />
                      <div><p className="font-medium leading-tight">{s.name}</p><p className="text-[11px] text-muted-foreground tabular-nums">{s.id} · year {s.year}</p></div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5"><p className="leading-tight">{s.college}</p><p className="text-[11px] text-muted-foreground uppercase tracking-[0.05em]">{courseLabel(s.course)}</p></td>
                  <td className="px-3 py-2.5 tabular-nums font-medium">{cpInr(s.need)}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="py-12 text-center">
                <p className="text-[13.5px] font-medium text-foreground">No students match</p>
                <p className="text-[12.5px] text-muted-foreground mt-1">{pool.length === 0 ? "Loosen an eligibility rule to bring students in." : "Try a different search."}</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { ProgramsList, CreateProgramModal, ProgramBuilder, PROG_STATUS_TONE });
