// ── Program landing — single white sheet, hero + subtle rail, minimal student grid ──
function Stat({ label, value }) {
  return (
    <div>
      <p className="text-[19px] font-semibold text-foreground tabular-nums leading-none">{value}</p>
      <p className="text-helper mt-1.5">{label}</p>
    </div>
  );
}

// Student card — small circular photo, story + aspiration
function StudentCard({ s }) {
  return (
    <div className="rounded-xl border border-border-soft p-5">
      <div className="flex items-center gap-3.5">
        <Avatar name={s.name} size={56} />
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-foreground leading-tight">{s.name}</p>
          <p className="text-helper mt-1">{s.course} · {s.year}</p>
          <p className="text-helper truncate">{s.college}</p>
        </div>
      </div>
      <p className="text-[13.5px] text-foreground/90 leading-relaxed mt-4">{s.story}</p>
      <div className="flex items-center gap-2 mt-3.5 pt-3.5 border-t border-border-soft">
        <Icon name="target" size={15} className="text-primary shrink-0" />
        <span className="text-[12.5px] text-foreground"><span className="text-muted-foreground">Aspires to </span>{s.aspiration.charAt(0).toLowerCase() + s.aspiration.slice(1)}</span>
      </div>
    </div>
  );
}

function HowItWorksStep({ step, n }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Icon name={step.icon} size={19} /></span>
        <span className="text-[12px] font-semibold text-muted-foreground tabular-nums">0{n}</span>
      </div>
      <p className="text-[15px] font-semibold text-foreground">{step.title}</p>
      <p className="text-helper mt-1 leading-relaxed">{step.body}</p>
    </div>
  );
}

// FAQ accordion row
function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className="border-b border-border-soft last:border-0">
      <button onClick={onToggle} className="w-full flex items-start justify-between gap-4 py-4 text-left">
        <span className="text-[14.5px] font-medium text-foreground">{q}</span>
        <Icon name="chevDown" size={17} className={cn("text-muted-foreground shrink-0 mt-0.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && <p className="text-[13.5px] leading-relaxed text-muted-foreground pb-4 pr-8 -mt-1 animate-fade-in">{a}</p>}
    </div>
  );
}

// Donor wall — names, amounts, dates
function DonorWall() {
  const [showAll, setShowAll] = React.useState(false);
  const rows = showAll ? DONOR_LIST : DONOR_LIST.slice(0, 8);
  return (
    <div id="donor-wall" className="scroll-mt-[84px]">
      <Eyebrow>The people behind it</Eyebrow>
      <h2 className="text-[22px] sm:text-[24px] font-semibold tracking-[-0.01em] text-foreground mt-2">{ACTIVE_PROGRAM.donors.toLocaleString("en-IN")} donors and counting</h2>
      <p className="text-body text-muted-foreground mt-2 max-w-[56ch]">A few of the colleagues who've given to this programme. Thank you.</p>
      <div className="mt-6 rounded-xl border border-border-soft divide-y divide-border-soft overflow-hidden">
        {rows.map((d, i) => (
          <div key={i} className="flex items-center gap-3.5 px-4 py-3">
            <Avatar name={d.name} size={36} />
            <span className="text-[14px] font-medium text-foreground flex-1 min-w-0 truncate">{d.name}</span>
            <span className="text-helper whitespace-nowrap hidden sm:block">{d.date}</span>
            <span className="text-[14px] font-semibold text-foreground tabular-nums w-24 text-right">{formatINR(d.amount)}</span>
          </div>
        ))}
      </div>
      {DONOR_LIST.length > 8 && (
        <button onClick={() => setShowAll(!showAll)} className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-primary hover:underline">
          {showAll ? "Show fewer" : `Show all ${DONOR_LIST.length} donors`}
          <Icon name={showAll ? "chevDown" : "chevRight"} size={15} className={cn(showAll && "rotate-180")} />
        </button>
      )}
    </div>
  );
}

// Floating recent-donations ticker (bottom-right, always visible)
function DonationTicker() {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setI(n => (n + 1) % RECENT_DONATIONS.length), 4000);
    return () => clearInterval(id);
  }, []);
  const d = RECENT_DONATIONS[i];
  return (
    <div className="fixed left-4 sm:left-5 bottom-5 z-40 max-w-[300px]">
      <div key={i} className="animate-scale-in flex items-center gap-2.5 bg-surface border border-border rounded-full shadow-lg py-2 pl-2 pr-4">
        <Avatar name={d.name} size={32} />
        <p className="text-[12.5px] text-foreground leading-tight">
          <span className="font-semibold">{d.name}</span> donated <span className="font-semibold tabular-nums">{formatINR(d.amount)}</span>
          <span className="block text-[11px] text-muted-foreground">{d.t}</span>
        </p>
      </div>
    </div>
  );
}

