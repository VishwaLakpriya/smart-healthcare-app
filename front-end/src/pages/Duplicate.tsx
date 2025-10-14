import { H1, Panel, Button } from "../components/ui";
import { useNavigate } from "react-router-dom";

export default function Duplicate() {
  const nav = useNavigate();
  return (
    <>
      <H1>Duplicate Check-in</H1>
      <Panel className="p-8">
        <div className="text-rose-700 font-semibold text-xl">Duplicate check-in blocked</div>
        <p className="text-slate-600 mt-2">An active encounter already exists for this patient today.</p>
        <div className="mt-8 flex gap-3">
          <Button variant="outline" onClick={()=>nav("/checkin/found")}>View Details</Button>
          <Button onClick={()=>nav("/checkin/start")}>Back to Start</Button>
        </div>
      </Panel>
    </>
  );
}
