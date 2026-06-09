// ── Program workspace: L2 menu (Details · Form · Donors · Nominations · Applications · Scholars · Analytics) ──
const WS_TABS = [
  { id: "dashboard", label: "Dashboard", icon: "layoutGrid" },
  { id: "details", label: "Details", icon: "fileText" },
  { id: "donors", label: "Donors", icon: "heart" },
  { id: "passbook", label: "Passbook", icon: "wallet" },
  { id: "nominations", label: "Applications", icon: "clipboard" },
  { id: "scholars", label: "Scholars", icon: "userCheck" },
  { id: "analytics", label: "Analytics", icon: "barChart" },
];

const WS_ELIGIBILITY = [
  "First-generation college student",
  "Family income below ₹4,00,000 / year",
  "Secured admission on merit",
  "Indian citizen studying in India",
];

function ProgramWorkspace({ programId, tab, setTab, onBack }) {
  const prog = PROGRAMS.find(p => p.id === programId) || PROGRAMS[0];
  const [scholarId, setScholarId] = React.useState(ADMIN_SCHOLARS[0].id);
  const [scholarPage, setScholarPage] = React.useState("scholars");
  const pct = prog.goal ? Math.round((prog.raised / prog.goal) * 100) : 0;

  return (
    <div>
      {/* workspace header */}
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-4">
        <Icon name="arrowLeft" size={14} />All programs
      </button>
      <div className="flex items-start gap-4 mb-5">
        <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}><Icon name="graduationCap" size={24} /></div>
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-foreground leading-tight">{prog.name}</h1>
            <Badge tone={PROG_STATUS_TONE[prog.status]} className="shrink-0">{prog.status}</Badge>
          </div>
          <p className="text-helper mt-1">{prog.org} · {cpInrShort(prog.raised)} of {cpInrShort(prog.goal)} ({pct}%) · ends {prog.end}</p>
        </div>
      </div>

      {/* tab content */}
      {tab === "dashboard" && <WsDashboard prog={prog} setTab={setTab} />}
      {tab === "details" && <WsDetails prog={prog} />}
      {tab === "donors" && <WsDonors prog={prog} />}
      {tab === "passbook" && <WsPassbook prog={prog} />}
      {tab === "nominations" && <NominationsPage go={() => {}} />}
      {tab === "scholars" && <ScholarsPage page={scholarPage} go={(p) => setScholarPage(p === "scholars" ? "scholars" : p)} scholarId={scholarId} setScholarId={setScholarId} />}
      {tab === "analytics" && <div className="space-y-8"><AnalyticsPage /><WsLeaderboard /></div>}
    </div>
  );
}

// ── Dashboard: programme overview ──
function WsDashboard({ prog, setTab }) {
  const pct = prog.goal ? Math.round((prog.raised / prog.goal) * 100) : 0;
  const part = Math.round((ANALYTICS.participation.donors / ANALYTICS.participation.total) * 100);
  const daysLeft = Math.max(0, Math.round((new Date("2026-08-31") - new Date("2026-06-03")) / 86400000));

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon="trendingUp" label="Total raised" value={cpInrShort(prog.raised)} sub={`${pct}% of ${cpInrShort(prog.goal)} goal`} tone="primary" onClick={() => setTab("donors")} />
        <KpiCard icon="graduationCap" label="Scholars" value={prog.scholars} sub={`of ${prog.maxScholars} planned`} tone="success" onClick={() => setTab("scholars")} />
        <KpiCard icon="users" label="Participation" value={`${part}%`} sub={`${prog.donors.toLocaleString("en-IN")} donors`} tone="primary" onClick={() => setTab("analytics")} />
        <KpiCard icon="clipboard" label="Applications" value={ADMIN_NOMINATIONS.length} sub="Total received" tone="warning" onClick={() => setTab("nominations")} />
      </div>

      {/* progress band */}
      <Card className="p-6">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
          <div>
            <Eyebrow>Fundraising progress</Eyebrow>
            <p className="text-[22px] font-semibold text-foreground tabular-nums mt-1">{formatINR(prog.raised)} <span className="text-[14px] font-normal text-muted-foreground">raised of {formatINR(prog.goal)}</span></p>
          </div>
          <div className="text-right">
            <p className="text-[22px] font-semibold text-primary tabular-nums leading-none">{pct}%</p>
            <p className="text-helper mt-1">{daysLeft} days left · ends {prog.end}</p>
          </div>
        </div>
        <Progress value={pct} height={10} />
      </Card>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
        {/* activity */}
        <Card className="p-6">
          <Eyebrow>Recent activity</Eyebrow>
          <h2 className="text-section-title mt-1 mb-4">What's happening</h2>
          <div className="space-y-1">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-border-soft last:border-0">
                <div className="h-9 w-9 rounded-full bg-surface-muted flex items-center justify-center shrink-0 text-muted-foreground"><Icon name={a.icon} size={16} /></div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[13.5px] text-foreground leading-snug"><span className="font-medium">{a.who}</span> {a.action} <span className="font-medium">{a.detail}</span></p>
                  <p className="text-[11.5px] text-muted-foreground mt-0.5">{a.t}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* leaderboard */}
        <MiniLeaderboard onViewAll={() => setTab("analytics")} />
      </div>
    </div>
  );
}

