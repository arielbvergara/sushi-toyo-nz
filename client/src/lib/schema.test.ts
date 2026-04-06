import { describe, it, expect } from "vitest";
import { approximateDatePublished, buildRestaurantSchema } from "./schema";
import type { PlaceDetails } from "@/types";

// ── Fixtures ──────────────────────────────────────────────────────────────────

function buildPlaceDetails(overrides: Partial<PlaceDetails> = {}): PlaceDetails {
  return {
    name: "Sushi Toyo Takapuna",
    address: "55 Hurstmere Road, Takapuna, Auckland 0622, New Zealand",
    rating: 4.6,
    totalReviews: 312,
    mapsUrl: "https://maps.google.com/?cid=test",
    reviews: [
      {
        authorName: "Alice",
        rating: 5,
        text: "Amazing sushi!",
        relativeTimeDescription: "1 week ago",
      },
      {
        authorName: "Bob",
        rating: 4,
        text: "Really good value.",
        relativeTimeDescription: "2 months ago",
      },
    ],
    ...overrides,
  };
}

const TEST_SITE_URL = "https://sushitoyo.co.nz";

// ── approximateDatePublished ──────────────────────────────────────────────────

describe("approximateDatePublished", () => {
  // The function returns a date-only string (midnight UTC), so the tolerance
  // must account for the time-of-day component — up to 24 h difference is normal.
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  it("approximateDatePublished_ShouldReturnIsoDateString_WhenRelativeTimeIsWeeks", () => {
    const result = approximateDatePublished("2 weeks ago");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const date = new Date(result);
    const expected = new Date(Date.now() - 14 * ONE_DAY_MS);
    expect(Math.abs(date.getTime() - expected.getTime())).toBeLessThan(ONE_DAY_MS);
  });

  it("approximateDatePublished_ShouldReturnIsoDateString_WhenRelativeTimeIsDays", () => {
    const result = approximateDatePublished("3 days ago");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const date = new Date(result);
    const expected = new Date(Date.now() - 3 * ONE_DAY_MS);
    expect(Math.abs(date.getTime() - expected.getTime())).toBeLessThan(ONE_DAY_MS);
  });

  it("approximateDatePublished_ShouldReturnIsoDateString_WhenRelativeTimeIsMonths", () => {
    const result = approximateDatePublished("1 month ago");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const date = new Date(result);
    const expected = new Date(Date.now() - 30 * ONE_DAY_MS);
    expect(Math.abs(date.getTime() - expected.getTime())).toBeLessThan(ONE_DAY_MS);
  });

  it("approximateDatePublished_ShouldReturnIsoDateString_WhenRelativeTimeIsYears", () => {
    const result = approximateDatePublished("a year ago");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const date = new Date(result);
    const expected = new Date(Date.now() - 365 * ONE_DAY_MS);
    expect(Math.abs(date.getTime() - expected.getTime())).toBeLessThan(ONE_DAY_MS);
  });

  it("approximateDatePublished_ShouldReturnIsoDateString_WhenRelativeTimeIsYesterday", () => {
    const result = approximateDatePublished("yesterday");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const date = new Date(result);
    const expected = new Date(Date.now() - ONE_DAY_MS);
    expect(Math.abs(date.getTime() - expected.getTime())).toBeLessThan(ONE_DAY_MS);
  });

  it("approximateDatePublished_ShouldReturnTodayFallback_WhenRelativeTimeIsUnrecognised", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(approximateDatePublished("just now")).toBe(today);
    expect(approximateDatePublished("")).toBe(today);
    expect(approximateDatePublished("some time ago")).toBe(today);
  });

  it("approximateDatePublished_ShouldNeverReturnFutureDate_WhenAnyInputGiven", () => {
    const testInputs = ["2 weeks ago", "1 month ago", "yesterday", "just now", "unknown"];
    const now = new Date().toISOString().split("T")[0];
    for (const input of testInputs) {
      const result = approximateDatePublished(input);
      expect(result <= now).toBe(true);
    }
  });
});

// ── buildRestaurantSchema ─────────────────────────────────────────────────────

