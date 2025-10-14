import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import patients from "./routes/patient";
import appointments from "./routes/appointments";
import checkin from "./routes/checkin";
import eligibility from "./routes/eligibility";
import auth from "./routes/auth";

const app = express();

app.use(cookieParser());
app.use(express.json());

// allow frontend origin to send cookies
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "smart-healthcare-api" }));

app.use("/api/auth", auth);
app.use("/api/patients", patients);
app.use("/api/appointments", appointments);
app.use("/api/checkin", checkin);
app.use("/api/eligibility", eligibility);

export default app;
