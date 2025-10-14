import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import User from "../models/User";
import { requireAuth, signJwt } from "../middleware/auth";

const r = Router();

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().toLowerCase(),
  password: z.string()
    .min(8)
    .max(64)
    .regex(/[A-Z]/, "Must include uppercase")
    .regex(/[a-z]/, "Must include lowercase")
    .regex(/[0-9]/, "Must include a digit")
    .regex(/[^A-Za-z0-9]/, "Must include a special character"),
  role: z.enum(["admin", "clerk"]).optional()
});

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1)
});

// Helper to set cookie consistently
function setAuthCookie(res: any, token: string) {
  const secure = String(process.env.COOKIE_SECURE) === "true";
  res.cookie("access_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    // cookie lifetime tied to token's exp; you can also set maxAge
  });
}

// POST /api/auth/register
r.post("/register", async (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "VALIDATION", details: parse.error.flatten() });

  const { name, email, password, role } = parse.data;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: "EMAIL_IN_USE" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role: role || "clerk" });

  const token = signJwt({ uid: user._id.toString(), role: user.role, name: user.name, email: user.email }, process.env.JWT_EXPIRES || "1h");
  setAuthCookie(res, token);

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

// POST /api/auth/login
r.post("/login", async (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "VALIDATION", details: parse.error.flatten() });

  const { email, password } = parse.data;
  const user = await User.findOne({ email });
  if (!user || !user.isActive) return res.status(401).json({ error: "INVALID_CREDENTIALS" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "INVALID_CREDENTIALS" });

  const token = signJwt({ uid: user._id.toString(), role: user.role, name: user.name, email: user.email }, process.env.JWT_EXPIRES || "1h");
  setAuthCookie(res, token);

  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

// GET /api/auth/me
r.get("/me", requireAuth, async (req, res) => {
  const u = (req as any).user;
  res.json({ user: u });
});

// POST /api/auth/logout
r.post("/logout", (_req, res) => {
  res.clearCookie("access_token", { httpOnly: true, sameSite: "lax", secure: String(process.env.COOKIE_SECURE) === "true" });
  res.json({ ok: true });
});

export default r;
