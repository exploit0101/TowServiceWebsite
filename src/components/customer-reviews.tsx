import Link from "next/link";
import { MessageSquareQuote, Star, ArrowUpRight, Camera, MessageSquare, Clock3 } from "lucide-react";
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
                  <figcaption>
                    <span className="review-avatar" aria-hidden="true">
                      {review.author ? review.author.trim().split(/\s+/).map(part => part.charAt(0)).slice(0,2).join('') : <MessageSquareQuote size={17}/>}
                    </span>
                    <span className="review-person">
                      <strong>{review.author || "Customer feedback"}</strong>
                      <span className="review-profile-details">
                        {review.profileReviewCount !== undefined && <span><MessageSquare size={12} aria-hidden="true"/>{review.profileReviewCount} {review.profileReviewCount === 1 ? 'review' : 'reviews'}</span>}
                        {review.profilePhotoCount !== undefined && <span><Camera size={12} aria-hidden="true"/>{review.profilePhotoCount} {review.profilePhotoCount === 1 ? 'photo' : 'photos'}</span>}
                      </span>
                      {review.date && <time dateTime={review.date}>{review.date}</time>}
                    </span>
                  </figcaption>
                  {review.relativeDateLabel && <span className="review-date-label"><Clock3 size={12} aria-hidden="true"/>{review.relativeDateLabel}</span>}
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
                </figure>
              ))}
            </div>
            {reviews.sourceLabel && (
              <p className="review-source">{reviews.sourceLabel}.{reviews.detailsAsOf && <> Profile details as of {new Intl.DateTimeFormat('en-CA',{dateStyle:'long',timeZone:'UTC'}).format(new Date(`${reviews.detailsAsOf}T00:00:00Z`))}.</>}</p>
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
