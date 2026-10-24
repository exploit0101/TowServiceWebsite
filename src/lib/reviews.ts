export type CustomerReview = {
  author: string;
  text: string;
  rating: number;
  date: string;
};
export type ReviewSummary = {
  verified: boolean;
  sourceUrl: string;
  rating: number | null;
  totalReviews: number | null;
  entries: readonly CustomerReview[];
};

// Publish actual customer feedback and its source here when supplied by the owner.
export const customerReviews: ReviewSummary = {
  verified: false,
  sourceUrl: "",
  rating: null,
  totalReviews: null,
  entries: [],
};

export function hasPublishableReviews(reviews: ReviewSummary): boolean {
  let validSource = false;
  try {
    validSource = new URL(reviews.sourceUrl).protocol === "https:";
  } catch {
    /* No source supplied. */
  }
  return (
    reviews.verified &&
    validSource &&
    typeof reviews.rating === "number" &&
    Number.isFinite(reviews.rating) &&
    reviews.rating >= 1 &&
    reviews.rating <= 5 &&
    Number.isInteger(reviews.totalReviews) &&
    (reviews.totalReviews ?? 0) >= reviews.entries.length &&
    reviews.entries.length > 0 &&
    reviews.entries.every(
      (review) =>
        review.author.trim() &&
        review.text.trim() &&
        Number.isInteger(review.rating) &&
        review.rating >= 1 &&
        review.rating <= 5 &&
        /^\d{4}-\d{2}-\d{2}$/.test(review.date),
    )
  );
}
