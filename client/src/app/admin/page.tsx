"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminAuth } from "@/components/ui/AdminAuth";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { api } from "@/lib/api";
import type { CloudinaryImage } from "@/types";

const ADMIN_TOKEN_SESSION_KEY = "admin_token";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Restore session from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_TOKEN_SESSION_KEY);
    if (stored) setToken(stored);
  }, []);

  const fetchImages = useCallback(
    async (sessionToken: string) => {
      setIsLoadingImages(true);
      setFetchError(null);

      try {
        const result = await api.admin.listImages(sessionToken);

        if (!result.success) {
          if (result.error === "Invalid or expired session" || result.error === "Session expired") {
            handleLogout();
            return;
          }
          setFetchError(result.error ?? "Failed to load images");
          return;
        }

        setImages(result.data ?? []);
      } catch {
        setFetchError("Unable to connect to the server.");
      } finally {
        setIsLoadingImages(false);
      }
    },
    []
  );

  useEffect(() => {
    if (token) fetchImages(token);
  }, [token, fetchImages]);

  function handleAuthenticated(newToken: string) {
    setToken(newToken);
  }

  function handleLogout() {
    sessionStorage.removeItem(ADMIN_TOKEN_SESSION_KEY);
    setToken(null);
    setImages([]);
  }

  function handleUploadComplete() {
    if (token) fetchImages(token);
  }

  async function handleDeleteImage(publicId: string) {
    if (!token) return;
    const result = await api.admin.deleteImage(token, publicId);
    if (!result.success) {
      if (result.error === "Invalid or expired session" || result.error === "Session expired") {
        handleLogout();
        return;
      }
      setFetchError(result.error ?? "Failed to delete image");
      return;
    }
    setImages((prev) => prev.filter((img) => img.publicId !== publicId));
  }

  if (!token) {
    return <AdminAuth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div
      className="min-h-screen px-6 py-12"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1
              className="text-3xl font-semibold tracking-widest uppercase"
              style={{
                color: "var(--foreground)",
                fontFamily: "var(--font-family-heading)",
              }}
            >
              Image Manager
            </h1>
            <p className="text-xs tracking-widest uppercase mt-1" style={{ color: "var(--muted)" }}>
              sushi-toyo-nz · Cloudinary
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ImageUploader onUploadComplete={handleUploadComplete} />

            <button
              type="button"
              onClick={handleLogout}
              className="px-6 py-3 text-xs font-semibold tracking-widest uppercase transition-colors duration-150"
              style={{
                backgroundColor: "transparent",
                border: "1px solid var(--border)",
                color: "var(--muted)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--error)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--error)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Error banner */}
        {fetchError && (
          <div
            className="mb-6 px-4 py-3 text-sm"
            style={{
              color: "var(--error)",
              backgroundColor: "var(--error-bg)",
              border: "1px solid var(--error-border)",
            }}
          >
            {fetchError}
          </div>
        )}

        {/* Stats bar */}
        {!isLoadingImages && images.length > 0 && (
          <p className="text-xs mb-6" style={{ color: "var(--muted)" }}>
            {images.length} {images.length === 1 ? "image" : "images"} in this folder
          </p>
        )}

        {/* Gallery */}
        <ImageGallery images={images} isLoading={isLoadingImages} onDelete={handleDeleteImage} />
      </div>
    </div>
  );
}
