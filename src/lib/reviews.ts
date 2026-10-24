export type CustomerReview = {
  author?: string;
  text: string;
  rating?: number;
  date?: string;
};
export type ReviewSummary = {
  verified: boolean;
  sourceUrl: string;
  sourceKind?: "public" | "owner-provided";
  sourceLabel?: string;
  rating: number | null;
  totalReviews: number | null;
  entries: readonly CustomerReview[];
};

/** Owner-supplied feedback. No platform, individual star scores, names or dates are inferred. */
export const customerReviews: ReviewSummary = {
  verified: true,
  sourceUrl: "",
  sourceKind: "owner-provided",
  sourceLabel: "Rating and customer feedback supplied by EasyTowing",
  rating: 4.9,
  totalReviews: null,
  entries: [
    {
      text: "Easy Towing made a stressful situation much easier. The dispatch team was helpful, communication was clear, and the towing service was handled professionally.",
    },
    {
      text: "Great communication and helpful service. The team explained everything clearly and helped me arrange the roadside assistance I needed. A positive experience overall.",
    },
    {
      text: "I needed help with a dead car battery and contacted Easy Towing. The process was straightforward, and I appreciated being kept informed while assistance was arranged.",
    },
  ],
};

export function hasPublishableReviews(reviews: ReviewSummary): boolean {
  const suppliedByOwner =
    reviews.sourceKind === "owner-provided" &&
    Boolean(reviews.sourceLabel?.trim());
  let publicSource = false;
  try {
    publicSource = new URL(reviews.sourceUrl).protocol === "https:";
  } catch {
    /* Owner-supplied feedback need not have a public URL. */
  }
  const validCount =
    reviews.totalReviews === null
      ? suppliedByOwner
      : Number.isInteger(reviews.totalReviews) &&
        reviews.totalReviews >= reviews.entries.length;
  return (
    reviews.verified &&
    (suppliedByOwner || publicSource) &&
    typeof reviews.rating === "number" &&
    Number.isFinite(reviews.rating) &&
    reviews.rating >= 1 &&
    reviews.rating <= 5 &&
    validCount &&
    reviews.entries.length > 0 &&
    reviews.entries.every(
      (review) =>
        Boolean(review.text.trim()) &&
        (review.author === undefined || Boolean(review.author.trim())) &&
        (review.rating === undefined ||
          (Number.isInteger(review.rating) &&
            review.rating >= 1 &&
            review.rating <= 5)) &&
        (review.date === undefined || /^\d{4}-\d{2}-\d{2}$/.test(review.date)),
    )
  );
}
