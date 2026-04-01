"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: Error | null, result: CloudinaryWidgetResult) => void
      ) => CloudinaryWidget;
    };
  }
}

interface CloudinaryWidget {
  open: () => void;
  close: () => void;
  destroy: () => void;
}

interface CloudinaryWidgetResult {
  event: string;
  info?: {
    public_id: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
    created_at: string;
  };
}

interface ImageUploaderProps {
  onUploadComplete: () => void;
}

const CLOUDINARY_WIDGET_SCRIPT_URL = "https://upload-widget.cloudinary.com/latest/global/all.js";
const CLOUDINARY_SCRIPT_ID = "cloudinary-upload-widget";

export function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const [isScriptReady, setIsScriptReady] = useState(false);

  useEffect(() => {
    const existing = document.getElementById(CLOUDINARY_SCRIPT_ID);

    if (existing) {
      // Script tag already in the DOM — check if it has already fired its load event
      if (window.cloudinary) {
        // Schedule outside the synchronous effect body to satisfy the lint rule
        queueMicrotask(() => setIsScriptReady(true));
      } else {
        existing.addEventListener("load", () => setIsScriptReady(true), { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = CLOUDINARY_SCRIPT_ID;
    script.src = CLOUDINARY_WIDGET_SCRIPT_URL;
    script.async = true;
    script.addEventListener("load", () => setIsScriptReady(true), { once: true });
    document.body.appendChild(script);

    return () => {
      widgetRef.current?.destroy();
      widgetRef.current = null;
    };
  }, []);

  function openWidget() {
    if (!isScriptReady || !window.cloudinary) return;

    if (widgetRef.current) {
      widgetRef.current.open();
      return;
    }

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        folder: "sushi-toyo-nz",
        multiple: true,
        maxFileSize: 10_000_000,
        allowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
        styles: {
          palette: {
            window: "#231F1C",
            windowBorder: "#3A3530",
            tabIcon: "#C9A96E",
            menuIcons: "#9C8E7E",
            textDark: "#1C1917",
            textLight: "#F5F0E8",
            link: "#C9A96E",
            action: "#C9A96E",
            inactiveTabIcon: "#9C8E7E",
            error: "#F87171",
            inProgress: "#C9A96E",
            complete: "#4ADE80",
            sourceBg: "#1C1917",
          },
        },
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return;
        }
        if (result.event === "success") {
          onUploadComplete();
        }
      }
    );

    widgetRef.current.open();
  }

  return (
    <button
      type="button"
      onClick={openWidget}
      disabled={!isScriptReady}
      className="px-6 py-3 text-xs font-semibold tracking-widest uppercase transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        backgroundColor: "var(--accent)",
        color: "#1C1917",
      }}
      onMouseEnter={(e) => {
        if (isScriptReady) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-hover)";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent)";
      }}
    >
      {isScriptReady ? "Upload Images" : "Loading…"}
    </button>
  );
}
