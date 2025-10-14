import { H1, Panel, Button } from "../components/ui";
import { useState } from "react";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function ManualLookup() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function search() {
    setLoading(true);
    try {
      const { data } = await api.get(`/patients`, { params: { q } });
      setRows(data);
      setSelectedId(null);
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(id: string) {
    // single-select behavior (checkbox UI, radio logic)
    setSelectedId((prev) => (prev === id ? null : id));
  }

  async function proceed() {
    if (!selectedId) return;
    const patient = rows.find((r) => r._id === selectedId);
    if (!patient) return;

    setLoading(true);
    try {
      const [{ data: appts }, { data: elig }] = await Promise.all([
        api.get(`/appointments/today/${patient._id}`),
        api.get(`/eligibility`)
      ]);
      nav("/checkin/found", { state: { patient, appts, elig } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <H1>Check In / Manual Lookup</H1>

      <div className="max-w-5xl">
        {/* Search */}
        <label className="block font-semibold text-[#1A6C8C] mb-2">NIC / Phone No :</label>
        <div className="flex gap-3">
          <input
            className="flex-1 h-12 rounded-xl border px-4 bg-white text-black placeholder-slate-400"
            placeholder="9XXXXXXXXV or 011 234 5678"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button onClick={search} className="px-10 h-12 flex items-center" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        {/* Results */}
        <div className="mt-8">
          <div className="font-semibold text-[#1A6C8C] mb-3">Results :</div>
          <Panel className="p-0 overflow-hidden">
            {rows.length === 0 ? (
              <div className="p-10 text-slate-500">{loading ? "Loading..." : "No results yet"}</div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <ul role="list" className="divide-y divide-[#C7D6DF]">
                  {/* Sticky header */}
                  <li className="sticky top-0 z-10 bg-[#7FAFC4] text-white grid grid-cols-[56px_1fr_auto] items-center px-6 py-4">
                    <span className="sr-only">Select</span>
                    <span className="font-medium">Name</span>
                    <span className="font-medium text-right pr-2">NIC</span>
                  </li>

                  {rows.map((r) => {
                    const checked = selectedId === r._id;
                    return (
                      <li
                        key={r._id}
                        className={`grid grid-cols-[56px_1fr_auto] items-center px-6 py-4 cursor-pointer
                                    ${checked ? "bg-[#E6F2F7] ring-2 ring-[#1E6E8D]" : "bg-white hover:bg-slate-50"}`}
                        onClick={() => toggleSelect(r._id)}
                      >
                        {/* Checkbox */}
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSelect(r._id)}
                            className="h-5 w-5 accent-[#1E6E8D] cursor-pointer"
                            aria-label={`Select ${r.name}`}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        {/* Name */}
                        <span className="font-medium text-[#1A6C8C]">{r.name}</span>

                        {/* NIC */}
                        <span className="text-right text-slate-700 pr-2">{r.nic || "-"}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </Panel>
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex gap-4">
          <Button variant="outline" onClick={() => nav(-1)} className="w-48 h-14 text-xl  items-center justify-center">
            Back
          </Button>
          {/* Black text requested explicitly */}
          <button
            onClick={proceed}
            disabled={!selectedId || loading}
            className={`w-48 h-14 text-xl font-semibold rounded-xl border-2 px-6
                        ${selectedId && !loading
                          ? "border-[#1E6E8D] bg-white text-[#1A6C8C] hover:bg-[#E6F2F7]"
                          : "border-slate-300 bg-slate-100 text-black/50 cursor-not-allowed"}`}
          >
            Select
          </button>
        </div>
      </div>
    </>
  );
}
