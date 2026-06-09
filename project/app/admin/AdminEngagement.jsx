// ── Admin engagement pages: Leaderboards · Nudges · Student stories ──

const RANK_MEDAL = {
  1: "bg-[hsl(45_90%_50%)] text-[hsl(40_60%_20%)]",
  2: "bg-[hsl(220_12%_72%)] text-[hsl(220_15%_28%)]",
  3: "bg-[hsl(28_55%_55%)] text-white",
};
function RankBadge({ rank }) {
  return <span className={cn("h-7 w-7 rounded-full flex items-center justify-center text-[12.5px] font-bold tabular-nums shrink-0", rank <= 3 ? RANK_MEDAL[rank] : "bg-muted text-muted-foreground")}>{rank}</span>;
}
function TrendArrow({ dir }) {
  const up = dir === "up";
  return (
    <span className={cn("inline-flex items-center gap-1 text-[12px] font-medium", up ? "text-success" : "text-destructive")}>
      <Icon name={up ? "trendingUp" : "trendingDown"} size={14} />{up ? "Up" : "Down"}
    </span>
  );
}

// ════════════════ 1 · LEADERBOARDS ════════════════
function LeaderboardsPage() {
  const toast = useToast();
  const [tab, setTab] = React.useState("donations");
  const [openTeam, setOpenTeam] = React.useState(null);
  const toggle = (t) => setOpenTeam(o => o === t ? null : t);

  return (
    <div>
      <AdminPageHead title="Leaderboards" subtitle="Team standings by giving and nominations. Click a team to see the breakdown."
        actions={<>
          <Button variant="secondary" size="sm" onClick={() => toast("Export started · CSV", { sub: "Leaderboard — " + tab, icon: "download" })}><Icon name="download" size={14} />Export CSV</Button>
          <Button variant="secondary" size="sm" onClick={() => toast("Export started · PDF", { sub: "Leaderboard — " + tab, icon: "download" })}><Icon name="download" size={14} />Export PDF</Button>
        </>} />

      <Tabs tabs={[{ id: "donations", label: "Donations" }, { id: "nominations", label: "Nominations" }]} value={tab} onChange={(t) => { setTab(t); setOpenTeam(null); }} className="mb-5" />

      {tab === "donations" ? (
        <Card className="p-0 overflow-hidden">
          <Table columns={[{ label: "Rank", w: "w-16" }, { label: "Team" }, { label: "Total donated", align: "right" }, { label: "Donors", align: "right" }, { label: "Participation", align: "right" }, { label: "Trend", align: "right" }, { label: "", w: "w-10" }]}>
            {LB_DONATIONS.map(t => {
              const expanded = openTeam === t.team;
              return (
                <React.Fragment key={t.team}>
                  <tr className="border-b border-border-soft hover:bg-surface-muted/40 transition-colors cursor-pointer" onClick={() => toggle(t.team)}>
                    <Td><RankBadge rank={t.rank} /></Td>
                    <Td className="font-medium">{t.team}</Td>
                    <Td align="right" className="tabular-nums font-medium">{formatINR(t.total)}</Td>
                    <Td align="right" className="tabular-nums text-muted-foreground">{t.donors}/{t.headcount}</Td>
                    <Td align="right"><span className="inline-flex items-center gap-2 justify-end"><span className="hidden sm:block w-16 h-1.5 rounded-full bg-muted overflow-hidden"><span className="block h-full bg-primary rounded-full" style={{ width: t.participation + "%" }} /></span><span className="tabular-nums font-medium">{t.participation}%</span></span></Td>
                    <Td align="right"><TrendArrow dir={t.trend} /></Td>
                    <Td align="right"><Icon name="chevDown" size={16} className={cn("text-muted-foreground transition-transform", expanded && "rotate-180")} /></Td>
                  </tr>
                  {expanded && (
                    <tr className="bg-surface-muted/30">
                      <td colSpan={7} className="px-4 py-3">
                        <p className="text-eyebrow mb-2.5 pl-12">Top donors in {t.team}</p>
                        <div className="pl-12 grid sm:grid-cols-2 gap-x-8 gap-y-2">
                          {t.members.map(m => (
                            <div key={m.name} className="flex items-center gap-2.5 py-1">
                              <Avatar name={m.name} size={26} />
                              <span className="text-[13px] text-foreground flex-1">{m.name}</span>
                              <span className="text-[13px] font-medium tabular-nums">{formatINR(m.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </Table>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table columns={[{ label: "Rank", w: "w-16" }, { label: "Team" }, { label: "Submitted", align: "right" }, { label: "Shortlisted", align: "right" }, { label: "Selected", align: "right" }, { label: "", w: "w-10" }]}>
            {LB_NOMINATIONS.map(t => {
              const expanded = openTeam === t.team;
              return (
                <React.Fragment key={t.team}>
                  <tr className="border-b border-border-soft hover:bg-surface-muted/40 transition-colors cursor-pointer" onClick={() => toggle(t.team)}>
                    <Td><RankBadge rank={t.rank} /></Td>
                    <Td className="font-medium">{t.team}</Td>
                    <Td align="right" className="tabular-nums font-medium">{t.submitted}</Td>
                    <Td align="right" className="tabular-nums"><Badge tone="warning">{t.shortlisted}</Badge></Td>
                    <Td align="right" className="tabular-nums"><Badge tone="success">{t.selected}</Badge></Td>
                    <Td align="right"><Icon name="chevDown" size={16} className={cn("text-muted-foreground transition-transform", expanded && "rotate-180")} /></Td>
                  </tr>
                  {expanded && (
                    <tr className="bg-surface-muted/30">
                      <td colSpan={6} className="px-4 py-3">
                        <p className="text-eyebrow mb-2.5 pl-12">Top nominators in {t.team}</p>
                        <div className="pl-12 grid sm:grid-cols-2 gap-x-8 gap-y-2">
                          {t.members.map(m => (
                            <div key={m.name} className="flex items-center gap-2.5 py-1">
                              <Avatar name={m.name} size={26} />
                              <span className="text-[13px] text-foreground flex-1">{m.name}</span>
                              <span className="text-[13px] font-medium tabular-nums">{m.submitted} nominations</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </Table>
        </Card>
      )}
    </div>
  );
}

// ════════════════ 2 · NUDGES ════════════════
const SEG_TONE = {
  info: "bg-primary/10 text-primary",
  destructive: "bg-destructive-soft text-destructive",
  warning: "bg-warning-soft text-warning",
  success: "bg-success-soft text-success",
};
function NudgesPage() {
  const toast = useToast();
  const [seg, setSeg] = React.useState(null);
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [preview, setPreview] = React.useState(false);
  const [schedule, setSchedule] = React.useState(false);

  const open = (s) => { setSeg(s); setSubject(s.subject); setBody(s.body); setPreview(false); setSchedule(false); };
  const close = () => setSeg(null);
  const send = () => { toast(`Nudge sent to ${seg.label}`, { sub: `${seg.count.toLocaleString("en-IN")} recipients · ${subject}`, icon: "send" }); close(); };

  return (
    <div>
      <AdminPageHead title="Send a nudge to your employees" subtitle="Reach the right people with the right message — pick a segment to compose." />

      <div className="grid sm:grid-cols-2 gap-4">
        {NUDGE_SEGMENTS.map(s => (
          <button key={s.id} onClick={() => open(s)}
            className="text-left rounded-xl border border-border bg-card shadow-sm p-5 hover:border-foreground/20 transition-colors">
            <div className="flex items-start justify-between">
              <span className={cn("h-11 w-11 rounded-xl flex items-center justify-center", SEG_TONE[s.tone])}><Icon name={s.icon} size={20} /></span>
              <Icon name="arrowRight" size={18} className="text-muted-foreground" />
            </div>
            <p className="text-card-title mt-4">{s.label}</p>
            <p className="text-helper mt-1">{s.blurb}{s.id !== "all" ? ` · ${s.count.toLocaleString("en-IN")} employees` : ` · ${s.count.toLocaleString("en-IN")} employees`}</p>
          </button>
        ))}
      </div>

      {/* history */}
      <div className="mt-8">
        <h2 className="text-section-title mb-3">Nudge history</h2>
        <Card className="p-0 overflow-hidden">
          <Table columns={[{ label: "Date sent" }, { label: "Segment" }, { label: "Subject" }, { label: "Recipients", align: "right" }, { label: "Open rate", align: "right" }, { label: "", w: "w-16" }]}>
            {NUDGE_HISTORY.map((h, i) => (
              <tr key={i} className="border-b border-border-soft last:border-0">
                <Td className="text-muted-foreground whitespace-nowrap">{h.date}</Td>
                <Td><Badge tone="info">{h.segment}</Badge></Td>
                <Td className="font-medium">{h.subject}</Td>
                <Td align="right" className="tabular-nums">{h.recipients.toLocaleString("en-IN")}</Td>
                <Td align="right" className="tabular-nums">{h.openRate}%</Td>
                <Td align="right"><button onClick={() => toast("Opening nudge report", { icon: "fileText" })} className="text-[12.5px] font-medium text-primary hover:underline">View</button></Td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>

      {/* compose drawer */}
      <Drawer open={!!seg} onClose={close} eyebrow="Compose nudge" title={seg ? seg.label : ""} width={520}
        footer={seg && (
          <div className="flex items-center justify-between gap-3">
            <Button variant="secondary" onClick={() => setPreview(p => !p)}><Icon name="mail" size={15} />{preview ? "Hide preview" : "Preview"}</Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setSchedule(s => !s)}><Icon name="calendar" size={15} />Schedule</Button>
              <Button onClick={send}><Icon name="send" size={15} />Send now</Button>
            </div>
          </div>
        )}>
        {seg && (
          <div className="space-y-5">
            <Field label="To">
              <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-surface-muted/50">
                <span className={cn("h-6 w-6 rounded-md flex items-center justify-center", SEG_TONE[seg.tone])}><Icon name={seg.icon} size={13} /></span>
                <span className="text-[13.5px] font-medium text-foreground">{seg.label}</span>
                <span className="text-[12.5px] text-muted-foreground ml-auto tabular-nums">{seg.count.toLocaleString("en-IN")} recipients</span>
              </div>
            </Field>
            <Field label="Subject"><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></Field>
            <Field label="Message"><Textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} /></Field>

            {schedule && (
              <div className="rounded-lg border border-border-soft bg-surface-muted/40 p-4 grid grid-cols-2 gap-3 animate-fade-in">
                <Field label="Date"><Input type="date" defaultValue="2026-06-02" /></Field>
                <Field label="Time"><Input type="time" defaultValue="09:00" /></Field>
                <p className="col-span-2 text-helper">The nudge will be queued and sent at the scheduled time.</p>
              </div>
            )}

            {preview && (
              <div className="rounded-xl border border-border-soft overflow-hidden animate-fade-in">
                <div className="px-4 py-2.5 border-b border-border-soft bg-surface-muted/40 flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Icon name="mail" size={14} /><span className="truncate">From: {COMPANY.foundation} · To: {seg.label}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4"><img src="assets/b4s-logo.png" alt="" className="h-6 w-6 object-contain" /><span className="text-[12.5px] font-bold tracking-tight text-foreground">{COMPANY.name} Giving</span></div>
                  <p className="text-[15px] font-semibold text-foreground mb-3">{subject}</p>
                  {body.split("\n\n").map((p, i) => <p key={i} className="text-[13px] leading-relaxed text-foreground/90 mb-3">{p}</p>)}
                  <span className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-[13px] font-medium mt-1">Open the giving portal<Icon name="arrowRight" size={14} /></span>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}

// ════════════════ 3 · STUDENT STORIES ════════════════
function StoriesPage() {
  const toast = useToast();
  const [stories, setStories] = React.useState(STORY_LIST);
  const [adding, setAdding] = React.useState(false);
  const [form, setForm] = React.useState({ first: "", quote: "", college: "", status: "Published" });

  const toggleStatus = (id) => setStories(ss => ss.map(s => s.id === id ? { ...s, status: s.status === "Published" ? "Draft" : "Published" } : s));
  const submit = () => {
    if (!form.first.trim() || !form.quote.trim()) return;
    setStories(ss => [...ss, { ...form, id: "st" + Date.now() }]);
    toast("Story added", { sub: `${form.first} · ${form.status}`, icon: "checkCircle" });
    setAdding(false); setForm({ first: "", quote: "", college: "", status: "Published" });
  };

  return (
    <div>
      <AdminPageHead title="Student stories" subtitle="Stories shown on the employee programme page to build context before the ask. Reorder to control their sequence."
        actions={<>
          <Button variant="secondary" size="sm" onClick={() => toast("Opening employee programme page preview", { icon: "image" })}><Icon name="image" size={14} />Preview on program page</Button>
          <Button size="sm" onClick={() => setAdding(true)}><Icon name="plus" size={15} />Add story</Button>
        </>} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stories.map(s => (
          <Card key={s.id} className="p-0 overflow-hidden">
            <div className="aspect-[4/3] bg-surface-muted flex items-center justify-center border-b border-border-soft">
              <div className="flex flex-col items-center text-muted-foreground"><Icon name="image" size={26} /><span className="text-[11px] mt-1.5">Photo placeholder</span></div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-card-title">{s.first}</p>
                <Badge tone={s.status === "Published" ? "success" : "muted"}>{s.status}</Badge>
              </div>
              <div className="flex items-start gap-1.5 mb-2"><Icon name="quote" size={15} className="text-primary/25 shrink-0 mt-0.5" /><p className="text-[13px] text-foreground leading-snug">{s.quote}</p></div>
              <p className="text-helper">{s.college}</p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-soft">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => toast("Edit story", { sub: s.first, icon: "pencil" })}><Icon name="pencil" size={13} />Edit</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toggleStatus(s.id)}>{s.status === "Published" ? "Unpublish" : "Publish"}</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* add story modal */}
      {adding && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setAdding(false)}>
          <div className="absolute inset-0 bg-foreground/30" />
          <div onClick={(e) => e.stopPropagation()} className="relative w-full sm:w-[440px] rounded-xl border border-border bg-popover shadow-lg p-5 animate-scale-in max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[15px] font-semibold text-foreground">Add student story</p>
              <button onClick={() => setAdding(false)} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="aspect-[5/2] rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:border-primary/40 transition-colors">
                <Icon name="upload" size={20} /><span className="text-[12px] mt-1.5">Upload photo</span>
              </div>
              <Field label="Student first name"><Input value={form.first} onChange={(e) => setForm({ ...form, first: e.target.value })} placeholder="Priya" /></Field>
              <Field label="One-line quote" helper={`${form.quote.length}/120`}>
                <Textarea rows={2} maxLength={120} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} placeholder="A short line in the student's voice" />
              </Field>
              <Field label="College name"><Input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} placeholder="Lady Shri Ram College, Delhi" /></Field>
              <Field label="Status">
                <Segmented options={[["Published", "Publish now"], ["Draft", "Save as draft"]]} value={form.status} onChange={(v) => setForm({ ...form, status: v })} />
              </Field>
            </div>
            <Button className="w-full mt-5" disabled={!form.first.trim() || !form.quote.trim()} onClick={submit}><Icon name="plus" size={15} />Add story</Button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

Object.assign(window, { LeaderboardsPage, NudgesPage, StoriesPage });
