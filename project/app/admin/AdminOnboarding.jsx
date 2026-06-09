// ── First-run admin setup: three separate screens, no stepper ──
//   1. Company details + POC   2. Billing details   3. Program creation

function AdminOnboarding({ onComplete, onSkip }) {
  const toast = useToast();
  // phase: "you" | "company" | "billing" | "program" | "done"
  const [phase, setPhase] = React.useState("you");
  const [programme, setProgramme] = React.useState(null);

  const [company, setCompany] = React.useState({ name: "Infosys", foundation: "Infosys Foundation", website: "infosysfoundation.org", industry: "Information Technology", size: "5,000+" });
  const [billing, setBilling] = React.useState({ legalName: "Infosys Limited", gstin: "29AAACI4741P1ZL", pan: "AAACI4741P", email: "finance@infosys.com", address: "Electronics City, Hosur Road, Bengaluru 560100", method: "Bank transfer (NEFT/RTGS)" });
  const setB = (k, v) => setBilling(s => ({ ...s, [k]: v }));
  // Admin contact details (screen 1)
  const [poc, setPoc] = React.useState({
    csrName: "Sana Verma", csrDesignation: "CSR Head", csrPhone: "9845098450", csrEmail: "sana.verma@infosys.com",
  });
  const setP = (k, v) => setPoc(s => ({ ...s, [k]: v }));

  // ── Stage 2: full-page program builder ──
  if (phase === "program") {
    return (
      <ProgramBuilder variant="page"
        onClose={() => setPhase("billing")}        onLaunch={() => {
          setProgramme({ name: "First-gen Engineers 2026" });
          toast("Programme created · saved as draft", { sub: "First-gen Engineers 2026", icon: "checkCircle" });
          setPhase("done");
        }} />
    );
  }

  // ── Done ──
  if (phase === "done") return <OnboardingDone company={company} programme={programme} onComplete={onComplete} />;

  // ── Stage 1: company setup ──
  // ── Screen header (shared) ──
  const ScreenChrome = ({ children, showSkip }) => (
    <div className="fixed inset-0 z-40 bg-background overflow-y-auto">
      <header className="sticky top-0 z-10 h-16 bg-surface/95 backdrop-blur-sm border-b border-border flex items-center px-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <img src="assets/b4s-logo.png" alt="" className="h-8 w-8 object-contain" />
          <div className="leading-tight"><p className="text-[14px] font-bold tracking-tight text-foreground">Buddy4Study</p><p className="text-[10.5px] text-muted-foreground -mt-0.5">Admin setup</p></div>
        </div>
        <button onClick={onSkip} className="ml-auto text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors" style={{ visibility: showSkip ? "visible" : "hidden" }}>Skip setup</button>
      </header>
      <div className="mx-auto max-w-[820px] px-5 sm:px-8 py-8 sm:py-10"><div className="animate-fade-in">{children}</div></div>
    </div>
  );

  const POC_GROUPS = [
    { eyebrow: "Primary admin", keys: ["csrName", "csrDesignation", "csrPhone", "csrEmail"] },
  ];

  // ── Screen 2: Billing details ──
  if (phase === "billing") {
    return (
      <ScreenChrome showSkip>
        <Eyebrow className="text-primary">Billing details</Eyebrow>
        <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-foreground mt-2 leading-tight">How should we bill you?</h1>
        <p className="text-[15px] text-muted-foreground mt-1.5 max-w-[60ch]">Used for donation receipts and 80G certificates.</p>
        <Card className="p-6 space-y-5 mt-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Registered legal name" htmlFor="b-legal"><Input id="b-legal" value={billing.legalName} onChange={e => setB("legalName", e.target.value)} /></Field>
            <Field label="Billing email" htmlFor="b-email"><Input id="b-email" type="email" value={billing.email} onChange={e => setB("email", e.target.value)} /></Field>
            <Field label="GSTIN" htmlFor="b-gstin"><Input id="b-gstin" value={billing.gstin} onChange={e => setB("gstin", e.target.value)} /></Field>
            <Field label="PAN" htmlFor="b-pan"><Input id="b-pan" value={billing.pan} onChange={e => setB("pan", e.target.value)} /></Field>
            <div className="sm:col-span-2">
              <Field label="Billing address" htmlFor="b-addr"><Textarea id="b-addr" rows={2} value={billing.address} onChange={e => setB("address", e.target.value)} /></Field>
            </div>
          </div>
        </Card>
        <div className="flex items-center justify-between gap-3 mt-8">
          <Button variant="secondary" onClick={() => setPhase("company")}><Icon name="arrowLeft" size={16} />Back</Button>
          <Button onClick={() => setPhase("program")}>Continue to programme<Icon name="arrowRight" size={16} /></Button>
        </div>
      </ScreenChrome>
    );
  }

  // ── Screen 1: about you (admin contact details) ──
  if (phase === "you") {
    return (
      <ScreenChrome>
        <Eyebrow className="text-primary">About you</Eyebrow>
        <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-foreground mt-2 leading-tight">Tell us about you</h1>
        <p className="text-[15px] text-muted-foreground mt-1.5 max-w-[60ch]">You're the primary admin for this programme. We'll reach you for approvals and payroll coordination.</p>
        <Card className="p-6 mt-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full name"><Input value={poc.csrName} onChange={e => setP("csrName", e.target.value)} /></Field>
            <Field label="Designation"><Input value={poc.csrDesignation} onChange={e => setP("csrDesignation", e.target.value)} /></Field>
            <Field label="Phone">
              <div className="flex h-10 w-full rounded-md border border-input bg-surface overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                <span className="flex items-center px-3 text-sm text-muted-foreground bg-surface-muted border-r border-input shrink-0">+91</span>
                <input inputMode="numeric" maxLength={10} value={poc.csrPhone} onChange={e => setP("csrPhone", e.target.value.replace(/\D/g, "").slice(0, 10))} className="flex-1 min-w-0 px-3 text-sm bg-transparent focus:outline-none" />
              </div>
            </Field>
            <Field label="Work email"><Input type="email" value={poc.csrEmail} onChange={e => setP("csrEmail", e.target.value)} /></Field>
          </div>
        </Card>
        <div className="flex items-center justify-end gap-3 mt-8">
          <Button disabled={!poc.csrName.trim()} onClick={() => setPhase("company")}>Continue to organisation<Icon name="arrowRight" size={16} /></Button>
        </div>
      </ScreenChrome>
    );
  }

  // ── Screen 2: company details ──
  return (
    <ScreenChrome>
      <Eyebrow className="text-primary">Set up your organisation</Eyebrow>
      <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-foreground mt-2 leading-tight">Tell us about your organisation</h1>
      <p className="text-[15px] text-muted-foreground mt-1.5 max-w-[60ch]">This appears on your employee giving site and on every scholar award letter.</p>

      <div className="mt-6">
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl border border-border-soft bg-surface-muted flex items-center justify-center shrink-0">
              <img src="assets/b4s-logo.png" alt="" className="h-10 w-10 object-contain" />
            </div>
            <div>
              <p className="text-[13.5px] font-medium text-foreground">Company logo</p>
              <p className="text-helper mb-2">PNG or SVG, square, up to 2 MB.</p>
              <Button variant="outline" size="sm" onClick={() => toast("Logo upload", { sub: "Upload is a demo stub.", icon: "upload" })}><Icon name="upload" size={14} />Upload logo</Button>
            </div>
          </div>
          <div className="h-px bg-border-soft" />
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Company name" htmlFor="co-name"><Input id="co-name" value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} /></Field>
            <Field label="Foundation / CSR entity" htmlFor="co-found"><Input id="co-found" value={company.foundation} onChange={e => setCompany({ ...company, foundation: e.target.value })} /></Field>
            <Field label="Website" htmlFor="co-web"><Input id="co-web" value={company.website} onChange={e => setCompany({ ...company, website: e.target.value })} /></Field>
            <Field label="Industry" htmlFor="co-ind">
              <NativeSelect value={company.industry} onChange={e => setCompany({ ...company, industry: e.target.value })}>
                {["Information Technology", "Financial Services", "Manufacturing", "Healthcare", "Consulting", "Retail", "Other"].map(o => <option key={o}>{o}</option>)}
              </NativeSelect>
            </Field>
            <Field label="Company size" htmlFor="co-size">
              <NativeSelect value={company.size} onChange={e => setCompany({ ...company, size: e.target.value })}>
                {["1–200", "201–1,000", "1,001–5,000", "5,000+"].map(o => <option key={o}>{o}</option>)}
              </NativeSelect>
            </Field>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between gap-3 mt-8">
        <Button variant="secondary" onClick={() => setPhase("you")}><Icon name="arrowLeft" size={16} />Back</Button>
        <Button disabled={!company.name.trim()} onClick={() => setPhase("billing")}>Continue to billing<Icon name="arrowRight" size={16} /></Button>
      </div>
    </ScreenChrome>
  );
}

