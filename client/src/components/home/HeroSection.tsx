import Link from "next/link";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative w-full flex items-center"
      style={{ minHeight: "calc(100vh - 4rem)" }}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0D0B08 0%, #2A1F12 50%, #1A1208 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(ellipse at 70% 40%, #4A3520 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-8 w-full">
        <div className="max-w-2xl">
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-6"
            style={{ color: "#C9A96E" }}
          >
            Authentic Japanese Cuisine&nbsp;&nbsp;·&nbsp;&nbsp;Takapuna
          </p>

          <h1
            className="mb-6 leading-none"
            style={{
              fontFamily: "var(--font-family-heading)",
              fontSize: "clamp(64px, 8vw, 112px)",
              fontWeight: 400,
              color: "#F5F0E8",
            }}
          >
            Sushi Toyo
          </h1>

          <p className="mb-10 leading-relaxed" style={{ color: "#9C8E7E", fontSize: "15px" }}>
            Handcrafted sushi &amp; donburi on Auckland&apos;s North Shore.
            <br />
            Fresh flavours, tradition in every bite.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/menu"
              className="px-8 py-3 text-xs font-semibold tracking-widest uppercase transition-colors duration-150"
              style={{ border: "1px solid #C9A96E", color: "#C9A96E" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A96E";
                (e.currentTarget as HTMLAnchorElement).style.color = "#1C1917";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.color = "#C9A96E";
              }}
            >
              View Menu
            </Link>
            <Link
              href="/#location"
              className="px-8 py-3 text-xs font-semibold tracking-widest uppercase transition-colors duration-150"
              style={{ border: "1px solid rgba(245,240,232,0.4)", color: "#F5F0E8" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(245,240,232,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              }}
            >
              Find Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
