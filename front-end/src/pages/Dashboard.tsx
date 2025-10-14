import { useNavigate, Link } from "react-router-dom";
import { Panel, Button } from "../components/ui";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Kpis = { apiOk: boolean; todaysAppts: number; arrived: number; waiting: number; avgWaitMin: number };

export default function Dashboard() {
  const nav = useNavigate();
  const [kpis, setKpis] = useState<Kpis>({ apiOk: false, todaysAppts: 0, arrived: 0, waiting: 0, avgWaitMin: 0 });

  // Lightweight health ping (works with your current backend)
  useEffect(() => {
    api.get("/health").then(() => setKpis((k) => ({ ...k, apiOk: true }))).catch(() => setKpis((k) => ({ ...k, apiOk: false })));
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-[48px] font-extrabold text-[#1A6C8C]">Dashboard</h1>

      {/* KPI cards (numbers are placeholders you can wire later) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard label="API Status" value={kpis.apiOk ? "Online" : "Offline"} badgeColor={kpis.apiOk ? "bg-emerald-600" : "bg-rose-600"} />
        <KpiCard label="Today’s Appointments" value={String(kpis.todaysAppts || 1)} />
        <KpiCard label="Arrived" value={String(kpis.arrived || 0)} />
        <KpiCard label="Avg Wait (min)" value={String(kpis.avgWaitMin || 10)} />
      </div>

      {/* Quick actions */}
      <Panel className="p-6">
        <div className="text-xl font-semibold mb-4 text-[#1A6C8C]">Quick Actions</div>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <Button className="h-16" onClick={() => nav("/checkin/start")}>Open Check-in</Button>
          <Button variant="outline" className="h-16" onClick={() => nav("/checkin/lookup")}>Manual Lookup</Button>
          <Button variant="outline" className="h-16" onClick={() => nav("/appointment")}>New Appointment</Button>
          <Button variant="outline" className="h-16" onClick={() => nav("/reports")}>Open Reports</Button>
        </div>
      </Panel>

      {/* Navigation tiles */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <SectionCard
          title="Profile"
          description="View or update patient profile details."
          to="/profile"
        />
        <SectionCard
          title="Appointment"
          description="Search slots, book, reschedule, or cancel."
          to="/appointment"
        />
        <SectionCard
          title="Check-in"
          description="Scan card or lookup and record arrival."
          to="/checkin/start"
        />
        <SectionCard
          title="Reports"
          description="Run utilization and arrival reports."
          to="/reports"
          className="xl:col-span-2"
        />
      </div>
    </div>
  );
}

function KpiCard({ label, value, badgeColor = "bg-[#1E6E8D]" }: { label: string; value: string; badgeColor?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#C7D6DF] p-6">
      <div className="text-sm text-slate-500">{label}</div>
      <div className={`inline-block mt-2 text-white text-2xl font-bold px-4 py-1 rounded-lg ${badgeColor}`}>{value}</div>
    </div>
  );
}

function SectionCard({ title, description, to, className="" }: { title: string; description: string; to: string; className?: string }) {
  return (
    <Panel className={`p-6 hover:shadow-md transition ${className}`}>
      <div className="text-2xl font-bold text-[#1A6C8C]">{title}</div>
      <p className="text-slate-600 mt-2">{description}</p>
      <Link to={to} className="inline-block mt-4 text-[#1E6E8D] font-semibold hover:underline">Go →</Link>
    </Panel>
  );
}
