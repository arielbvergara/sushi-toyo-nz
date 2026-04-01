import Link from "next/link";
import {
  PHONE_NUMBER,
  ADDRESS_LINE_1,
  ADDRESS_LINE_2,
  TAGLINE,
} from "@/constants/restaurant";

const PLACE_QUERY = "Sushi+Toyo+Takapuna,+Auckland,+New+Zealand";

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

interface SiteFooterProps {
  navLinks: NavLink[];
}

function SushiToyoLogo() {
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

export function SiteFooter({ navLinks }: SiteFooterProps) {
  return (
    <footer
      className="py-12 px-8"
      style={{ backgroundColor: "#161310", borderTop: "1px solid #3A3530" }}
    >
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        {/* Brand + contact */}
        <div>
          <SushiToyoLogo />
          <address className="not-italic mt-3 space-y-0.5">
            <p className="text-xs" style={{ color: "#6B5E50" }}>{ADDRESS_LINE_1}, {ADDRESS_LINE_2}</p>
            <p className="text-xs" style={{ color: "#6B5E50" }}>{PHONE_NUMBER}</p>
          </address>
          <p className="mt-1 text-xs" style={{ color: "#6B5E50" }}>{TAGLINE}</p>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-8 flex-wrap">
          {navLinks.map((link) => (
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest uppercase transition-colors duration-150"
                style={{ color: "#6B5E50" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#9C8E7E")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#6B5E50")}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest uppercase transition-colors duration-150"
                style={{ color: "#6B5E50" }}
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs" style={{ color: "#6B5E50" }}>
          © {new Date().getFullYear()} Sushi Toyo Restaurant
        </p>
      </div>
    </footer>
  );
}

export const HOME_FOOTER_NAV: NavLink[] = [
  { href: "/menu", label: "View Menu" },
  { href: "https://instagram.com", label: "Instagram", external: true },
  { href: `https://maps.google.com/?q=${PLACE_QUERY}`, label: "Google Maps", external: true },
];

export const MENU_FOOTER_NAV: NavLink[] = [
  { href: "/menu", label: "Menu" },
  { href: "/#about", label: "About" },
  { href: "/#hours", label: "Hours" },
  { href: "/#location", label: "Location" },
];
