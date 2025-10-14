import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type JwtPayload = { uid: string; role: string; name: string; email: string };

export function signJwt(payload: JwtPayload, expiresIn: string) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.access_token;
    if (!token) return res.status(401).json({ error: "UNAUTHORIZED" });
    const decoded = verifyJwt(token);
    (req as any).user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtPayload | undefined;
    if (!user) return res.status(401).json({ error: "UNAUTHORIZED" });
    if (!roles.includes(user.role)) return res.status(403).json({ error: "FORBIDDEN" });
    next();
  };
}
