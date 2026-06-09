// ── Scholar Tracker: card grid + detail page ──
function ScholarsPage({ page, go, scholarId, setScholarId }) {
  if (page === "scholar-detail") {
    const s = ADMIN_SCHOLARS.find(x => x.id === scholarId) || ADMIN_SCHOLARS[0];
    return <ScholarDetail s={s} go={go} />;
  }
  return (
    <>
      <AdminPageHead title="Scholars" subtitle={`${ADMIN_SCHOLARS.length} scholars currently funded across active programmes.`}
        actions={<Button variant="secondary" size="sm" onClick={() => {
          const rows = [["Name", "Institute", "Current class", "Type", "Nominated by", "Date of disbursement", "Disbursed amount"],
            ...ADMIN_SCHOLARS.map(s => [s.name, s.college, s.currentClass, s.source, s.nominatedBy || "-", s.nextDate, s.disbursed])];
          const csv = rows.map(r => r.map(v => /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v).join(",")).join("\n");
          const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
          const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "scholars.csv"; a.click(); URL.revokeObjectURL(url);
        }}><Icon name="download" size={14} />Export to Excel</Button>} />
      <Card className="p-0 overflow-hidden">
        <Table columns={[{ label: "Name" }, { label: "Institute" }, { label: "Current class" }, { label: "Type" }, { label: "Nominated by" }, { label: "Disbursement date" }, { label: "Disbursed", align: "right" }, { label: "", w: "w-10" }]}>
          {ADMIN_SCHOLARS.map(s => (
            <tr key={s.id} className="border-b border-border-soft last:border-0 hover:bg-surface-muted/40 transition-colors cursor-pointer" onClick={() => { setScholarId(s.id); go("scholar-detail"); }}>
              <Td><div className="flex items-center gap-2.5"><Avatar name={s.name} size={30} /><span className="font-medium">{s.name}</span></div></Td>
              <Td className="text-muted-foreground">{s.college}</Td>
              <Td className="text-muted-foreground">{s.currentClass}</Td>
              <Td><Badge tone={s.source === "Nominated" ? "info" : "muted"} className="whitespace-nowrap">{s.source}</Badge></Td>
              <Td className="text-muted-foreground">{s.nominatedBy || "—"}</Td>
              <Td className="text-muted-foreground whitespace-nowrap">{s.nextDate}</Td>
              <Td align="right" className="tabular-nums font-medium">{formatINR(s.disbursed)}</Td>
              <Td align="right"><Icon name="chevRight" size={16} className="text-muted-foreground" /></Td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  );
}

function ScholarDetail({ s, go }) {
  const pct = Math.round((s.disbursed / s.total) * 100);
  const initials = s.name.split(" ").map(w => w[0]).slice(0, 2).join("");
  return (
    <>
      <button onClick={() => go("scholars")} className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-4">
        <Icon name="arrowLeft" size={14} />Back to scholars
      </button>

      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-7">
        <Avatar name={s.name} size={64} />
        <div className="flex-1 min-w-0">
          <h1 className="text-[24px] font-semibold tracking-[-0.01em] text-foreground">{s.name}</h1>
          <p className="text-body text-muted-foreground mt-0.5">{s.course} · {s.college}</p>
        </div>
        <Badge tone={s.source === "Nominated" ? "info" : "foreground"} className="h-7 px-3 text-[12.5px]">{s.source}</Badge>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.15fr] gap-6 items-start">
        <div className="space-y-6">
          {/* scholar details */}
          <Card className="p-6">
            <Eyebrow className="mb-4">Scholar details</Eyebrow>
            <dl className="grid grid-cols-2 gap-x-5 gap-y-4">
              {[
                ["Programme", s.program],
                ["Institute", s.college],
                ["Course", s.course],
                ["Current class", s.currentClass],
                ["Source", s.source],
                ["Nominated by", s.nominatedBy || "—"],
                ["Total award", formatINR(s.total)],
                ["Disbursed so far", `${formatINR(s.disbursed)} · ${pct}%`],
                ["Next disbursement", s.nextDate],
              ].map(([k, v]) => (
                <div key={k} className={k === "Programme" || k === "Institute" ? "col-span-2" : ""}>
                  <dt className="text-helper">{k}</dt>
                  <dd className="text-[13.5px] font-medium text-foreground mt-0.5 leading-snug tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5">
              <Progress value={pct} height={8} />
              <p className="text-helper mt-1.5">{formatINR(s.disbursed)} disbursed of {formatINR(s.total)} total award</p>
            </div>
          </Card>

          {/* gratitude note */}
          <Card className="p-6">
            <Eyebrow className="mb-3">Gratitude note from {s.name.split(" ")[0]}</Eyebrow>
            {s.gratitude ? (
              <figure>
                <div className="relative rounded-xl bg-primary/[0.04] border border-primary/15 p-5">
                  <Icon name="quote" size={20} className="text-primary/40 mb-2" />
                  <blockquote className="text-[14.5px] text-foreground leading-relaxed">{s.gratitude}</blockquote>
                </div>
                <figcaption className="flex items-center gap-2.5 mt-3.5">
                  <Avatar name={s.name} size={32} />
                  <div><p className="text-[13px] font-medium text-foreground">{s.name}</p><p className="text-helper">Shared on {s.gratitudeDate}</p></div>
                </figcaption>
              </figure>
            ) : (
              <div className="rounded-lg border border-dashed border-border-soft p-6 text-center">
                <p className="text-[13px] text-muted-foreground">No note shared yet. Scholars are invited to write one after their first disbursement.</p>
              </div>
            )}
          </Card>
        </div>

        {/* media shared by the scholar */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Eyebrow>Media from {s.name.split(" ")[0]}</Eyebrow>
            {s.media.length > 0 && <span className="text-helper">{s.media.length} item{s.media.length === 1 ? "" : "s"}</span>}
          </div>
          {s.media.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {s.media.map((m, i) => (
                <figure key={i} className={cn("group rounded-xl overflow-hidden border border-border-soft", m.type === "video" && "col-span-2")}>
                  <div className={cn("relative flex items-center justify-center bg-surface-muted", m.type === "video" ? "aspect-[16/9]" : "aspect-square")}
                    style={{ backgroundColor: `hsl(var(--primary) / 0.06)` }}>
                    {m.type === "video" ? (
                      <>
                        <span className="h-14 w-14 rounded-full bg-surface/90 shadow-sm border border-border-soft flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                          <Icon name="play" size={22} className="ml-0.5" />
                        </span>
                        {m.duration && <span className="absolute bottom-2 right-2 text-[11px] font-medium text-background bg-foreground/70 rounded px-1.5 py-0.5 tabular-nums">{m.duration}</span>}
                        <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-primary bg-surface/90 rounded-full px-2 py-0.5"><Icon name="video" size={11} />Video</span>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-primary/55">
                        <Icon name="image" size={26} />
                        <span className="mt-1.5 text-[22px] font-semibold tracking-tight">{initials}</span>
                      </div>
                    )}
                  </div>
                  <figcaption className="px-3 py-2.5 bg-card">
                    <p className="text-[12.5px] font-medium text-foreground leading-tight">{m.label}</p>
                    {m.caption && <p className="text-helper mt-0.5">{m.caption}</p>}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border-soft p-8 text-center">
              <div className="h-11 w-11 rounded-full bg-surface-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground"><Icon name="image" size={18} /></div>
              <p className="text-[13px] font-medium text-foreground">No media yet</p>
              <p className="text-[12.5px] text-muted-foreground mt-1 max-w-[34ch] mx-auto">Photos and thank-you videos the scholar shares will appear here.</p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

window.ScholarsPage = ScholarsPage;
