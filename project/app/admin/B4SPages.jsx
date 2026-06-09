// ── B4S Superadmin pages (part 2): clients, programmes, scholars, disbursements, analytics, billing, team, pool, audit, settings ──

// ════════════════ CLIENTS LIST ════════════════
function B4SClients({ openClient, clients = B4S_CLIENTS, onOnboard }) {
  const [q, setQ] = React.useState("");
  const [statusF, setStatusF] = React.useState("All");
  const filtered = clients.filter(c =>
    (c.name + " " + c.foundation + " " + c.industry).toLowerCase().includes(predQ(q)) &&
    (statusF === "All" || c.status === statusF));
  return (
    <>
      <AdminPageHead title="Clients" subtitle={`${clients.length} organisations on the platform.`}
        actions={<Button size="sm" onClick={onOnboard}><Icon name="plus" size={15} />Onboard company</Button>} />
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <SearchInput value={q} onChange={e => setQ(e.target.value)} placeholder="Search clients…" />
        <FilterPills options={["All", "Pending", "Active", "Suspended"]} value={statusF} onChange={setStatusF} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(c => {
          const pct = c.goal ? Math.round((c.raised / c.goal) * 100) : 0;
          const pending = c.status === "Pending";
          return (
            <Card key={c.id} className="p-5 hover:border-foreground/20 transition-colors cursor-pointer" onClick={() => openClient(c.id)}>
              <div className="flex items-start gap-3">
                <Avatar name={c.name} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><p className="text-card-title">{c.name}</p>{c.isHome && <Badge tone="info">You</Badge>}</div>
                  <p className="text-helper">{c.foundation} · {c.industry}</p>
                </div>
                <Badge tone={B4S_CLIENT_STATUS_TONE[c.status]}>{c.status}</Badge>
              </div>
              {pending ? (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-warning-soft/50 px-3 py-2 text-[12.5px] text-warning">
                  <Icon name="mail" size={14} className="shrink-0" />Invite sent to {c.csr} · awaiting setup
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: pct + "%" }} /></div>
                  <span className="text-[12px] text-muted-foreground tabular-nums">{fmtCr(c.raised)} / {fmtCr(c.goal)}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border-soft">
                {[["Plan", c.plan], ["Scholars", c.scholars], ["Employees", c.employees ? c.employees.toLocaleString("en-IN") : "—"]].map(([k, v]) => (
                  <div key={k}><p className="text-helper">{k}</p><p className="text-[14px] font-semibold text-foreground tabular-nums">{v}</p></div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

// ════════════════ PROGRAMME DETAIL (read-only, mirrors the HR-admin programme view) ════════════════
// ════════════════ PROGRAMME WORKSPACE (L3) — renders the exact HR-admin sections ════════════════
function B4SProgrammeWorkspace({ prog, client, progTab = "dashboard", setProgTab }) {
  // map the B4S programme onto the HR-admin programme shape so the shared sections show its numbers
  const hrProg = { ...PROGRAMS[0], name: prog.name, status: prog.status === "Ended" ? "Active" : prog.status, raised: prog.raised, goal: prog.goal, scholars: prog.scholars, end: prog.end };
  const pct = prog.goal ? Math.min(100, Math.round(prog.raised / prog.goal * 100)) : 0;
  const ended = prog.status === "Ended";
  const [scholarId, setScholarId] = React.useState(ADMIN_SCHOLARS[0].id);
  const [scholarPage, setScholarPage] = React.useState("scholars");

  return (
    <div>
      {/* programme header */}
      <div className="flex items-start gap-4 mb-6 flex-wrap">
        <span className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon name="award" size={22} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap"><h1 className="text-[22px] font-semibold tracking-[-0.01em] text-foreground">{prog.name}</h1><Badge tone={prog.status === "Active" ? "success" : ended || prog.status === "Draft" ? "muted" : "warning"}>{prog.status}</Badge></div>
          <p className="text-body text-muted-foreground mt-0.5">{client.name} · {client.foundation} · {cpInrShort(prog.raised)} of {cpInrShort(prog.goal)} ({pct}%) · {ended ? "ended" : "ends"} {prog.end}</p>
        </div>
      </div>

      {progTab === "dashboard" && <WsDashboard prog={hrProg} setTab={setProgTab} />}
      {progTab === "details" && <WsDetails prog={hrProg} />}
      {progTab === "donors" && <WsDonors prog={hrProg} />}
      {progTab === "nominations" && <NominationsPage go={() => {}} />}
      {progTab === "passbook" && <WsPassbook prog={{ name: prog.name, donors: 0 }} />}
      {progTab === "scholars" && <ScholarsPage page={scholarPage} go={(p) => setScholarPage(p === "scholars" ? "scholars" : p)} scholarId={scholarId} setScholarId={setScholarId} />}
      {progTab === "analytics" && <div className="space-y-8"><AnalyticsPage /><WsLeaderboard /></div>}
    </div>
  );
}
window.B4SProgrammeWorkspace = B4SProgrammeWorkspace;

// ════════════════ CLIENT DETAIL ════════════════
function B4SClientDetail({ clientId, clients = B4S_CLIENTS, wsTab = "overview", setWsTab, openProgramme, onBack }) {
  const toast = useToast();
  const c = clients.find(x => x.id === clientId) || clients[0];
  const pct = c.goal ? Math.round((c.raised / c.goal) * 100) : 0;
  const matchClient = (name) => name === c.name || (c.name.indexOf("Larsen") === 0 && name === "L&T");
  const progs = B4S_PROGRAMMES.filter(p => matchClient(p.client));
  const scholars = B4S_SCHOLARS.filter(s => matchClient(s.client));
  const invoices = B4S_INVOICES.filter(iv => matchClient(iv.client));
  const noms = Math.round(c.scholars * 5.5);
  const go2 = (t) => setWsTab && setWsTab(t);
  // overview analytics (client-scoped, derived from the client's totals)
  const contactPhone = (() => {
    const d = String(9800000000 + (Math.abs([...c.name].reduce((a, ch) => a + ch.charCodeAt(0), 0)) * 7919) % 99999999).slice(0, 10);
    return "+91 " + d.slice(0, 5) + " " + d.slice(5, 10);
  })();
  const donorCount = Math.round(c.employees * 0.68);
  const donMonths = [["Jan", 0.12], ["Feb", 0.14], ["Mar", 0.15], ["Apr", 0.17], ["May", 0.20], ["Jun", 0.22]].map(([label, w]) => ({ label, value: Math.round(c.raised * w) }));
  const pn = (i) => progs.length ? progs[i % progs.length].name : c.name;
  const [confirmSuspend, setConfirmSuspend] = React.useState(false);
  const [suspendText, setSuspendText] = React.useState("");
  const [bulkOpen, setBulkOpen] = React.useState(false);
  React.useEffect(() => { setConfirmSuspend(false); setSuspendText(""); }, [c && c.id]);
  // masked contact + OTP reveal
  const [revealed, setRevealed] = React.useState(false);
  const [otpOpen, setOtpOpen] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  React.useEffect(() => { setRevealed(false); }, [clientId]);
  const maskEmail = (e) => { if (!e) return "—"; const [u, d] = e.split("@"); return (u ? u[0] : "") + "•••••" + "@" + (d || ""); };
  const maskPhone = (p) => { const digits = (p || "").replace(/\D/g, ""); const last2 = digits.slice(-2); return "+91 •••• •••" + last2; };
  const pending = c.status === "Pending";

  return (
    <>
      <div className="flex items-start gap-4 mb-6 flex-wrap">
        <Avatar name={c.name} size={56} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap"><h1 className="text-[22px] font-semibold tracking-[-0.01em] text-foreground">{c.name}</h1><Badge tone={B4S_CLIENT_STATUS_TONE[c.status]}>{c.status}</Badge><Badge tone={B4S_PLAN_TONE[c.plan]}>{c.plan}</Badge></div>
          <p className="text-body text-muted-foreground mt-0.5">{c.foundation} · {c.industry} · client since {c.since}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setBulkOpen(true)}><Icon name="upload" size={15} />Bulk upload employees</Button>
          <Button variant="outline" onClick={() => setConfirmSuspend(true)}><Icon name="pause" size={15} />{c.status === "Suspended" ? "Resume" : "Suspend"}</Button>
        </div>
      </div>

      {pending && (
        <div className="flex items-center gap-2.5 rounded-lg bg-warning-soft/50 px-4 py-3 mb-6 text-[13px] text-warning">
          <Icon name="mail" size={15} className="shrink-0" />Invite sent to {c.csr} — awaiting setup. Metrics appear once the company completes onboarding.
        </div>
      )}

      {/* ── OVERVIEW ── */}
      {wsTab === "overview" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            <KpiCard label="Total raised" value={fmtCr(c.raised)} sub={`${pct}% of ${fmtCr(c.goal)}`} icon="trendingUp" onClick={() => go2("donors")} />
            <KpiCard label="Scholars funded" value={c.scholars} icon="graduationCap" tone="success" onClick={() => go2("scholars")} />
            <KpiCard label="Total employees" value={c.employees.toLocaleString("en-IN")} icon="users" onClick={() => go2("employees")} />
            <KpiCard label="Total programmes" value={c.programmes} icon="award" tone="warning" />
            <KpiCard label="Total nominations" value={noms.toLocaleString("en-IN")} icon="userPlus" onClick={() => go2("nominations")} />
          </div>
          {c.raised > 0 && (
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <Eyebrow>Donations over time</Eyebrow>
                <h3 className="text-section-title mt-1 mb-4">Giving trend</h3>
                <LineChart data={donMonths} valueFmt={(v) => formatLakh(v)} />
              </Card>
              <Card className="p-6">
                <Eyebrow>Employee participation</Eyebrow>
                <h3 className="text-section-title mt-1 mb-4">Donors vs non-donors</h3>
                <DonutChart size={168} centerLabel={Math.round(donorCount / c.employees * 100) + "%"} centerSub="participating"
                  segments={[
                    { label: "Donors", value: donorCount, color: CHART.primary, display: donorCount.toLocaleString("en-IN") },
                    { label: "Non-donors", value: c.employees - donorCount, color: CHART.track, display: (c.employees - donorCount).toLocaleString("en-IN") },
                  ]} />
              </Card>
              {progs.length > 0 && (
                <Card className="p-6 lg:col-span-2">
                  <Eyebrow>By programme</Eyebrow>
                  <h3 className="text-section-title mt-1 mb-4">Donations vs target · nominations</h3>
                  <div className="space-y-4">
                    {progs.map((p, i) => {
                      const ppct = p.goal ? Math.min(100, Math.round((p.raised / p.goal) * 100)) : 0;
                      const pnoms = Math.round(p.scholars * 5.5);
                      return (
                        <button key={p.id} onClick={() => openProgramme && openProgramme(p.id)} className="w-full text-left block pb-4 border-b border-border-soft last:border-0 last:pb-0 group">
                          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1.5">
                            <div className="flex items-center gap-2"><p className="text-[13.5px] font-medium text-foreground group-hover:text-primary transition-colors">{p.name}</p><Badge tone={p.status === "Active" ? "success" : p.status === "Ended" || p.status === "Draft" ? "muted" : "warning"}>{p.status}</Badge><Icon name="arrowRight" size={13} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                            <p className="text-[12.5px] text-muted-foreground tabular-nums"><span className="font-medium text-foreground">{fmtCr(p.raised)}</span> of {fmtCr(p.goal)} · {ppct}%</p>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: ppct + "%" }} /></div>
                          <div className="flex items-center gap-4 mt-2 text-helper flex-wrap">
                            <span className="inline-flex items-center gap-1.5"><Icon name="userPlus" size={13} />{pnoms.toLocaleString("en-IN")} nominations</span>
                            <span className="inline-flex items-center gap-1.5"><Icon name="graduationCap" size={13} />{p.scholars} scholars</span>
                            <span className="inline-flex items-center gap-1.5"><Icon name="calendar" size={13} />Nominations close {p.end}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              )}
            </div>
          )}

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-section-title">Primary contact</h2>
                {revealed
                  ? <button onClick={() => setRevealed(false)} className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground hover:text-foreground"><Icon name="eyeOff" size={14} />Hide</button>
                  : <button onClick={() => { setOtp(""); setOtpOpen(true); }} className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary hover:underline"><Icon name="eye" size={14} />Reveal</button>}
              </div>
              <Card className="p-5 space-y-3">
                {[["Name", c.csr, false], ["Email", revealed ? c.csrEmail : maskEmail(c.csrEmail), true], ["Contact number", revealed ? contactPhone : maskPhone(contactPhone), true]].map(([k, v, sensitive]) => (
                  <div key={k} className="flex items-center justify-between gap-4 text-[13px]">
                    <span className="text-muted-foreground">{k}</span>
                    <span className={cn("font-medium text-right truncate", sensitive && !revealed ? "text-muted-foreground tabular-nums tracking-wide" : "text-foreground")}>{v}</span>
                  </div>
                ))}
                {!revealed && <p className="text-helper flex items-center gap-1.5 pt-1"><Icon name="lock" size={12} />Email &amp; number are masked. Reveal with an OTP.</p>}
              </Card>
            </div>
            <div>
              <h2 className="text-section-title mb-3">Recent activity</h2>
              <Card className="p-2">
                {(() => {
                  if (c.raised === 0 && c.employees === 0) {
                    return <div className="py-8 text-center text-[13px] text-muted-foreground">No activity yet — the client is still completing setup.</div>;
                  }
                  const acts = [
                    { icon: "heart", text: <><span className="font-medium">{B4S_SAMPLE_DONORS[0].name}</span> donated {formatINR(B4S_SAMPLE_DONORS[0].amount)}</>, prog: pn(0), t: "2 hours ago" },
                    { icon: "userPlus", text: <><span className="font-medium">{B4S_SAMPLE_NOMINATIONS[0].by}</span> nominated <span className="font-medium">{B4S_SAMPLE_NOMINATIONS[0].nominee}</span></>, prog: pn(1), t: "6 hours ago" },
                    { icon: "coin", text: <>Disbursement of {fmtCr(45000)} released to <span className="font-medium">{scholars[0] ? scholars[0].name : "a scholar"}</span></>, prog: pn(2), t: "Yesterday" },
                    { icon: "graduationCap", text: <><span className="font-medium">{B4S_SAMPLE_NOMINATIONS[4].nominee}</span> was selected as a scholar</>, prog: pn(0), t: "2 days ago" },
                    { icon: "award", text: <>Programme <span className="font-medium">{pn(1)}</span> crossed {pct}% of its goal</>, prog: pn(1), t: "4 days ago" },
                  ];
                  return acts.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 px-3 py-2.5 border-b border-border-soft last:border-0">
                      <span className="h-8 w-8 rounded-full bg-surface-muted flex items-center justify-center shrink-0 text-muted-foreground"><Icon name={a.icon} size={15} /></span>
                      <div className="flex-1 min-w-0 pt-0.5"><p className="text-[13px] text-foreground leading-snug">{a.text}</p><p className="text-[11.5px] text-muted-foreground mt-0.5 truncate">{a.prog} · {a.t}</p></div>
                    </div>
                  ));
                })()}
              </Card>
            </div>
          </div>
        </>
      )}

      {/* ── DONORS ── */}
      {wsTab === "donors" && (
        <div>
          <h2 className="text-section-title mb-1">{fmtCr(c.raised)} raised</h2>
          <p className="text-helper mb-3">Recent donors{c.raised > 0 ? "" : " — none yet"}</p>
          <Card className="p-0 overflow-hidden">
            <Table columns={[{ label: "Donor" }, { label: "Team" }, { label: "Type" }, { label: "Amount", align: "right" }, { label: "Date" }]}>
              {c.raised > 0 && B4S_SAMPLE_DONORS.map((d, i) => (
                <tr key={i} className="border-b border-border-soft last:border-0 hover:bg-surface-muted/40 transition-colors">
                  <Td><div className="flex items-center gap-2.5"><Avatar name={d.name} size={30} /><span className="font-medium">{d.name}</span></div></Td>
                  <Td className="text-muted-foreground">{d.team}</Td>
                  <Td><Badge tone={d.type === "Recurring" ? "info" : d.type === "Payroll giving" ? "warning" : "muted"}>{d.type}</Badge></Td>
                  <Td align="right" className="tabular-nums font-medium">{formatINR(d.amount)}</Td>
                  <Td className="text-muted-foreground whitespace-nowrap">{d.date}</Td>
                </tr>
              ))}
              {c.raised === 0 && <tr><td colSpan={5} className="py-10 text-center text-[13px] text-muted-foreground">No donations yet.</td></tr>}
            </Table>
          </Card>
        </div>
      )}

      {/* ── NOMINATIONS ── */}
      {wsTab === "nominations" && (
        <div>
          <h2 className="text-section-title mb-1">{noms.toLocaleString("en-IN")} nominations</h2>
          <p className="text-helper mb-3">Students put forward by employees{noms > 0 ? "" : " — none yet"}</p>
          <Card className="p-0 overflow-hidden">
            <Table columns={[{ label: "Nominee" }, { label: "Nominated by" }, { label: "Institute" }, { label: "Status" }]}>
              {noms > 0 && B4S_SAMPLE_NOMINATIONS.map((n, i) => (
                <tr key={i} className="border-b border-border-soft last:border-0 hover:bg-surface-muted/40 transition-colors">
                  <Td><div className="flex items-center gap-2.5"><Avatar name={n.nominee} size={30} /><span className="font-medium">{n.nominee}</span></div></Td>
                  <Td className="text-muted-foreground">{n.by}</Td>
                  <Td className="text-muted-foreground">{n.institute}</Td>
                  <Td><Badge tone={B4S_NOM_STATUS_TONE[n.status] || "muted"}>{n.status}</Badge></Td>
                </tr>
              ))}
              {noms === 0 && <tr><td colSpan={4} className="py-10 text-center text-[13px] text-muted-foreground">No nominations yet.</td></tr>}
            </Table>
          </Card>
        </div>
      )}

      {/* ── SCHOLARS ── */}
      {wsTab === "scholars" && (
        <div>
          <h2 className="text-section-title mb-3">{scholars.length} scholar{scholars.length === 1 ? "" : "s"}</h2>
          <Card className="p-0 overflow-hidden">
            <Table columns={[{ label: "Scholar" }, { label: "Institute · course" }, { label: "Source" }, { label: "Amount", align: "right" }, { label: "Disbursed", align: "right" }, { label: "Status" }]}>
              {scholars.map(s => (
                <tr key={s.id} className="border-b border-border-soft last:border-0 hover:bg-surface-muted/40 transition-colors">
                  <Td><div className="flex items-center gap-2.5"><Avatar name={s.name} size={30} /><span className="font-medium">{s.name}</span></div></Td>
                  <Td className="text-muted-foreground"><div>{s.institute}</div><div className="text-helper">{s.course}</div></Td>
                  <Td><Badge tone={s.source === "Nominated" ? "info" : "foreground"}>{s.source}</Badge></Td>
                  <Td align="right" className="tabular-nums">{fmtCr(s.amount)}</Td>
                  <Td align="right" className="tabular-nums">{fmtCr(s.disbursed)}</Td>
                  <Td><Badge tone={s.status === "Active" ? "success" : "muted"}>{s.status}</Badge></Td>
                </tr>
              ))}
              {scholars.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-[13px] text-muted-foreground">No scholars yet.</td></tr>}
            </Table>
          </Card>
        </div>
      )}

      {/* ── EMPLOYEES ── */}
      {wsTab === "employees" && (
        <div>
          <h2 className="text-section-title mb-1">{c.employees.toLocaleString("en-IN")} employees</h2>
          <p className="text-helper mb-3">Onboarded to the giving portal{c.employees > 0 ? "" : " — none yet"}</p>
          <Card className="p-0 overflow-hidden">
            <Table columns={[{ label: "Employee" }, { label: "Team" }, { label: "Total donated", align: "right" }, { label: "Status" }]}>
              {c.employees > 0 && B4S_SAMPLE_EMPLOYEES.map((e, i) => (
                <tr key={i} className="border-b border-border-soft last:border-0 hover:bg-surface-muted/40 transition-colors">
                  <Td><div className="flex items-center gap-2.5"><Avatar name={e.name} size={30} /><span className="font-medium">{e.name}</span></div></Td>
                  <Td className="text-muted-foreground">{e.team}</Td>
                  <Td align="right" className="tabular-nums">{e.donated > 0 ? formatINR(e.donated) : "—"}</Td>
                  <Td><Badge tone={B4S_EMP_STATUS_TONE[e.status] || "muted"}>{e.status}</Badge></Td>
                </tr>
              ))}
              {c.employees === 0 && <tr><td colSpan={4} className="py-10 text-center text-[13px] text-muted-foreground">No employees onboarded yet.</td></tr>}
            </Table>
          </Card>
        </div>
      )}

      {/* ── BILLING ── */}
      {wsTab === "billing" && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <KpiCard label="Plan" value={c.plan} icon="award" />
            <KpiCard label="Invoices" value={invoices.length} icon="fileText" />
            <KpiCard label="Outstanding" value={fmtCr(invoices.filter(i => i.status !== "Paid").reduce((s, i) => s + i.amount, 0))} icon="coin" tone="warning" />
          </div>
          <h2 className="text-section-title mb-3">Invoices</h2>
          <Card className="p-0 overflow-hidden">
            <Table columns={[{ label: "Invoice" }, { label: "Plan" }, { label: "Amount", align: "right" }, { label: "Issued" }, { label: "Due" }, { label: "Status" }]}>
              {invoices.map(iv => (
                <tr key={iv.id} className="border-b border-border-soft last:border-0 hover:bg-surface-muted/40 transition-colors">
                  <Td className="font-medium tabular-nums">{iv.id}</Td>
                  <Td><Badge tone={B4S_PLAN_TONE[iv.plan]}>{iv.plan}</Badge></Td>
                  <Td align="right" className="tabular-nums">{fmtCr(iv.amount)}</Td>
                  <Td className="text-muted-foreground whitespace-nowrap">{iv.issued}</Td>
                  <Td className="text-muted-foreground whitespace-nowrap">{iv.due}</Td>
                  <Td><Badge tone={B4S_INVOICE_TONE[iv.status]}>{iv.status}</Badge></Td>
                </tr>
              ))}
              {invoices.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-[13px] text-muted-foreground">No invoices yet.</td></tr>}
            </Table>
          </Card>
        </div>
      )}

      {confirmSuspend && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => { setConfirmSuspend(false); setSuspendText(""); }}>
          <div className="absolute inset-0 bg-foreground/30" />
          <div onClick={e => e.stopPropagation()} className="relative w-full sm:w-[400px] rounded-xl border border-border bg-popover shadow-lg p-5 animate-scale-in">
            {c.status === "Suspended" ? (
              <>
                <div className="flex items-start gap-3">
                  <span className="h-9 w-9 rounded-lg bg-success-soft text-success flex items-center justify-center shrink-0"><Icon name="play" size={18} /></span>
                  <div><p className="text-[15px] font-semibold text-foreground">Resume {c.name}?</p>
                    <p className="text-[13px] text-muted-foreground mt-1">Employees regain access to the giving portal.</p></div>
                </div>
                <div className="flex gap-2.5 mt-5">
                  <Button variant="outline" className="flex-1" onClick={() => setConfirmSuspend(false)}>Cancel</Button>
                  <Button className="flex-1" onClick={() => { setConfirmSuspend(false); toast(`${c.name} resumed`, { icon: "checkCircle" }); }}>Resume</Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <span className="h-9 w-9 rounded-lg bg-destructive-soft text-destructive flex items-center justify-center shrink-0"><Icon name="pause" size={18} /></span>
                  <div>
                    <p className="text-[15px] font-semibold text-foreground">Suspend {c.name}?</p>
                    <p className="text-[13px] text-muted-foreground mt-1">Employees lose access to the giving portal until resumed. In-flight disbursements continue.</p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-[13px] font-medium text-foreground">Type <span className="font-mono text-destructive">suspend</span> to confirm</label>
                  <Input value={suspendText} autoFocus onChange={(ev) => setSuspendText(ev.target.value)}
                    onKeyDown={(ev) => { if (ev.key === "Enter" && suspendText.trim().toLowerCase() === "suspend") { setConfirmSuspend(false); setSuspendText(""); toast(`${c.name} suspended`, { icon: "checkCircle" }); } }}
                    placeholder="suspend" className="mt-1.5" />
                </div>
                <div className="flex gap-2.5 mt-5">
                  <Button variant="outline" className="flex-1" onClick={() => { setConfirmSuspend(false); setSuspendText(""); }}>Cancel</Button>
                  <Button variant="destructive" className="flex-1" disabled={suspendText.trim().toLowerCase() !== "suspend"}
                    onClick={() => { setConfirmSuspend(false); setSuspendText(""); toast(`${c.name} suspended`, { icon: "checkCircle" }); }}>Suspend</Button>
                </div>
              </>
            )}
          </div>
        </div>, document.body)}

      {bulkOpen && <InviteCsvModal open={bulkOpen} onClose={() => setBulkOpen(false)} onConfirm={(n) => { setBulkOpen(false); toast("Invites sent", { sub: `${n} employees invited at ${c.name}.`, icon: "mail" }); }} />}

      {otpOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setOtpOpen(false)}>
          <div className="absolute inset-0 bg-foreground/30" />
          <div onClick={e => e.stopPropagation()} className="relative w-full sm:w-[400px] rounded-xl border border-border bg-popover shadow-lg p-5 animate-scale-in">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[15px] font-semibold text-foreground">Verify it's you</p>
              <button onClick={() => setOtpOpen(false)} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">For privacy, contact details are masked. We've sent a 6-digit code to <span className="font-medium text-foreground">{maskEmail(B4S_USER.email)}</span>. Enter it to reveal {c.csr}'s email and number.</p>
            <div className="mt-4">
              <Field label="6-digit code">
                <Input inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="••••••" className="tracking-[0.4em] text-center text-[16px]" />
              </Field>
              <button onClick={() => toast("Code resent", { sub: maskEmail(B4S_USER.email), icon: "mail" })} className="text-[12.5px] font-medium text-primary hover:underline mt-2">Resend code</button>
            </div>
            <Button className="w-full mt-4" disabled={otp.length < 6} onClick={() => { setRevealed(true); setOtpOpen(false); toast("Verified", { sub: "Contact details revealed for this session.", icon: "checkCircle" }); }}>
              <Icon name="lock" size={15} />Reveal contact details
            </Button>
          </div>
        </div>, document.body)}
    </>
  );
}

// ════════════════ ALL PROGRAMMES ════════════════
function B4SProgrammes({ openProgFromList }) {
  const [q, setQ] = React.useState("");
  const [client, setClient] = React.useState("All");
  const [status, setStatus] = React.useState("All");
  const [goal, setGoal] = React.useState("All");
  const [raised, setRaised] = React.useState("All");

  const clientOpts = React.useMemo(() => Array.from(new Set(B4S_PROGRAMMES.map(p => p.client))).sort(), []);
  // preset ₹ buckets (values in rupees)
  const BUCKETS = [
    { v: "All", label: "Any", lo: null, hi: null },
    { v: "lt10", label: "Under ₹10L", lo: null, hi: 1000000 },
    { v: "10-50", label: "₹10–50L", lo: 1000000, hi: 5000000 },
    { v: "50-100", label: "₹50L–1Cr", lo: 5000000, hi: 10000000 },
    { v: "gt100", label: "Over ₹1Cr", lo: 10000000, hi: null },
  ];
  const bucket = (v) => BUCKETS.find(b => b.v === v) || BUCKETS[0];
  const inBucket = (val, v) => { const b = bucket(v); return (b.lo == null || val >= b.lo) && (b.hi == null || val < b.hi); };

  const filtered = B4S_PROGRAMMES.filter(p =>
    (p.name + " " + p.client).toLowerCase().includes(predQ(q)) &&
    (client === "All" || p.client === client) &&
    (status === "All" || p.status === status) &&
    inBucket(p.goal, goal) && inBucket(p.raised, raised)
  );
  const anyFilter = q || client !== "All" || status !== "All" || goal !== "All" || raised !== "All";
  const clearAll = () => { setQ(""); setClient("All"); setStatus("All"); setGoal("All"); setRaised("All"); };

  return (
    <>
      <AdminPageHead title="All programmes" subtitle="Every scholarship programme across all clients." />

      {/* one calm filter row */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <SearchInput value={q} onChange={e => setQ(e.target.value)} placeholder="Search programmes…" className="w-60" />
        <SearchableSelect value={client} onChange={setClient} options={clientOpts} allLabel="All clients" placeholder="Search clients…" className="w-48" />
        <FilterSelect label="Goal" value={goal} onChange={setGoal} options={BUCKETS.map(b => [b.v, b.label])} allValue="All" />
        <FilterSelect label="Raised" value={raised} onChange={setRaised} options={BUCKETS.map(b => [b.v, b.label])} allValue="All" />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={[["All", "All"], ["Active", "Active"], ["Draft", "Draft"], ["Ended", "Ended"]]} allValue="All" />
        {anyFilter && <button onClick={clearAll} className="text-[12.5px] font-medium text-muted-foreground hover:text-foreground ml-auto">Clear filters</button>}
      </div>

      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-helper">{filtered.length} of {B4S_PROGRAMMES.length} programmes</p>
      </div>
      <Card className="p-0 overflow-hidden">
        <Table columns={[{ label: "Name" }, { label: "Client" }, { label: "Goal", align: "right" }, { label: "Raised", align: "right" }, { label: "Nominations", align: "right" }, { label: "Status" }, { label: "", w: "w-10" }]}>
          {filtered.map(p => (
            <tr key={p.id} className="border-b border-border-soft last:border-0 hover:bg-surface-muted/40 transition-colors cursor-pointer" onClick={() => openProgFromList && openProgFromList(p)}>
              <Td className="font-medium">{p.name}</Td>
              <Td className="text-muted-foreground">{p.client}</Td>
              <Td align="right" className="tabular-nums text-muted-foreground">{fmtCr(p.goal)}</Td>
              <Td align="right" className="tabular-nums font-medium">{fmtCr(p.raised)}</Td>
              <Td align="right" className="tabular-nums">{Math.round(p.scholars * 5.5).toLocaleString("en-IN")}</Td>
              <Td><Badge tone={p.status === "Active" ? "success" : p.status === "Ended" || p.status === "Draft" ? "muted" : "warning"}>{p.status}</Badge></Td>
              <Td align="right"><Icon name="chevRight" size={16} className="text-muted-foreground" /></Td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && <div className="py-12 text-center text-[13px] text-muted-foreground">No programmes match your filters.</div>}
      </Card>
    </>
  );
}

// ════════════════ ALL SCHOLARS ════════════════
function B4SScholars() {
  const toast = useToast();
  const [q, setQ] = React.useState("");
  const [client, setClient] = React.useState("All");
  const [programme, setProgramme] = React.useState("All");
  const [source, setSource] = React.useState("All");

  const clientOpts = React.useMemo(() => Array.from(new Set(B4S_SCHOLARS.map(s => s.client))).sort(), []);
  // programmes scoped to the selected client (or all)
  const progOpts = React.useMemo(() =>
    Array.from(new Set(B4S_SCHOLARS.filter(s => client === "All" || s.client === client).map(s => s.programme))).sort(),
    [client]);
  // reset programme if it no longer belongs to the chosen client
  React.useEffect(() => { if (programme !== "All" && !progOpts.includes(programme)) setProgramme("All"); }, [progOpts]);

  const filtered = B4S_SCHOLARS.filter(s =>
    (s.name + " " + s.client + " " + s.institute + " " + s.programme).toLowerCase().includes(predQ(q)) &&
    (client === "All" || s.client === client) &&
    (programme === "All" || s.programme === programme) &&
    (source === "All" || s.source === source)
  );
  const anyFilter = q || client !== "All" || programme !== "All" || source !== "All";
  const clearAll = () => { setQ(""); setClient("All"); setProgramme("All"); setSource("All"); };
  const exportCsv = () => toast("Export started · CSV", { sub: `${filtered.length} scholars`, icon: "download" });

  return (
    <>
      <AdminPageHead title="All scholars" subtitle="Scholars funded across every client programme."
        actions={<Button variant="secondary" size="sm" onClick={exportCsv}><Icon name="download" size={14} />Export to Excel</Button>} />

      <div className="flex flex-wrap items-center gap-2.5 mb-3">
        <SearchInput value={q} onChange={e => setQ(e.target.value)} placeholder="Search scholars…" className="w-60" />
        <SearchableSelect value={client} onChange={setClient} options={clientOpts} allLabel="All clients" placeholder="Search clients…" className="w-48" />
        <SearchableSelect value={programme} onChange={setProgramme} options={progOpts} allLabel="All programmes" placeholder="Search programmes…" className="w-56" />
        <FilterSelect label="Source" value={source} onChange={setSource} options={[["All", "All"], ["Nominated", "Nominated"], ["Pre-verified", "Pre-verified"]]} allValue="All" />
        {anyFilter && <button onClick={clearAll} className="text-[12.5px] font-medium text-muted-foreground hover:text-foreground ml-auto">Clear filters</button>}
      </div>

      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-helper">{filtered.length} of {B4S_SCHOLARS.length} scholars</p>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table columns={[{ label: "Scholar" }, { label: "Client" }, { label: "Programme" }, { label: "Institute · course" }, { label: "Source" }, { label: "Disbursed", align: "right" }, { label: "Status" }]}>
          {filtered.map(s => (
            <tr key={s.id} className="border-b border-border-soft last:border-0">
              <Td><div className="flex items-center gap-2.5"><Avatar name={s.name} size={30} /><span className="font-medium">{s.name}</span></div></Td>
              <Td className="text-muted-foreground">{s.client}</Td>
              <Td className="text-muted-foreground">{s.programme}</Td>
              <Td><p className="text-foreground">{s.institute}</p><p className="text-helper">{s.course}</p></Td>
              <Td><Badge tone={s.source === "Nominated" ? "info" : "muted"}>{s.source}</Badge></Td>
              <Td align="right" className="tabular-nums">{formatINR(s.disbursed)} <span className="text-muted-foreground">/ {formatINR(s.amount)}</span></Td>
              <Td><Badge tone={s.status === "Active" ? "success" : "muted"}>{s.status}</Badge></Td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && <div className="py-12 text-center text-[13px] text-muted-foreground">No scholars match your filters.</div>}
      </Card>
    </>
  );
}

// ════════════════ DISBURSEMENTS ════════════════
function B4SDisbursements() {
  const toast = useToast();
  const total = B4S_DISBURSEMENTS.reduce((s, d) => s + d.amount, 0);
  const scheduled = B4S_DISBURSEMENTS.filter(d => d.status === "Scheduled").reduce((s, d) => s + d.amount, 0);
  return (
    <>
      <AdminPageHead title="Disbursements" subtitle="Money movement to scholars across all clients." />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <KpiCard label="Disbursed (this cycle)" value={formatINR(total - scheduled)} icon="coin" tone="success" />
        <KpiCard label="Scheduled" value={formatINR(scheduled)} icon="clock" tone="warning" />
        <KpiCard label="Transactions" value={B4S_DISBURSEMENTS.length} icon="fileText" />
      </div>
      <Card className="p-0 overflow-hidden">
        <Table columns={[{ label: "Scholar" }, { label: "Client" }, { label: "Tranche", align: "right" }, { label: "Amount", align: "right" }, { label: "Date" }, { label: "Status" }]}>
          {B4S_DISBURSEMENTS.map(d => (
            <tr key={d.id} className="border-b border-border-soft last:border-0">
              <Td className="font-medium">{d.scholar}</Td>
              <Td className="text-muted-foreground">{d.client}</Td>
              <Td align="right" className="tabular-nums">#{d.tranche}</Td>
              <Td align="right" className="tabular-nums font-medium">{formatINR(d.amount)}</Td>
              <Td className="text-muted-foreground whitespace-nowrap">{d.date}</Td>
              <Td><Badge tone={d.status === "Confirmed" ? "success" : d.status === "Released" ? "info" : "warning"}>{d.status}</Badge></Td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  );
}

// ════════════════ PLATFORM ANALYTICS ════════════════
function B4SAnalytics() {
  const byPlan = ["Enterprise", "Growth", "Starter"].map(p => ({ label: p, value: B4S_CLIENTS.filter(c => c.plan === p).length }));
  const topClients = [...B4S_CLIENTS].sort((a, b) => b.raised - a.raised).slice(0, 6).map(c => ({ label: c.name, value: c.raised }));
  return (
    <>
      <AdminPageHead title="Platform analytics" subtitle="Aggregate giving, growth, and disbursement health across clients." />
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-6">
          <Eyebrow>Total raised by client</Eyebrow>
          <h2 className="text-section-title mt-1 mb-4">Top contributors</h2>
          <HBarChart data={topClients} valueFmt={fmtCr} />
        </Card>
        <Card className="p-6">
          <Eyebrow>Clients by plan</Eyebrow>
          <h2 className="text-section-title mt-1 mb-4">Plan mix</h2>
          <DonutChart size={150} centerLabel={String(B4S_CLIENTS.length)} centerSub="clients"
            segments={byPlan.map((p, i) => ({ label: p.label, value: p.value, color: [CHART.primary, CHART.success, CHART.track][i], display: String(p.value) }))} />
        </Card>
        <Card className="p-6 lg:col-span-2">
          <Eyebrow>Raised over time</Eyebrow>
          <h2 className="text-section-title mt-1 mb-4">Platform giving — last 6 months</h2>
          <LineChart data={[{ label: "Jan", value: 1.2 }, { label: "Feb", value: 1.8 }, { label: "Mar", value: 2.6 }, { label: "Apr", value: 3.1 }, { label: "May", value: 3.3 }, { label: "Jun", value: 3.6 }]} valueFmt={v => "₹" + v + " Cr"} />
        </Card>
      </div>
    </>
  );
}

// ════════════════ BILLING ════════════════
function B4SBilling() {
  const toast = useToast();
  const collected = B4S_INVOICES.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const outstanding = B4S_INVOICES.filter(i => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  return (
    <>
      <AdminPageHead title="Billing & invoicing" subtitle="Subscription invoices issued to client organisations."
        actions={<Button variant="secondary" size="sm" onClick={() => toast("Export started · CSV", { icon: "download" })}><Icon name="download" size={14} />Export</Button>} />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <KpiCard label="Collected (May)" value={formatINR(collected)} icon="coin" tone="success" />
        <KpiCard label="Outstanding" value={formatINR(outstanding)} icon="clock" tone="warning" />
        <KpiCard label="Invoices" value={B4S_INVOICES.length} icon="fileText" />
      </div>
      <Card className="p-0 overflow-hidden">
        <Table columns={[{ label: "Invoice" }, { label: "Client" }, { label: "Plan" }, { label: "Amount", align: "right" }, { label: "Due" }, { label: "Status" }, { label: "", w: "w-24" }]}>
          {B4S_INVOICES.map(inv => (
            <tr key={inv.id} className="border-b border-border-soft last:border-0">
              <Td className="font-medium font-mono text-[12.5px]">{inv.id}</Td>
              <Td>{inv.client}</Td>
              <Td><Badge tone={B4S_PLAN_TONE[inv.plan]}>{inv.plan}</Badge></Td>
              <Td align="right" className="tabular-nums font-medium">{formatINR(inv.amount)}</Td>
              <Td className="text-muted-foreground whitespace-nowrap">{inv.due}</Td>
              <Td><Badge tone={B4S_INVOICE_TONE[inv.status]}>{inv.status}</Badge></Td>
              <Td align="right">{inv.status !== "Paid"
                ? <Button size="sm" variant="outline" onClick={() => toast("Marked paid", { sub: inv.id, icon: "checkCircle" })}>Mark paid</Button>
                : <button onClick={() => toast("Opening invoice PDF", { icon: "fileText" })} className="text-[12.5px] font-medium text-primary hover:underline">View</button>}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  );
}

// ════════════════ B4S TEAM ════════════════
function B4STeam() {
  const toast = useToast();
  return (
    <>
      <AdminPageHead title="B4S team & roles" subtitle="Internal Buddy4Study staff and their client access."
        actions={<Button size="sm" onClick={() => toast("Invite teammate", { sub: "Team invite (demo).", icon: "mail" })}><Icon name="plus" size={15} />Invite teammate</Button>} />
      <Card className="p-0 overflow-hidden">
        <Table columns={[{ label: "Member" }, { label: "Role" }, { label: "Client access" }, { label: "Status" }, { label: "", w: "w-10" }]}>
          {B4S_TEAM.map((m, i) => (
            <tr key={i} className="border-b border-border-soft last:border-0">
              <Td><div className="flex items-center gap-2.5"><Avatar name={m.name} size={30} /><div><div className="font-medium text-foreground">{m.name}</div><div className="text-helper">{m.email}</div></div></div></Td>
              <Td><Badge tone={B4S_ROLE_TONE[m.role]}>{m.role}</Badge></Td>
              <Td className="text-muted-foreground">{m.clients}</Td>
              <Td><Badge tone={m.status === "Active" ? "success" : "warning"}>{m.status}</Badge></Td>
              <Td align="right"><button className="h-8 w-8 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"><Icon name="more" size={16} /></button></Td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  );
}

// ════════════════ VERIFIED STUDENT POOL ════════════════
function B4SPool() {
  const toast = useToast();
  const [q, setQ] = React.useState("");
  const [statusF, setStatusF] = React.useState("All");
  const s = B4S_POOL_STATS;
  const filtered = B4S_POOL.filter(p => (p.name + " " + p.institute + " " + p.state).toLowerCase().includes(predQ(q)) && (statusF === "All" || p.status === statusF));
  return (
    <>
      <AdminPageHead title="Verified student pool" subtitle="The master database of pre-verified students clients can draw from."
        actions={<><Button variant="secondary" size="sm" onClick={() => toast("Bulk import", { sub: "CSV import (demo).", icon: "upload" })}><Icon name="upload" size={14} />Bulk import</Button><Button size="sm" onClick={() => toast("Add student", { icon: "plus" })}><Icon name="plus" size={15} />Add student</Button></>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total in pool" value={s.total.toLocaleString("en-IN")} icon="graduationCap" filter onClick={() => setStatusF("All")} active={statusF === "All"} />
        <KpiCard label="Verified" value={s.verified.toLocaleString("en-IN")} icon="userCheck" tone="success" filter onClick={() => setStatusF("Verified")} active={statusF === "Verified"} />
        <KpiCard label="Pending" value={s.pending.toLocaleString("en-IN")} icon="clock" tone="warning" filter onClick={() => setStatusF("Pending")} active={statusF === "Pending"} />
        <KpiCard label="Flagged" value={s.flagged.toLocaleString("en-IN")} icon="info" tone="warning" filter onClick={() => setStatusF("Flagged")} active={statusF === "Flagged"} />
      </div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <SearchInput value={q} onChange={e => setQ(e.target.value)} placeholder="Search students…" className="w-72" />
        <p className="text-helper">{filtered.length} of {B4S_POOL.length} students{statusF !== "All" ? ` · ${statusF}` : ""}</p>
      </div>
      <Card className="p-0 overflow-hidden">
        <Table columns={[{ label: "ID" }, { label: "Student" }, { label: "Institute · course" }, { label: "State" }, { label: "Income/yr", align: "right" }, { label: "Status" }]}>
          {filtered.map(p => (
            <tr key={p.id} className="border-b border-border-soft last:border-0">
              <Td className="font-mono text-[12px] text-muted-foreground">{p.id}</Td>
              <Td className="font-medium">{p.name}</Td>
              <Td><p className="text-foreground">{p.institute}</p><p className="text-helper">{p.course}</p></Td>
              <Td className="text-muted-foreground">{p.state}</Td>
              <Td align="right" className="tabular-nums">{formatINR(p.income)}</Td>
              <Td><Badge tone={B4S_POOL_TONE[p.status]}>{p.status}</Badge></Td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  );
}

// ════════════════ AUDIT LOG ════════════════
function B4SAudit() {
  return (
    <>
      <AdminPageHead title="Audit log" subtitle="Every platform-level action, with who and when." />
      <Card className="p-2">
        {B4S_AUDIT.map((a, i) => (
          <div key={i} className="flex items-start gap-3 px-3 py-3 border-b border-border-soft last:border-0">
            <span className="h-9 w-9 rounded-lg bg-surface-muted text-muted-foreground flex items-center justify-center shrink-0"><Icon name={a.icon} size={16} /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] text-foreground"><span className="font-medium">{a.who}</span> {a.action}</p>
              <p className="text-helper">{a.target}</p>
            </div>
            <span className="text-helper whitespace-nowrap">{a.t}</span>
          </div>
        ))}
      </Card>
    </>
  );
}

// ════════════════ PLATFORM SETTINGS ════════════════
function B4SSettings() {
  const toast = useToast();
  const [tab, setTab] = React.useState("platform");
  const [prefs, setPrefs] = React.useState({ autoApprove: false, poolSelfServe: true, gstInvoice: true, defaultPlan: "Growth" });
  return (
    <>
      <AdminPageHead title="Platform settings" subtitle="Defaults and controls that apply across all clients." />
      <Tabs tabs={[{ id: "platform", label: "Platform defaults" }, { id: "fees", label: "Fees & 80G" }, { id: "branding", label: "Branding" }]} value={tab} onChange={setTab} className="mb-5" />
      {tab === "platform" && (
        <Card className="p-6 max-w-[640px] space-y-1">
          {[["autoApprove", "Auto-approve client programmes", "Skip manual review before a programme goes live."],
            ["poolSelfServe", "Let clients self-serve the verified pool", "Clients can pull students from the master pool without B4S sign-off."],
            ["gstInvoice", "Attach GST invoice to billing", "Include a tax invoice with each subscription charge."]].map(([k, t, d]) => (
            <div key={k} className="flex items-center justify-between py-3 border-b border-border-soft last:border-0">
              <div className="pr-4"><p className="text-[14px] font-medium text-foreground">{t}</p><p className="text-helper mt-0.5">{d}</p></div>
              <Toggle on={prefs[k]} onChange={v => setPrefs(p => ({ ...p, [k]: v }))} />
            </div>
          ))}
          <div className="pt-4"><Button onClick={() => toast("Settings saved", { icon: "checkCircle" })}>Save changes</Button></div>
        </Card>
      )}
      {tab === "fees" && (
        <Card className="p-6 max-w-[640px] space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Platform fee (%)"><Input defaultValue="4.0" className="tabular-nums" /></Field>
            <Field label="Payment gateway fee (%)"><Input defaultValue="1.8" className="tabular-nums" /></Field>
            <Field label="Default 80G validity"><Input defaultValue="FY 2025–26" /></Field>
            <Field label="Settlement cycle"><NativeSelect defaultValue="Weekly">{["Daily", "Weekly", "Fortnightly", "Monthly"].map(o => <option key={o}>{o}</option>)}</NativeSelect></Field>
          </div>
          <Button onClick={() => toast("Fee settings saved", { icon: "checkCircle" })}>Save changes</Button>
        </Card>
      )}
      {tab === "branding" && (
        <Card className="p-6 max-w-[640px]">
          <p className="text-helper mb-4">Co-branding shown across client portals — the B4S mark always appears in the footer.</p>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl border border-border-soft bg-surface-muted flex items-center justify-center"><div className="h-9 w-9 rounded-md bg-foreground text-background flex items-center justify-center text-[13px] font-bold">B4</div></div>
            <Button variant="outline" size="sm" onClick={() => toast("Logo upload (demo)", { icon: "upload" })}><Icon name="upload" size={14} />Replace mark</Button>
          </div>
        </Card>
      )}
    </>
  );
}

Object.assign(window, { B4SClients, B4SClientDetail, B4SProgrammes, B4SScholars, B4SDisbursements, B4SAnalytics, B4SBilling, B4STeam, B4SPool, B4SAudit, B4SSettings });
