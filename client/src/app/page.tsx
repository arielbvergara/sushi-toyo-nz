"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { HeroSection } from "@/components/home/HeroSection";
import { OurStorySection } from "@/components/home/OurStorySection";
import { SignatureDishesSection, type DishFromApi, type HomeMenuGroup } from "@/components/home/SignatureDishesSection";
import { QuoteDividerSection } from "@/components/home/QuoteDividerSection";
import { VisitUsSection } from "@/components/home/VisitUsSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { CtaSection } from "@/components/home/CtaSection";
import { SiteFooter, HOME_FOOTER_NAV } from "@/components/layout/SiteFooter";

interface MenuSectionData {
  signatureDishes: DishFromApi[];
  homeGroups: HomeMenuGroup[];
}

export default function Home() {
  const [menuSectionData, setMenuSectionData] = useState<MenuSectionData | null>(null);

  useEffect(() => {
    api.menu.list().then((res) => {
      if (!res.success || !res.data) return;

      const signatureDishes: DishFromApi[] = [];
      const homeGroups: HomeMenuGroup[] = [];

      for (const section of res.data) {
        const homeItems = section.items
          .filter((item) => item.type?.toUpperCase() === "HOME")
          .map((item) => ({ name: item.title, price: item.price1 }));

        if (homeItems.length > 0) {
          homeGroups.push({ label: section.name.toUpperCase(), items: homeItems });
        }

        for (const item of section.items) {
          if (item.type?.toUpperCase() === "SIGNATURE") {
            signatureDishes.push({
              title: item.title,
              description: item.description,
              price: item.price1,
              imageUrl: item.imageUrl,
            });
          }
        }
      }

      const hasTypedItems = signatureDishes.length > 0 || homeGroups.length > 0;
      if (!hasTypedItems) return;

      setMenuSectionData({ signatureDishes, homeGroups });
    });
  }, []);

  return (
    <main>
      <HeroSection />
      <OurStorySection />
      {menuSectionData && (
        <SignatureDishesSection
          signatureDishes={menuSectionData.signatureDishes}
          homeGroups={menuSectionData.homeGroups}
        />
      )}
      <QuoteDividerSection />
      <VisitUsSection />
      <ReviewsSection />
      <CtaSection />
      <SiteFooter navLinks={HOME_FOOTER_NAV} />
    </main>
  );
}
