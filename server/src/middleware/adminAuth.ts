import { Request, Response, NextFunction } from "express";
import { randomBytes } from "crypto";
import { AdminSession } from "../types";

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// In-memory session store: token → session metadata
const sessions = new Map<string, AdminSession>();

export function createSession(): string {
  const token = randomBytes(32).toString("hex");
  const session: AdminSession = {
    token,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  sessions.set(token, session);
  return token;
}

export function invalidateExpiredSessions(): void {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt <= now) {
      sessions.delete(token);
    }
  }
}

export function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  const token = authHeader.slice(7);
  const session = sessions.get(token);

  if (!session) {
    res.status(401).json({ success: false, error: "Invalid or expired session" });
    return;
  }

  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    res.status(401).json({ success: false, error: "Session expired" });
    return;
  }

  next();
}
