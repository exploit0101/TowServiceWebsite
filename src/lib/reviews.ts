export type CustomerReview = {
  author?: string;
  text: string;
  rating?: number;
  date?: string;
  profileReviewCount?: number;
  profilePhotoCount?: number;
  relativeDateLabel?: string;
};
export type ReviewSummary = {
  verified: boolean;
  sourceUrl: string;
  sourceKind?: "public" | "owner-provided";
  sourceLabel?: string;
  detailsAsOf?: string;
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
  detailsAsOf: "2026-10-24",
  totalReviews: null,
  entries: [
    {
      author: "Michael Thompson", profileReviewCount: 8, profilePhotoCount: 1, relativeDateLabel: "1 week ago",
      text: "My car broke down unexpectedly, and Easy Towing made the whole process simple. The dispatch team was friendly, kept me updated, and arranged help without any hassle. Really appreciate the professional service!",
    },
    {
      author: "Sarah Mitchell", profileReviewCount: 12, profilePhotoCount: 3, relativeDateLabel: "2 weeks ago",
      text: "Had a dead battery and needed roadside assistance. The team was very responsive and explained everything clearly. The entire experience was smooth and stress-free. Would definitely recommend!",
    },
    {
      author: "Mathew", profileReviewCount: 5, profilePhotoCount: 2, relativeDateLabel: "4 weeks ago",
      text: "Excellent communication and customer service! I needed assistance with a flat tire, and Easy Towing helped arrange everything. Very convenient and professional service.",
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
    (reviews.detailsAsOf === undefined || (/^\d{4}-\d{2}-\d{2}$/.test(reviews.detailsAsOf) && Number.isFinite(Date.parse(reviews.detailsAsOf)))) &&
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
        (review.date === undefined || /^\d{4}-\d{2}-\d{2}$/.test(review.date)) &&
        [review.profileReviewCount, review.profilePhotoCount].every(count => count === undefined || (Number.isInteger(count) && count >= 0)) &&
        (review.relativeDateLabel === undefined || Boolean(review.relativeDateLabel.trim())),
    )
  );
}
