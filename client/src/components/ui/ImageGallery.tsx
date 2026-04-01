"use client";

import { useState } from "react";
import type { CloudinaryImage } from "@/types";

interface ImageGalleryProps {
  images: CloudinaryImage[];
  isLoading: boolean;
  onDelete?: (publicId: string) => Promise<void>;
}

const COPIED_FEEDBACK_DURATION_MS = 2000;

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ImageGallery({ images, isLoading, onDelete }: ImageGalleryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function copyUrl(publicId: string, url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(publicId);
      setTimeout(() => setCopiedId(null), COPIED_FEEDBACK_DURATION_MS);
    } catch {
      // Fallback for browsers without clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedId(publicId);
      setTimeout(() => setCopiedId(null), COPIED_FEEDBACK_DURATION_MS);
    }
  }

  async function handleDelete(publicId: string) {
    if (!onDelete) return;
    setDeletingId(publicId);
    setConfirmDeleteId(null);
    try {
      await onDelete(publicId);
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse"
            style={{ backgroundColor: "var(--surface)" }}
          />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div
        className="py-16 text-center"
        style={{ border: "1px dashed var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          No images uploaded yet. Use the button above to add your first image.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => {
        const isCopied = copiedId === image.publicId;
        const fileName = image.publicId.split("/").pop() ?? image.publicId;

        return (
          <div
            key={image.publicId}
            className="group flex flex-col overflow-hidden"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            {/* Image thumbnail */}
            <div className="aspect-square overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.secureUrl}
                alt={fileName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Metadata + copy button */}
            <div className="p-3 flex flex-col gap-2">
              <p
                className="text-xs truncate font-medium"
                style={{ color: "var(--foreground)" }}
                title={fileName}
              >
                {fileName}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {image.width} × {image.height} · {image.format.toUpperCase()}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {formatDate(image.createdAt)}
              </p>

              <button
                type="button"
                onClick={() => copyUrl(image.publicId, image.secureUrl)}
                className="mt-1 w-full py-1.5 text-xs font-semibold tracking-widest uppercase transition-colors duration-150"
                style={{
                  backgroundColor: isCopied ? "var(--success-bg)" : "transparent",
                  border: `1px solid ${isCopied ? "var(--success-border)" : "var(--border)"}`,
                  color: isCopied ? "var(--success)" : "var(--muted)",
                }}
                onMouseEnter={(e) => {
                  if (!isCopied) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCopied) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
                  }
                }}
              >
                {isCopied ? "Copied!" : "Copy URL"}
              </button>

              {onDelete && (
                confirmDeleteId === image.publicId ? (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={deletingId === image.publicId}
                      onClick={() => handleDelete(image.publicId)}
                      className="flex-1 py-1.5 text-xs font-semibold tracking-widest uppercase transition-colors duration-150"
                      style={{
                        backgroundColor: "var(--error-bg)",
                        border: "1px solid var(--error-border)",
                        color: "var(--error)",
                        opacity: deletingId === image.publicId ? 0.6 : 1,
                      }}
                    >
                      {deletingId === image.publicId ? "Deleting…" : "Confirm"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="flex-1 py-1.5 text-xs font-semibold tracking-widest uppercase transition-colors duration-150"
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid var(--border)",
                        color: "var(--muted)",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(image.publicId)}
                    className="w-full py-1.5 text-xs font-semibold tracking-widest uppercase transition-colors duration-150"
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid var(--border)",
                      color: "var(--muted)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--error-border)";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--error)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
                    }}
                  >
                    Delete
                  </button>
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
