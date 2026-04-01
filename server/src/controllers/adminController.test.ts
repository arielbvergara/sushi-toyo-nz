import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

// ── Hoist mock refs ──────────────────────────────────────────────────────────
const mockListImages = vi.hoisted(() => vi.fn());
const mockDeleteImage = vi.hoisted(() => vi.fn());
const mockCreateSession = vi.hoisted(() => vi.fn());
const mockInvalidateExpiredSessions = vi.hoisted(() => vi.fn());

vi.mock("../services/cloudinaryService", () => ({
  CloudinaryService: vi.fn().mockImplementation(function (this: any) {
    this.listImages = mockListImages;
    this.deleteImage = mockDeleteImage;
  }),
}));

vi.mock("../middleware/adminAuth", () => ({
  createSession: mockCreateSession,
  invalidateExpiredSessions: mockInvalidateExpiredSessions,
}));

vi.mock("../config", () => ({
  config: {
    admin: { password: "test-secret" },
    cloudinary: { folder: "sushi-toyo-nz" },
  },
}));

import { authenticate, deleteImage, listImages } from "./adminController";

function buildRes(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

// ── authenticate ─────────────────────────────────────────────────────────────

describe("adminController — authenticate", () => {
  beforeEach(() => vi.clearAllMocks());

  it("authenticate_ShouldReturn200WithToken_WhenPasswordIsCorrect", async () => {
    mockCreateSession.mockReturnValueOnce("abc123token");

    const req = { body: { password: "test-secret" } } as Request;
    const res = buildRes();

    await authenticate(req, res);

    expect(mockInvalidateExpiredSessions).toHaveBeenCalledOnce();
    expect(mockCreateSession).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { token: "abc123token" } });
  });

  it("authenticate_ShouldReturn401_WhenPasswordIsWrong", async () => {
    const req = { body: { password: "wrong-password" } } as Request;
    const res = buildRes();

    await authenticate(req, res);

    expect(mockCreateSession).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Invalid password" });
  });

  it("authenticate_ShouldReturn400_WhenPasswordIsMissing", async () => {
    const req = { body: {} } as Request;
    const res = buildRes();

    await authenticate(req, res);

    expect(mockCreateSession).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Password is required" });
  });

  it("authenticate_ShouldReturn400_WhenPasswordIsNotAString", async () => {
    const req = { body: { password: 12345 } } as unknown as Request;
    const res = buildRes();

    await authenticate(req, res);

    expect(mockCreateSession).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Password is required" });
  });
});

// ── listImages ────────────────────────────────────────────────────────────────

describe("adminController — listImages", () => {
  beforeEach(() => vi.clearAllMocks());

  it("listImages_ShouldReturn200WithImages_WhenServiceSucceeds", async () => {
    const mockImages = [
      {
        publicId: "sushi-toyo-nz/photo1",
        url: "http://res.cloudinary.com/demo/image/upload/photo1.jpg",
        secureUrl: "https://res.cloudinary.com/demo/image/upload/photo1.jpg",
        format: "jpg",
        width: 800,
        height: 600,
        createdAt: "2026-01-01T00:00:00Z",
      },
    ];
    mockListImages.mockResolvedValueOnce(mockImages);

    const req = {} as Request;
    const res = buildRes();

    await listImages(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: mockImages });
  });

  it("listImages_ShouldReturn500_WhenServiceThrows", async () => {
    mockListImages.mockRejectedValueOnce(new Error("Cloudinary API error"));

    const req = {} as Request;
    const res = buildRes();

    await listImages(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Failed to fetch images" });
  });
});

// ── deleteImage ───────────────────────────────────────────────────────────────

describe("adminController — deleteImage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deleteImage_ShouldReturn200_WhenPublicIdIsValid", async () => {
    mockDeleteImage.mockResolvedValueOnce(undefined);

    const req = { params: { publicId: "sushi-toyo-nz/photo1" } } as unknown as Request;
    const res = buildRes();

    await deleteImage(req, res);

    expect(mockDeleteImage).toHaveBeenCalledWith("sushi-toyo-nz/photo1");
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it("deleteImage_ShouldReturn400_WhenPublicIdIsMissing", async () => {
    const req = { params: { publicId: "" } } as unknown as Request;
    const res = buildRes();

    await deleteImage(req, res);

    expect(mockDeleteImage).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "publicId is required" });
  });

  it("deleteImage_ShouldReturn403_WhenPublicIdIsOutsideConfiguredFolder", async () => {
    const req = { params: { publicId: "other-folder/photo1" } } as unknown as Request;
    const res = buildRes();

    await deleteImage(req, res);

    expect(mockDeleteImage).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Cannot delete images outside the configured folder",
    });
  });

  it("deleteImage_ShouldReturn500_WhenServiceThrows", async () => {
    mockDeleteImage.mockRejectedValueOnce(new Error("Cloudinary API error"));

    const req = { params: { publicId: "sushi-toyo-nz/photo1" } } as unknown as Request;
    const res = buildRes();

    await deleteImage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Failed to delete image" });
  });
});
