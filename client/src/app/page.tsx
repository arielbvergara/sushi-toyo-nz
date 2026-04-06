import { RestaurantJsonLd } from "@/components/seo/RestaurantJsonLd";
import { HomePageClient } from "@/components/home/HomePageClient";
import type { PlaceDetails } from "@/types";

// No "use client" directive — this is a Server Component so that
// RestaurantJsonLd (JSON-LD schema) is rendered in the initial HTML response.
// All client-side behaviour lives in HomePageClient below.

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sushitoyo.co.nz";

const SCHEMA_REVALIDATE_SECONDS = 604_800; // 7 days — matches server-side cache TTL

async function fetchLocationForSchema(): Promise<PlaceDetails | null> {
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
  try {
    const res = await fetch(`${apiBase}/location`, {
      next: { revalidate: SCHEMA_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { success: boolean; data?: PlaceDetails };
    return json.success && json.data ? json.data : null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const locationDetails = await fetchLocationForSchema();

  return (
    <main>
      {locationDetails && (
        <RestaurantJsonLd details={locationDetails} siteUrl={SITE_URL} />
      )}
      <HomePageClient />
    </main>
  );
}
