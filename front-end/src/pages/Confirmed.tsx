import { H1, Panel, Button } from "../components/ui";
import { useLocation, useNavigate } from "react-router-dom";

export default function Confirmed() {
  const nav = useNavigate();
  const { state } = useLocation() as any;

  // from PatientFound -> nav("/checkin/confirmed", { state: { patient, appt, elig, checkin } })
  const appt = state?.appt;                        // preferred source for doctor/department
  const token: string | undefined = state?.checkin?.token;
  const encounter = state?.checkin?.encounter;

  // Robust fallbacks in case appt is missing
  const department = appt?.department || encounter?.department || "—";
  const doctor = appt?.doctor || "—";

  function onPrint() {
    window.print();
  }
  function onSave() {
    const text = [
      `Token: ${token ?? "-"}`,
      `Department: ${department}`,
      `Doctor: ${doctor}`,
      `Encounter: ${encounter?._id ?? "-"}`,
      `Status: ${encounter?.status ?? "-"}`
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `token-${token || "unknown"}.txt`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <H1>Check-in Confirmed</H1>

      <Panel className="p-6 space-y-6">
        {/* Status strip */}
        <div className="text-center">
          <div className="text-2xl font-semibold">Check-in Successful</div>
          <div className="text-slate-600 mt-1">
            Encounter : {encounter?._id?.slice(-6) ?? "—"} &nbsp; | &nbsp; Status : {encounter?.status ?? "—"}
          </div>
        </div>

        {/* Appointment context linked to token */}
        <div className="grid gap-4 text-center">
          <div className="text-lg text-slate-700">
            <span className="font-semibold text-[#1A6C8C]">Department:</span> {department}
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <span className="font-semibold text-[#1A6C8C]">Doctor:</span> {doctor}
          </div>

          {/* Token card */}
          <div className="grid place-items-center">
            <div className="bg-[#1E6E8D] text-white rounded-2xl px-16 py-10 shadow">
              <div className="text-sm text-white/80 text-center mb-1">Queue Token</div>
              <div className="text-5xl font-extrabold tracking-widest text-center">{token ?? "—"}</div>
              <div className="text-white/80 text-center mt-2">Estimated wait ~ 10 min</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={onPrint} className="w-56 h-14 text-xl">Print Token</Button>
          <Button variant="outline" onClick={onSave} className="w-40 h-14 text-xl">Save</Button>
          <Button onClick={() => nav("/checkin/start")} className="w-40 h-14 text-xl">Back</Button>
        </div>
      </Panel>
    </>
  );
}
