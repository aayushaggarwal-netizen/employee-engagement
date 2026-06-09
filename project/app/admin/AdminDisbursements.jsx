// ── Disbursements: summary, table, schedule modal ──
function DisbursementsPage() {
  const toast = useToast();
  const [rows, setRows] = React.useState(DISBURSEMENTS);
  const [scholarFilter, setScholarFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [scheduleOpen, setScheduleOpen] = React.useState(false);

  const scholars = ["All", ...new Set(ADMIN_SCHOLARS.map(s => s.name))];
  const filtered = rows.filter(r =>
    (scholarFilter === "All" || r.scholar === scholarFilter) &&
    (statusFilter === "All" || r.status === statusFilter)
  );

  const totalDisbursed = rows.filter(r => r.status !== "Scheduled").reduce((s, r) => s + r.amount, 0);
  const upcoming = rows.filter(r => r.status === "Scheduled");
  const upcomingTotal = upcoming.reduce((s, r) => s + r.amount, 0);

  const markReleased = (id) => {
    setRows(list => list.map(r => r.id === id ? { ...r, status: "Released" } : r));
    toast("Disbursement released", { sub: "Status updated to Released.", icon: "banknote" });
  };

  const schedule = (data) => {
    const sc = ADMIN_SCHOLARS.find(s => s.name === data.scholar);
    const trancheN = rows.filter(r => r.scholar === data.scholar).length + 1;
    setRows(list => [{ id: "new-" + Date.now(), scholar: data.scholar, program: sc ? sc.program : PROGRAMS[0].name, tranche: trancheN, amount: +data.amount, date: data.date || "TBD", status: "Scheduled" }, ...list]);
    toast("Disbursement scheduled", { sub: `${formatINR(+data.amount)} for ${data.scholar}.`, icon: "calendarPlus" });
    setScheduleOpen(false);
  };

  return (
    <>
      <AdminPageHead title="Disbursements" subtitle="Schedule and track scholarship payouts across all scholars."
        actions={<Button onClick={() => setScheduleOpen(true)}><Icon name="calendarPlus" size={16} />Schedule disbursement</Button>} />

      {/* summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <KpiCard icon="banknote" label="Total disbursed to date" value={formatINR(totalDisbursed)} sub="Released and confirmed" tone="success" />
        <KpiCard icon="calendar" label="Upcoming this period" value={formatINR(upcomingTotal)} sub={`${upcoming.length} scheduled tranches`} tone="warning" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <NativeSelect value={scholarFilter} onChange={e => setScholarFilter(e.target.value)} className="w-44">{scholars.map(s => <option key={s}>{s}</option>)}</NativeSelect>
          <NativeSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-40">{["All", "Scheduled", "Released", "Confirmed"].map(s => <option key={s}>{s}</option>)}</NativeSelect>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table columns={[
          { label: "Scholar" }, { label: "Program" }, { label: "Tranche" },
          { label: "Amount", align: "right" }, { label: "Scheduled date" }, { label: "Status" }, { label: "", align: "right" },
        ]}>
          {filtered.map(r => (
            <tr key={r.id} className="border-b border-border-soft last:border-0 hover:bg-surface-muted/40 transition-colors">
              <Td><div className="flex items-center gap-2.5"><Avatar name={r.scholar} size={30} /><span className="font-medium">{r.scholar}</span></div></Td>
              <Td className="text-muted-foreground max-w-[200px]"><span className="line-clamp-1">{r.program}</span></Td>
              <Td className="text-muted-foreground">#{r.tranche}</Td>
              <Td align="right" className="tabular-nums font-medium">{formatINR(r.amount)}</Td>
              <Td className="text-muted-foreground whitespace-nowrap">{r.date}</Td>
              <Td><Badge tone={DISB_STATUS_TONE[r.status]}>{r.status}</Badge></Td>
              <Td align="right">
                {r.status === "Scheduled"
                  ? <button onClick={() => markReleased(r.id)} className="text-[12.5px] font-medium text-primary hover:underline whitespace-nowrap">Mark as released</button>
                  : <span className="text-[12.5px] text-muted-foreground inline-flex items-center gap-1"><Icon name="check" size={13} stroke={2.5} />Done</span>}
              </Td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && <div className="py-12 text-center text-[13px] text-muted-foreground">No disbursements match your filters.</div>}
      </Card>

      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} onSchedule={schedule} />
    </>
  );
}

function ScheduleModal({ open, onClose, onSchedule }) {
  const [f, setF] = React.useState({ scholar: ADMIN_SCHOLARS[0].name, amount: "", date: "", note: "" });
  React.useEffect(() => { if (open) setF({ scholar: ADMIN_SCHOLARS[0].name, amount: "", date: "", note: "" }); }, [open]);
  const valid = +f.amount > 0;
  return (
    <Overlay open={open} onClose={onClose}>
      <div className="p-6 w-full sm:w-[440px]">
        <div className="flex items-center justify-between mb-5"><h2 className="text-section-title">Schedule disbursement</h2><button onClick={onClose} className="text-muted-foreground hover:text-foreground"><Icon name="x" size={18} /></button></div>
        <div className="space-y-4">
          <Field label="Scholar" htmlFor="sd-scholar"><NativeSelect value={f.scholar} onChange={e => setF({ ...f, scholar: e.target.value })}>{ADMIN_SCHOLARS.map(s => <option key={s.id}>{s.name}</option>)}</NativeSelect></Field>
          <Field label="Amount" htmlFor="sd-amount">
            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[15px]">₹</span>
              <Input id="sd-amount" inputMode="numeric" className="pl-7" value={f.amount} onChange={e => setF({ ...f, amount: e.target.value.replace(/[^\d]/g, "") })} placeholder="40,000" /></div>
          </Field>
          <Field label="Date" htmlFor="sd-date"><Input id="sd-date" type="date" value={f.date} onChange={e => setF({ ...f, date: e.target.value })} /></Field>
          <Field label="Note" htmlFor="sd-note" optional><Input id="sd-note" value={f.note} onChange={e => setF({ ...f, note: e.target.value })} placeholder="e.g. Semester 2 tuition" /></Field>
        </div>
        <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button><Button className="flex-1" disabled={!valid} onClick={() => onSchedule(f)}>Schedule</Button></div>
      </div>
    </Overlay>
  );
}

window.DisbursementsPage = DisbursementsPage;
