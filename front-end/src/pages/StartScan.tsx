import { H1, Panel, Button } from "../components/ui";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useState } from "react";

export default function StartScan() {
  const nav = useNavigate();
  const [cardId, setCardId] = useState("");

  async function simulateScan() {
    try {
      const { data: patient } = await api.get(`/patients/by-card/${cardId || "CARD-10494"}`);
      const { data: appts } = await api.get(`/appointments/today/${patient._id}`);
      const { data: elig } = await api.get(`/eligibility`);
      nav("/checkin/found", { state: { patient, appts, elig } });
    } catch {
      nav("/checkin/lookup");
    }
  }

  return (
    <>
      <H1>Check In</H1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="space-y-6">
          <Button onClick={simulateScan} className="w-[360px] h-[72px] text-2xl">Scan Card</Button>
          <Button variant="outline" onClick={() => nav("/checkin/lookup")} className="w-[360px] h-[72px] text-2xl">Manual Lookup</Button>

          {/* Dev helper to type a card id */}
          <div className="text-sm text-slate-600">
            Developer helper — Card ID:
            <input className="ml-2 border rounded px-2 py-1" value={cardId} onChange={e => setCardId(e.target.value)} placeholder="CARD-10492" />
          </div>
        </div>

        <Panel className="p-8">
          <div className="border-4 border-dashed border-[#1E6E8D] rounded-3xl aspect-[4/3] grid place-items-center">
            <div className="w-72 h-44 rounded-2xl bg-slate-300 grid place-items-center text-white text-2xl">📷</div>
          </div>
          <p className="text-center mt-6 text-slate-600">Align your card with frame.</p>
          <p className="text-center text-slate-500 mt-2">Waiting for scan…</p>
        </Panel>
      </div>
    </>
  );
}
