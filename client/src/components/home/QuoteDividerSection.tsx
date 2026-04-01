import { QUOTE } from "@/constants/restaurant";

export function QuoteDividerSection() {
  return (
    <section
      className="relative w-full flex items-center justify-center py-0"
      style={{ minHeight: "400px" }}
    >
      {/* Background */}
      <div className="absolute inset-0" style={{ backgroundColor: "#3D1A0A" }} aria-hidden="true">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: "linear-gradient(to right, #8B2500 0%, #3D1A0A 40%, #3D1A0A 60%, #8B2500 100%)",
          }}
        />
      </div>

      <p
        className="relative z-10 text-center px-8 italic"
        style={{
          fontFamily: "var(--font-family-heading)",
          fontSize: "clamp(20px, 3vw, 32px)",
          fontWeight: 400,
          color: "#F5F0E8",
          maxWidth: "600px",
        }}
      >
        {QUOTE}
      </p>
    </section>
  );
}
