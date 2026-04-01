import { existsSync, readFileSync } from "fs";
import path from "path";
import type { NextConfig } from "next";

// ── Monorepo env loader ──────────────────────────────────────────────────────
// Next.js only loads .env.local from its own package directory (/client).
// In this monorepo all env vars live in the project root, so we read that file
// here and forward only the specific NEXT_PUBLIC_ vars needed by client code.
// We intentionally exclude vars like NEXT_PUBLIC_API_URL whose value differs
// between the rewrite config (absolute URL) and browser fetches (relative /api).
const CLIENT_VAR_ALLOWLIST = new Set([
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
  "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
  "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
]);

function loadNextPublicVarsFromRoot(): Record<string, string> {
  // __dirname is the directory of this config file (/client), so ".." is the monorepo root
  const rootEnvPath = path.join(__dirname, "..", ".env.local");
  if (!existsSync(rootEnvPath)) return {};

  const vars: Record<string, string> = {};

  for (const line of readFileSync(rootEnvPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    if (!CLIENT_VAR_ALLOWLIST.has(key)) continue;

    const raw = trimmed.slice(eqIndex + 1).trim();
    vars[key] = raw.replace(/^["']|["']$/g, "");
  }

  return vars;
}

// Mutate process.env directly so Turbopack picks up NEXT_PUBLIC_* at compile time
const nextPublicVars = loadNextPublicVarsFromRoot();
for (const [key, value] of Object.entries(nextPublicVars)) {
  if (!process.env[key]) process.env[key] = value;
}

const SECURITY_HEADERS = [
  // Prevent clickjacking by disallowing the page from being embedded in a frame
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevent MIME type sniffing attacks
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limit referrer information sent to third-party origins
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features not used by the app
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Content Security Policy – restricts where resources can be loaded from.
  // 'unsafe-inline' is required for Tailwind CSS and Next.js inline hydration scripts.
  // Tighten script-src further by adding nonce support once the app grows.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://upload-widget.cloudinary.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://upload-widget.cloudinary.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' https: data: blob:",
      "frame-src https://www.google.com https://maps.google.com https://upload-widget.cloudinary.com",
      "connect-src 'self' ws: wss: https://api.cloudinary.com https://res.cloudinary.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Forward NEXT_PUBLIC_* vars read from the monorepo root .env.local
  env: nextPublicVars,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/:path*`,
      },
    ];
  },

  images: {
    // Menu images are sourced from arbitrary third-party URLs stored in Google
    // Sheets, so the full set of hostnames cannot be enumerated upfront.
    // Protocol is restricted to HTTPS to prevent mixed-content and plain-HTTP
    // image requests; HTTP sources should be updated in the spreadsheet data.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
