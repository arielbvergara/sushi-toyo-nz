import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LocationService, LOCATION_CACHE_KEY } from "./location";
import { cache } from "../lib/cache";

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildPlacesApiResponse(overrides: Record<string, unknown> = {}) {
  return {
    ok: true,
    json: async () => ({
      places: [
        {
          displayName: { text: "Sushi Toyo Takapuna" },
          formattedAddress: "55 Hurstmere Road, Takapuna, Auckland 0622, New Zealand",
          rating: 4.6,
          userRatingCount: 312,
          googleMapsUri: "https://maps.google.com/?cid=test",
          reviews: [
            {
              relativePublishTimeDescription: "1 week ago",
              rating: 5,
              text: { text: "Great sushi!" },
              authorAttribution: {
                displayName: "Test Reviewer",
                photoUri: "https://example.com/photo.jpg",
              },
            },
          ],
          ...overrides,
        },
      ],
    }),
  };
}

// ── getMockPlaceDetails ───────────────────────────────────────────────────────

describe("LocationService.getMockPlaceDetails", () => {
  it("getMockPlaceDetails_ShouldReturnPlaceDetails_WhenCalled", () => {
    const service = new LocationService("");
    const result = service.getMockPlaceDetails();
    expect(result).toBeDefined();
  });

  it("getMockPlaceDetails_ShouldReturnCorrectPlaceName_WhenCalled", () => {
    const service = new LocationService("");
    const result = service.getMockPlaceDetails();
    expect(result.name).toBe("Sushi Toyo Takapuna");
  });

  it("getMockPlaceDetails_ShouldReturnValidRating_WhenCalled", () => {
    const service = new LocationService("");
    const result = service.getMockPlaceDetails();
    expect(result.rating).toBeGreaterThanOrEqual(1);
    expect(result.rating).toBeLessThanOrEqual(5);
  });

  it("getMockPlaceDetails_ShouldReturnPositiveTotalReviews_WhenCalled", () => {
    const service = new LocationService("");
    const result = service.getMockPlaceDetails();
    expect(result.totalReviews).toBeGreaterThan(0);
  });

  it("getMockPlaceDetails_ShouldReturnNonEmptyReviewsList_WhenCalled", () => {
    const service = new LocationService("");
    const result = service.getMockPlaceDetails();
    expect(result.reviews.length).toBeGreaterThan(0);
  });

  it("getMockPlaceDetails_ShouldReturnReviewsWithValidRatings_WhenCalled", () => {
    const service = new LocationService("");
    const result = service.getMockPlaceDetails();
    for (const review of result.reviews) {
      expect(review.rating).toBeGreaterThanOrEqual(1);
      expect(review.rating).toBeLessThanOrEqual(5);
    }
  });

  it("getMockPlaceDetails_ShouldReturnReviewsWithAuthorNames_WhenCalled", () => {
    const service = new LocationService("");
    const result = service.getMockPlaceDetails();
    for (const review of result.reviews) {
      expect(review.authorName).toBeTruthy();
    }
  });

  it("getMockPlaceDetails_ShouldReturnNonEmptyAddress_WhenCalled", () => {
    const service = new LocationService("");
    const result = service.getMockPlaceDetails();
    expect(result.address).toBeTruthy();
  });

  it("getMockPlaceDetails_ShouldReturnValidMapsUrl_WhenCalled", () => {
    const service = new LocationService("");
    const result = service.getMockPlaceDetails();
    expect(result.mapsUrl).toMatch(/^https?:\/\//);
  });
});

// ── getPlaceDetails ───────────────────────────────────────────────────────────

describe("LocationService.getPlaceDetails", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    cache.invalidate(LOCATION_CACHE_KEY);
  });

  afterEach(() => {
    cache.invalidate(LOCATION_CACHE_KEY);
  });

  it("getPlaceDetails_ShouldReturnMockData_WhenNoApiKeyProvided", async () => {
    const service = new LocationService("");
    const result = await service.getPlaceDetails();
    expect(result.name).toBe("Sushi Toyo Takapuna");
  });

  it("getPlaceDetails_ShouldCallPlacesApiNew_WhenApiKeyIsProvided", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce(buildPlacesApiResponse());
    vi.stubGlobal("fetch", mockFetch);

    const service = new LocationService("test-api-key");
    const result = await service.getPlaceDetails();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://places.googleapis.com/v1/places:searchText",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "X-Goog-Api-Key": "test-api-key",
          "X-Goog-FieldMask": expect.stringContaining("places.displayName"),
        }),
      })
    );
    expect(result.name).toBe("Sushi Toyo Takapuna");
    expect(result.rating).toBe(4.6);
    expect(result.totalReviews).toBe(312);
    expect(result.reviews).toHaveLength(1);
    expect(result.reviews[0].authorName).toBe("Test Reviewer");
    expect(result.reviews[0].text).toBe("Great sushi!");
    expect(result.reviews[0].relativeTimeDescription).toBe("1 week ago");
  });

  it("getPlaceDetails_ShouldThrow_WhenApiReturnsErrorObject", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        error: {
          status: "REQUEST_DENIED",
          message: "This API project is not authorized to use this API.",
        },
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const service = new LocationService("invalid-key");
    await expect(service.getPlaceDetails()).rejects.toThrow("REQUEST_DENIED");
  });

  it("getPlaceDetails_ShouldThrow_WhenApiReturnsNoPlaces", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ places: [] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const service = new LocationService("test-api-key");
    await expect(service.getPlaceDetails()).rejects.toThrow("no results");
  });

  it("getPlaceDetails_ShouldThrow_WhenHttpRequestFails", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 403,
    });
    vi.stubGlobal("fetch", mockFetch);

    const service = new LocationService("test-api-key");
    await expect(service.getPlaceDetails()).rejects.toThrow("HTTP 403");
  });

  it("getPlaceDetails_ShouldUseFallbackValues_WhenOptionalFieldsAreMissing", async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce(
      buildPlacesApiResponse({
        googleMapsUri: undefined,
        reviews: [
          {
            relativePublishTimeDescription: "3 days ago",
            rating: 4,
            // text and authorAttribution intentionally omitted
          },
        ],
      })
    );
    vi.stubGlobal("fetch", mockFetch);

    const service = new LocationService("test-api-key");
    const result = await service.getPlaceDetails();

    expect(result.mapsUrl).toMatch(/^https?:\/\//);
    expect(result.reviews[0].authorName).toBe("Anonymous");
    expect(result.reviews[0].text).toBe("");
  });
});

