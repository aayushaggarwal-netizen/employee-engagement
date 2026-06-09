// ── Nominate a student: single-page form + success ──
function NominationRally({ navigate, mobile }) {
  const team = EMPLOYEE.team;
  const rank = TEAMS_NOMINATIONS.findIndex(t => t.name === team) + 1;
  const pending = MY_TEAM_MEMBERS.filter(m => !m.nominated);
  const maxCount = TEAMS_NOMINATIONS[0].count;
  const [copied, setCopied] = React.useState(false);
  const [nudgeOpen, setNudgeOpen] = React.useState(false);
  const ordinal = (n) => n + (["th", "st", "nd", "rd"][(n % 100 - 20) % 10] || ["th", "st", "nd", "rd"][n] || "th");
  const medal = { 0: "bg-[hsl(45_90%_50%)] text-[hsl(40_60%_20%)]", 1: "bg-[hsl(220_12%_72%)] text-[hsl(220_15%_28%)]", 2: "bg-[hsl(28_55%_55%)] text-white" };

  const defaultNudge = `I just nominated a student for ${PROGRAM.name} 💛 Our ${team} team is ${ordinal(rank)} on the nominations leaderboard. If you know a deserving student who needs support to stay in college, put their name forward — it takes two minutes: giving.infosys.com`;
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
      {/* nomination leaderboard + nudge */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <Icon name="trophy" size={15} className="text-warning" />
          <Eyebrow>Nominations leaderboard</Eyebrow>
        </div>
        <p className="text-helper mb-3">Departments by students put forward.</p>
        <div className="space-y-1.5">
          {TEAMS_NOMINATIONS.slice(0, 5).map((t, i) => {
            const mine = t.name === team;
            return (
              <div key={t.name} className={cn("flex items-center gap-2.5 rounded-lg px-2 py-1.5", mine && "bg-primary/5 ring-1 ring-primary/20")}>
                <span className={cn("h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 tabular-nums", i < 3 ? medal[i] : "bg-muted text-muted-foreground")}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[12.5px] font-medium text-foreground truncate flex items-center gap-1.5">
                      {t.name}{mine && <span className="text-[9.5px] font-semibold uppercase tracking-wide bg-primary/15 text-primary rounded px-1 py-0.5">You</span>}
                    </span>
                    <span className="text-[12px] font-semibold text-foreground tabular-nums shrink-0">{t.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full", i === 0 ? "bg-warning" : "bg-primary")} style={{ width: Math.min(100, (t.count / maxCount) * 100) + "%" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button variant="outline" className="w-full mt-4" onClick={() => setNudgeOpen(true)}>
          <Icon name="users" size={15} />Nudge your team to nominate
        </Button>
      </Card>

      {/* donate CTA */}
      <Card className="p-5 flex items-center gap-4">
        <span className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon name="gift" size={22} /></span>
        <div className="flex-1 min-w-0">
          <p className="text-card-title">Want to go further?</p>
          <p className="text-helper mt-0.5">Back your nomination with a gift — every rupee helps a student stay in college.</p>
        </div>
        <Button className="shrink-0" onClick={() => navigate("donate")}>Donate<Icon name="arrowRight" size={15} /></Button>
      </Card>

      {/* nudge popup */}
      <Overlay open={nudgeOpen} onClose={() => setNudgeOpen(false)} mobile={mobile}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-section-title">Nudge your team</h2>
            <button onClick={() => setNudgeOpen(false)} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button>
          </div>
          <p className="text-helper mb-4">{pending.length} {pending.length === 1 ? "teammate hasn't" : "teammates haven't"} nominated anyone yet. Copy the message and share it with them.</p>

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

function Nominate({ navigate }) {
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", relationship: "", reason: "" });
  const [touched, setTouched] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const reasonLen = form.reason.trim().length;
  const errs = {
    name: !form.name.trim(),
    email: !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email),
    phone: form.phone.replace(/\D/g, "").length < 10,
    relationship: !form.relationship,
    reason: reasonLen < 100,
  };
  const valid = !Object.values(errs).some(Boolean);

  function submit(e) {
    e.preventDefault();
    setTouched(true);
    if (valid) setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto w-full max-w-[560px] px-5 py-10 animate-fade-in">
        <Card className="relative overflow-hidden p-8 sm:p-10 text-center">
          <Confetti run={true} />
          <div className="relative">
            <div className="flex justify-center mb-6"><SuccessCheck size={72} tone="success" /></div>
            <h1 className="text-page-title">Nomination submitted</h1>
            <p className="text-[15px] text-muted-foreground mt-2">You've put forward <span className="font-medium text-foreground">{form.name}</span> for {PROGRAM.name}.</p>
            <div className="flex justify-center mt-5">
              <Badge tone="info" className="h-7 px-3 text-[12.5px] gap-1.5"><Icon name="clock" size={13} />Nomination submitted — under review</Badge>
            </div>
            <p className="text-helper mt-6 max-w-[44ch] mx-auto">The reviewer panel reads every nomination. You can track its status anytime under My Nominations.</p>
          </div>
        </Card>

        <NominationRally navigate={navigate} mobile={false} />

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={() => navigate("program")}><Icon name="arrowLeft" size={15} />Back to programme</Button>
          <Button className="flex-1" onClick={() => navigate("my-nominations")}>View my nominations<Icon name="arrowRight" size={15} /></Button>
        </div>
      </div>
    );
  }

  const showErr = (k) => touched && errs[k];

  return (
    <div className="mx-auto w-full max-w-[620px] px-5 py-7 sm:py-10 animate-fade-in">
      <button onClick={() => navigate("program")} className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-5">
        <Icon name="arrowLeft" size={14} />Back to programme
      </button>

      <div className="flex items-start gap-4 mb-7">
        <IconTile name="user" size={48} />
        <div>
          <h1 className="text-group-title">Nominate a student</h1>
          <p className="text-body text-muted-foreground mt-1">Put a deserving student forward for {PROGRAM.name}. The reviewer panel takes it from there.</p>
        </div>
      </div>

      <form onSubmit={submit}>
        <Card className="p-6 space-y-5">
          <Field label="Full name" htmlFor="n-name">
            <Input id="n-name" value={form.name} onChange={set("name")} placeholder="Student's full name"
              className={showErr("name") ? "border-destructive" : ""} />
            {showErr("name") && <p className="text-[12px] text-destructive mt-1">Please enter the student's name.</p>}
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Email ID" htmlFor="n-email">
              <Input id="n-email" type="email" value={form.email} onChange={set("email")} placeholder="student@email.com"
                className={showErr("email") ? "border-destructive" : ""} />
              {showErr("email") && <p className="text-[12px] text-destructive mt-1">Enter a valid email.</p>}
            </Field>
            <Field label="Phone number" htmlFor="n-phone">
              <div className={cn("flex h-10 w-full rounded-md border bg-surface overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
                showErr("phone") ? "border-destructive" : "border-input")}>
                <span className="flex items-center px-3 text-sm text-muted-foreground bg-surface-muted border-r border-input shrink-0">+91</span>
                <input id="n-phone" inputMode="numeric" maxLength={10} value={form.phone} placeholder="98765 43210"
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                  className="flex-1 min-w-0 px-3 text-sm bg-transparent placeholder:text-muted-foreground focus:outline-none" />
              </div>
              {showErr("phone") && <p className="text-[12px] text-destructive mt-1">Enter a 10-digit number.</p>}
            </Field>
          </div>

          <Field label="Relationship to you" htmlFor="n-rel">
            <NativeSelect value={form.relationship} onChange={set("relationship")} placeholder="Select one"
              className={showErr("relationship") ? "[&_select]:border-destructive" : ""}>
              {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
            </NativeSelect>
            {showErr("relationship") && <p className="text-[12px] text-destructive mt-1">Select your relationship.</p>}
          </Field>

          <Field label="Why this nomination?" htmlFor="n-reason"
            helper="A few honest sentences about what makes this student a good fit. The reviewer panel reads this verbatim.">
            <Textarea id="n-reason" rows={6} value={form.reason} onChange={set("reason")}
              placeholder="Tell us about the student — their circumstances, what they've achieved, and what this scholarship would change for them."
              className={showErr("reason") ? "border-destructive" : ""} />
            <div className="flex items-center justify-between mt-1">
              <span className={cn("text-[12px]", reasonLen < 100 ? "text-muted-foreground" : "text-success")}>
                {reasonLen < 100 ? `${100 - reasonLen} more characters needed` : "Looks good"}
              </span>
              <span className="text-[12px] text-muted-foreground tabular-nums">{reasonLen} / 100 min</span>
            </div>
          </Field>
        </Card>

        <Button size="lg" type="submit" className="w-full mt-6"><Icon name="send" size={16} />Submit nomination</Button>
        {touched && !valid && <p className="text-[13px] text-destructive text-center mt-3">Please complete the highlighted fields.</p>}
      </form>
    </div>
  );
}
window.Nominate = Nominate;
