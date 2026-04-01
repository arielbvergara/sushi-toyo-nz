export function OurStorySection() {
  return (
    <section id="about" className="w-full" style={{ backgroundColor: "#1C1917" }}>
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row">
        {/* Left: image placeholder */}
        <div
          className="lg:w-1/2 shrink-0"
          style={{ minHeight: "480px", backgroundColor: "#2A1F12" }}
          aria-hidden="true"
        >
          <div className="w-full h-full flex items-center justify-center" style={{ minHeight: "480px" }}>
            <span className="text-xs tracking-widest uppercase" style={{ color: "#4A3520" }}>
              Our Story Image
            </span>
          </div>
        </div>

        {/* Right: text */}
        <div className="lg:w-1/2 flex items-center px-12 py-16">
          <div className="max-w-lg">
            <p
              className="text-xs font-semibold tracking-[0.25em] uppercase mb-4"
              style={{ color: "#C9A96E" }}
            >
              Our Story
            </p>
            <h2
              className="mb-8 leading-tight"
              style={{
                fontFamily: "var(--font-family-heading)",
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 400,
                color: "#F5F0E8",
              }}
            >
              A Taste of
              <br />
              Tradition
            </h2>
            <p className="mb-5 leading-relaxed text-sm" style={{ color: "#9C8E7E" }}>
              Nestled in the heart of Takapuna on Lake Road, Sushi Toyo brings you the authentic
              flavours of Japan. Our chefs handcraft every roll &amp; bowl, and plate using the
              freshest ingredients sourced daily.
            </p>
            <p className="leading-relaxed text-sm" style={{ color: "#9C8E7E" }}>
              From classic teriyaki donburi to crispy katsu every dish is prepared with care,
              balancing tradition with the vibrant tastes of Aotearoa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
