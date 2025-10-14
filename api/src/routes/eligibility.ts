import { Router } from "express";
import { checkEligibility } from "../services/eligibility";
const r = Router();

r.get("/", async (_req, res) => {
  const e = await checkEligibility();
  res.json(e);
});

export default r;
