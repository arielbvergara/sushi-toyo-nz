"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";

interface AdminAuthProps {
  onAuthenticated: (token: string) => void;
}

export function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await api.admin.authenticate(password);

      if (!result.success || !result.data?.token) {
        setError(result.error ?? "Invalid password");
        return;
      }

      sessionStorage.setItem("admin_token", result.data.token);
      onAuthenticated(result.data.token);
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div
        className="w-full max-w-sm p-8"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h1
          className="text-2xl font-semibold tracking-widest uppercase mb-1 text-center"
          style={{ color: "var(--foreground)", fontFamily: "var(--font-family-heading)" }}
        >
          Admin
        </h1>
        <p
          className="text-xs tracking-widest uppercase text-center mb-8"
          style={{ color: "var(--muted)" }}
        >
          Image Manager
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="admin-password"
            className="block text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: "var(--muted)" }}
          >
            Access Code
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full px-4 py-3 text-sm mb-4 outline-none focus:ring-1"
            style={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              fontFamily: "var(--font-family-sans)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            required
          />

          {error && (
            <p
              className="text-xs mb-4 px-3 py-2"
              style={{
                color: "var(--error)",
                backgroundColor: "var(--error-bg)",
                border: "1px solid var(--error-border)",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full py-3 text-xs font-semibold tracking-widest uppercase transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--accent)",
              color: "#1C1917",
            }}
            onMouseEnter={(e) => {
              if (!isLoading && password) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-hover)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent)";
            }}
          >
            {isLoading ? "Verifying…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
