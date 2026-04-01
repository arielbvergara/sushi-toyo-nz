"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ExtendedMenuSection, MenuSection } from "@/types";
import { TwoColumnMenuSection } from "@/components/menu/TwoColumnMenuSection";
import { DrinksSection } from "@/components/menu/DrinksSection";
import { VisitUsCta } from "@/components/menu/VisitUsCta";
import { MapSection } from "@/components/menu/MapSection";
import { SiteFooter, MENU_FOOTER_NAV } from "@/components/layout/SiteFooter";

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

function MenuSkeleton() {
  return (
    <div className="py-16 px-8">
      <div className="max-w-screen-xl mx-auto space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 animate-pulse"
            style={{ backgroundColor: "#2A2520", width: i % 2 === 0 ? "60%" : "40%" }}
          />
        ))}
      </div>
    </div>
  );
}

function MenuUnavailable() {
  return (
    <div className="py-24 px-8 text-center">
      <p
        className="text-sm"
        style={{ color: "#9C8E7E" }}
      >
        Our menu is currently unavailable online. Please call us to enquire.
      </p>
    </div>
  );
}

export default function MenuPage() {
  const [sections, setSections] = useState<ExtendedMenuSection[] | null>(null);

  useEffect(() => {
    api.menu.list().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        const mapped: ExtendedMenuSection[] = (res.data as MenuSection[]).map((s) => ({
          ...s,
          categoryLabel: undefined,
          description: undefined,
          drinkSubGroups: undefined,
        }));
        setSections(mapped);
      } else {
        setSections([]);
      }
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
      {sections === null && <MenuSkeleton />}
      {sections !== null && sections.length === 0 && <MenuUnavailable />}
      {sections !== null && sections.length > 0 && sections.map((section, index) => renderSection(section, index))}

      {/* Visit Us CTA */}
      <VisitUsCta />

      {/* Map */}
      <MapSection />

      {/* Footer */}
      <SiteFooter navLinks={MENU_FOOTER_NAV} />
    </main>
  );
}
