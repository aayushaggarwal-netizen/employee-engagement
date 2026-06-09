// ── Donate: 3-step flow + branched success + celebration variations ──
const DONATION_TYPES = [
  { id: "one-time", title: "One-time", desc: "A single gift, paid now.", icon: "gift" },
  { id: "recurring", title: "Recurring", desc: "A set amount every month. Pause anytime.", icon: "repeat" },
  { id: "payroll", title: "Payroll pledge", desc: "Deducted from your salary by HR.", icon: "wallet" },
];
const QUICK_AMOUNTS = [500, 1000, 2500, 5000];

function Stepper({ step }) {
  const labels = ["Type", "Amount", "Confirm"];
  return (
    <div className="flex items-center gap-2">
      {labels.map((l, i) => {
        const n = i + 1, done = step > n, active = step === n;
        return (
          <React.Fragment key={l}>
            <div className="flex items-center gap-2">
              <div className={cn("h-7 w-7 rounded-full flex items-center justify-center text-[12.5px] font-semibold transition-colors",
                done ? "bg-primary text-primary-foreground" : active ? "bg-primary text-primary-foreground ring-4 ring-primary/10" : "bg-muted text-muted-foreground")}>
                {done ? <Icon name="check" size={14} stroke={3} /> : n}
              </div>
              <span className={cn("text-[13px] font-medium hidden sm:inline", active || done ? "text-foreground" : "text-muted-foreground")}>{l}</span>
            </div>
            {i < 2 && <div className={cn("h-px flex-1 min-w-4", done ? "bg-primary/40" : "bg-border")} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ---- Post-donation team rally: standing + who's yet to donate + copyable nudge ----
function TeamRally({ mobile }) {
  const team = EMPLOYEE.team;
  const rank = TEAMS.findIndex(t => t.name === team) + 1;
  const teamPct = (TEAMS.find(t => t.name === team) || {}).pct || 0;
  const donatedCount = MY_TEAM_MEMBERS.filter(m => m.donated).length;
  const total = MY_TEAM_MEMBERS.length;
  const pending = MY_TEAM_MEMBERS.filter(m => !m.donated);
  const progPct = Math.round((ACTIVE_PROGRAM.raised / ACTIVE_PROGRAM.goal) * 100);
  const [copied, setCopied] = React.useState(false);
  const [nudgeOpen, setNudgeOpen] = React.useState(false);
  const ordinal = (n) => n + (["th", "st", "nd", "rd"][(n % 100 - 20) % 10] || ["th", "st", "nd", "rd"][n] || "th");
  const medal = { 0: "bg-[hsl(45_90%_50%)] text-[hsl(40_60%_20%)]", 1: "bg-[hsl(220_12%_72%)] text-[hsl(220_15%_28%)]", 2: "bg-[hsl(28_55%_55%)] text-white" };

  const defaultNudge = `I just donated to ${ACTIVE_PROGRAM.name} 💛 Our ${team} team is ${ordinal(rank)} on the leaderboard and ${pending.length} of us haven't given yet — if the whole team chips in we're in line for the lunch-on-us reward. Even ₹500 helps a first-gen student stay in college. Join in: giving.infosys.com`;
  const [msg, setMsg] = React.useState(defaultNudge);

  const copy = () => {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(msg).then(done).catch(done);
    } else {
      const ta = document.createElement("textarea");
      ta.value = msg; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta); done();
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {/* overall programme target + progress */}
      <Card className="p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Icon name="target" size={16} className="text-primary" />
            <span className="text-card-title">Programme progress</span>
          </div>
          <Badge tone="success">{progPct}% funded</Badge>
        </div>
        <div className="flex items-end justify-between gap-2 mb-1.5">
          <span className="text-[20px] font-semibold text-foreground tabular-nums leading-none">{formatINR(ACTIVE_PROGRAM.raised)}</span>
          <span className="text-[13px] text-muted-foreground">of {formatINR(ACTIVE_PROGRAM.goal)} goal</span>
        </div>
        <Progress value={progPct} height={8} />
        <p className="text-helper mt-2.5">Your gift takes {ACTIVE_PROGRAM.name} closer to its goal — {formatINR(ACTIVE_PROGRAM.goal - ACTIVE_PROGRAM.raised)} to go.</p>
      </Card>

      {/* team leaderboard + nudge */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <Icon name="trophy" size={15} className="text-warning" />
          <Eyebrow>Team leaderboard</Eyebrow>
        </div>
        <p className="text-helper mb-3">First team to 100% participation wins.</p>
        <div className="space-y-1.5">
          {TEAMS.slice(0, 5).map((t, i) => {
            const mine = t.name === team;
            return (
              <div key={t.name} className={cn("flex items-center gap-2.5 rounded-lg px-2 py-1.5", mine && "bg-primary/5 ring-1 ring-primary/20")}>
                <span className={cn("h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 tabular-nums", i < 3 ? medal[i] : "bg-muted text-muted-foreground")}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[12.5px] font-medium text-foreground truncate flex items-center gap-1.5">
                      {t.name}{mine && <span className="text-[9.5px] font-semibold uppercase tracking-wide bg-primary/15 text-primary rounded px-1 py-0.5">You</span>}
                    </span>
                    <span className="text-[12px] font-semibold text-foreground tabular-nums shrink-0">{t.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full", i === 0 ? "bg-warning" : "bg-primary")} style={{ width: Math.min(100, t.pct) + "%" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button variant="outline" className="w-full mt-4" onClick={() => setNudgeOpen(true)}>
          <Icon name="users" size={15} />Nudge your team to climb
        </Button>
      </Card>

      {/* nudge popup */}
      <Overlay open={nudgeOpen} onClose={() => setNudgeOpen(false)} mobile={mobile}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-section-title">Nudge your team</h2>
            <button onClick={() => setNudgeOpen(false)} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button>
          </div>
          <p className="text-helper mb-4">{pending.length} {pending.length === 1 ? "teammate hasn't" : "teammates haven't"} donated yet. Copy the message and share it with them.</p>

          <div className="flex flex-wrap gap-2">
            {pending.map(m => (
              <span key={m.name} className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface-muted/50 pl-1 pr-2.5 py-1">
                <Avatar name={m.name} size={22} />
                <span className="text-[12.5px] font-medium text-foreground">{m.name}</span>
              </span>
            ))}
          </div>

          <p className="text-[13px] font-medium text-foreground mt-5">Your message</p>
          <p className="text-helper mt-0.5">Edit it if you like, then copy and paste it in your team channel or a personal DM.</p>
          <Textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={5} className="mt-2.5 text-[13px] leading-relaxed" />
          <Button className="w-full mt-3" onClick={copy}>
            <Icon name={copied ? "check" : "copy"} size={15} />{copied ? "Copied to clipboard" : "Copy message"}
          </Button>
        </div>
      </Overlay>
    </div>
  );
}

// ---- Share the celebration with peers ----
function ShareCelebration({ type, amount, mobile }) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const [sent, setSent] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const firstName = EMPLOYEE.name.split(" ")[0];
  const defaultMsg = `I just gave to ${ACTIVE_PROGRAM.name}. Join me — every gift keeps a student in college.`;
  const [msg, setMsg] = React.useState(defaultMsg);

  const toggle = (name) => setSelected(s => s.includes(name) ? s.filter(n => n !== name) : [...s, name]);
  const close = () => { setOpen(false); setTimeout(() => { setSent(false); setSelected([]); setMsg(defaultMsg); }, 200); };
  const copyLink = () => { setCopied(true); setTimeout(() => setCopied(false), 1800); };

  return (
    <>
      <div className="mt-4 rounded-xl border border-border bg-surface p-5 flex items-center gap-4">
        <IconTile name="users" size={44} tone="primary" />
        <div className="flex-1 min-w-0">
          <p className="text-card-title">Bring your team along</p>
          <p className="text-helper mt-0.5">Share this moment and invite peers to give too.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}><Icon name="share" size={15} />Share</Button>
      </div>

      <Overlay open={open} onClose={close} mobile={mobile}>
        <div className="p-6">
          {!sent ? (
            <>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-section-title">Share your gift</h2>
                <button onClick={close} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button>
              </div>
              <p className="text-helper mb-5">Send a private nudge to peers, or copy a link to share anywhere.</p>

              <Field label="Message" htmlFor="share-msg">
                <Textarea id="share-msg" rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} />
              </Field>

              <div className="mt-5">
                <Eyebrow className="mb-2.5">Send to peers</Eyebrow>
                <div className="space-y-1">
                  {PEERS.map(p => {
                    const on = selected.includes(p.name);
                    return (
                      <button key={p.name} onClick={() => toggle(p.name)}
                        className={cn("w-full flex items-center gap-3 p-2 rounded-lg border transition-colors",
                          on ? "border-primary bg-primary/5" : "border-transparent hover:bg-surface-muted")}>
                        <Avatar name={p.name} size={36} />
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-[13.5px] font-medium text-foreground">{p.name}</p>
                          <p className="text-[11.5px] text-muted-foreground">{p.team} team</p>
                        </div>
                        <div className={cn("h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors",
                          on ? "border-primary bg-primary" : "border-input")}>
                          {on && <Icon name="check" size={12} stroke={3} className="text-primary-foreground" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={copyLink}>
                  <Icon name={copied ? "check" : "link"} size={15} />{copied ? "Link copied" : "Copy link"}
                </Button>
                <Button className="flex-1" disabled={selected.length === 0} onClick={() => setSent(true)}>
                  <Icon name="send" size={15} />Send{selected.length ? ` (${selected.length})` : ""}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="flex justify-center mb-5"><SuccessCheck size={64} tone="success" /></div>
              <h2 className="text-section-title">Shared with {selected.length} {selected.length === 1 ? "peer" : "peers"}</h2>
              <p className="text-body text-muted-foreground mt-1.5 max-w-[36ch] mx-auto">{selected.join(", ")} {selected.length === 1 ? "has" : "have"} been invited to give to {ACTIVE_PROGRAM.name}.</p>
              <Button className="mt-6 w-full" onClick={close}>Done</Button>
            </div>
          )}
        </div>
      </Overlay>
    </>
  );
}

// ---- One-time only: convert this gift into a monthly habit (compact, inline in success card) ----
function MakeRecurring({ amount, navigate }) {
  const [method, setMethod] = React.useState("recurring"); // recurring | payroll
  const [confirmed, setConfirmed] = React.useState(false);

  if (confirmed) {
    return (
      <div className="mt-6 pt-5 border-t border-border-soft text-left animate-fade-in">
        <div className="flex items-start gap-3">
          <span className="h-8 w-8 rounded-lg bg-success-soft text-success flex items-center justify-center shrink-0"><Icon name="check" size={16} stroke={2.5} /></span>
          <div className="flex-1 min-w-0">
            <p className="text-[13.5px] font-medium text-foreground">{method === "recurring" ? "Monthly giving is on" : "Payroll giving is set"}</p>
            <p className="text-helper mt-0.5">
              {method === "recurring"
                ? `${formatINR(amount)} every month. Pause or cancel anytime from My Donations.`
                : `${formatINR(amount)} from your salary each month once HR confirms.`}
            </p>
          </div>
          <button onClick={() => navigate("my-donations")} className="text-[12.5px] font-medium text-primary hover:underline shrink-0">Manage</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-5 border-t border-border-soft text-left">
      <div className="flex items-center gap-2 min-w-0">
        <Icon name="repeat" size={16} className="text-primary shrink-0" />
        <p className="text-[13.5px] font-medium text-foreground">Make this happen every month?</p>
      </div>
      <div className="mt-3">
        <div className="flex gap-2">
          {[
            { id: "recurring", label: "Auto-pay", icon: "repeat" },
            { id: "payroll", label: "Payroll giving", icon: "wallet" },
          ].map(m => {
            const sel = method === m.id;
            return (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className={cn("flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-md border text-[12.5px] font-medium transition-colors",
                  sel ? "border-primary bg-primary/[0.04] text-primary ring-1 ring-primary/15" : "border-border text-foreground hover:border-foreground/20")}>
                <Icon name={m.icon} size={14} />{m.label}
              </button>
            );
          })}
        </div>
        <Button className="w-full mt-2.5" onClick={() => setConfirmed(true)}>
          <Icon name="check" size={15} />Yes, give {formatINR(amount)} every month
        </Button>
      </div>
    </div>
  );
}

// ---- Success screen: impact version with confetti + animation ----
function DonateSuccess({ type, amount, anonymous, want80G, navigate, mobile }) {
  const typeCopy = {
    "one-time": { head: `Thank you, ${EMPLOYEE.name.split(" ")[0]}.`, sub: "Your donation is confirmed.", note: null },
    "recurring": { head: `Thank you, ${EMPLOYEE.name.split(" ")[0]}.`, sub: `You're now donating ${formatINR(amount)} every month.`, note: "You can pause or cancel anytime from My Donations." },
    "payroll": { head: "Your pledge has been recorded.", sub: `${formatINR(amount)} will appear as a deduction in your next paycheck.`, note: "A confirmation has been sent to HR." },
  }[type];

  return (
    <div className="mx-auto w-full max-w-[560px] px-5 py-10 animate-fade-in">
      <Card className="relative overflow-hidden">
        <Confetti run={true} />

        <div className="relative p-8 sm:p-10 text-center">
          <div className="flex justify-center mb-5"><SuccessCheck size={76} tone="success" /></div>
          <Eyebrow className="text-primary animate-fade-in" style={{ animationDelay: "120ms" }}>Your gift at work</Eyebrow>
          <h1 className="text-page-title mt-2">{typeCopy.head}</h1>
          <p className="text-[15px] text-muted-foreground mt-2 max-w-[42ch] mx-auto">{typeCopy.sub}{typeCopy.note ? ` ${typeCopy.note}` : ""}</p>
          <div className="flex -space-x-3 justify-center my-7">
            {STUDENTS.map((s, i) => (
              <div key={s.id} className="ring-4 ring-card rounded-full animate-scale-in" style={{ animationDelay: `${250 + i * 90}ms` }}>
                <Avatar name={s.name} size={56} />
              </div>
            ))}
          </div>
          <p className="text-[13.5px] text-foreground">Helping students like <span className="font-medium">{STUDENTS.map(s => s.first).join(", ")}</span> stay in college.</p>
          <Receipt type={type} amount={amount} anonymous={anonymous} want80G={want80G} className="mt-7 text-left" />
          {type === "one-time" && <MakeRecurring amount={amount} navigate={navigate} />}
        </div>
      </Card>

      <TeamRally mobile={mobile} />

      {/* nominate prompt */}
      <Card className="p-5 mt-4 flex items-center gap-4">
        <IconTile name="user" size={44} tone="primary" />
        <div className="flex-1 min-w-0">
          <p className="text-card-title">Know a deserving student?</p>
          <p className="text-helper mt-0.5">Put them forward for {ACTIVE_PROGRAM.name} — the reviewer panel takes it from there.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("nominate")}><Icon name="user" size={15} />Nominate</Button>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button variant="outline" className="flex-1" onClick={() => navigate("program")}>
          <Icon name="arrowLeft" size={15} />Back to programme
        </Button>
        <Button className="flex-1" onClick={() => navigate("my-donations")}>View my donations<Icon name="arrowRight" size={15} /></Button>
      </div>
    </div>
  );
}

function Receipt({ type, amount, anonymous, want80G, className = "", bare }) {
  const typeLabel = DONATION_TYPES.find(t => t.id === type).title;
  const rows = [
    ["Type", typeLabel],
    ["Amount", type === "recurring" ? `${formatINR(amount)} / month` : type === "payroll" ? `${formatINR(amount)} / paycheck` : formatINR(amount)],
    ["Programme", ACTIVE_PROGRAM.name],
    ["Donor", anonymous ? "Anonymous" : EMPLOYEE.name],
    ["80G certificate", want80G ? "Yes — emailed at financial year-end" : "Not requested"],
  ];
  return (
    <div className={cn(!bare && "rounded-xl border bg-surface-muted/60 p-5", className)}>
      <dl className="space-y-2.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-start justify-between gap-6 text-[13.5px]">
            <dt className="text-muted-foreground shrink-0">{k}</dt>
            <dd className="text-foreground font-medium text-right">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Donate({ navigate, mobile }) {
  const [step, setStep] = React.useState(1);
  const [type, setType] = React.useState("one-time");
  const [amount, setAmount] = React.useState(1000);
  const [custom, setCustom] = React.useState("");
  const [anonymous, setAnonymous] = React.useState(false);
  const [want80G, setWant80G] = React.useState(true);
  const [done, setDone] = React.useState(false);

  const effectiveAmount = custom ? parseInt(custom, 10) || 0 : amount;
  const payrollCap = ACTIVE_PROGRAM.payrollCapPerMonth || Infinity;
  const overCap = type === "payroll" && effectiveAmount > payrollCap;

  if (done) return <DonateSuccess type={type} amount={effectiveAmount} anonymous={anonymous} want80G={want80G} navigate={navigate} mobile={mobile} />;

  const ctaLabel = { "one-time": "Proceed to payment", "recurring": "Set up recurring donation", "payroll": "Confirm pledge" }[type];

  return (
    <div className="mx-auto w-full max-w-[620px] px-5 py-7 sm:py-10 animate-fade-in">
      <button onClick={() => step === 1 ? navigate("program") : setStep(step - 1)}
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-5">
        <Icon name="arrowLeft" size={14} />{step === 1 ? "Back to programme" : "Back"}
      </button>

      <div className="mb-5"><Stepper step={step} /></div>

      {/* persistent programme context — visible on all steps */}
      <div className="rounded-lg border border-border-soft bg-surface-muted/50 px-4 py-3 flex items-center gap-2.5 mb-7">
        <Icon name="graduationCap" size={16} className="text-muted-foreground shrink-0" />
        <span className="text-[13px] text-muted-foreground">Donating to</span>
        <span className="text-[13px] font-medium text-foreground ml-auto text-right">{ACTIVE_PROGRAM.name}</span>
      </div>

      {/* STEP 1 — type */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h1 className="text-group-title">How would you like to give?</h1>
            <p className="text-body text-muted-foreground mt-1">Every option supports {ACTIVE_PROGRAM.name}.</p>
          </div>
          <div className="space-y-3">
            {DONATION_TYPES.map(t => {
              const sel = type === t.id;
              return (
                <button key={t.id} onClick={() => setType(t.id)}
                  className={cn("w-full text-left rounded-xl border bg-surface p-4 flex items-start gap-4 transition-colors",
                    sel ? "border-primary ring-2 ring-primary/15" : "border-border hover:border-foreground/20")}>
                  <IconTile name={t.icon} size={44} tone={sel ? "primary" : "muted"} />
                  <div className="flex-1 min-w-0">
                    <p className="text-card-title">{t.title}</p>
                    <p className="text-helper mt-0.5">{t.desc}</p>
                    {t.id === "payroll" && sel && (
                      <div className="mt-3 rounded-lg bg-warning-soft/60 border border-warning/20 p-3 flex gap-2.5">
                        <Icon name="info" size={15} className="text-warning shrink-0 mt-0.5" />
                        <p className="text-[12.5px] leading-relaxed text-foreground">This amount will be deducted from your salary. No payment is needed now — HR will process it.</p>
                      </div>
                    )}
                  </div>
                  <div className={cn("h-5 w-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors",
                    sel ? "border-primary bg-primary" : "border-input")}>
                    {sel && <Icon name="check" size={12} stroke={3} className="text-primary-foreground" />}
                  </div>
                </button>
              );
            })}
          </div>
          <Button size="lg" className="w-full" onClick={() => setStep(2)}>Continue<Icon name="arrowRight" size={16} /></Button>
        </div>
      )}

      {/* STEP 2 — amount */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h1 className="text-group-title">Choose an amount</h1>
            <p className="text-body text-muted-foreground mt-1">{type === "recurring" ? "Billed every month." : type === "payroll" ? "Deducted each paycheck." : "A one-time gift."}</p>
          </div>
          {type === "payroll" && ACTIVE_PROGRAM.payrollCapPerMonth && (
            <div className="rounded-lg border border-border-soft bg-surface-muted/50 px-4 py-2.5 flex items-center gap-2.5">
              <Icon name="info" size={15} className="text-muted-foreground shrink-0" />
              <p className="text-[12.5px] text-muted-foreground">Payroll giving is capped at <span className="font-medium text-foreground tabular-nums">{formatINR(ACTIVE_PROGRAM.payrollCapPerMonth)}/month</span> per employee for this programme.</p>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_AMOUNTS.map(a => {
              const sel = !custom && amount === a;
              return (
                <button key={a} onClick={() => { setAmount(a); setCustom(""); }}
                  className={cn("h-14 rounded-xl border text-[16px] font-semibold tabular-nums transition-colors",
                    sel ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/15" : "border-border bg-surface text-foreground hover:border-foreground/20")}>
                  {formatINR(a)}
                </button>
              );
            })}
          </div>
          <Field label="Or enter a custom amount" htmlFor="custom">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[15px]">₹</span>
              <Input id="custom" inputMode="numeric" value={custom} placeholder="Enter amount"
                onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ""))} className={cn("pl-7", overCap && "border-destructive")} />
            </div>
            {overCap && <p className="text-[12.5px] text-destructive mt-1.5 flex items-center gap-1.5"><Icon name="info" size={13} />Payroll giving can't exceed {formatINR(payrollCap)}/month. Lower the amount to continue.</p>}
          </Field>
          <div className="rounded-xl border border-border-soft divide-y divide-border-soft overflow-hidden">
            <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-surface-muted/40 transition-colors">
              <button type="button" role="checkbox" aria-checked={anonymous} onClick={() => setAnonymous(!anonymous)}
                className={cn("h-5 w-5 rounded-[5px] border shrink-0 mt-0.5 flex items-center justify-center transition-colors",
                  anonymous ? "bg-primary border-primary" : "border-input bg-surface")}>
                {anonymous && <Icon name="check" size={13} stroke={3} className="text-primary-foreground" />}
              </button>
              <span onClick={() => setAnonymous(!anonymous)}>
                <span className="block text-[13.5px] font-medium text-foreground">Donate anonymously</span>
                <span className="block text-helper mt-0.5">Your name won't appear on the donor wall or recent donations.</span>
              </span>
            </label>
            <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-surface-muted/40 transition-colors">
              <button type="button" role="checkbox" aria-checked={want80G} onClick={() => setWant80G(!want80G)}
                className={cn("h-5 w-5 rounded-[5px] border shrink-0 mt-0.5 flex items-center justify-center transition-colors",
                  want80G ? "bg-primary border-primary" : "border-input bg-surface")}>
                {want80G && <Icon name="check" size={13} stroke={3} className="text-primary-foreground" />}
              </button>
              <span onClick={() => setWant80G(!want80G)}>
                <span className="block text-[13.5px] font-medium text-foreground">Email me an 80G tax certificate</span>
                <span className="block text-helper mt-0.5">Claim tax exemption under Section 80G. A consolidated certificate is emailed to you at the end of the financial year.</span>
              </span>
            </label>
          </div>
          <Button size="lg" className="w-full" disabled={effectiveAmount < 1 || overCap} onClick={() => setStep(3)}>
            Review<Icon name="arrowRight" size={16} />
          </Button>
        </div>
      )}

      {/* STEP 3 — confirm */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h1 className="text-group-title">Confirm your {type === "payroll" ? "pledge" : "donation"}</h1>
            <p className="text-body text-muted-foreground mt-1">Take a moment to confirm everything looks right.</p>
          </div>
          <Card className="p-6"><Receipt type={type} amount={effectiveAmount} anonymous={anonymous} want80G={want80G} bare /></Card>
          {type === "payroll" ? (
            <div className="rounded-lg bg-warning-soft/60 border border-warning/20 p-4 flex gap-2.5">
              <Icon name="info" size={16} className="text-warning shrink-0 mt-0.5" />
              <p className="text-[13px] leading-relaxed text-foreground">No payment is needed now. {formatINR(effectiveAmount)} will be deducted from your next paycheck once HR confirms.</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border-soft bg-surface-muted/50 p-4 flex items-center gap-3">
              <Icon name="shield" size={18} className="text-success" />
              <p className="text-[13px] text-muted-foreground">Mock payment for this demo — no real transaction will occur.</p>
            </div>
          )}
          <Button size="lg" className="w-full" onClick={() => setDone(true)}>
            {type === "one-time" && <Icon name="gift" size={16} />}{ctaLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
window.Donate = Donate;
