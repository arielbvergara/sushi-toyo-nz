import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { createSession, adminAuth, invalidateExpiredSessions } from "./adminAuth";

function buildRes(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

function buildNext(): NextFunction {
  return vi.fn() as unknown as NextFunction;
}

describe("adminAuth middleware — createSession", () => {
  it("createSession_ShouldReturnUniqueHexToken_WhenCalled", () => {
    const token1 = createSession();
    const token2 = createSession();

    expect(token1).toMatch(/^[a-f0-9]{64}$/);
    expect(token2).toMatch(/^[a-f0-9]{64}$/);
    expect(token1).not.toBe(token2);
  });
});

describe("adminAuth middleware — adminAuth", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("adminAuth_ShouldCallNext_WhenTokenIsValid", () => {
    const token = createSession();
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as unknown as Request;
    const res = buildRes();
    const next = buildNext();

    adminAuth(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("adminAuth_ShouldReturn401_WhenAuthorizationHeaderIsMissing", () => {
    const req = { headers: {} } as unknown as Request;
    const res = buildRes();
    const next = buildNext();

    adminAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Unauthorized" });
  });

  it("adminAuth_ShouldReturn401_WhenTokenIsUnknown", () => {
    const req = {
      headers: { authorization: "Bearer not-a-real-token" },
    } as unknown as Request;
    const res = buildRes();
    const next = buildNext();

    adminAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Invalid or expired session" });
  });

  it("adminAuth_ShouldReturn401_WhenTokenHasExpired", () => {
    const token = createSession();

    // Advance time past the 24-hour TTL
    vi.advanceTimersByTime(25 * 60 * 60 * 1000);

    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as unknown as Request;
    const res = buildRes();
    const next = buildNext();

    adminAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Session expired" });
  });
});

describe("adminAuth middleware — invalidateExpiredSessions", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("invalidateExpiredSessions_ShouldRemoveExpiredTokens_WhenCalled", () => {
    const expiredToken = createSession();

    // Advance past TTL so the session expires
    vi.advanceTimersByTime(25 * 60 * 60 * 1000);
    invalidateExpiredSessions();

    // The expired token should no longer pass auth
    const req = {
      headers: { authorization: `Bearer ${expiredToken}` },
    } as unknown as Request;
    const res = buildRes();
    const next = buildNext();

    adminAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("invalidateExpiredSessions_ShouldPreserveActiveSessions_WhenCalled", () => {
    const activeToken = createSession();

    invalidateExpiredSessions();

    const req = {
      headers: { authorization: `Bearer ${activeToken}` },
    } as unknown as Request;
    const res = buildRes();
    const next = buildNext();

    adminAuth(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });
});