// Bright team leaderboard card — top-3 badges, scrollable, winning-team reward
// Light team leaderboard card — gold/silver/bronze medals, scrollable, race to 100%
const MEDAL = {
  0: "bg-[hsl(45_90%_50%)] text-[hsl(40_60%_20%)]",   // gold
  1: "bg-[hsl(220_12%_72%)] text-[hsl(220_15%_28%)]", // silver
  2: "bg-[hsl(28_55%_55%)] text-white",               // bronze
};

function RailLeaderboard() {
  const [tab, setTab] = React.useState("donations");
  const isDon = tab === "donations";
  const rows = isDon ? TEAMS : TEAMS_NOMINATIONS;
  const max = isDon ? 100 : TEAMS_NOMINATIONS[0].count;
  return (
    <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-1">
          <Icon name="trophy" size={16} className="text-warning" />
          <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-foreground">Team leaderboard</span>
        </div>
        {isDon && <p className="text-helper mb-3">First team to 100% participation wins.</p>}
        {!isDon && <p className="text-helper mb-3">Ranked by students nominated.</p>}

        <div className="inline-flex rounded-md border border-border bg-surface p-0.5 mb-3">
          {[["donations", "Participation"], ["nominations", "Nominations"]].map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)}
              className={cn("px-2.5 h-7 rounded text-[11.5px] font-medium transition-colors",
                tab === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>{l}</button>
          ))}
        </div>

        <div className="space-y-1.5 max-h-[180px] overflow-y-auto no-scrollbar pr-0.5 -mr-0.5">
          {rows.map((t, i) => {
            const mine = t.name === EMPLOYEE.team;
            const val = isDon ? t.pct : t.count;
            return (
              <div key={t.name} className={cn("flex items-center gap-2.5 rounded-lg px-2 py-1.5", mine && "bg-primary/5 ring-1 ring-primary/20")}>
                <span className={cn("h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 tabular-nums",
                  i < 3 ? MEDAL[i] : "bg-muted text-muted-foreground")}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[12.5px] font-medium text-foreground truncate flex items-center gap-1.5">
                      {t.name}{mine && <span className="text-[9.5px] font-semibold uppercase tracking-wide bg-primary/15 text-primary rounded px-1 py-0.5">You</span>}
                    </span>
                    <span className="text-[12px] font-semibold text-foreground tabular-nums shrink-0">{isDon ? `${t.pct}%` : t.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full transition-[width] duration-700", i === 0 ? "bg-warning" : "bg-primary")} style={{ width: Math.min(100, (val / max) * 100) + "%" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* reward for winning team */}
      <div className="bg-warning-soft/50 border-t border-border-soft px-4 sm:px-5 py-3 flex items-start gap-2.5">
        <span className="h-8 w-8 rounded-lg bg-warning-soft text-warning flex items-center justify-center shrink-0"><Icon name="gift" size={16} /></span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Winning team reward</p>
          <p className="text-[12.5px] leading-snug mt-0.5 text-foreground">{LEADERBOARD_REWARD}</p>
        </div>
      </div>
    </div>
  );
}

function ImpactRow({ icon, tone, label, value }) {
  return (
    <div className="flex items-center gap-3.5 py-3.5">
      <span className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
        tone === "primary" ? "bg-primary/10 text-primary" : tone === "success" ? "bg-success-soft text-success" : "bg-warning-soft text-warning")}>
        <Icon name={icon} size={17} />
      </span>
      <span className="text-[14px] text-muted-foreground flex-1">{label}</span>
      <span className="text-[18px] font-semibold text-foreground tabular-nums">{value}</span>
    </div>
  );
}

// Sticky right rail — focused donate CTA + leaderboard
function ActionRail({ navigate }) {
  const [shareOpen, setShareOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const shareUrl = "giving.infosys.com/bright-futures-2025";
  const shareMessage = `Support ${ACTIVE_PROGRAM.name} by ${ACTIVE_PROGRAM.org} — help first-generation students stay in college. Give to the programme or nominate a deserving student here: ${shareUrl}`;

  const copyMessage = () => {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(shareMessage).then(done).catch(done);
    else { const ta = document.createElement("textarea"); ta.value = shareMessage; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); done(); }
  };

  return (
    <div className="space-y-4">
      {/* donate card */}
      <div className="rounded-2xl border border-border bg-surface shadow-sm p-5 sm:p-6">
        <p className="text-[15px] font-semibold text-foreground">Make a difference today</p>
        <p className="text-helper mt-1 leading-relaxed">Give to the programme, or put forward a student who has earned their place.</p>
        <div className="flex flex-col gap-2.5 mt-4">
          <Button size="lg" onClick={() => navigate("donate")}><Icon name="gift" size={17} />Donate now</Button>
          <Button size="lg" variant="outline" onClick={() => navigate("nominate")}><Icon name="user" size={17} />Nominate a student</Button>
          <button onClick={() => { setShareOpen(true); setCopied(false); }}
            className="inline-flex items-center justify-center gap-2 h-9 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="share" size={15} />Share this programme
          </button>
        </div>
        <p className="text-helper text-center mt-2 flex items-center justify-center gap-1.5"><Icon name="shieldCheck" size={13} className="text-success" />100% reaches verified students</p>
      </div>

      {/* share popup — copyable message with link */}
      {shareOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShareOpen(false)}>
          <div className="absolute inset-0 bg-foreground/30" />
          <div onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:w-[420px] rounded-xl border border-border bg-popover shadow-lg p-5 animate-scale-in">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[15px] font-semibold text-foreground">Share this programme</p>
              <button onClick={() => setShareOpen(false)} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button>
            </div>
            <p className="text-helper mb-3">Copy this message and paste it into any channel — WhatsApp, email, Slack, or a DM.</p>
            <div className="rounded-lg border border-border-soft bg-surface-muted/40 p-3.5">
              <p className="text-[13px] leading-relaxed text-foreground">{shareMessage}</p>
            </div>
            <Button className="w-full mt-3" onClick={copyMessage}>
              <Icon name={copied ? "check" : "copy"} size={15} />{copied ? "Copied to clipboard" : "Copy message"}
            </Button>
          </div>
        </div>,
        document.body
      )}

      {/* leaderboard */}
      <RailLeaderboard />
    </div>
  );
}

