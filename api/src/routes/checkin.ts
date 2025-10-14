import { Router } from "express";
import Encounter from "../models/Encounter";
import Appointment from "../models/Appointment";
import { issueToken } from "../services/queue";
const r = Router();

r.post("/", async (req, res) => {
  const { patientId, appointmentId, department } = req.body;
  const dept = department || "General";
  const token = await issueToken(dept);

  // create encounter
  const enc = await Encounter.create({
    patientId, appointmentId: appointmentId || null, department: dept, token
  });

  // mark appointment arrived (if present)
  if (appointmentId) {
    await Appointment.findByIdAndUpdate(appointmentId, { status: "Arrived" });
  }

  res.json({ encounter: enc, token });
});

export default r;
