import type { ExtendedMenuSection } from "@/types";
import { MenuItemRow } from "./MenuItemRow";

interface TwoColumnMenuSectionProps {
  section: ExtendedMenuSection;
}

export function TwoColumnMenuSection({ section }: TwoColumnMenuSectionProps) {
  const midpoint = Math.ceil(section.items.length / 2);
  const leftItems = section.items.slice(0, midpoint);
  const rightItems = section.items.slice(midpoint);

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
