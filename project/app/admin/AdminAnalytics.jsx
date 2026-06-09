// ── Analytics: logins, engagement funnel, donation & nomination trends ──
function AnalyticsPage() {
  const toast = useToast();
  const [range, setRange] = React.useState("90");
  const [loginTab, setLoginTab] = React.useState("week");
  const [donTab, setDonTab] = React.useState("month");
  const [nomTab, setNomTab] = React.useState("month");
  const [donTeam, setDonTeam] = React.useState("All");
  const [nomTeam, setNomTeam] = React.useState("All");

  const A = ANALYTICS;
  const donConv = Math.round((A.donate.actual / A.donate.clicks) * 100);
  const nomConv = Math.round((A.nominate.actual / A.nominate.clicks) * 100);
  const partPct = Math.round((A.participation.donors / A.participation.total) * 100);
  const loginData = loginTab === "month" ? A.loginsByMonth : A.loginsByWeek;

  // team shares — used to slice the overall trend by team
  const donTotal = LB_DONATIONS.reduce((s, t) => s + t.total, 0);
  const donShare = Object.fromEntries(LB_DONATIONS.map(t => [t.team, t.total / donTotal]));
  const nomTotal = LB_NOMINATIONS.reduce((s, t) => s + t.submitted, 0);
  const nomShare = Object.fromEntries(LB_NOMINATIONS.map(t => [t.team, t.submitted / nomTotal]));
  const TEAMS = LB_DONATIONS.map(t => t.team);
  const teamOpts = ["All", ...TEAMS];
  const sliceByTeam = (data, team, share) => team === "All" ? data : data.map(d => ({ ...d, value: Math.round(d.value * share[team]) }));

  const donData = sliceByTeam(donTab === "month" ? A.donationsByMonth : A.donationsByWeek, donTeam, donShare);
  const nomData = sliceByTeam(nomTab === "month" ? A.nominationsByMonth : A.nominationsByWeek, nomTeam, nomShare);

  const downloadReport = () => {
    const totalRaised = A.donationsByMonth.reduce((s, d) => s + d.value, 0);
    const totalNoms = A.nominationsByMonth.reduce((s, d) => s + d.value, 0);
    const totalLogins = A.loginsByMonth.reduce((s, d) => s + d.value, 0);
    const nonDonors = A.participation.total - A.participation.donors;
    const esc = (s) => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
    const rows = (arr, fmt) => arr.map(d => `<tr><td>${esc(d.label || d.team || d.name)}</td><td class="num">${fmt(d.value != null ? d.value : d)}</td></tr>`).join("");
    const inr = (n) => "₹" + n.toLocaleString("en-IN");
    const num = (n) => n.toLocaleString("en-IN");
    const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Analytics report — ${esc(PROGRAMS[0].name)}</title>
<style>
  @page { margin: 18mm; }
  * { box-sizing: border-box; }
  body { font-family: Inter, system-ui, sans-serif; color: #1c1917; margin: 0; font-size: 12px; line-height: 1.5; }
  h1 { font-size: 22px; margin: 0 0 2px; letter-spacing: -0.01em; }
  .sub { color: #78716c; font-size: 12.5px; margin: 0 0 24px; }
  .eyebrow { text-transform: uppercase; letter-spacing: 0.1em; font-size: 10px; font-weight: 600; color: #a8573a; margin: 28px 0 8px; }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 8px; }
  .kpi { border: 1px solid #e7e5e4; border-radius: 10px; padding: 14px; }
  .kpi .v { font-size: 20px; font-weight: 600; }
  .kpi .l { color: #78716c; font-size: 11px; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
  th, td { text-align: left; padding: 6px 10px; border-bottom: 1px solid #ececec; font-size: 12px; }
  th { color: #78716c; font-weight: 600; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
  .foot { margin-top: 36px; color: #a8a29e; font-size: 10.5px; border-top: 1px solid #ececec; padding-top: 10px; }
</style></head><body>
  <h1>Analytics report</h1>
  <p class="sub">${esc(PROGRAMS[0].name)} · ${esc(PROGRAMS[0].org)} — generated ${today}</p>

  <div class="kpis">
    <div class="kpi"><div class="v">${num(A.donate.clicks)}</div><div class="l">Donate clicks</div></div>
    <div class="kpi"><div class="v">${num(A.donate.actual)}</div><div class="l">Employees donating (${donConv}%)</div></div>
    <div class="kpi"><div class="v">${num(A.nominate.clicks)}</div><div class="l">Nominate clicks</div></div>
    <div class="kpi"><div class="v">${num(A.nominate.actual)}</div><div class="l">Employees nominating (${nomConv}%)</div></div>
  </div>

  <div class="eyebrow">Summary</div>
  <table>
    <tr><td>Total raised</td><td class="num">${inr(totalRaised)}</td></tr>
    <tr><td>Total nominations</td><td class="num">${num(totalNoms)}</td></tr>
    <tr><td>Total logins</td><td class="num">${num(totalLogins)}</td></tr>
    <tr><td>Participation</td><td class="num">${num(A.participation.donors)} of ${num(A.participation.total)} (${partPct}%)</td></tr>
  </table>

  <div class="grid2">
    <div>
      <div class="eyebrow">Logins by month</div>
      <table><thead><tr><th>Month</th><th class="num">Logins</th></tr></thead><tbody>${rows(A.loginsByMonth, num)}</tbody></table>
    </div>
    <div>
      <div class="eyebrow">Donors by giving mode</div>
      <table><thead><tr><th>Mode</th><th class="num">Employees</th></tr></thead><tbody>
        ${rows(A.donationTypes, num)}<tr><td>Non-donors</td><td class="num">${num(nonDonors)}</td></tr>
      </tbody></table>
    </div>
    <div>
      <div class="eyebrow">Giving trend by month</div>
      <table><thead><tr><th>Month</th><th class="num">Raised</th></tr></thead><tbody>${rows(A.donationsByMonth, inr)}</tbody></table>
    </div>
    <div>
      <div class="eyebrow">Nomination trend by month</div>
      <table><thead><tr><th>Month</th><th class="num">Nominations</th></tr></thead><tbody>${rows(A.nominationsByMonth, num)}</tbody></table>
    </div>
    <div>
      <div class="eyebrow">Donation leaderboard</div>
      <table><thead><tr><th>Team</th><th class="num">Participation</th></tr></thead><tbody>
        ${LB_DONATIONS.map(t => `<tr><td>${esc(t.team)}</td><td class="num">${t.participation}%</td></tr>`).join("")}
      </tbody></table>
    </div>
    <div>
      <div class="eyebrow">Nomination leaderboard</div>
      <table><thead><tr><th>Team</th><th class="num">Submitted</th></tr></thead><tbody>
        ${LB_NOMINATIONS.map(t => `<tr><td>${esc(t.team)}</td><td class="num">${num(t.submitted)}</td></tr>`).join("")}
      </tbody></table>
    </div>
  </div>

  <p class="foot">Powered by Buddy4Study · Confidential — for internal use only.</p>
  <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 250); };</script>
</body></html>`;
    const w = window.open("", "_blank");
    if (!w) { toast("Pop-up blocked", { sub: "Allow pop-ups to download the report.", icon: "info" }); return; }
    w.document.open(); w.document.write(html); w.document.close();
    toast("Report ready", { sub: "Save as PDF from the print dialog.", icon: "download" });
  };

  return (
    <>
      <AdminPageHead title="Analytics" subtitle="Logins, engagement funnel, and giving & nomination trends."
        actions={<>
          <Segmented options={[["30", "30d"], ["90", "90d"], ["all", "All time"]]} value={range} onChange={setRange} />
          <Button variant="outline" onClick={downloadReport}><Icon name="download" size={15} />Download report</Button>
        </>} />

      {/* engagement funnel — clicks vs actual actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon="mousePointer" tone="info" label="Donate clicks" value={A.donate.clicks.toLocaleString("en-IN")} sub="Button taps in range" />
        <KpiCard icon="heart" tone="primary" label="Employees donating" value={A.donate.actual.toLocaleString("en-IN")} sub={`${donConv}% of clicks converted`} />
        <KpiCard icon="mousePointer" tone="info" label="Nominate clicks" value={A.nominate.clicks.toLocaleString("en-IN")} sub="Button taps in range" />
        <KpiCard icon="userPlus" tone="warning" label="Employees nominating" value={A.nominate.actual.toLocaleString("en-IN")} sub={`${nomConv}% of clicks converted`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* logins */}
        <Card className="p-6">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div><Eyebrow>Logins</Eyebrow><h2 className="text-section-title mt-1">Employee logins over time</h2></div>
            <Segmented size="sm" options={[["week", "Weekly"], ["month", "Monthly"]]} value={loginTab} onChange={setLoginTab} />
          </div>
          <LineChart data={loginData} valueFmt={(v) => v.toLocaleString("en-IN")} />
          <p className="text-helper mt-2">Total logins in range · {loginData.reduce((s, d) => s + d.value, 0).toLocaleString("en-IN")} · {loginTab === "month" ? "by month" : "by week"}</p>
        </Card>

        {/* donation trend */}
        <Card className="p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div><Eyebrow>Donations over time</Eyebrow><h2 className="text-section-title mt-1">Giving trend</h2></div>
            <Segmented size="sm" options={[["week", "Weekly"], ["month", "Monthly"]]} value={donTab} onChange={setDonTab} />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="users" size={14} className="text-muted-foreground" />
            <NativeSelect value={donTeam} onChange={e => setDonTeam(e.target.value)} className="h-8 text-[12.5px] w-44 py-0">
              {teamOpts.map(t => <option key={t} value={t}>{t === "All" ? "All teams" : t}</option>)}
            </NativeSelect>
          </div>
          <LineChart data={donData} valueFmt={(v) => formatLakh(v)} />
          <p className="text-helper mt-2">{donTeam === "All" ? "Total raised in range" : `${donTeam} · raised in range`} · {formatINR(donData.reduce((s, d) => s + d.value, 0))}</p>
        </Card>

        {/* nomination trend */}
        <Card className="p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div><Eyebrow>Nominations over time</Eyebrow><h2 className="text-section-title mt-1">Nomination trend</h2></div>
            <Segmented size="sm" options={[["week", "Weekly"], ["month", "Monthly"]]} value={nomTab} onChange={setNomTab} />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="users" size={14} className="text-muted-foreground" />
            <NativeSelect value={nomTeam} onChange={e => setNomTeam(e.target.value)} className="h-8 text-[12.5px] w-44 py-0">
              {teamOpts.map(t => <option key={t} value={t}>{t === "All" ? "All teams" : t}</option>)}
            </NativeSelect>
          </div>
          <LineChart data={nomData} valueFmt={(v) => v.toLocaleString("en-IN")} />
          <p className="text-helper mt-2">{nomTeam === "All" ? "Total nominations in range" : `${nomTeam} · nominations in range`} · {nomData.reduce((s, d) => s + d.value, 0).toLocaleString("en-IN")}</p>
        </Card>

        {/* donation mode split */}
        <Card className="p-6">
          <Eyebrow>How employees give</Eyebrow>
          <h2 className="text-section-title mt-1 mb-5">Donors by giving mode</h2>
          {(() => {
            const nonDonors = A.participation.total - A.participation.donors;
            const [oneTime, recurring, payroll] = A.donationTypes.map(d => d.value);
            return (
              <DonutChart size={172} centerLabel={A.participation.total.toLocaleString("en-IN")} centerSub="employees"
                segments={[
                  { label: "One-time", value: oneTime, color: CHART.primary, display: oneTime.toLocaleString("en-IN") },
                  { label: "Recurring", value: recurring, color: CHART.info, display: recurring.toLocaleString("en-IN") },
                  { label: "Payroll giving", value: payroll, color: CHART.success, display: payroll.toLocaleString("en-IN") },
                  { label: "Non-donors", value: nonDonors, color: CHART.track, display: nonDonors.toLocaleString("en-IN") },
                ]} />
            );
          })()}
        </Card>
      </div>
    </>
  );
}
window.AnalyticsPage = AnalyticsPage;
