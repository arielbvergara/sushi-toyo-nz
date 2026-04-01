import { v2 as cloudinary } from "cloudinary";
import { config } from "../config";
import { CloudinaryImage } from "../types";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

export class CloudinaryService {
  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  }

  async listImages(): Promise<CloudinaryImage[]> {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: config.cloudinary.folder,
      max_results: 500,
      resource_type: "image",
    });

    return result.resources.map((resource: Record<string, unknown>) => ({
      publicId: resource.public_id as string,
      url: resource.url as string,
      secureUrl: resource.secure_url as string,
      format: resource.format as string,
      width: resource.width as number,
      height: resource.height as number,
      createdAt: resource.created_at as string,
    }));
  }
}
