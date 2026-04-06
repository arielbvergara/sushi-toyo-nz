import { buildRestaurantSchema } from "@/lib/schema";
import type { PlaceDetails } from "@/types";

// No "use client" directive — this is a Server Component.
// The JSON-LD script tag is rendered in the initial HTML response so
// Googlebot can index structured data without executing JavaScript.

const JSON_LD_SCRIPT_TYPE = "application/ld+json";
const JSON_LD_SCRIPT_ID = "restaurant-schema";

interface Props {
  details: PlaceDetails;
  siteUrl: string;
}

export function RestaurantJsonLd({ details, siteUrl }: Props) {
  const schema = buildRestaurantSchema(details, siteUrl);
  return (
    <script
      id={JSON_LD_SCRIPT_ID}
      type={JSON_LD_SCRIPT_TYPE}
      // dangerouslySetInnerHTML is the correct pattern for JSON-LD in React.
      // The data is server-generated structured data, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
