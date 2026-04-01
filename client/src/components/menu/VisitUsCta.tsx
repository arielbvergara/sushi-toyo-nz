import Link from "next/link";
import { PHONE_HREF } from "@/constants/restaurant";

export function VisitUsCta() {
  return (
    <section
      className="relative py-24 px-8 text-center overflow-hidden"
      style={{ backgroundColor: "#2A1A0A" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(42,26,10,0.85) 0%, rgba(28,25,23,0.9) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-xl mx-auto">
        <p
          className="text-xs font-semibold tracking-[0.25em] uppercase mb-6"
          style={{ color: "#C9A96E" }}
        >
          Ready to Order?
        </p>
        <h2
          className="mb-4"
          style={{
            fontFamily: "var(--font-family-heading)",
            fontSize: "clamp(32px, 5vw, 60px)",
            fontWeight: 400,
            color: "#F5F0E8",
          }}
        >
          Visit Us Today
        </h2>
        <p className="mb-10 text-sm" style={{ color: "#9C8E7E" }}>
          Walk-ins welcome — we look forward to welcoming you.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href={PHONE_HREF}
            className="px-8 py-3 text-xs font-semibold tracking-widest uppercase transition-colors duration-150"
            style={{ backgroundColor: "#C9A96E", color: "#1C1917", border: "1px solid #C9A96E" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B8946A";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#B8946A";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A96E";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#C9A96E";
            }}
          >
            Order Now
          </a>
          <Link
            href="/#location"
            className="px-8 py-3 text-xs font-semibold tracking-widest uppercase transition-colors duration-150"
            style={{ border: "1px solid rgba(245,240,232,0.4)", color: "#F5F0E8" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(245,240,232,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
            }}
          >
            View Location
          </Link>
        </div>
      </div>
    </section>
  );
}
