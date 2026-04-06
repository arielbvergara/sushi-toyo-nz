import type { PlaceDetails } from "@/types";
import {
  PHONE_NUMBER,
  ADDRESS_LINE_1,
  ADDRESS_LINE_2,
  ADDRESS_LINE_3,
  RESTAURANT_URL,
  MENU_URL,
  SERVES_CUISINE,
  PRICE_RANGE,
} from "@/constants/restaurant";

// ── Relative-time parsing ─────────────────────────────────────────────────────

const RELATIVE_TIME_PATTERNS: Array<{ pattern: RegExp; toMs: (n: number) => number }> = [
  { pattern: /^(\d+)\s+year[s]?\s+ago$/i,   toMs: (n) => n * 365 * 24 * 60 * 60 * 1000 },
  { pattern: /^a\s+year\s+ago$/i,            toMs: ()  => 365 * 24 * 60 * 60 * 1000 },
  { pattern: /^(\d+)\s+month[s]?\s+ago$/i,  toMs: (n) => n * 30 * 24 * 60 * 60 * 1000 },
  { pattern: /^a\s+month\s+ago$/i,           toMs: ()  => 30 * 24 * 60 * 60 * 1000 },
  { pattern: /^(\d+)\s+week[s]?\s+ago$/i,   toMs: (n) => n * 7 * 24 * 60 * 60 * 1000 },
  { pattern: /^a\s+week\s+ago$/i,            toMs: ()  => 7 * 24 * 60 * 60 * 1000 },
  { pattern: /^(\d+)\s+day[s]?\s+ago$/i,    toMs: (n) => n * 24 * 60 * 60 * 1000 },
  { pattern: /^yesterday$/i,                 toMs: ()  => 24 * 60 * 60 * 1000 },
  { pattern: /^a\s+day\s+ago$/i,             toMs: ()  => 24 * 60 * 60 * 1000 },
  { pattern: /^(\d+)\s+hour[s]?\s+ago$/i,   toMs: (n) => n * 60 * 60 * 1000 },
  { pattern: /^an?\s+hour\s+ago$/i,          toMs: ()  => 60 * 60 * 1000 },
];

export function approximateDatePublished(relativeTimeDescription: string): string {
  const input = relativeTimeDescription.trim();

  for (const { pattern, toMs } of RELATIVE_TIME_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      const n = match[1] ? parseInt(match[1], 10) : 1;
      const approximateDate = new Date(Date.now() - toMs(n));
      return approximateDate.toISOString().split("T")[0];
    }
  }

  // Fallback: "just now", unrecognised strings, etc.
  return new Date().toISOString().split("T")[0];
}

// ── Schema builder ────────────────────────────────────────────────────────────

const SCHEMA_CONTEXT = "https://schema.org";
const SCHEMA_TYPE_RESTAURANT = ["Restaurant", "LocalBusiness"] as const;
const SCHEMA_TYPE_POSTAL_ADDRESS = "PostalAddress";
const SCHEMA_TYPE_AGGREGATE_RATING = "AggregateRating";
const SCHEMA_TYPE_REVIEW = "Review";
const SCHEMA_TYPE_RATING = "Rating";
const SCHEMA_TYPE_PERSON = "Person";

const RATING_BEST = 5;
const RATING_WORST = 1;
const RESTAURANT_NAME = "Sushi Toyo";
const ADDRESS_REGION = "Auckland";
const ADDRESS_COUNTRY = "NZ";
const ADDRESS_POSTAL_CODE = "0622";

export function buildRestaurantSchema(details: PlaceDetails, siteUrl: string): object {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": SCHEMA_TYPE_RESTAURANT,
    name: RESTAURANT_NAME,
    url: siteUrl,
    telephone: PHONE_NUMBER,
    servesCuisine: SERVES_CUISINE,
    priceRange: PRICE_RANGE,
    hasMap: details.mapsUrl,
    hasMenu: `${siteUrl}${MENU_URL}`,
    address: {
      "@type": SCHEMA_TYPE_POSTAL_ADDRESS,
      streetAddress: ADDRESS_LINE_1,
      addressLocality: ADDRESS_LINE_2.split(",")[0].trim(),
      addressRegion: ADDRESS_REGION,
      postalCode: ADDRESS_POSTAL_CODE,
      addressCountry: ADDRESS_COUNTRY,
    },
    aggregateRating: {
      "@type": SCHEMA_TYPE_AGGREGATE_RATING,
      ratingValue: details.rating,
      reviewCount: details.totalReviews,
      bestRating: RATING_BEST,
      worstRating: RATING_WORST,
    },
    review: details.reviews.map((r) => ({
      "@type": SCHEMA_TYPE_REVIEW,
      author: {
        "@type": SCHEMA_TYPE_PERSON,
        name: r.authorName,
      },
      reviewRating: {
        "@type": SCHEMA_TYPE_RATING,
        ratingValue: r.rating,
        bestRating: RATING_BEST,
        worstRating: RATING_WORST,
      },
      reviewBody: r.text,
      datePublished: approximateDatePublished(r.relativeTimeDescription),
    })),
  };
}
