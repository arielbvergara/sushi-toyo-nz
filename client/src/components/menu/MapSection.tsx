const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const PLACE_QUERY = "Sushi+Toyo+Takapuna,+Auckland,+New+Zealand";
const MAP_EMBED_URL = MAPS_API_KEY
  ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=${PLACE_QUERY}&zoom=16`
  : `https://maps.google.com/maps?q=${PLACE_QUERY}&z=16&output=embed`;

export function MapSection() {
  return (
    <section className="py-16 px-8" style={{ backgroundColor: "#1C1917" }}>
      <div className="max-w-screen-xl mx-auto">
        <div
          className="w-full overflow-hidden"
          style={{ aspectRatio: "21/6", border: "1px solid #3A3530" }}
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
    </section>
  );
}
