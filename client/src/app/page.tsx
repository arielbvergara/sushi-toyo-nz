"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PlaceReview } from "@/types";
import { api } from "@/lib/api";
import {
  PHONE_HREF,
  ADDRESS_LINE_1,
  ADDRESS_LINE_2,
  ADDRESS_LINE_3,
  OPENING_HOURS,
  QUOTE,
  SIGNATURE_DISHES,
  HOMEPAGE_MENU_PREVIEW,
  TAGLINE,
} from "@/constants/restaurant";

// ─── Menu type aliases (for items filtered from the API by type column) ────────

interface DishFromApi {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}

interface HomeGroup {
  label: string;
  items: { name: string; price: string }[];
}

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const PLACE_QUERY = "Sushi+Toyo+Takapuna,+Auckland,+New+Zealand";
const MAP_EMBED_URL = MAPS_API_KEY
  ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=${PLACE_QUERY}&zoom=16`
  : `https://maps.google.com/maps?q=${PLACE_QUERY}&z=16&output=embed`;

const PLACEHOLDER_REVIEWS: PlaceReview[] = [
  {
    authorName: "Niky Warner",
    rating: 5,
    text: "The food always comes out superbly and is always fresh and delicious. One of the best Japanese restaurants I've found on The North Shore.",
    relativeTimeDescription: "a month ago",
  },
  {
    authorName: "Google Reviewer",
    rating: 5,
    text: "Super welcoming staff and the food was incredibly yummy. A great spot for authentic Japanese food in Takapuna.",
    relativeTimeDescription: "2 weeks ago",
  },
  {
    authorName: "Glen Lee Customer",
    rating: 5,
    text: "Generous portions and excellent value for money. The donburi bowls are absolutely outstanding. Will be back!",
    relativeTimeDescription: "3 weeks ago",
  },
];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill={filled ? "#C9A96E" : "none"}
      stroke="#C9A96E"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function StarRatingRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} filled={n <= Math.round(rating)} />
      ))}
    </div>
  );
}

// ─── Section 1: Hero ──────────────────────────────────────────────────────────

