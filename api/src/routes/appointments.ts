import { Router } from "express";
import Appointment from "../models/Appointment";
const r = Router();

r.post("/", async (req, res) => {
  const a = await Appointment.create(req.body);
  res.status(201).json(a);
});

r.get("/today/:patientId", async (req, res) => {
  const start = new Date(); start.setHours(0,0,0,0);
  const end = new Date(); end.setHours(23,59,59,999);
  const rows = await Appointment.find({
    patientId: req.params.patientId,
    time: { $gte: start, $lte: end },
    status: { $ne: "Cancelled" }
  }).sort({ time: 1 });
  res.json(rows);
});

r.get("/patient/:patientId", async (req, res) => {
  const rows = await Appointment.find({
    patientId: req.params.patientId,
    status: { $ne: "Cancelled" }
  }).sort({ time: 1 });
  res.json(rows);
});
export default r;
