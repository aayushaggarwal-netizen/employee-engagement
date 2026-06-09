// ── B4S: onboard a company → send the HR-admin invite that starts their setup wizard ──
// Industry & size options mirror the HR-admin company-setup flow exactly.
const B4S_INDUSTRIES = ["Information Technology", "Financial Services", "Manufacturing", "Healthcare", "Consulting", "Retail", "Other"];
const B4S_SIZES = ["1–200", "201–1,000", "1,001–5,000", "5,000+"];

function B4SOnboardClient({ open, onClose, onDone }) {
  const toast = useToast();
  const steps = ["Company", "HR admin", "Billing", "Invite"];
  const blank = {
    name: "", foundation: "", industry: B4S_INDUSTRIES[0], size: B4S_SIZES[1], website: "",
    adminName: "", adminEmail: "", adminPhone: "", adminDesignation: "CSR Head",
    legalName: "", regLegalName: "", gstin: "", pan: "", billingAddress: "",
  };
  const [step, setStep] = React.useState(0);
  const [sent, setSent] = React.useState(false);
  const [f, setF] = React.useState(blank);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));

  React.useEffect(() => { if (open) { setStep(0); setSent(false); setF(blank); } }, [open]);
  if (!open) return null;

  const canStep = [
    f.name.trim() && f.foundation.trim(),
    f.adminName.trim() && /\S+@\S+\.\S+/.test(f.adminEmail),
    true,
    true,
  ];

  const send = () => {
    const id = "c" + Date.now();
    onDone && onDone({
      id, name: f.name.trim(), foundation: f.foundation.trim(), plan: "Growth", status: "Pending",
      since: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      employees: 0, programmes: 0, raised: 0, goal: 0, scholars: 0,
      csr: f.adminName.trim(), csrEmail: f.adminEmail.trim(), industry: f.industry,
    });
    setSent(true);
    toast("Invite sent", { sub: `${f.adminName.split(" ")[0]} at ${f.name} will receive a setup link.`, icon: "mail" });
  };

  const footer = sent ? null : (
    <div className="w-full flex items-center justify-between gap-3">
      <button onClick={onClose} className="text-[13px] font-medium text-muted-foreground hover:text-foreground">Cancel</button>
      <div className="flex items-center gap-2.5">
        {step > 0 && <Button variant="secondary" onClick={() => setStep(step - 1)}><Icon name="arrowLeft" size={14} />Back</Button>}
        {step < steps.length - 1
          ? <Button disabled={!canStep[step]} onClick={() => setStep(step + 1)}>Continue<Icon name="arrowRight" size={14} /></Button>
          : <Button onClick={send}><Icon name="send" size={14} />Send invite</Button>}
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/30" />
      <div onClick={e => e.stopPropagation()} className="relative w-full sm:w-[620px] max-h-[90vh] flex flex-col rounded-xl border border-border bg-popover shadow-lg animate-scale-in">
        {/* header */}
        <div className="px-6 pt-5 pb-4 border-b border-border-soft">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-semibold text-foreground">{sent ? "Invite sent" : "Onboard a company"}</p>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button>
          </div>
          {!sent && <div className="mt-4"><B4SMiniStepper steps={steps} current={step} /></div>}
        </div>

        {/* body */}
        <div className="overflow-y-auto px-6 py-5">
          {sent ? (
            <div className="text-center py-4">
              <div className="h-14 w-14 rounded-full bg-success-soft text-success flex items-center justify-center mx-auto mb-4"><Icon name="mail" size={26} /></div>
              <h2 className="text-[18px] font-semibold text-foreground">{f.name} is onboarded</h2>
              <p className="text-body text-muted-foreground mt-1.5 max-w-[42ch] mx-auto">An invite is on its way to <span className="font-medium text-foreground">{f.adminEmail}</span>. {f.adminName.split(" ")[0]} will click the link to set the password and start the setup wizard — company profile, billing, then their first programme.</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-surface-muted px-3.5 py-2 text-[12.5px] text-muted-foreground">
                <Icon name="clock" size={14} />Shows as <Badge tone="warning">Pending</Badge> until they finish
              </div>
              <div className="mt-6 flex items-center justify-center gap-2.5">
                <Button variant="secondary" onClick={onClose}>Done</Button>
                <Button onClick={() => toast("Invite resent", { sub: f.adminEmail, icon: "mail" })}><Icon name="send" size={14} />Resend invite</Button>
              </div>
            </div>
          ) : step === 0 ? (
            <div className="space-y-4">
              <p className="text-helper -mt-1 mb-1">The organisation you're bringing onto the platform.</p>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl border border-border-soft bg-surface-muted flex items-center justify-center shrink-0 text-muted-foreground"><Icon name="building" size={22} /></div>
                <div>
                  <p className="text-[13.5px] font-medium text-foreground">Company logo</p>
                  <p className="text-helper mb-2">PNG or SVG, square, up to 2 MB.</p>
                  <Button variant="outline" size="sm" onClick={() => toast("Logo upload", { sub: "Upload is a demo stub.", icon: "upload" })}><Icon name="upload" size={14} />Upload logo</Button>
                </div>
              </div>
              <Field label="Company name" htmlFor="ob-name"><Input id="ob-name" value={f.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Reliance Industries" /></Field>
              <Field label="Foundation / CSR entity" htmlFor="ob-found"><Input id="ob-found" value={f.foundation} onChange={e => set("foundation", e.target.value)} placeholder="e.g. Reliance Foundation" /></Field>
              <Field label="Website" htmlFor="ob-web"><Input id="ob-web" value={f.website} onChange={e => set("website", e.target.value)} placeholder="company.com" /></Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Industry"><NativeSelect value={f.industry} onChange={e => set("industry", e.target.value)}>{B4S_INDUSTRIES.map(o => <option key={o}>{o}</option>)}</NativeSelect></Field>
                <Field label="Company size"><NativeSelect value={f.size} onChange={e => set("size", e.target.value)}>{B4S_SIZES.map(o => <option key={o}>{o}</option>)}</NativeSelect></Field>
              </div>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4">
              <p className="text-helper -mt-1 mb-1">Who runs the programme. This person receives the invite and becomes the company's HR admin.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name"><Input value={f.adminName} onChange={e => set("adminName", e.target.value)} placeholder="e.g. Sana Verma" /></Field>
                <Field label="Designation"><Input value={f.adminDesignation} onChange={e => set("adminDesignation", e.target.value)} /></Field>
              </div>
              <Field label="Work email" hint="The setup invite is sent here."><Input type="email" value={f.adminEmail} onChange={e => set("adminEmail", e.target.value)} placeholder="name@company.com" /></Field>
              <Field label="Phone">
                <div className="flex h-10 w-full rounded-md border border-input bg-surface overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                  <span className="flex items-center px-3 text-sm text-muted-foreground bg-surface-muted border-r border-input shrink-0">+91</span>
                  <input inputMode="numeric" maxLength={10} value={f.adminPhone} onChange={e => set("adminPhone", e.target.value.replace(/\D/g, "").slice(0, 10))} className="flex-1 min-w-0 px-3 text-sm bg-transparent focus:outline-none" />
                </div>
              </Field>
            </div>
          ) : step === 2 ? (
            <div className="space-y-4">
              <p className="text-helper -mt-1 mb-1">Used for donation receipts and 80G certificates the company issues.</p>
              <Field label="Registered legal name" htmlFor="ob-reglegal"><Input id="ob-reglegal" value={f.regLegalName} onChange={e => set("regLegalName", e.target.value)} placeholder="As on the certificate of incorporation" /></Field>
              <Field label="Legal name" htmlFor="ob-legal"><Input id="ob-legal" value={f.legalName} onChange={e => set("legalName", e.target.value)} placeholder="Name used on invoices" /></Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="GSTIN"><Input value={f.gstin} onChange={e => set("gstin", e.target.value.toUpperCase())} placeholder="29AAACI4741P1ZL" /></Field>
                <Field label="PAN"><Input value={f.pan} onChange={e => set("pan", e.target.value.toUpperCase())} placeholder="AAACI4741P" /></Field>
              </div>
              <Field label="Billing address"><Textarea rows={2} value={f.billingAddress} onChange={e => set("billingAddress", e.target.value)} placeholder="Registered office address" /></Field>
            </div>
          ) : (
            <div>
              <p className="text-helper mb-3">This is the email {f.adminName || "the HR admin"} receives. The button opens their setup wizard.</p>
              <div className="rounded-xl border border-border-soft overflow-hidden">
                {/* email chrome */}
                <div className="px-4 py-3 border-b border-border-soft bg-surface-muted/50 space-y-0.5">
                  <p className="text-[12px] text-muted-foreground"><span className="font-medium text-foreground">To</span> {f.adminEmail || "—"}</p>
                  <p className="text-[12px] text-muted-foreground"><span className="font-medium text-foreground">Subject</span> You're invited to set up employee giving at {f.name || "your company"}</p>
                </div>
                {/* email body */}
                <div className="p-5 bg-card">
                  <div className="flex items-center gap-2 mb-4"><img src="assets/b4s-logo.png" alt="" className="h-7 w-7 object-contain" /><span className="text-[13px] font-bold text-foreground">Buddy4Study</span></div>
                  <p className="text-[14px] text-foreground leading-relaxed">Hi {f.adminName ? f.adminName.split(" ")[0] : "there"},</p>
                  <p className="text-[14px] text-foreground leading-relaxed mt-2.5">{f.foundation || f.name || "Your organisation"} has been set up on Buddy4Study to run employee giving. You've been named the programme admin.</p>
                  <p className="text-[14px] text-foreground leading-relaxed mt-2.5">Click below to set your password and start the guided setup — company profile, billing details, and your first scholarship programme. It takes about 15 minutes.</p>
                  <div className="my-4"><span className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2.5 text-[13.5px] font-medium"><Icon name="arrowRight" size={15} />Start setup</span></div>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed">If you weren't expecting this, you can ignore this email.</p>
                  <p className="text-[12px] text-muted-foreground mt-4 pt-3 border-t border-border-soft">Powered by Buddy4Study · Your data is private and secure.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {footer && <div className="px-6 py-4 border-t border-border-soft">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

function B4SMiniStepper({ steps, current }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const done = i < current, active = i === current;
        return (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2 shrink-0">
              <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-semibold tabular-nums",
                done && "bg-success text-success-foreground", active && "bg-primary text-primary-foreground ring-4 ring-primary/10",
                !done && !active && "bg-muted text-muted-foreground")}>
                {done ? <Icon name="check" size={11} stroke={2.5} /> : i + 1}
              </div>
              <span className={cn("text-[12px] font-medium hidden sm:inline", active || done ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={cn("flex-1 h-px min-w-[12px]", done ? "bg-success/40" : "bg-border")} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

window.B4SOnboardClient = B4SOnboardClient;