// ── getPlaceDetails — cache behaviour ────────────────────────────────────────

describe("LocationService.getPlaceDetails — cache behaviour", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    cache.invalidate(LOCATION_CACHE_KEY);
  });

  afterEach(() => {
    cache.invalidate(LOCATION_CACHE_KEY);
  });

  it("getPlaceDetails_ShouldReturnCachedResult_WhenCalledTwiceWithSameApiKey", async () => {
    const mockFetch = vi.fn().mockResolvedValue(buildPlacesApiResponse());
    vi.stubGlobal("fetch", mockFetch);

    const service = new LocationService("test-api-key");
    const first = await service.getPlaceDetails();
    const second = await service.getPlaceDetails();

    expect(first).toEqual(second);
  });

  it("getPlaceDetails_ShouldCallFetchOnce_WhenCalledTwiceAndCacheIsWarm", async () => {
    const mockFetch = vi.fn().mockResolvedValue(buildPlacesApiResponse());
    vi.stubGlobal("fetch", mockFetch);

    const service = new LocationService("test-api-key");
    await service.getPlaceDetails();
    await service.getPlaceDetails();

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("getPlaceDetails_ShouldCallFetchAgain_WhenCacheHasBeenInvalidated", async () => {
    const mockFetch = vi.fn().mockResolvedValue(buildPlacesApiResponse());
    vi.stubGlobal("fetch", mockFetch);

    const service = new LocationService("test-api-key");
    await service.getPlaceDetails();
    cache.invalidate(LOCATION_CACHE_KEY);
    await service.getPlaceDetails();

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("getPlaceDetails_ShouldCacheAllReviews_WhenApiReturnsMultipleReviews", async () => {
    const multiReviewResponse = buildPlacesApiResponse({
      reviews: [
        {
          relativePublishTimeDescription: "1 week ago",
          rating: 5,
          text: { text: "Review 1" },
          authorAttribution: { displayName: "Reviewer 1" },
        },
        {
          relativePublishTimeDescription: "2 weeks ago",
          rating: 4,
          text: { text: "Review 2" },
          authorAttribution: { displayName: "Reviewer 2" },
        },
        {
          relativePublishTimeDescription: "1 month ago",
          rating: 5,
          text: { text: "Review 3" },
          authorAttribution: { displayName: "Reviewer 3" },
        },
      ],
    });
    const mockFetch = vi.fn().mockResolvedValue(multiReviewResponse);
    vi.stubGlobal("fetch", mockFetch);

    const service = new LocationService("test-api-key");
    const result = await service.getPlaceDetails();
    cache.invalidate(LOCATION_CACHE_KEY); // force re-read to confirm data was cached, not truncated

    // Re-prime the cache to verify it stored all reviews
    const mockFetch2 = vi.fn().mockResolvedValue(multiReviewResponse);
    vi.stubGlobal("fetch", mockFetch2);
    const cached = await service.getPlaceDetails();

    expect(result.reviews).toHaveLength(3);
    expect(cached.reviews).toHaveLength(3);
  });

  it("getPlaceDetails_ShouldCacheMockData_WhenNoApiKeyProvided", async () => {
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    const service = new LocationService("");
    await service.getPlaceDetails();
    await service.getPlaceDetails();

    // Mock data path should never call fetch
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
