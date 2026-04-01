import { Request, Response } from "express";
import { config } from "../config";
import { createSession, invalidateExpiredSessions } from "../middleware/adminAuth";
import { CloudinaryService } from "../services/cloudinaryService";
import { ApiResponse, CloudinaryImage } from "../types";

export async function authenticate(
  req: Request,
  res: Response<ApiResponse<{ token: string }>>
): Promise<void> {
  const { password } = req.body as { password?: string };

  if (!password || typeof password !== "string") {
    res.status(400).json({ success: false, error: "Password is required" });
    return;
  }

  if (!config.admin.password) {
    console.error("ADMIN_PASSWORD environment variable is not configured");
    res.status(503).json({ success: false, error: "Admin access is not configured" });
    return;
  }

  if (password !== config.admin.password) {
    res.status(401).json({ success: false, error: "Invalid password" });
    return;
  }

  invalidateExpiredSessions();
  const token = createSession();

  res.status(200).json({ success: true, data: { token } });
}

export async function deleteImage(
  req: Request,
  res: Response<ApiResponse>
): Promise<void> {
  const publicId = req.params.publicId as string;

  if (!publicId) {
    res.status(400).json({ success: false, error: "publicId is required" });
    return;
  }

  // Restrict deletions to the configured folder to prevent IDOR attacks
  if (!publicId.startsWith(`${config.cloudinary.folder}/`)) {
    res.status(403).json({ success: false, error: "Cannot delete images outside the configured folder" });
    return;
  }

  try {
    const cloudinaryService = new CloudinaryService();
    await cloudinaryService.deleteImage(publicId);
    res.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cloudinary deleteImage error:", message);
    res.status(500).json({ success: false, error: "Failed to delete image" });
  }
}

export async function listImages(
  _req: Request,
  res: Response<ApiResponse<CloudinaryImage[]>>
): Promise<void> {
  try {
    const cloudinaryService = new CloudinaryService();
    const images = await cloudinaryService.listImages();
    res.json({ success: true, data: images });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cloudinary listImages error:", message);
    res.status(500).json({ success: false, error: "Failed to fetch images" });
  }
}
