"use client";

import Link from "next/link";
import { PHONE_HREF } from "@/constants/restaurant";

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/#hours", label: "Hours" },
  { href: "/#location", label: "Location" },
];

function SushiToyoLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* TO/YO grid logo */}
      <div
        className="w-10 h-10 grid grid-cols-2 gap-0.5 p-1 shrink-0"
        style={{ backgroundColor: "#8B1A1A" }}
        aria-hidden="true"
      >
        <div className="bg-[#F5F0E8] flex items-center justify-center">
          <span style={{ fontSize: "7px", fontWeight: 700, color: "#1C1917", lineHeight: 1 }}>TO</span>
        </div>
        <div className="bg-[#F5F0E8] flex items-center justify-center">
          <span style={{ fontSize: "7px", fontWeight: 700, color: "#1C1917", lineHeight: 1 }}>YO</span>
        </div>
        <div className="bg-[#F5F0E8] flex items-center justify-center">
          <span style={{ fontSize: "5px", fontWeight: 600, color: "#1C1917", lineHeight: 1 }}>SUSHI</span>
        </div>
        <div className="bg-[#F5F0E8] flex items-center justify-center">
          <span style={{ fontSize: "5px", fontWeight: 600, color: "#1C1917", lineHeight: 1 }}>TOYO</span>
        </div>
      </div>
      <span
        className="text-[var(--foreground)] font-semibold tracking-widest text-sm uppercase"
        style={{ fontFamily: "var(--font-family-sans)" }}
      >
        Sushi Toyo
      </span>
    </div>
  );
}

export function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-16"
      style={{ backgroundColor: "#1C1917", borderBottom: "1px solid #3A3530" }}
    >
      <div className="max-w-screen-xl mx-auto h-full px-8 flex items-center justify-between">
        <Link href="/" aria-label="Sushi Toyo — go to home">
          <SushiToyoLogo />
        </Link>

        <div className="flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-150 text-xs font-semibold tracking-widest uppercase"
            >
              {link.label}
            </Link>
          ))}

          <a
            href={PHONE_HREF}
            className="px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-colors duration-150"
            style={{
              color: "#C9A96E",
              border: "1px solid #C9A96E",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A96E";
              (e.currentTarget as HTMLAnchorElement).style.color = "#1C1917";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = "#C9A96E";
            }}
          >
            Order Now
          </a>
        </div>
      </div>
    </nav>
  );
}