function OnboardingDone({ company, programme, onComplete }) {
  const items = [
    { done: true, label: "Company profile", detail: company.name },
    { done: !!programme, label: "First programme", detail: programme ? programme.name : "Skipped — add later" },
  ];
  return (
    <div className="fixed inset-0 z-40 bg-background overflow-y-auto flex items-center justify-center p-5">
      <div className="w-full max-w-[520px] animate-fade-in">
        <Card className="p-8 sm:p-10 text-center">
          <div className="flex justify-center mb-6"><SuccessCheck size={80} tone="success" /></div>
          <h1 className="text-page-title">You're all set</h1>
          <p className="text-[15px] text-muted-foreground mt-2 max-w-[42ch] mx-auto">Your organisation and first programme are ready. Invite your team and manage everything from the dashboard.</p>
          <div className="mt-7 text-left rounded-xl border border-border-soft divide-y divide-border-soft">
            {items.map((it, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <span className={cn("h-6 w-6 rounded-full flex items-center justify-center shrink-0", it.done ? "bg-success-soft text-success" : "bg-muted text-muted-foreground")}>
                  <Icon name={it.done ? "check" : "dot"} size={it.done ? 13 : 10} stroke={3} />
                </span>
                <div className="flex-1 min-w-0"><p className="text-[13.5px] font-medium text-foreground">{it.label}</p></div>
                <span className="text-[12.5px] text-muted-foreground text-right truncate max-w-[50%]">{it.detail}</span>
              </div>
            ))}
          </div>
          <Button size="lg" className="w-full mt-7" onClick={onComplete}>Go to dashboard<Icon name="arrowRight" size={16} /></Button>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { AdminOnboarding });