function HeroSection() {
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
        {/* Subtle texture overlay */}
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

// ─── Section 2: Our Story ─────────────────────────────────────────────────────

function OurStorySection() {
  return (
    <section id="about" className="w-full" style={{ backgroundColor: "#1C1917" }}>
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row">
        {/* Left: image placeholder (deep colour block) */}
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
              Nestled in the heart of Takapuna on Lake Road, Sushi Toyo brings you the authentic flavours of
              Japan. Our chefs handcraft every roll &amp; bowl, and plate using the freshest ingredients sourced
              daily.
            </p>
            <p className="leading-relaxed text-sm" style={{ color: "#9C8E7E" }}>
              From classic teriyaki donburi to crispy katsu every dish is prepared with care, balancing
              tradition with the vibrant tastes of Aotearoa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: Signature Dishes ─────────────────────────────────────────────

function SignatureDishCard({ dish }: { dish: DishFromApi }) {
  return (
    <div className="flex flex-col" style={{ color: "#F5F0E8" }}>
      {/* Image area */}
      <div
        className="w-full mb-4 relative overflow-hidden"
        style={{ aspectRatio: "4/3", backgroundColor: "#2A1F12" }}
      >
        {dish.imageUrl ? (
          <Image
            src={dish.imageUrl}
            alt={dish.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ minHeight: "200px" }}>
            <span className="text-xs tracking-widest uppercase" style={{ color: "#4A3520" }}>
              {dish.title}
            </span>
          </div>
        )}
      </div>
      <h3
        className="mb-2 text-xl"
        style={{ fontFamily: "var(--font-family-heading)", fontWeight: 500 }}
      >
        {dish.title}
      </h3>
      <p className="text-xs leading-relaxed mb-4" style={{ color: "#9C8E7E" }}>
        {dish.description}
      </p>
      <p className="font-semibold text-sm" style={{ color: "#C9A96E" }}>
        {dish.price}
      </p>
    </div>
  );
}

interface SignatureDishesProps {
  signatureDishes: DishFromApi[];
  homeGroups: HomeGroup[];
}

const MENU_SECTION_BG_URL = "https://lh3.googleusercontent.com/geougc-cs/ABOP9pvJj9PSW_8oNTfdDOXB-TuZ6RnORsiIDEkKZ7UqInmC8INqVR7NuaVqA0K4M8ycSHU2HceHiJK2YRiWJj6_Px-Fvd03pKi-l79Wb76FMXnSDMLa5yW5p4P574OVE7n28zBRbDKnC-dmtI8=w600-h450-p";

function SignatureDishesSection({ signatureDishes, homeGroups }: SignatureDishesProps) {
  return (
    <section
      className="py-20 px-8 relative"
      style={{ backgroundColor: "#231F1C" }}
    >
      {/* Background image with dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${MENU_SECTION_BG_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(28, 25, 23, 0.65)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ color: "#C9A96E" }}
          >
            Our Menu
          </p>
          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-family-heading)",
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 400,
              color: "#F5F0E8",
            }}
          >
            Signature Dishes
          </h2>
          <p className="text-sm" style={{ color: "#9C8E7E" }}>
            Each dish crafted with care and the freshest ingredients.
          </p>
        </div>

        {/* Dish cards */}
        {signatureDishes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {signatureDishes.map((dish) => (
              <SignatureDishCard key={dish.title} dish={dish} />
            ))}
          </div>
        )}

        {/* 2-column menu preview */}
        {homeGroups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8" style={{ borderTop: "1px solid #3A3530" }}>
            {homeGroups.map((group) => (
              <div key={group.label}>
                <p
                  className="text-xs font-semibold tracking-[0.2em] uppercase mb-6"
                  style={{ color: "#C9A96E" }}
                >
                  {group.label}
                </p>
                <ul className="space-y-4">
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <span style={{ color: "#F5F0E8" }}>{item.name}</span>
                      <span style={{ color: "#9C8E7E" }}>{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Section 4: Quote Divider ─────────────────────────────────────────────────

function QuoteDividerSection() {
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

      {/* Quote */}
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

// ─── Section 5: Visit Us / Location ──────────────────────────────────────────

function VisitUsSection() {
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

          {/* Google Maps embed */}
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

// ─── Section 6: Reviews ───────────────────────────────────────────────────────

function ReviewCard({ review }: { review: PlaceReview }) {
  return (
    <div
      className="flex flex-col gap-4 p-6"
      style={{ backgroundColor: "#2A2520", border: "1px solid #3A3530" }}
    >
      <StarRatingRow rating={review.rating} />
      <p className="text-sm leading-relaxed" style={{ color: "#C8BDAF" }}>
        {review.text}
      </p>
      <p className="text-xs font-semibold" style={{ color: "#9C8E7E" }}>
        — {review.authorName}
      </p>
    </div>
  );
}

function ReviewsSection() {
  const [reviews, setReviews] = useState<PlaceReview[]>(PLACEHOLDER_REVIEWS);

  useEffect(() => {
    api.location.getDetails().then((res) => {
      if (res.success && res.data && res.data.reviews.length > 0) {
        setReviews(res.data.reviews.slice(0, 3));
      }
    });
  }, []);

  return (
    <section id="reviews" className="py-20 px-8" style={{ backgroundColor: "#231F1C" }}>
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ color: "#C9A96E" }}
          >
            Reviews
          </p>
          <h2
            style={{
              fontFamily: "var(--font-family-heading)",
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 400,
              color: "#F5F0E8",
            }}
          >
            What Our Guests Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <ReviewCard key={`${review.authorName}-${i}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 7: CTA ───────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section
      className="relative py-24 px-8 text-center"
      style={{ backgroundColor: "#1C1917" }}
    >
      <div className="max-w-2xl mx-auto">
        <p
          className="text-xs font-semibold tracking-[0.25em] uppercase mb-6"
          style={{ color: "#C9A96E" }}
        >
          Order Now
        </p>
        <h2
          className="mb-4"
          style={{
            fontFamily: "var(--font-family-heading)",
            fontSize: "clamp(32px, 5vw, 64px)",
            fontWeight: 400,
            color: "#F5F0E8",
          }}
        >
          Ready to Taste
          <br />
          Authentic Japanese?
        </h2>
        <p className="mb-10 text-sm" style={{ color: "#9C8E7E" }}>
          Available for dine-in — we look forward to welcoming you.
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
            Call to Order
          </a>
          <Link
            href="/menu"
            className="px-8 py-3 text-xs font-semibold tracking-widest uppercase transition-colors duration-150"
            style={{ border: "1px solid rgba(245,240,232,0.4)", color: "#F5F0E8" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(245,240,232,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
            }}
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function SushiToyoLogoSmall() {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-8 h-8 grid grid-cols-2 gap-0.5 p-0.5 shrink-0"
        style={{ backgroundColor: "#8B1A1A" }}
        aria-hidden="true"
      >
        <div className="bg-[#F5F0E8] flex items-center justify-center">
          <span style={{ fontSize: "5px", fontWeight: 700, color: "#1C1917" }}>TO</span>
        </div>
        <div className="bg-[#F5F0E8] flex items-center justify-center">
          <span style={{ fontSize: "5px", fontWeight: 700, color: "#1C1917" }}>YO</span>
        </div>
        <div className="bg-[#F5F0E8]" />
        <div className="bg-[#F5F0E8]" />
      </div>
      <span
        className="font-semibold tracking-widest text-sm uppercase"
        style={{ color: "#F5F0E8", fontFamily: "var(--font-family-sans)" }}
      >
        Toyo
      </span>
    </div>
  );
}

function Footer() {
  return (
    <footer
      className="py-12 px-8"
      style={{ backgroundColor: "#161310", borderTop: "1px solid #3A3530" }}
    >
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left */}
        <div>
          <SushiToyoLogoSmall />
          <p className="mt-2 text-xs" style={{ color: "#6B5E50" }}>
            {TAGLINE}
          </p>
        </div>

        {/* Center nav */}
        <nav className="flex items-center gap-8">
          {[
            { href: "/menu", label: "View Menu" },
            { href: "https://instagram.com", label: "Instagram" },
            { href: `https://maps.google.com/?q=${PLACE_QUERY}`, label: "Google Maps" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs tracking-widest uppercase transition-colors duration-150"
              style={{ color: "#6B5E50" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#9C8E7E")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#6B5E50")}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right */}
        <p className="text-xs" style={{ color: "#6B5E50" }}>
          © 2024 Sushi Toyo Restaurant
        </p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [signatureDishes, setSignatureDishes] = useState<DishFromApi[] | null>(null);
  const [homeGroups, setHomeGroups] = useState<HomeGroup[] | null>(null);
  const [hideMenuSection, setHideMenuSection] = useState(false);

  useEffect(() => {
    api.menu.list().then((res) => {
      if (!res.success || !res.data) return; // keep static fallback on error

      const signature: DishFromApi[] = [];
      const home: HomeGroup[] = [];

      for (const section of res.data) {
        const homeItems = section.items
          .filter((item) => item.type?.toUpperCase() === "HOME")
          .map((item) => ({ name: item.title, price: item.price1 }));

        if (homeItems.length > 0) {
          home.push({ label: section.name.toUpperCase(), items: homeItems });
        }

        for (const item of section.items) {
          if (item.type?.toUpperCase() === "SIGNATURE") {
            signature.push({
              title: item.title,
              description: item.description,
              price: item.price1,
              imageUrl: item.imageUrl,
            });
          }
        }
      }

      const hasAnyTyped = signature.length > 0 || home.length > 0;
      if (!hasAnyTyped) {
        setHideMenuSection(true);
        return;
      }

      setSignatureDishes(signature);
      setHomeGroups(home);
    });
  }, []);

  const fallbackSignature: DishFromApi[] = SIGNATURE_DISHES.map((d) => ({
    title: d.title,
    description: d.description,
    price: d.price,
    imageUrl: d.imageUrl,
  }));

  const fallbackHomeGroups: HomeGroup[] = HOMEPAGE_MENU_PREVIEW.map((g) => ({
    label: g.label,
    items: g.items.map((i) => ({ name: i.name, price: i.price })),
  }));

  return (
    <main>
      <HeroSection />
      <OurStorySection />
      {!hideMenuSection && (
        <SignatureDishesSection
          signatureDishes={signatureDishes ?? fallbackSignature}
          homeGroups={homeGroups ?? fallbackHomeGroups}
        />
      )}
      <QuoteDividerSection />
      <VisitUsSection />
      <ReviewsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
