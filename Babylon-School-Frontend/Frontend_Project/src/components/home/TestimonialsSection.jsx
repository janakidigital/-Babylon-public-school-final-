import { useState, useEffect, useCallback, useId } from "react";
import { publicApi } from "../../services/api";
import { mediaUrl } from "../../lib/media";
import usePublicData from "../../hooks/usePublicData";
import EmptyState from "../common/EmptyState";
import RichText from "../shared/RichText";
import { richTextToPlainText } from "../../lib/richText";

const PREVIEW_LENGTH = 280;

export default function TestimonialsSection() {
  const { data, loading } = usePublicData(publicApi.testimonials, []);
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const messageId = useId();

  // Reset to first slide when data changes
  useEffect(() => {
    setCurrent(0);
    setExpanded(false);
  }, [data]);

  const total = data.length;

  const goTo = useCallback(
    (index) => {
      if (total === 0) return;
      setCurrent((index + total) % total);
      setExpanded(false);
    },
    [total],
  );

  const prev = () => goTo(current - 1);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // Pause auto-scroll while the full testimonial is being read.
  useEffect(() => {
    if (total <= 1 || expanded) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, total, expanded]);

  const testimonial = data[current] || data[0];
  const plainMessage = richTextToPlainText(testimonial?.message).replace(/\s+/g, " ").trim();
  const isLong = plainMessage.length > PREVIEW_LENGTH;
  const preview = isLong
    ? `${plainMessage.slice(0, PREVIEW_LENGTH).replace(/\s+\S*$/, "").trimEnd()}…`
    : plainMessage;

  return (
    <section className="testimonials shell">
      <div className="center-heading">
        <p className="eyebrow">OUR COMMUNITY</p>
        <h2>Hear from Our Valued Parents</h2>
      </div>

      {loading ? (
        <p className="testimonials-loading">Loading testimonials...</p>
      ) : total === 0 ? (
        <EmptyState title="No testimonials yet" />
      ) : (
        <div className="testimonial-slider">
          <div className="testimonial-slide">
            {/* Left content */}
            <div className="testimonial-content">
              <div className="quote-icon">
                <span>”</span>
              </div>

              <h3 className="testimonial-question">
                {testimonial.question}
              </h3>

              <RichText
                id={messageId}
                className="testimonial-message"
                value={isLong && !expanded ? preview : testimonial.message}
              />
              {isLong && (
                <button
                  type="button"
                  className="testimonial-toggle"
                  aria-expanded={expanded}
                  aria-controls={messageId}
                  onClick={() => setExpanded(value => !value)}
                >
                  {expanded ? "See less" : "See more"}
                </button>
              )}

              <div className="testimonial-meta">
                <span className="testimonial-name">{testimonial.name}</span>
                {testimonial.designation && (
                  <span className="testimonial-role">
                    {testimonial.designation}
                  </span>
                )}
              </div>
            </div>

            {/* Right side – large circular image + shapes */}
            <div className="testimonial-image-wrap">
              <div className="shape shape-green" />
              <div className="shape shape-blue" />

              {/* Image is always rendered */}
              <img
                src={
                  testimonial.image
                    ? mediaUrl(testimonial.image)
                    : "/images/default-avatar.png"
                }
                alt={testimonial.name || "Parent"}
                className="testimonial-avatar-large"
                onError={(e) => {
                  e.currentTarget.src = "/images/default-avatar.png";
                }}
              />
            </div>
          </div>

          {/* Navigation */}
          {total > 1 && (
            <div className="testimonial-nav">
              <button
                type="button"
                className="testimonial-btn prev"
                onClick={prev}
                aria-label="Previous testimonial"
              >
                ‹
              </button>

              <button
                type="button"
                className="testimonial-btn next"
                onClick={next}
                aria-label="Next testimonial"
              >
                ›
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
