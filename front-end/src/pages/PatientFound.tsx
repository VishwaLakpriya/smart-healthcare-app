import { H1, Panel, Button } from "../components/ui";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useEffect, useMemo, useState } from "react";

/** Radio-like select icon (used only for TODAY) */
function SelectIcon({ selected }: { selected: boolean }) {
  return (
    <span
      className={`inline-grid place-items-center w-8 h-8 rounded-full border-2 ${
        selected ? "border-[#1E6E8D] bg-[#1E6E8D]" : "border-slate-400 bg-white"
      }`}
      aria-pressed={selected}
      aria-label={selected ? "Selected" : "Not selected"}
    >
      {selected ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.071 7.071a1 1 0 01-1.414 0L3.293 9.95a1 1 0 111.414-1.414l3.121 3.121 6.364-6.364a1 1 0 011.415 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <span className="h-3 w-3 rounded-full bg-transparent" />
      )}
    </span>
  );
}

type Appt = {
  _id: string;
  time: string;
  department: string;
  doctor?: string;
  hospital?: string;
  status: "Scheduled" | "Arrived" | "Cancelled";
};

type FilterKey = "today" | "past" | "pending";

export default function PatientFound() {
  const nav = useNavigate();
  const { state } = useLocation() as any;
  const patient = state?.patient;
  const elig = state?.elig;

  const [allAppts, setAllAppts] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("today");

  // Fetch all appointments for the patient
  useEffect(() => {
    if (!patient?._id) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/appointments/patient/${patient._id}`);
        setAllAppts(data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [patient?._id]);

  // Compute start/end of today once
  const startOfToday = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const endOfToday   = useMemo(() => { const d = new Date(); d.setHours(23,59,59,999); return d; }, []);

  // Group: Past / Today / Pending
  const groups = useMemo(() => {
    const past: Appt[] = [], today: Appt[] = [], pending: Appt[] = [];
    for (const a of allAppts) {
      const at = new Date(a.time);
      if (at < startOfToday) past.push(a);
      else if (at > endOfToday) pending.push(a);
      else today.push(a);
    }
    return { past, today, pending };
  }, [allAppts, startOfToday, endOfToday]);

  // Counts for tabs
  const counts = {
    today: groups.today.length,
    past: groups.past.length,
    pending: groups.pending.length
  };

  // Which list to show based on filter
  const items =
    filter === "today" ? groups.today :
    filter === "past" ? groups.past :
    groups.pending;

  // Toggle behavior: clicking selected Today row unselects it
  function onRowClick(id: string, selectable: boolean) {
    if (!selectable) return;
    setSelectedApptId(prev => (prev === id ? null : id));
  }

  async function confirm() {
    if (!selectedApptId) return; // confirm only when selected
    const appt = groups.today.find(a => a._id === selectedApptId);
    if (!appt) return; // safety: only Today appts are valid
    const department = appt.department || "General";

    const { data } = await api.post(`/checkin`, {
      patientId: patient._id,
      appointmentId: appt._id,
      department
    });
    nav("/checkin/confirmed", { state: { patient, appt, elig, checkin: data } });
  }

  if (!patient) return <div className="text-slate-600">No patient in state — go back.</div>;

  return (
    <>
      <H1>Patient Found</H1>

      {/* Header cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Panel className="p-6 xl:col-span-2">
          <div className="text-xl font-semibold text-[#1A6C8C] mb-2">Medical Alerts</div>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-300 grid place-items-center text-white text-xl font-bold">
              {patient.name?.split(" ").map((n:string)=>n[0]).join("")}
            </div>
            <div>
              <div className="text-slate-500 font-semibold">{patient.name}</div>
              <div className="text-slate-500">Age : {patient.age ?? "xx"} &nbsp;|&nbsp; ID : {patient.card?.id || patient._id}</div>
              <div className="mt-3 space-x-2">
                {(patient.alerts || []).map((a:string) => (
                  <span key={a} className="inline-block bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm">{a}</span>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="text-xl font-semibold text-[#1A6C8C] mb-2">Insurance Status</div>
          <span className="inline-block bg-emerald-100 text-emerald-700 rounded-full px-4 py-1">
            {elig?.tag} {elig?.detail ? `- ${elig.detail}` : ""}
          </span>
        </Panel>
      </div>

      {/* Filter tabs with counts */}
      <div className="mt-8">
        <div className="inline-flex bg-white rounded-xl border border-[#C7D6D0] overflow-hidden">
          {(["today","past","pending"] as FilterKey[]).map(key => {
            const active = filter === key;
            const label = key === "today" ? "Today" : key === "past" ? "Past" : "Pending";
            const count = counts[key];
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold capitalize transition
                            ${active ? "bg-[#1E6E8D] text-white" : "text-[#1E6E8D] hover:bg-[#E6F2F7]"}`}
                aria-pressed={active}
              >
                <span>{label}</span>
                <span className={`min-w-6 h-6 inline-grid place-items-center rounded-full text-xs px-2
                                  ${active ? "bg-white/20 text-white" : "bg-[#E6F2F7] text-[#1E6E8D]"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Appointments list */}
      <div className="mt-4">
        <Panel className="p-0">
          {loading ? (
            <div className="p-6 text-slate-500">Loading…</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-slate-500">No appointments</div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              <ul role="list" className="divide-y divide-[#C7D6DF]">
                <li className="sticky top-0 z-10 bg-[#E6F2F7] text-[#1A6C8C] grid grid-cols-[56px_1fr_auto] items-center px-6 py-3 text-sm font-semibold">
                  <span className="sr-only">Select</span>
                  <span >Department / Doctor</span>
                  <span className="text-right pr-2">Time</span>
                </li>

                {items.map((a) => {
                  const time = new Date(a.time).toLocaleString([], { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" });
                  const selectable = filter === "today";
                  const isSelected = selectable && selectedApptId === a._id;
                  return (
                    <li
                      key={a._id}
                      className={`grid grid-cols-[56px_1fr_auto] items-center px-6 py-4 ${
                        selectable ? "cursor-pointer hover:bg-slate-50" : "bg-white opacity-90"
                      } ${isSelected ? "bg-[#E6F2F7] ring-2 ring-[#1E6E8D]" : ""}`}
                      onClick={() => onRowClick(a._id, selectable)}
                    >
                      <div className="flex items-center justify-center">
                        {selectable ? <SelectIcon selected={isSelected} /> : <span className="w-8 h-8 rounded-full border-2 border-transparent" />}
                      </div>
                      <div>
                        <div className="text-[#1A6C8C] font-semibold">{a.department}</div>
                        <div className="text-slate-600 text-sm">{a.doctor || "-"}</div>
                        {!selectable && <div className="mt-1 text-xs text-slate-500">Read-only</div>}
                      </div>
                      <div className="text-right text-slate-700 pr-2">{time}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </Panel>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Button
          onClick={confirm}
          className="w-56 h-16 text-2xl"
          disabled={!selectedApptId}  // only enabled when something is selected
        >
          Confirm
        </Button>
        <Button
          variant="outline"
          onClick={() => nav(-1)}
          className="w-56 h-16 text-2xl"
        >
          Back
        </Button>
      </div>
    </>
  );
}
