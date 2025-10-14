import { Router } from "express";
import Patient from "../models/Patient";
const r = Router();

// Create a patient (simple)
r.post("/", async (req, res) => {
  const p = await Patient.create(req.body);
  res.status(201).json(p);
});

// Query by NIC/phone (for manual lookup)
r.get("/", async (req, res) => {
  const { q } = req.query as { q?: string };
  if (!q) return res.json([]);
  const rx = new RegExp(q, "i");
  const rows = await Patient.find({ $or: [{ nic: rx }, { phone: rx }] }).limit(10);
  res.json(rows);
});

// Lookup by card id (for kiosk scan)
r.get("/by-card/:cardId", async (req, res) => {
  const p = await Patient.findOne({ "card.id": req.params.cardId });
  if (!p) return res.status(404).json({ error: "NOT_FOUND" });
  res.json(p);
});

export default r;