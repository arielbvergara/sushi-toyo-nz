import Image from "next/image";
import { QUOTE } from "@/constants/restaurant";

const QUOTE_BG_IMAGE_URL =
  "https://res.cloudinary.com/dhdrv4f0q/image/upload/v1775110451/sushi-toyo-nz/tfxbzuckud2rkojqweuj.jpg";

export function QuoteDividerSection() {
  return (
    <section
      className="relative w-full flex items-center justify-center py-0"
      style={{ minHeight: "400px" }}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <Image
          src={QUOTE_BG_IMAGE_URL}
          alt=""
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
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
