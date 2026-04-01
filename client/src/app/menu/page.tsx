"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { MenuSection } from "@/types";
import {
  PHONE_HREF,
  ADDRESS_LINE_1,
  ADDRESS_LINE_2,
  PHONE_NUMBER,
  TAGLINE,
  STATIC_MENU,
  type ExtendedMenuSection,
  type MenuDrinkSubGroup,
} from "@/constants/restaurant";

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const PLACE_QUERY = "Sushi+Toyo+Takapuna,+Auckland,+New+Zealand";
const MAP_EMBED_URL = MAPS_API_KEY
  ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=${PLACE_QUERY}&zoom=16`
  : `https://maps.google.com/maps?q=${PLACE_QUERY}&z=16&output=embed`;

// ─── Menu item row ────────────────────────────────────────────────────────────

function MenuItemRow({ name, price }: { name: string; price: string }) {
  return (
    <li
      className="flex items-center justify-between py-3 text-sm"
      style={{ borderBottom: "1px solid #3A3530" }}
    >
      <span style={{ color: "#F5F0E8" }}>{name}</span>
      <span style={{ color: "#9C8E7E" }}>{price}</span>
    </li>
  );
}

// ─── Standard two-column menu section ────────────────────────────────────────

function TwoColumnMenuSection({ section }: { section: ExtendedMenuSection }) {
  const leftItems = section.items.slice(0, Math.ceil(section.items.length / 2));
  const rightItems = section.items.slice(Math.ceil(section.items.length / 2));

  return (
    <div className="py-16 px-8" style={{ borderBottom: "1px solid #3A3530" }}>
      <div className="max-w-screen-xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          {section.categoryLabel && (
            <p
              className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
              style={{ color: "#C9A96E" }}
            >
              {section.categoryLabel}
            </p>
          )}
          <h2
            className="mb-3"
            style={{
              fontFamily: "var(--font-family-heading)",
              fontSize: "clamp(28px, 3.5vw, 48px)",
              fontWeight: 400,
              color: "#F5F0E8",
            }}
          >
            {section.name}
          </h2>
          {section.description && (
            <p className="text-xs" style={{ color: "#9C8E7E" }}>
              {section.description}
            </p>
          )}
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
          <ul>
            {leftItems.map((item) => (
              <MenuItemRow key={item.title} name={item.title} price={item.price1} />
            ))}
          </ul>
          <ul>
            {rightItems.map((item) => (
              <MenuItemRow key={item.title} name={item.title} price={item.price1} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Drinks three-column section ─────────────────────────────────────────────

function DrinksSection({ section }: { section: ExtendedMenuSection }) {
  const groups: MenuDrinkSubGroup[] = section.drinkSubGroups ?? [];

  return (
    <div className="py-16 px-8" style={{ backgroundColor: "#1C1917" }}>
      <div className="max-w-screen-xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          {section.categoryLabel && (
            <p
              className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
              style={{ color: "#C9A96E" }}
            >
              {section.categoryLabel}
            </p>
          )}
          <h2
            className="mb-3"
            style={{
              fontFamily: "var(--font-family-heading)",
              fontSize: "clamp(28px, 3.5vw, 48px)",
              fontWeight: 400,
              color: "#F5F0E8",
            }}
          >
            {section.name}
          </h2>
          {section.description && (
            <p className="text-xs" style={{ color: "#9C8E7E" }}>
              {section.description}
            </p>
          )}
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12">
          {groups.map((group) => (
            <div key={group.label}>
              <p
                className="text-xs font-semibold tracking-[0.2em] uppercase mb-4"
                style={{ color: "#C9A96E" }}
              >
                {group.label}
              </p>
              <ul>
                {group.items.map((item) => (
                  <MenuItemRow key={item.name} name={item.name} price={item.price} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Render a section dynamically or from static data ────────────────────────

function renderSection(section: ExtendedMenuSection, index: number) {
  if (section.drinkSubGroups && section.drinkSubGroups.length > 0) {
    return <DrinksSection key={section.name} section={section} />;
  }
  return (
    <div
      key={section.name}
      style={{ backgroundColor: index % 2 === 0 ? "#231F1C" : "#1C1917" }}
    >
      <TwoColumnMenuSection section={section} />
    </div>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────

function VisitUsCta() {
  return (
    <section
      className="relative py-24 px-8 text-center overflow-hidden"
      style={{ backgroundColor: "#2A1A0A" }}
    >
      {/* Subtle background gradient */}
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

// ─── Map CTA ──────────────────────────────────────────────────────────────────

function MapCta() {
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

// ─── Footer ───────────────────────────────────────────────────────────────────

function MenuFooter() {
  return (
    <footer
      className="py-12 px-8"
      style={{ backgroundColor: "#161310", borderTop: "1px solid #3A3530" }}
    >
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        {/* Left: logo + address */}
        <div>
          <p
            className="font-semibold tracking-widest uppercase text-base mb-2"
            style={{ color: "#F5F0E8", fontFamily: "var(--font-family-sans)" }}
          >
            Sushi Toyo
          </p>
          <p className="text-xs" style={{ color: "#6B5E50" }}>
            {ADDRESS_LINE_1}, {ADDRESS_LINE_2}
          </p>
          <p className="text-xs mt-1" style={{ color: "#6B5E50" }}>
            {PHONE_NUMBER}
          </p>
          <p className="text-xs mt-1" style={{ color: "#6B5E50" }}>
            {TAGLINE}
          </p>
        </div>

        {/* Center nav */}
        <nav className="flex items-center gap-8">
          {[
            { href: "/menu", label: "Menu" },
            { href: "/#about", label: "About" },
            { href: "/#hours", label: "Hours" },
            { href: "/#location", label: "Location" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-widest uppercase transition-colors duration-150"
              style={{ color: "#6B5E50" }}
            >
              {link.label}
            </Link>
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

export default function MenuPage() {
  const [sections, setSections] = useState<ExtendedMenuSection[]>(STATIC_MENU);

  useEffect(() => {
    api.menu.list().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        // Map API data to ExtendedMenuSection (no drinkSubGroups from API)
        const mapped: ExtendedMenuSection[] = (res.data as MenuSection[]).map((s) => ({
          ...s,
          categoryLabel: undefined,
          description: undefined,
          drinkSubGroups: undefined,
        }));
        setSections(mapped);
      }
      // On failure, keep STATIC_MENU (already set as initial state)
    });
  }, []);

  return (
    <main style={{ backgroundColor: "#231F1C" }}>
      {/* Hero */}
      <section
        className="relative flex items-center justify-center py-24 px-8 text-center"
        style={{ minHeight: "350px", backgroundColor: "#1C1917" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0D0B08 0%, #2A1F12 50%, #1A1208 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <h1
            className="mb-4"
            style={{
              fontFamily: "var(--font-family-heading)",
              fontSize: "clamp(48px, 6vw, 88px)",
              fontWeight: 400,
              color: "#F5F0E8",
            }}
          >
            Our Menu
          </h1>
          <p className="text-sm" style={{ color: "#9C8E7E" }}>
            Fresh ingredients, authentic flavours, crafted with passion.
          </p>
        </div>
      </section>

      {/* Menu sections */}
      {sections.map((section, index) => renderSection(section, index))}

      {/* Visit Us CTA */}
      <VisitUsCta />

      {/* Map */}
      <MapCta />

      {/* Footer */}
      <MenuFooter />
    </main>
  );
}
