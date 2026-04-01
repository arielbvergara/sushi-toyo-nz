import type { ExtendedMenuSection, MenuDrinkSubGroup } from "@/types";
import { MenuItemRow } from "./MenuItemRow";

interface DrinksSectionProps {
  section: ExtendedMenuSection;
}

export function DrinksSection({ section }: DrinksSectionProps) {
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