function Program({ navigate }) {
  const [faqOpen, setFaqOpen] = React.useState(0);
  return (
    <>
      <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 py-6 sm:py-10 animate-fade-in">
        <button onClick={() => navigate("programs")} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors mb-4">
          <Icon name="arrowLeft" size={15} />All programmes
        </button>
        <div className="grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-10 items-start">

          {/* ░░ LEFT — scrolling content ░░ */}
          <div className="min-w-0">
            <div className="bg-surface rounded-2xl border border-border-soft shadow-sm px-6 sm:px-9 divide-y divide-border-soft">

              {/* HERO */}
              <section className="py-8 sm:py-9">
                <div className="flex items-center gap-2 text-helper mb-3 flex-wrap">
                  <Icon name="building" size={13} />
                  <span>{ACTIVE_PROGRAM.org}</span>
                  <span aria-hidden>·</span>
                  <Badge tone="success">Active</Badge>
                </div>
                <h1 className="text-[28px] sm:text-[36px] font-semibold tracking-[-0.02em] leading-[1.08] text-foreground max-w-[16ch]">{ACTIVE_PROGRAM.name}</h1>
                <p className="text-[15px] sm:text-[17px] leading-relaxed text-muted-foreground max-w-[54ch] mt-3.5">{ACTIVE_PROGRAM.tagline}</p>

                {/* target / progress */}
                <div className="mt-7">
                  <div className="flex flex-wrap items-end justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[24px] sm:text-[28px] font-semibold text-foreground tabular-nums">{formatINR(ACTIVE_PROGRAM.raised)}</span>
                      <span className="text-[14px] text-muted-foreground"> raised of {formatINR(ACTIVE_PROGRAM.goal)}</span>
                    </div>
                    <span className="text-[14px] font-semibold text-primary tabular-nums">{Math.round((ACTIVE_PROGRAM.raised / ACTIVE_PROGRAM.goal) * 100)}%</span>
                  </div>
                  <Progress value={Math.round((ACTIVE_PROGRAM.raised / ACTIVE_PROGRAM.goal) * 100)} height={10} />
                </div>

                {/* meta stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 mt-7">
                  {[
                    { icon: "users", v: ACTIVE_PROGRAM.donors.toLocaleString("en-IN"), l: "donors", to: "donor-wall" },
                    { icon: "graduationCap", v: ACTIVE_PROGRAM.scholarsFunded, l: "scholars funded", nav: "my-scholars" },
                    { icon: "user", v: ACTIVE_PROGRAM.nominations, l: "nominations" },
                    { icon: "calendar", v: daysLeft(ACTIVE_PROGRAM.endDate), l: "days left" },
                  ].map((c, i) => {
                    const link = c.to || c.nav;
                    const inner = (
                      <>
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5"><Icon name={c.icon} size={14} /></div>
                        <p className="text-[19px] font-semibold text-foreground tabular-nums leading-none">{c.v}</p>
                        <p className="text-helper mt-1 flex items-center gap-1">{c.l}{link && <Icon name="arrowRight" size={11} className="text-primary" />}</p>
                      </>
                    );
                    return link ? (
                      <button key={i} onClick={() => {
                        if (c.nav) { navigate(c.nav); return; }
                        const el = document.getElementById(c.to); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                        className="text-left group hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md -m-1 p-1">
                        {inner}
                      </button>
                    ) : <div key={i}>{inner}</div>;
                  })}
                </div>
              </section>

              {/* ABOUT */}
              <section className="py-8 sm:py-9">
                <Eyebrow>About the programme</Eyebrow>
                <p className="text-[16px] sm:text-[18px] leading-relaxed text-foreground mt-3 max-w-[62ch]" style={{ textWrap: "pretty" }}>{ACTIVE_PROGRAM.mission}</p>
                <div className="grid sm:grid-cols-3 gap-7 sm:gap-8 mt-9">
                  {ACTIVE_PROGRAM.howItWorks.map((step, i) => <HowItWorksStep key={i} step={step} n={i + 1} />)}
                </div>
                <div className="mt-9 pt-7 border-t border-border-soft">
                  <div className="flex items-center gap-2 mb-4"><Icon name="shieldCheck" size={16} className="text-success" /><Eyebrow>Who qualifies</Eyebrow></div>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                    {ACTIVE_PROGRAM.eligibility.map((e, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <span className="h-5 w-5 rounded-full bg-success-soft text-success flex items-center justify-center shrink-0"><Icon name="check" size={12} stroke={3} /></span>
                        <span className="text-[14px] text-foreground">{e}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* STUDENTS */}
              <section className="py-8 sm:py-9">
                <Eyebrow>Who you're helping</Eyebrow>
                <h2 className="text-[22px] sm:text-[24px] font-semibold tracking-[-0.01em] text-foreground mt-2">Students seeking your support</h2>
                <p className="text-body text-muted-foreground mt-2 max-w-[56ch]">Verified, first-generation students from across India. Your gift to the programme is matched to those who need it most.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7">
                  {STUDENTS.map(s => <StudentCard key={s.id} s={s} />)}
                </div>
              </section>

              {/* CODE OF PRACTICE */}
              <section className="py-8 sm:py-9">
                <Eyebrow>Code of practice</Eyebrow>
                <ul className="mt-4 space-y-3 max-w-[60ch]">
                  {CODE_OF_PRACTICE.map((c, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed">
                      <Icon name="check" size={15} className="text-muted-foreground shrink-0 mt-0.5" />
                      <span><span className="font-medium text-foreground">{c.title}.</span> <span className="text-muted-foreground">{c.body}</span></span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* DONOR WALL */}
              <section className="py-8 sm:py-9">
                <DonorWall />
              </section>

              {/* FAQ */}
              <section className="py-8 sm:py-9">
                <Eyebrow>Good to know</Eyebrow>
                <h2 className="text-[22px] sm:text-[24px] font-semibold tracking-[-0.01em] text-foreground mt-2 mb-4">Frequently asked questions</h2>
                <div>
                  {PROGRAM_FAQS.map((f, i) => (
                    <FaqItem key={i} q={f.q} a={f.a} open={faqOpen === i} onToggle={() => setFaqOpen(faqOpen === i ? -1 : i)} />
                  ))}
                </div>
              </section>

            </div>
          </div>

          {/* ░░ RIGHT — sticky rail ░░ */}
          <aside className="lg:sticky lg:top-[84px]">
            <ActionRail navigate={navigate} />
          </aside>

        </div>
      </div>
      <DonationTicker />
    </>
  );
}
window.Program = Program;
