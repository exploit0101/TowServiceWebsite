import Link from "next/link";
import { MessageSquareQuote, Quote, Star, ArrowUpRight } from "lucide-react";
import {
  customerReviews,
  hasPublishableReviews,
  type ReviewSummary,
} from "@/lib/reviews";

export function CustomerReviews({
  reviews = customerReviews,
}: {
  reviews?: ReviewSummary;
}) {
  const publishable = hasPublishableReviews(reviews);
  const summary = (
    <>
      <strong>
        {reviews.rating?.toFixed(1)}
        <small>/5</small>
      </strong>
      <span>
        <span className="review-stars" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={15} />
          ))}
        </span>
        <span>
          {reviews.totalReviews !== null
            ? `From ${reviews.totalReviews} customer reviews`
            : "Customer feedback"}
          {reviews.sourceUrl && <ArrowUpRight size={13} aria-hidden="true" />}
        </span>
      </span>
    </>
  );
  return (
    <section
      id="reviews"
      className={`reviews-section${publishable ? " has-reviews" : ""}`}
      aria-labelledby="reviews-heading"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span />
              CUSTOMER REVIEWS
            </div>
            <h2 id="reviews-heading">Your experience matters.</h2>
          </div>
          {publishable &&
            (reviews.sourceUrl ? (
              <a href={reviews.sourceUrl} className="review-summary">
                {summary}
              </a>
            ) : (
              <div className="review-summary">{summary}</div>
            ))}
        </div>
        {publishable ? (
          <>
            <div className="review-grid">
              {reviews.entries.slice(0, 4).map((review, index) => (
                <figure
                  className="review-card"
                  key={`${review.author || "feedback"}-${index}`}
                >
                  <Quote size={23} aria-hidden="true" />
                  {review.rating !== undefined && (
                    <div
                      className="review-stars"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: review.rating }, (_, i) => (
                        <Star key={i} size={15} aria-hidden="true" />
                      ))}
                    </div>
                  )}
                  <blockquote>{review.text}</blockquote>
                  <figcaption>
                    <span className="review-avatar" aria-hidden="true">
                      {review.author ? (
                        review.author.trim().charAt(0)
                      ) : (
                        <MessageSquareQuote size={17} />
                      )}
                    </span>
                    <span>
                      <strong>{review.author || "Customer feedback"}</strong>
                      {review.date && (
                        <time dateTime={review.date}>{review.date}</time>
                      )}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
            {reviews.sourceLabel && (
              <p className="review-source">{reviews.sourceLabel}.</p>
            )}
          </>
        ) : (
          <div className="review-invitation">
            <span className="review-invitation-icon">
              <MessageSquareQuote size={30} aria-hidden="true" />
            </span>
            <div>
              <h3>Used easytowing? We’d love to hear from you.</h3>
              <p>Share what went well, or tell us how we can help.</p>
            </div>
            <Link href="/contact" className="button button-outline">
              Share your feedback
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
