import Image from "next/image";

export interface DishFromApi {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}

export interface HomeMenuGroup {
  label: string;
  items: { name: string; price: string }[];
}

interface SignatureDishCardProps {
  dish: DishFromApi;
}

function SignatureDishCard({ dish }: SignatureDishCardProps) {
  return (
    <div className="flex flex-col" style={{ color: "#F5F0E8" }}>
      <div
        className="w-full mb-4 relative overflow-hidden"
        style={{ aspectRatio: "4/3", backgroundColor: "#2A1F12" }}
      >
        {dish.imageUrl ? (
          <Image src={dish.imageUrl} alt={dish.title} fill className="object-cover" />
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
  homeGroups: HomeMenuGroup[];
}

const MENU_SECTION_BG_URL =
  "https://lh3.googleusercontent.com/geougc-cs/ABOP9pvJj9PSW_8oNTfdDOXB-TuZ6RnORsiIDEkKZ7UqInmC8INqVR7NuaVqA0K4M8ycSHU2HceHiJK2YRiWJj6_Px-Fvd03pKi-l79Wb76FMXnSDMLa5yW5p4P574OVE7n28zBRbDKnC-dmtI8=w600-h450-p";

export function SignatureDishesSection({ signatureDishes, homeGroups }: SignatureDishesProps) {
  return (
    <section className="py-20 px-8 relative" style={{ backgroundColor: "#231F1C" }}>
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
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8"
            style={{ borderTop: "1px solid #3A3530" }}
          >
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
