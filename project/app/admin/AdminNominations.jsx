// ── Applications: unified applicant pipeline (nominations + scholars) ──
function ApplicantsPage({ go }) {
  const toast = useToast();
  const [rows, setRows] = React.useState(ADMIN_APPLICANTS);
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [sourceFilter, setSourceFilter] = React.useState("All");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [q, setQ] = React.useState("");
  const [openId, setOpenId] = React.useState(null);

  // parse "26 Apr 2026" → Date (midnight)
  const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const parseDate = (s) => {
    if (!s) return null;
    const m = s.match(/(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
    if (!m) return null;
    return new Date(+m[3], MONTHS[m[2]], +m[1]);
  };

  const filtered = rows.filter(n => {
    if (statusFilter !== "All" && n.status !== statusFilter) return false;
    if (sourceFilter !== "All" && n.source !== sourceFilter) return false;
    if (dateFrom || dateTo) {
      const d = parseDate(n.date);
      if (!d) return false;
      if (dateFrom && d < new Date(dateFrom)) return false;
      if (dateTo && d > new Date(dateTo)) return false;
    }
    const ql = predQ(q);
    return n.name.toLowerCase().includes(ql)
      || (n.nominatedBy || "").toLowerCase().includes(ql)
      || n.college.toLowerCase().includes(ql);
  });
  const active = rows.find(n => n.id === openId);
  const anyFilter = statusFilter !== "All" || sourceFilter !== "All" || dateFrom || dateTo || q;

  const exportXls = () => {
    const head = ["Name", "Institute", "Source", "Nominated by", "Relationship", "Nomination submitted", "Status"];
    const rowsCsv = filtered.map(n => [n.name, n.college, n.source, n.nominatedBy || "—", n.relationship || "—", n.date || "—", n.status]);
    const csv = [head, ...rowsCsv].map(r => r.map(v => {
      const s = String(v == null ? "" : v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "applicants.csv"; a.click();
    URL.revokeObjectURL(url);
    toast("Exported " + filtered.length + " applicants", { sub: "Opens in Excel", icon: "download" });
  };

  return (
    <>
      <AdminPageHead title="Applications" subtitle="Every applicant in one pipeline — from registration through to funded scholar."
        actions={<Button variant="secondary" size="sm" onClick={exportXls}><Icon name="download" size={14} />Export to Excel</Button>} />

      <div className="flex flex-col lg:flex-row lg:items-end gap-3 mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-helper">Status</span>
            <NativeSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-52">
              <option value="All">All statuses</option>
              {[...STAGE_ORDER, "Reject"].map(s => <option key={s} value={s}>{s}</option>)}
            </NativeSelect>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-helper">Source</span>
            <NativeSelect value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="w-44">
              <option value="All">All sources</option>
              <option value="Nomination">Nomination</option>
              <option value="Pre-verified">Pre-verified</option>
            </NativeSelect>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-helper">Submitted from</span>
            <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-40" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-helper">Submitted to</span>
            <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-40" />
          </label>
          {anyFilter && (
            <button onClick={() => { setStatusFilter("All"); setSourceFilter("All"); setDateFrom(""); setDateTo(""); setQ(""); }}
              className="h-10 text-[12.5px] font-medium text-muted-foreground hover:text-foreground">Clear</button>
          )}
        </div>
        <SearchInput value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, institute, or nominator" className="lg:ml-auto lg:w-72 shrink-0" />
      </div>

      <Card className="p-0 overflow-hidden">
        <Table columns={[
          { label: "Name" }, { label: "Institute" }, { label: "Source" }, { label: "Nominated by" },
          { label: "Relationship" }, { label: "Submitted" }, { label: "Status" }, { label: "", align: "right" },
        ]}>
          {filtered.map(n => (
            <tr key={n.id} className="border-b border-border-soft last:border-0 hover:bg-surface-muted/40 transition-colors cursor-pointer" onClick={() => setOpenId(n.id)}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={n.name} size={32} />
                  <div><div className="text-[13.5px] font-medium text-foreground">{n.name}</div><div className="text-helper">{n.course}</div></div>
                </div>
              </td>
              <Td className="text-muted-foreground max-w-[180px]"><span className="line-clamp-1">{n.college}</span></Td>
              <Td><Badge tone={n.source === "Nomination" ? "info" : "foreground"}>{n.source}</Badge></Td>
              <Td>{n.nominatedBy || <span className="text-muted-foreground">—</span>}</Td>
              <Td className="text-muted-foreground">{n.relationship || "—"}</Td>
              <Td className="text-muted-foreground whitespace-nowrap">{n.date || "—"}</Td>
              <Td><Badge tone={APPLICANT_STAGE_TONE[n.status] || "muted"}>{n.status}</Badge></Td>
              <Td align="right"><span className="text-[12.5px] font-medium text-primary whitespace-nowrap">View</span></Td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && <div className="py-12 text-center text-[13px] text-muted-foreground">No applicants match your filters.</div>}
      </Card>

      <ApplicantDrawer rec={active} onClose={() => setOpenId(null)} />
    </>
  );
}

function ApplicantDrawer({ rec, onClose }) {
  const n = rec;
  if (!n) return <Drawer open={false} onClose={onClose} title="" />;

  const isNomination = n.source === "Nomination";

  return (
    <Drawer open={!!n} onClose={onClose} eyebrow={isNomination ? "Applicant" : "Scholar"} title={n.name} width={520}>
      <div className="space-y-7">
        <div className="flex items-center gap-2">
          <Badge tone={APPLICANT_STAGE_TONE[n.status] || "muted"}>{n.status}</Badge>
          <Badge tone={isNomination ? "info" : "foreground"}>{n.source}</Badge>
        </div>

        {/* applicant details */}
        <section>
          <Eyebrow className="mb-3">Applicant details</Eyebrow>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            {[["Email", n.email], ["Phone", n.phone], ["Institute", n.college], ["Course", n.course], ["Year", n.year]]
              .filter(([, v]) => v != null)
              .map(([k, v]) => (
                <div key={k} className={k === "Institute" ? "col-span-2" : ""}>
                  <dt className="text-helper">{k}</dt><dd className="text-[13.5px] text-foreground mt-0.5">{v}</dd>
                </div>
              ))}
          </dl>
        </section>

        {/* nominated by — only for nominations */}
        {isNomination && n.nominatedBy && (
          <section>
            <Eyebrow className="mb-3">Nominated by</Eyebrow>
            <div className="flex items-center gap-3 rounded-lg border border-border-soft p-3">
              <Avatar name={n.nominatedBy} size={36} />
              <div><p className="text-[13.5px] font-medium text-foreground">{n.nominatedBy}</p><p className="text-helper">Relationship: {n.relationship || "—"}</p></div>
            </div>
          </section>
        )}

        {/* why this nomination */}
        {n.reason && (
          <section>
            <Eyebrow className="mb-3">Why this nomination</Eyebrow>
            <div className="rounded-lg border-l-[3px] border-primary bg-primary/[0.04] p-4">
              <div className="flex items-center gap-1.5 mb-2 text-[11.5px] font-medium text-primary uppercase tracking-[0.06em]"><Icon name="quote" size={13} />Reviewer reads this as submitted</div>
              <p className="text-body text-foreground">{n.reason}</p>
            </div>
          </section>
        )}

        {/* documents removed — view-only listing */}

        {/* status history */}
        {n.log && n.log.length > 0 && (
          <section>
            <Eyebrow className="mb-3">Status history</Eyebrow>
            <ol className="relative pl-5">
              <span className="absolute left-[5px] top-1 bottom-1 w-px bg-border" />
              {n.log.map((l, i) => (
                <li key={i} className="relative pb-4 last:pb-0">
                  <span className={cn("absolute -left-[15px] top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-surface", i === n.log.length - 1 ? "bg-primary" : "bg-border")} />
                  <p className="text-[13px] font-medium text-foreground">{l.s}</p>
                  <p className="text-helper">{l.by} · {l.d}</p>
                  {l.note && <p className="text-[12.5px] text-muted-foreground mt-1 rounded bg-surface-muted/60 px-2.5 py-1.5">{l.note}</p>}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </Drawer>
  );
}

window.ApplicantsPage = ApplicantsPage;
window.NominationsPage = ApplicantsPage;
