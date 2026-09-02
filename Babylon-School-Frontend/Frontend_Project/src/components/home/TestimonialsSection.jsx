import { useState, useEffect, useCallback } from "react";
import { publicApi } from "../../services/api";
import { mediaUrl } from "../../lib/media";
import usePublicData from "../../hooks/usePublicData";
import EmptyState from "../common/EmptyState";

export default function TestimonialsSection() {
  const { data, loading } = usePublicData(publicApi.testimonials, []);
  const [current, setCurrent] = useState(0);

  // Reset to first slide when data changes
  useEffect(() => {
    setCurrent(0);
  }, [data]);

  const total = data.length;

  const goTo = useCallback(
    (index) => {
      if (total === 0) return;
      setCurrent((index + total) % total);
    },
    [total],
  );

  const prev = () => goTo(current - 1);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, total]);

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
                {data[current].question || "What are your expectation for the school in preparing students for challenges in a globalized world?"}
              </h3>

              <p className="testimonial-message">
                {data[current].message}
              </p>

              <div className="testimonial-meta">
                <span className="testimonial-name">{data[current].name}</span>
                {data[current].designation && (
                  <span className="testimonial-role">
                    {data[current].designation}
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
                  data[current].image
                    ? mediaUrl(data[current].image)
                    : "/images/default-avatar.png"
                }
                alt={data[current].name || "Parent"}
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