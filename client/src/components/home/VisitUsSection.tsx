import {
  ADDRESS_LINE_1,
  ADDRESS_LINE_2,
  ADDRESS_LINE_3,
  OPENING_HOURS,
} from "@/constants/restaurant";

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const PLACE_QUERY = "Sushi+Toyo+Takapuna,+Auckland,+New+Zealand";
const MAP_EMBED_URL = MAPS_API_KEY
  ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=${PLACE_QUERY}&zoom=16`
  : `https://maps.google.com/maps?q=${PLACE_QUERY}&z=16&output=embed`;

export function VisitUsSection() {
  return (
    <section className="py-20 px-8" style={{ backgroundColor: "#1C1917" }}>
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Hours */}
        <div id="hours">
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ color: "#C9A96E" }}
          >
            Opening Hours
          </p>
          <h2
            className="mb-10"
            style={{
              fontFamily: "var(--font-family-heading)",
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 400,
              color: "#F5F0E8",
            }}
          >
            Visit Us
          </h2>
          <ul className="space-y-6">
            {OPENING_HOURS.map((row) => (
              <li
                key={row.days}
                className="flex items-center justify-between text-sm pb-4"
                style={{ borderBottom: "1px solid #3A3530" }}
              >
                <span style={{ color: "#F5F0E8" }}>{row.days}</span>
                <span style={{ color: row.time === "Closed" ? "#9C8E7E" : "#F5F0E8" }}>
                  {row.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Location + Map */}
        <div id="location">
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ color: "#C9A96E" }}
          >
            Find Us
          </p>
          <h2
            className="mb-6"
            style={{
              fontFamily: "var(--font-family-heading)",
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 400,
              color: "#F5F0E8",
            }}
          >
            Location
          </h2>
          <address className="not-italic text-sm mb-8 space-y-1" style={{ color: "#9C8E7E" }}>
            <p>{ADDRESS_LINE_1}</p>
            <p>{ADDRESS_LINE_2}</p>
            <p>{ADDRESS_LINE_3}</p>
          </address>

          <div
            className="w-full overflow-hidden"
            style={{ aspectRatio: "16/9", border: "1px solid #3A3530" }}
          >
            <iframe
              title="Sushi Toyo Takapuna location"
              src={MAP_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
