"use client";

import { useEffect, useState } from "react";
import type { PlaceReview } from "@/types";
import { StarRating } from "@/components/ui/StarRating";
import { api } from "@/lib/api";

const MAX_REVIEWS_DISPLAYED = 3;

const PLACEHOLDER_REVIEWS: PlaceReview[] = [
  {
    authorName: "Niky Warner",
    rating: 5,
    text: "The food always comes out superbly and is always fresh and delicious. One of the best Japanese restaurants I've found on The North Shore.",
    relativeTimeDescription: "a month ago",
  },
  {
    authorName: "Google Reviewer",
    rating: 5,
    text: "Super welcoming staff and the food was incredibly yummy. A great spot for authentic Japanese food in Takapuna.",
    relativeTimeDescription: "2 weeks ago",
  },
  {
    authorName: "Glen Lee Customer",
    rating: 5,
    text: "Generous portions and excellent value for money. The donburi bowls are absolutely outstanding. Will be back!",
    relativeTimeDescription: "3 weeks ago",
  },
];

function HomeReviewCard({ review }: { review: PlaceReview }) {
  return (
    <div
      className="flex flex-col gap-4 p-6"
      style={{ backgroundColor: "#2A2520", border: "1px solid #3A3530" }}
    >
      <StarRating rating={review.rating} size="sm" />
      <p className="text-sm leading-relaxed" style={{ color: "#C8BDAF" }}>
        {review.text}
      </p>
      <p className="text-xs font-semibold" style={{ color: "#9C8E7E" }}>
        — {review.authorName}
      </p>
    </div>
  );
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<PlaceReview[]>(PLACEHOLDER_REVIEWS);

  useEffect(() => {
    api.location.getDetails().then((res) => {
      if (res.success && res.data && res.data.reviews.length > 0) {
        setReviews(res.data.reviews.slice(0, MAX_REVIEWS_DISPLAYED));
      }
    });
  }, []);

  return (
    <section id="reviews" className="py-20 px-8" style={{ backgroundColor: "#231F1C" }}>
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ color: "#C9A96E" }}
          >
            Reviews
          </p>
          <h2
            style={{
              fontFamily: "var(--font-family-heading)",
              fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 400,
              color: "#F5F0E8",
            }}
          >
            What Our Guests Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <HomeReviewCard key={`${review.authorName}-${i}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