// ── Details: editable program landing page ──
function WsDetails({ prog }) {
  const toast = useToast();
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({
    name: prog.name,
    tagline: prog.description,
    about: "This programme funds first-generation students who have earned a college seat on merit but can't afford tuition, hostel, and learning materials. Each scholar receives need-based support disbursed across the academic year, with utilisation tracked end to end.",
  });
  const [draft, setDraft] = React.useState(form);
  const pct = prog.goal ? Math.round((prog.raised / prog.goal) * 100) : 0;
  const STORY_MAX = 6;
  const [storyIds, setStoryIds] = React.useState(() => new Set(STORY_LIST.filter(s => s.status === "Published").slice(0, 3).map(s => s.id)));
  const stories = STORY_LIST.filter(s => storyIds.has(s.id));
  const [pickStories, setPickStories] = React.useState(false);
  const [faqs, setFaqs] = React.useState([
    { id: "f1", q: "Who is eligible to be nominated?", a: "Any pre-verified student who meets the programme's eligibility rules — first-generation undergraduates with family income below the set threshold." },
    { id: "f2", q: "How are donations used?", a: "Every rupee goes to scholar tuition, hostel, and learning materials. Disbursements are tranche-based and tracked end to end." },
    { id: "f3", q: "When will scholars be selected?", a: "Shortlisting closes after the review window; selected scholars are notified and the first disbursement lands within 30 days." },
  ]);
  const [openFaq, setOpenFaq] = React.useState(null);
  const [addFaq, setAddFaq] = React.useState(false);
  const [faqQ, setFaqQ] = React.useState("");
  const faqBodyRef = React.useRef(null);
  const [showHistory, setShowHistory] = React.useState(false);
  const [selVersion, setSelVersion] = React.useState(null);
  const baseSnap = {
    name: prog.name,
    tagline: prog.description,
    about: "This programme funds first-generation students who have earned a college seat on merit but can't afford tuition, hostel, and learning materials. Each scholar receives need-based support disbursed across the academic year, with utilisation tracked end to end.",
  };
  const v2Snap = { ...baseSnap, name: "Bright Futures Scholarship" };
  const v1Snap = { ...v2Snap, tagline: "Funding college for students who earned their place.", about: "A scholarship for first-generation students." };
  const [versions, setVersions] = React.useState([
    { v: 3, name: "Version 3", by: "Sana Verma", date: "28 May 2026", time: "04:12 PM", changedKeys: ["about", "tagline"], snapshot: baseSnap, prev: v2Snap },
    { v: 2, name: "Version 2", by: "Rajesh Iyer", date: "12 May 2026", time: "11:30 AM", changedKeys: ["name"], snapshot: v2Snap, prev: v1Snap },
    { v: 1, name: "Version 1", by: "Sana Verma", date: "01 May 2026", time: "09:05 AM", changedKeys: [], snapshot: v1Snap, prev: null, created: true },
  ]);
  const [editingVName, setEditingVName] = React.useState(false);
  const renameVersion = (v, name) => setVersions(vs => vs.map(x => x.v === v ? { ...x, name } : x));
  const FIELD_LABELS = { name: "Programme name", tagline: "Tagline", about: "About the programme" };
  const exec = (cmd) => { document.execCommand(cmd, false, null); if (faqBodyRef.current) faqBodyRef.current.focus(); };
  const submitFaq = () => {
    const html = faqBodyRef.current ? faqBodyRef.current.innerHTML.trim() : "";
    if (!faqQ.trim() || !html) return;
    setFaqs(f => [...f, { id: "faq" + Date.now(), q: faqQ.trim(), a: html, rich: true }]);
    setAddFaq(false); setFaqQ("");
    toast("FAQ added", { sub: "Now visible on the programme page.", icon: "checkCircle" });
  };

  const save = () => {
    const changedKeys = Object.keys(FIELD_LABELS).filter(k => draft[k] !== form[k]);
    const prev = { ...form };
    setForm(draft);
    setEditing(false);
    if (changedKeys.length) {
      const now = new Date();
      setVersions(vs => [{
        v: vs.length + 1,
        name: "Version " + (vs.length + 1),
        by: ADMIN_USER.name,
        date: now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        changedKeys,
        snapshot: { ...draft },
        prev,
      }, ...vs]);
    }
    toast("Programme page updated", { sub: "Changes are live on the employee page.", icon: "checkCircle" });
  };
  const restore = (ver) => {
    const prev = { ...form };
    setForm(ver.snapshot); setDraft(ver.snapshot); setEditing(false); setSelVersion(null);
    const now = new Date();
    setVersions(vs => [{
      v: vs.length + 1, name: "Version " + (vs.length + 1), by: ADMIN_USER.name,
      date: now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      changedKeys: Object.keys(FIELD_LABELS).filter(k => ver.snapshot[k] !== prev[k]),
      snapshot: { ...ver.snapshot }, prev, restoredFrom: ver.v,
    }, ...vs]);
    toast("Version restored", { sub: `Rolled back to v${ver.v}.`, icon: "rotate" });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <Eyebrow>Programme page</Eyebrow>
          <p className="text-helper mt-1">This is exactly what employees see. Edit the copy and it updates live.</p>
        </div>
        {editing
          ? <div className="flex gap-2"><Button variant="secondary" size="sm" onClick={() => { setDraft(form); setEditing(false); }}>Cancel</Button><Button size="sm" onClick={save}><Icon name="check" size={14} />Save changes</Button></div>
          : <div className="flex gap-2"><Button variant="secondary" size="sm" onClick={() => setShowHistory(true)}><Icon name="history" size={14} />Version history</Button><Button variant="outline" size="sm" onClick={() => { setDraft(form); setEditing(true); }}><Icon name="pencil" size={14} />Edit page</Button></div>}
      </div>

      <div className="bg-surface rounded-2xl border border-border-soft shadow-sm overflow-hidden">
        <div className="px-6 sm:px-9 divide-y divide-border-soft">
          {/* hero */}
          <section className="py-8">
            <div className="flex items-center gap-2 text-helper mb-3"><Icon name="building" size={13} /><span>{prog.org}</span><span aria-hidden>·</span><Badge tone={PROG_STATUS_TONE[prog.status]}>{prog.status}</Badge></div>
            {editing
              ? <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="text-[20px] font-semibold h-12" />
              : <h1 className="text-[28px] font-semibold tracking-[-0.02em] leading-[1.1] text-foreground">{form.name}</h1>}
            {editing
              ? <Textarea rows={2} value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} className="mt-3" />
              : <p className="text-[15px] leading-relaxed text-muted-foreground mt-3 max-w-[56ch]">{form.tagline}</p>}
            <div className="mt-6 space-y-2 max-w-[560px]">
              <div className="flex items-end justify-between"><span className="text-[22px] font-semibold tabular-nums text-foreground">{cpInr(prog.raised)}</span><span className="text-[13px] text-muted-foreground">of {cpInr(prog.goal)} · {pct}%</span></div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: pct + "%" }} /></div>
              <p className="text-helper">{prog.donors.toLocaleString("en-IN")} donors · {prog.scholars} scholars funded</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <span className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md bg-primary text-primary-foreground text-[14px] font-medium sm:flex-1"><Icon name="gift" size={16} />Donate now</span>
              <span className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md border border-primary/30 text-primary text-[14px] font-medium sm:flex-1"><Icon name="user" size={16} />Nominate a student</span>
            </div>
          </section>

          {/* about */}
          <section className="py-8">
            <Eyebrow>About the programme</Eyebrow>
            {editing
              ? <Textarea rows={5} value={draft.about} onChange={(e) => setDraft({ ...draft, about: e.target.value })} className="mt-3" />
              : <p className="text-[15px] leading-relaxed text-foreground mt-3 whitespace-pre-line" style={{ textWrap: "pretty" }}>{form.about}</p>}
          </section>

          {/* eligibility */}
          <section className="py-8">
            <div className="flex items-center gap-2 mb-3"><Icon name="shieldCheck" size={16} className="text-success" /><Eyebrow>Who qualifies</Eyebrow></div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {WS_ELIGIBILITY.map((e, i) => (
                <div key={i} className="flex items-center gap-2.5"><span className="h-5 w-5 rounded-full bg-success-soft text-success flex items-center justify-center shrink-0"><Icon name="check" size={12} stroke={3} /></span><span className="text-[14px] text-foreground">{e}</span></div>
              ))}
            </div>
          </section>

          {/* stories */}
          <section className="py-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Eyebrow>Student stories</Eyebrow>
                <p className="text-helper mt-1">{stories.length} of {STORY_MAX} featured on the programme page</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setPickStories(true)}><Icon name="plus" size={14} />Add story</Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {stories.map(s => (
                <div key={s.id} className="rounded-xl border border-border-soft p-5">
                  <div className="flex items-center gap-3.5">
                    <Avatar name={s.name || s.first} size={56} />
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold text-foreground leading-tight">{s.name || s.first}</p>
                      <p className="text-helper mt-1">{s.course}{s.year ? ` · ${s.year}` : ""}</p>
                      <p className="text-helper truncate">{s.college}</p>
                    </div>
                  </div>
                  <p className="text-[13.5px] text-foreground/90 leading-relaxed mt-4">{s.quote}</p>
                  {s.aspiration && (
                    <div className="flex items-center gap-2 mt-3.5 pt-3.5 border-t border-border-soft">
                      <Icon name="target" size={15} className="text-primary shrink-0" />
                      <span className="text-[12.5px] text-foreground"><span className="text-muted-foreground">Aspires to </span>{s.aspiration}</span>
                    </div>
                  )}
                </div>
              ))}
              {stories.length === 0 && (
                <div className="col-span-full rounded-xl border border-dashed border-border-soft p-8 text-center">
                  <p className="text-[13.5px] font-medium text-foreground">No stories featured yet</p>
                  <p className="text-[12.5px] text-muted-foreground mt-1">Add up to {STORY_MAX} student stories to show on the programme page.</p>
                </div>
              )}
            </div>
          </section>

          {/* FAQs */}
          <section className="py-8">
            <div className="flex items-center justify-between gap-3">
              <Eyebrow>Frequently asked questions</Eyebrow>
              <Button variant="outline" size="sm" onClick={() => { setFaqQ(""); setAddFaq(true); }}><Icon name="plus" size={14} />Add FAQ</Button>
            </div>
            <div className="mt-4 rounded-xl border border-border-soft divide-y divide-border-soft overflow-hidden">
              {faqs.map(f => {
                const open = openFaq === f.id;
                return (
                  <div key={f.id}>
                    <button onClick={() => setOpenFaq(open ? null : f.id)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-surface-muted/40 transition-colors">
                      <span className="text-[14px] font-medium text-foreground flex-1">{f.q}</span>
                      <Icon name="chevDown" size={16} className={cn("text-muted-foreground transition-transform shrink-0", open && "rotate-180")} />
                    </button>
                    {open && (
                      <div className="px-4 pb-4 -mt-0.5 text-[13.5px] text-foreground/85 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline"
                        dangerouslySetInnerHTML={{ __html: f.a }} />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {pickStories && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setPickStories(false)}>
          <div className="absolute inset-0 bg-foreground/30" />
          <div onClick={(e) => e.stopPropagation()} className="relative w-full sm:w-[760px] rounded-xl border border-border bg-popover shadow-lg animate-scale-in max-h-[88vh] flex flex-col">
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border-soft">
              <div>
                <p className="text-[15px] font-semibold text-foreground">Feature student stories</p>
                <p className="text-helper mt-0.5">Pick up to {STORY_MAX} students to show on the programme page.</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[13px] font-medium text-muted-foreground tabular-nums">{storyIds.size}/{STORY_MAX} selected</span>
                <button onClick={() => setPickStories(false)} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button>
              </div>
            </div>
            <div className="overflow-auto p-5 grid sm:grid-cols-2 gap-3">
              {STORY_LIST.map(s => {
                const on = storyIds.has(s.id);
                const atMax = !on && storyIds.size >= STORY_MAX;
                return (
                  <button key={s.id} disabled={atMax}
                    onClick={() => setStoryIds(prev => { const n = new Set(prev); n.has(s.id) ? n.delete(s.id) : n.add(s.id); return n; })}
                    className={cn("text-left rounded-xl border p-5 transition-colors relative", on ? "border-primary ring-1 ring-primary/20 bg-primary/[0.03]" : atMax ? "border-border-soft opacity-50 cursor-not-allowed" : "border-border-soft hover:border-foreground/20")}>
                    <span className={cn("absolute top-3.5 right-3.5 h-5 w-5 rounded-full border flex items-center justify-center", on ? "bg-primary border-primary" : "border-input bg-surface")}>
                      {on && <Icon name="check" size={12} stroke={3} className="text-primary-foreground" />}
                    </span>
                    <div className="flex items-center gap-3.5">
                      <Avatar name={s.name} size={56} />
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-foreground leading-tight pr-5">{s.name}</p>
                        <p className="text-helper mt-1">{s.course} · {s.year}</p>
                        <p className="text-helper truncate">{s.college}</p>
                      </div>
                    </div>
                    <p className="text-[13.5px] text-foreground/90 leading-relaxed mt-4">{s.quote}</p>
                    <div className="flex items-center gap-2 mt-3.5 pt-3.5 border-t border-border-soft">
                      <Icon name="target" size={15} className="text-primary shrink-0" />
                      <span className="text-[12.5px] text-foreground"><span className="text-muted-foreground">Aspires to </span>{s.aspiration}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-border-soft">
              <Button variant="secondary" onClick={() => setPickStories(false)}>Cancel</Button>
              <Button onClick={() => { setPickStories(false); toast("Stories updated", { sub: `${storyIds.size} ${storyIds.size === 1 ? "story" : "stories"} on the programme page.`, icon: "checkCircle" }); }}>Done</Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {addFaq && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setAddFaq(false)}>
          <div className="absolute inset-0 bg-foreground/30" />
          <div onClick={(e) => e.stopPropagation()} className="relative w-full sm:w-[480px] rounded-xl border border-border bg-popover shadow-lg p-5 animate-scale-in max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[15px] font-semibold text-foreground">Add FAQ</p>
              <button onClick={() => setAddFaq(false)} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button>
            </div>
            <div className="space-y-4">
              <Field label="Question"><Input value={faqQ} onChange={(e) => setFaqQ(e.target.value)} placeholder="e.g. How are scholars selected?" /></Field>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-foreground">Answer</label>
                <div className="rounded-md border border-input bg-surface overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                  <div className="flex items-center gap-0.5 px-1.5 py-1 border-b border-border-soft bg-surface-muted/40">
                    {[["bold", "B", "font-bold"], ["italic", "i", "italic"], ["insertUnorderedList", "•", ""], ["insertOrderedList", "1.", ""]].map(([cmd, label, cls]) => (
                      <button key={cmd} type="button" onMouseDown={(e) => { e.preventDefault(); exec(cmd); }}
                        className={cn("h-7 min-w-7 px-2 rounded text-[13px] text-foreground hover:bg-surface-muted transition-colors", cls)}>{label}</button>
                    ))}
                  </div>
                  <div ref={faqBodyRef} contentEditable suppressContentEditableWarning
                    className="px-3 py-2.5 text-[13.5px] leading-relaxed text-foreground min-h-[110px] focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                    data-placeholder="Write the answer — use the toolbar for bold, italic, and lists." />
                </div>
                <p className="text-helper">Supports bold, italic, and lists.</p>
              </div>
            </div>
            <Button className="w-full mt-5" onClick={submitFaq}><Icon name="plus" size={15} />Add to programme page</Button>
          </div>
        </div>,
        document.body
      )}

      {showHistory && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100]" onClick={() => { setShowHistory(false); setSelVersion(null); }}>
          <div className="absolute inset-0 bg-foreground/30" />
          <div onClick={(e) => e.stopPropagation()} className="absolute top-0 right-0 h-full w-full sm:w-[460px] bg-surface shadow-lg flex flex-col animate-fade-in">
            <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-4 border-b border-border-soft">
              <div><Eyebrow>Version history</Eyebrow><p className="text-helper mt-0.5">{selVersion ? "Changes in this version" : "Select a version to see what changed."}</p></div>
              <button onClick={() => { setShowHistory(false); setSelVersion(null); }} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button>
            </div>

            {!selVersion ? (
              <div className="flex-1 overflow-y-auto p-2">
                {versions.map((ver, idx) => (
                  <button key={ver.v} onClick={() => { setSelVersion(ver); setEditingVName(false); }}
                    className={cn("w-full text-left flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-surface-muted/60 transition-colors", idx === 0 && "bg-surface-muted/40")}>
                    <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold tabular-nums shrink-0 mt-0.5">v{ver.v}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13.5px] font-semibold text-foreground">{ver.name}</span>
                        {idx === 0 && <Badge tone="success">Current</Badge>}
                      </div>
                      <p className="text-[12px] text-muted-foreground mt-0.5">
                        {ver.created ? "Created the programme page" : ver.restoredFrom ? `Restored from v${ver.restoredFrom}` : ver.changedKeys.map(k => FIELD_LABELS[k]).join(", ")}
                      </p>
                      <div className="text-helper mt-0.5 flex items-center gap-1.5">
                        <Avatar name={ver.by} size={16} />{ver.by} · {ver.date} · {ver.time}
                      </div>
                    </div>
                    <Icon name="chevRight" size={16} className="text-muted-foreground mt-1.5 shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5">
                <button onClick={() => { setSelVersion(null); setEditingVName(false); }} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground mb-4"><Icon name="arrowLeft" size={14} />All versions</button>
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold tabular-nums shrink-0">v{selVersion.v}</span>
                  {editingVName ? (
                    <input autoFocus value={selVersion.name}
                      onChange={(e) => { renameVersion(selVersion.v, e.target.value); setSelVersion(sv => ({ ...sv, name: e.target.value })); }}
                      onBlur={() => setEditingVName(false)}
                      onKeyDown={(e) => { if (e.key === "Enter") setEditingVName(false); }}
                      className="text-[14px] font-semibold text-foreground bg-transparent border-b border-primary focus:outline-none flex-1 min-w-0" />
                  ) : (
                    <button onClick={() => setEditingVName(true)} className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-foreground hover:text-primary transition-colors" title="Click to rename">
                      {selVersion.name}<Icon name="pencil" size={12} className="text-muted-foreground group-hover:text-primary" />
                    </button>
                  )}
                </div>
                <div className="text-helper flex items-center gap-1.5 mb-5"><Avatar name={selVersion.by} size={16} />{selVersion.by} · {selVersion.date} · {selVersion.time}</div>

                {selVersion.created || !selVersion.prev ? (
                  <div className="rounded-lg border border-border-soft bg-surface-muted/40 p-4 text-[13px] text-muted-foreground">This is the original version — the page was created here.</div>
                ) : selVersion.changedKeys.length === 0 ? (
                  <div className="rounded-lg border border-border-soft bg-surface-muted/40 p-4 text-[13px] text-muted-foreground">No field-level changes recorded.</div>
                ) : (
                  <div className="space-y-4">
                    {selVersion.changedKeys.map(k => (
                      <div key={k}>
                        <p className="text-eyebrow mb-2">{FIELD_LABELS[k]}</p>
                        <div className="rounded-lg border border-destructive/20 bg-destructive-soft/40 px-3 py-2 mb-1.5">
                          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-destructive mb-0.5">Before</p>
                          <p className="text-[13px] text-foreground/80 line-through decoration-destructive/40 whitespace-pre-line">{selVersion.prev[k] || "—"}</p>
                        </div>
                        <div className="rounded-lg border border-success/30 bg-success-soft/50 px-3 py-2">
                          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-success mb-0.5">After</p>
                          <p className="text-[13px] text-foreground whitespace-pre-line">{selVersion.snapshot[k] || "—"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {versions[0] && versions[0].v !== selVersion.v && (
                  <Button variant="outline" className="w-full mt-6" onClick={() => restore(selVersion)}><Icon name="rotate" size={14} />Restore this version</Button>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function WsForm() {
  const toast = useToast();
  const [which, setWhich] = React.useState("nomination");
  const [forms, setForms] = React.useState({
    nomination: [
      { id: "f1", label: "Full name", type: "Short text", req: true },
      { id: "f2", label: "Email ID", type: "Email", req: true },
      { id: "f3", label: "Phone number", type: "Phone (+91)", req: true },
      { id: "f4", label: "Relationship to you", type: "Dropdown", req: true, options: ["Family friend", "Relative", "Mentor / teacher", "Neighbour", "Other"] },
      { id: "f5", label: "Why this nomination?", type: "Long text", req: true, minChars: 100 },
    ],
    application: [
      { id: "a1", label: "Full name", type: "Short text", req: true },
      { id: "a2", label: "Date of birth", type: "Date", req: true },
      { id: "a3", label: "College & course", type: "Short text", req: true },
      { id: "a4", label: "Year of study", type: "Dropdown", req: true, options: ["1st year", "2nd year", "3rd year", "4th year"] },
      { id: "a5", label: "Annual family income", type: "Number (₹)", req: true },
      { id: "a6", label: "Marksheet (Class XII)", type: "File", req: true, accept: "PDF/JPG" },
      { id: "a7", label: "Income proof", type: "File", req: true, accept: "PDF/JPG" },
      { id: "a8", label: "Statement of need", type: "Long text", req: true, minChars: 200 },
    ],
  });
  const fields = forms[which];
  const setFields = (updater) => setForms(fs => ({ ...fs, [which]: typeof updater === "function" ? updater(fs[which]) : updater }));
  const [editField, setEditField] = React.useState(null); // field object being edited (or {} for new)

  const FIELD_TYPES = ["Short text", "Long text", "Email", "Phone (+91)", "Number (₹)", "Date", "Dropdown", "File"];
  const typeSummary = (f) => {
    if (f.type === "Dropdown") return `Dropdown · ${(f.options || []).length} options`;
    if (f.type === "Long text" && f.minChars) return `Long text · min ${f.minChars} chars`;
    if (f.type === "File" && f.accept) return `File · ${f.accept}`;
    return f.type;
  };
  const move = (i, dir) => setFields(list => {
    const j = i + dir; if (j < 0 || j >= list.length) return list;
    const next = list.slice(); [next[i], next[j]] = [next[j], next[i]]; return next;
  });
  const removeField = (id) => setFields(list => list.filter(f => f.id !== id));
  const saveField = (field) => {
    setFields(list => field.id && list.some(f => f.id === field.id)
      ? list.map(f => f.id === field.id ? field : f)
      : [...list, { ...field, id: "f" + Date.now() }]);
    setEditField(null);
    toast("Field saved", { sub: `"${field.label}" updated on the ${which} form.`, icon: "checkCircle" });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <Eyebrow>Forms</Eyebrow>
          <p className="text-helper mt-1">The fields collected from employees and students for this programme. Edit fields and their validations.</p>
        </div>
        <Button size="sm" onClick={() => setEditField({ label: "", type: "Short text", req: true })}><Icon name="plus" size={15} />Add field</Button>
      </div>

      <div className="inline-flex rounded-md border border-border bg-surface p-0.5 mb-5">
        {[["nomination", "Nomination form"], ["application", "Application form"]].map(([v, l]) => (
          <button key={v} onClick={() => setWhich(v)}
            className={cn("px-3.5 h-8 rounded text-[12.5px] font-medium transition-colors", which === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>{l}</button>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border-soft flex items-center justify-between">
          <p className="text-[13px] font-medium">{which === "nomination" ? "Employee nomination form" : "Student application form"}</p>
          <span className="text-helper tabular-nums">{fields.length} fields</span>
        </div>
        <div className="divide-y divide-border-soft">
          {fields.map((f, i) => (
            <div key={f.id} className="flex items-center gap-3 px-5 py-3.5 group">
              <div className="flex flex-col shrink-0">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="h-4 text-muted-foreground hover:text-foreground disabled:opacity-30"><Icon name="chevUp" size={14} /></button>
                <button onClick={() => move(i, 1)} disabled={i === fields.length - 1} className="h-4 text-muted-foreground hover:text-foreground disabled:opacity-30"><Icon name="chevDown" size={14} /></button>
              </div>
              <span className="h-7 w-7 rounded-md bg-surface-muted text-muted-foreground flex items-center justify-center text-[11px] font-semibold tabular-nums shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-medium text-foreground">{f.label}{f.req && <span className="text-destructive ml-1">*</span>}</p>
                <p className="text-helper">{typeSummary(f)}{f.type === "Dropdown" && f.options && f.options.length ? ` — ${f.options.join(", ")}` : ""}</p>
              </div>
              <button onClick={() => setEditField(f)} className="h-8 px-2.5 rounded-md inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors shrink-0"><Icon name="pencil" size={14} />Edit</button>
              <button onClick={() => removeField(f.id)} className="h-8 w-8 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-surface-muted transition-colors shrink-0"><Icon name="trash" size={15} /></button>
            </div>
          ))}
        </div>
      </Card>

      {editField && <FieldEditor field={editField} types={FIELD_TYPES} onClose={() => setEditField(null)} onSave={saveField} />}
    </div>
  );
}

function FieldEditor({ field, types, onClose, onSave }) {
  const [f, setF] = React.useState({ options: [], minChars: 100, accept: "PDF/JPG", ...field });
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const isNew = !field.id;
  const valid = f.label.trim() && (f.type !== "Dropdown" || (f.options || []).filter(o => o.trim()).length >= 2);
  const submit = () => {
    const clean = { label: f.label.trim(), type: f.type, req: !!f.req, id: f.id };
    if (f.type === "Dropdown") clean.options = f.options.map(o => o.trim()).filter(Boolean);
    if (f.type === "Long text") clean.minChars = Number(f.minChars) || 0;
    if (f.type === "File") clean.accept = f.accept;
    onSave(clean);
  };
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/30" />
      <div onClick={(e) => e.stopPropagation()} className="relative w-full sm:w-[460px] rounded-xl border border-border bg-popover shadow-lg p-5 animate-scale-in max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[15px] font-semibold text-foreground">{isNew ? "Add field" : "Edit field"}</p>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button>
        </div>
        <div className="space-y-4">
          <Field label="Field label"><Input value={f.label} onChange={(e) => set("label", e.target.value)} placeholder="e.g. Full name" /></Field>
          <Field label="Field type">
            <NativeSelect value={f.type} onChange={(e) => set("type", e.target.value)}>{types.map(t => <option key={t}>{t}</option>)}</NativeSelect>
          </Field>

          {f.type === "Dropdown" && (
            <div>
              <label className="text-[13px] font-medium text-foreground">Dropdown options</label>
              <div className="space-y-2 mt-1.5">
                {(f.options.length ? f.options : [""]).map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input value={opt} onChange={(e) => set("options", f.options.map((o, j) => j === i ? e.target.value : o))} placeholder={`Option ${i + 1}`} />
                    <button onClick={() => set("options", f.options.filter((_, j) => j !== i))} className="h-9 w-9 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-surface-muted shrink-0"><Icon name="x" size={15} /></button>
                  </div>
                ))}
              </div>
              <button onClick={() => set("options", [...f.options, ""])} className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary hover:underline"><Icon name="plus" size={13} />Add option</button>
              {(f.options || []).filter(o => o.trim()).length < 2 && <p className="text-[12px] text-muted-foreground mt-2">Add at least 2 options.</p>}
            </div>
          )}

          {f.type === "Long text" && (
            <Field label="Minimum characters" helper="Set 0 for no minimum."><Input inputMode="numeric" value={f.minChars} onChange={(e) => set("minChars", e.target.value.replace(/\D/g, ""))} className="tabular-nums" /></Field>
          )}

          {f.type === "File" && (
            <Field label="Accepted formats">
              <NativeSelect value={f.accept} onChange={(e) => set("accept", e.target.value)}>{["PDF/JPG", "PDF only", "JPG/PNG", "Any"].map(a => <option key={a}>{a}</option>)}</NativeSelect>
            </Field>
          )}

          <label className="flex items-center justify-between py-2.5 border-t border-border-soft">
            <div><p className="text-[13.5px] font-medium text-foreground">Required field</p><p className="text-helper">Applicants must fill this in.</p></div>
            <Toggle on={f.req} onChange={(v) => set("req", v)} />
          </label>
        </div>
        <div className="flex gap-3 mt-5"><Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button><Button className="flex-1" disabled={!valid} onClick={submit}>{isNew ? "Add field" : "Save field"}</Button></div>
      </div>
    </div>,
    document.body
  );
}

// ── Donors: leaderboard + donor list ──
// ── Team leaderboard (shown in workspace Analytics tab) ──
function WsLeaderboard() {
  const toast = useToast();
  const [lbTab, setLbTab] = React.useState("participation");
  const isPart = lbTab === "participation";
  const medal = { 1: "bg-[hsl(45_90%_50%)] text-[hsl(40_60%_20%)]", 2: "bg-[hsl(220_12%_72%)] text-[hsl(220_15%_28%)]", 3: "bg-[hsl(28_55%_55%)] text-white" };
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div><Eyebrow>Team leaderboard</Eyebrow><p className="text-helper mt-1">{isPart ? "Departments ranked by participation." : "Departments ranked by students nominated."}</p></div>
        <Button variant="secondary" size="sm" onClick={() => toast("Export started · CSV", { icon: "download" })}><Icon name="download" size={14} />Export</Button>
      </div>
      <div className="inline-flex rounded-md border border-border bg-surface p-0.5 mb-3">
        {[["participation", "Donations"], ["nominations", "Nominations"]].map(([v, l]) => (
          <button key={v} onClick={() => setLbTab(v)}
            className={cn("px-3 h-7 rounded text-[12px] font-medium transition-colors", lbTab === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>{l}</button>
        ))}
      </div>
      <Card className="p-0 overflow-hidden">
        {isPart ? (
          <Table columns={[{ label: "Rank", w: "w-16" }, { label: "Team" }, { label: "Donated", align: "right" }, { label: "Donors", align: "right" }, { label: "Participation", align: "right" }]}>
            {LB_DONATIONS.map(t => (
              <tr key={t.team} className="border-b border-border-soft last:border-0">
                <Td><span className={cn("h-7 w-7 rounded-full flex items-center justify-center text-[12px] font-bold tabular-nums", t.rank <= 3 ? medal[t.rank] : "bg-muted text-muted-foreground")}>{t.rank}</span></Td>
                <Td className="font-medium">{t.team}</Td>
                <Td align="right" className="tabular-nums font-medium">{formatINR(t.total)}</Td>
                <Td align="right" className="tabular-nums text-muted-foreground">{t.donors}/{t.headcount}</Td>
                <Td align="right" className="tabular-nums font-medium">{t.participation}%</Td>
              </tr>
            ))}
          </Table>
        ) : (
          <Table columns={[{ label: "Rank", w: "w-16" }, { label: "Team" }, { label: "Submitted", align: "right" }, { label: "Shortlisted", align: "right" }, { label: "Selected", align: "right" }]}>
            {LB_NOMINATIONS.map(t => (
              <tr key={t.team} className="border-b border-border-soft last:border-0">
                <Td><span className={cn("h-7 w-7 rounded-full flex items-center justify-center text-[12px] font-bold tabular-nums", t.rank <= 3 ? medal[t.rank] : "bg-muted text-muted-foreground")}>{t.rank}</span></Td>
                <Td className="font-medium">{t.team}</Td>
                <Td align="right" className="tabular-nums font-medium">{t.submitted}</Td>
                <Td align="right" className="tabular-nums"><Badge tone="warning">{t.shortlisted}</Badge></Td>
                <Td align="right" className="tabular-nums"><Badge tone="success">{t.selected}</Badge></Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}

// ── Donors: donor list with search + Excel export ──
function csvDownload(filename, rows) {
  const csv = rows.map(r => r.map(v => {
    const s = String(v == null ? "" : v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function WsDonors({ prog }) {
  const toast = useToast();
  const donors = (typeof DONOR_LIST !== "undefined" ? DONOR_LIST : []);
  const [q, setQ] = React.useState("");
  const [teamFilter, setTeamFilter] = React.useState("All");
  const [minAmt, setMinAmt] = React.useState("");
  const [maxAmt, setMaxAmt] = React.useState("");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const parseDonorDate = (s) => { const t = Date.parse(s); return isNaN(t) ? null : t; };
  const fromT = fromDate ? Date.parse(fromDate) : -Infinity;
  const toT = toDate ? Date.parse(toDate) + 86400000 - 1 : Infinity;
  const teams = ["All", ...Array.from(new Set(donors.map(d => d.team).filter(Boolean)))];
  const min = minAmt === "" ? -Infinity : Number(minAmt);
  const max = maxAmt === "" ? Infinity : Number(maxAmt);
  const filtered = donors.filter(d => {
    const name = d.anonymous ? "anonymous" : (d.name || "");
    const matchesQ = (name + " " + (d.team || "")).toLowerCase().includes(predQ(q));
    const matchesTeam = teamFilter === "All" || d.team === teamFilter;
    const matchesAmt = d.amount >= min && d.amount <= max;
    const dt = parseDonorDate(d.date);
    const matchesDate = dt == null ? true : (dt >= fromT && dt <= toT);
    return matchesQ && matchesTeam && matchesAmt && matchesDate;
  });
  const clearFilters = () => { setTeamFilter("All"); setMinAmt(""); setMaxAmt(""); setFromDate(""); setToDate(""); setQ(""); };
  const filtersActive = teamFilter !== "All" || minAmt !== "" || maxAmt !== "" || fromDate !== "" || toDate !== "" || q !== "";
  const exportXls = () => {
    const rows = [["Donor", "Team", "Type", "Date", "Amount (₹)"],
      ...filtered.map(d => [d.anonymous ? "Anonymous" : d.name, d.team || "", DONATION_TYPE_LABEL[d.type] || "One-time", d.date, d.amount])];
    csvDownload(`${prog.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-donors.csv`, rows);
    toast("Exported " + filtered.length + " donors", { sub: "Opens in Excel", icon: "download" });
  };
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-end justify-between gap-3 mb-3 flex-wrap">
          <div>
            <Eyebrow>Recent donors</Eyebrow>
            <p className="text-helper mt-1">{prog.donors.toLocaleString("en-IN")} people have given to this programme.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <SearchInput value={q} onChange={e => setQ(e.target.value)} placeholder="Search donors…" />
            <Button variant="secondary" size="sm" onClick={exportXls}><Icon name="download" size={14} />Export to Excel</Button>
          </div>
        </div>

        {/* filters */}
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-helper">Team</span>
            <NativeSelect value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} className="w-44">
              {teams.map(t => <option key={t} value={t}>{t}</option>)}
            </NativeSelect>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-helper">Amount ₹</span>
            <Input inputMode="numeric" value={minAmt} onChange={(e) => setMinAmt(e.target.value.replace(/\D/g, ""))} placeholder="Min" className="w-24 h-9" />
            <span className="text-muted-foreground text-[13px]">–</span>
            <Input inputMode="numeric" value={maxAmt} onChange={(e) => setMaxAmt(e.target.value.replace(/\D/g, ""))} placeholder="Max" className="w-24 h-9" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-helper">Date</span>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-[150px] h-9" />
            <span className="text-muted-foreground text-[13px]">–</span>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-[150px] h-9" />
          </div>
          {filtersActive && <button onClick={clearFilters} className="text-[12.5px] font-medium text-primary hover:underline">Clear</button>}
          <span className="text-helper ml-auto tabular-nums">{filtered.length} donor{filtered.length === 1 ? "" : "s"}</span>
        </div>
        <Card className="p-0 overflow-hidden">
          <Table columns={[{ label: "Donor" }, { label: "Team" }, { label: "Type" }, { label: "Date" }, { label: "Amount", align: "right" }]}>
            {filtered.slice(0, 50).map((d, i) => (
              <tr key={i} className="border-b border-border-soft last:border-0">
                <Td><div className="flex items-center gap-2.5"><Avatar name={d.anonymous ? "A A" : d.name} size={30} /><span className="font-medium">{d.anonymous ? "Anonymous" : d.name}</span></div></Td>
                <Td className="text-muted-foreground">{d.team || "—"}</Td>
                <Td><Badge tone={DONATION_TYPE_TONE[d.type] || "muted"}>{DONATION_TYPE_LABEL[d.type] || "One-time"}</Badge></Td>
                <Td className="text-muted-foreground whitespace-nowrap">{d.date}</Td>
                <Td align="right" className="tabular-nums font-medium">{formatINR(d.amount)}</Td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-[13px] text-muted-foreground">No donors match "{q}".</td></tr>
            )}
          </Table>
        </Card>
      </div>
    </div>
  );
}

// ── Passbook: unified ledger of donations (in) and disbursements (out) ──
function wsUtr(seed, i) {
  // deterministic 16-char UTR-style reference
  let h = 0; const s = seed + "-" + i;
  for (let k = 0; k < s.length; k++) h = (h * 31 + s.charCodeAt(k)) >>> 0;
  const base = (h.toString(36) + (h * 2654435761 >>> 0).toString(36)).toUpperCase().replace(/[^A-Z0-9]/g, "");
  return ("UTR" + base).slice(0, 16).padEnd(16, "0");
}
function WsPassbook({ prog }) {
  const toast = useToast();
  const donors = (typeof DONOR_LIST !== "undefined" ? DONOR_LIST : []);
  const disb = (typeof DISBURSEMENTS !== "undefined" ? DISBURSEMENTS : []);
  const parseD = (s) => { const t = Date.parse(s); return isNaN(t) ? 0 : t; };

  // unified ledger entries
  const entries = React.useMemo(() => {
    const inflow = donors.map((d, i) => ({
      kind: "Donation", party: d.anonymous ? "Anonymous donor" : d.name, sub: d.team || "—",
      method: DONATION_TYPE_LABEL[d.type] || "One-time", status: "Credited", amount: d.amount,
      date: d.date, t: parseD(d.date), utr: wsUtr("DON" + (d.name || "anon"), i),
    }));
    const outflow = disb.map((x, i) => ({
      kind: "Disbursement", party: x.scholar, sub: "Tranche " + x.tranche,
      method: "Bank transfer", status: x.status, amount: x.amount,
      date: x.date, t: parseD(x.date), utr: wsUtr("DIS" + x.scholar, x.tranche),
    }));
    return [...inflow, ...outflow].sort((a, b) => b.t - a.t);
  }, [donors, disb]);

  const [q, setQ] = React.useState("");
  const [type, setType] = React.useState("All");
  const filtered = entries.filter(e =>
    (type === "All" || e.kind === type) &&
    (e.party + " " + e.utr + " " + e.method + " " + e.sub).toLowerCase().includes(predQ(q))
  );
  const totalIn = entries.filter(e => e.kind === "Donation").reduce((s, e) => s + e.amount, 0);
  const totalOut = entries.filter(e => e.kind === "Disbursement").reduce((s, e) => s + e.amount, 0);
  const anyFilter = q || type !== "All";

  const exportXls = () => {
    const rows = [["Date", "UTR no.", "Type", "Party", "Detail", "Method", "Status", "Amount (₹)"],
      ...filtered.map(e => [e.date, e.utr, e.kind, e.party, e.sub, e.method, e.status, (e.kind === "Disbursement" ? "-" : "+") + e.amount])];
    csvDownload(`${prog.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-passbook.csv`, rows);
    toast("Exported " + filtered.length + " entries", { sub: "Opens in Excel", icon: "download" });
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-4 flex-wrap">
        <div>
          <Eyebrow>Passbook</Eyebrow>
          <p className="text-helper mt-1">Every donation received and disbursement made for this programme.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={exportXls}><Icon name="download" size={14} />Export to Excel</Button>
      </div>

      {/* summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <Card className="p-4"><div className="flex items-center gap-2 text-helper"><Icon name="arrowDownLeft" size={14} className="text-success" />Donations in</div><p className="text-[20px] font-semibold text-foreground tabular-nums mt-1">{formatINR(totalIn)}</p></Card>
        <Card className="p-4"><div className="flex items-center gap-2 text-helper"><Icon name="arrowUpRight" size={14} className="text-primary" />Disbursed out</div><p className="text-[20px] font-semibold text-foreground tabular-nums mt-1">{formatINR(totalOut)}</p></Card>
        <Card className="p-4"><div className="flex items-center gap-2 text-helper"><Icon name="wallet" size={14} className="text-muted-foreground" />Net balance</div><p className="text-[20px] font-semibold text-foreground tabular-nums mt-1">{formatINR(totalIn - totalOut)}</p></Card>
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-3">
        <SearchInput value={q} onChange={e => setQ(e.target.value)} placeholder="Search party, UTR, or method…" className="w-64" />
        <FilterSelect label="Type" value={type} onChange={setType} options={[["All", "All"], ["Donation", "Donations"], ["Disbursement", "Disbursements"]]} allValue="All" />
        {anyFilter && <button onClick={() => { setQ(""); setType("All"); }} className="text-[12.5px] font-medium text-muted-foreground hover:text-foreground ml-auto">Clear filters</button>}
      </div>

      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-helper">{filtered.length} of {entries.length} entries</p>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table columns={[{ label: "Date" }, { label: "UTR no." }, { label: "Type" }, { label: "Party" }, { label: "Method" }, { label: "Status" }, { label: "Amount", align: "right" }]}>
          {filtered.map((e, i) => {
            const out = e.kind === "Disbursement";
            return (
              <tr key={i} className="border-b border-border-soft last:border-0 hover:bg-surface-muted/40 transition-colors">
                <Td className="text-muted-foreground whitespace-nowrap">{e.date}</Td>
                <Td className="font-mono text-[12px] text-muted-foreground tracking-tight">{e.utr}</Td>
                <Td>
                  <span className={cn("inline-flex items-center gap-1.5 text-[12.5px] font-medium", out ? "text-primary" : "text-success")}>
                    <Icon name={out ? "arrowUpRight" : "arrowDownLeft"} size={13} />{e.kind}
                  </span>
                </Td>
                <Td><div className="flex items-center gap-2.5"><Avatar name={e.party} size={28} /><div><div className="text-[13.5px] font-medium text-foreground">{e.party}</div><div className="text-helper">{e.sub}</div></div></div></Td>
                <Td className="text-muted-foreground">{e.method}</Td>
                <Td><Badge tone={e.status === "Credited" || e.status === "Confirmed" ? "success" : e.status === "Released" ? "info" : "muted"}>{e.status}</Badge></Td>
                <Td align="right" className={cn("tabular-nums font-medium", out ? "text-foreground" : "text-success")}>{out ? "−" : "+"}{formatINR(e.amount)}</Td>
              </tr>
            );
          })}
        </Table>
        {filtered.length === 0 && <div className="py-12 text-center text-[13px] text-muted-foreground">No passbook entries match your filters.</div>}
      </Card>
    </div>
  );
}

Object.assign(window, { ProgramWorkspace, WsDashboard, WsDetails, WsDonors, WsPassbook, WsLeaderboard, WS_TABS, WS_LABEL: { dashboard: "Dashboard", details: "Details", form: "Form", donors: "Donors", passbook: "Passbook", nominations: "Applications", scholars: "Scholars", analytics: "Analytics" } });