describe("buildRestaurantSchema", () => {
  it("buildRestaurantSchema_ShouldIncludeCorrectType_WhenCalled", () => {
    const schema = buildRestaurantSchema(buildPlaceDetails(), TEST_SITE_URL) as Record<string, unknown>;
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toContain("Restaurant");
    expect(schema["@type"]).toContain("LocalBusiness");
  });

  it("buildRestaurantSchema_ShouldEmbedAggregateRating_WhenDetailsHaveRating", () => {
    const details = buildPlaceDetails({ rating: 4.6, totalReviews: 312 });
    const schema = buildRestaurantSchema(details, TEST_SITE_URL) as Record<string, unknown>;
    const rating = schema["aggregateRating"] as Record<string, unknown>;
    expect(rating["@type"]).toBe("AggregateRating");
    expect(rating["ratingValue"]).toBe(4.6);
    expect(rating["reviewCount"]).toBe(312);
    expect(rating["bestRating"]).toBe(5);
    expect(rating["worstRating"]).toBe(1);
  });

  it("buildRestaurantSchema_ShouldMapAllReviews_WhenDetailsHaveMultipleReviews", () => {
    const schema = buildRestaurantSchema(buildPlaceDetails(), TEST_SITE_URL) as Record<string, unknown>;
    const reviews = schema["review"] as unknown[];
    expect(reviews).toHaveLength(2);
  });

  it("buildRestaurantSchema_ShouldNotTruncateReviews_WhenMoreThanThreeReviewsProvided", () => {
    const details = buildPlaceDetails({
      reviews: Array.from({ length: 10 }, (_, i) => ({
        authorName: `Reviewer ${i}`,
        rating: 5,
        text: `Review ${i}`,
        relativeTimeDescription: "1 week ago",
      })),
    });
    const schema = buildRestaurantSchema(details, TEST_SITE_URL) as Record<string, unknown>;
    const reviews = schema["review"] as unknown[];
    expect(reviews).toHaveLength(10);
  });

  it("buildRestaurantSchema_ShouldSetHasMenuUrl_WhenSiteUrlProvided", () => {
    const schema = buildRestaurantSchema(buildPlaceDetails(), TEST_SITE_URL) as Record<string, unknown>;
    expect(schema["hasMenu"]).toBe("https://sushitoyo.co.nz/menu");
  });

  it("buildRestaurantSchema_ShouldIncludeAddressFields_WhenCalled", () => {
    const schema = buildRestaurantSchema(buildPlaceDetails(), TEST_SITE_URL) as Record<string, unknown>;
    const address = schema["address"] as Record<string, unknown>;
    expect(address["@type"]).toBe("PostalAddress");
    expect(address["streetAddress"]).toBe("55 Hurstmere Road");
    expect(address["addressCountry"]).toBe("NZ");
    expect(address["postalCode"]).toBe("0622");
  });

  it("buildRestaurantSchema_ShouldIncludePhoneAndCuisine_WhenCalled", () => {
    const schema = buildRestaurantSchema(buildPlaceDetails(), TEST_SITE_URL) as Record<string, unknown>;
    expect(schema["telephone"]).toBe("+64 9 486 0062");
    expect(schema["servesCuisine"]).toBe("Japanese");
    expect(schema["priceRange"]).toBe("$$");
  });

  it("buildRestaurantSchema_ShouldHandleEmptyReviewsArray_WhenDetailsHaveNoReviews", () => {
    const details = buildPlaceDetails({ reviews: [] });
    const schema = buildRestaurantSchema(details, TEST_SITE_URL) as Record<string, unknown>;
    const reviews = schema["review"] as unknown[];
    expect(reviews).toHaveLength(0);
  });

  it("buildRestaurantSchema_ShouldMapReviewFields_WhenReviewsProvided", () => {
    const schema = buildRestaurantSchema(buildPlaceDetails(), TEST_SITE_URL) as Record<string, unknown>;
    const reviews = schema["review"] as Array<Record<string, unknown>>;
    const first = reviews[0];
    expect(first["@type"]).toBe("Review");
    const author = first["author"] as Record<string, unknown>;
    expect(author["@type"]).toBe("Person");
    expect(author["name"]).toBe("Alice");
    const rating = first["reviewRating"] as Record<string, unknown>;
    expect(rating["ratingValue"]).toBe(5);
    expect(first["reviewBody"]).toBe("Amazing sushi!");
    expect(first["datePublished"]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("buildRestaurantSchema_ShouldIncludeMapsUrl_WhenDetailsHaveMapsUrl", () => {
    const details = buildPlaceDetails({ mapsUrl: "https://maps.google.com/?cid=test" });
    const schema = buildRestaurantSchema(details, TEST_SITE_URL) as Record<string, unknown>;
    expect(schema["hasMap"]).toBe("https://maps.google.com/?cid=test");
  });
});
