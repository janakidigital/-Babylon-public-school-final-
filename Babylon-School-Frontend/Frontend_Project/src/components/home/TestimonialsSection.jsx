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
        <h2>What parents & students say</h2>
      </div>

      {loading ? (
        <p className="testimonials-loading">Loading testimonials...</p>
      ) : total === 0 ? (
        <EmptyState title="No testimonials yet" />
      ) : (
        <div className="testimonial-slider">
          {/* Current testimonial */}
          <div className="testimonial-slide">
            <blockquote key={data[current]._id || data[current].name}>
              <p className="testimonial-message">“{data[current].message}”</p>

              <div className="testimonial-footer">
                {data[current].image && (
                  <img
                    src={mediaUrl(data[current].image)}
                    alt={data[current].name}
                    className="testimonial-avatar"
                  />
                )}
                <div className="testimonial-meta">
                  <span className="testimonial-name">{data[current].name}</span>
                  {data[current].designation && (
                    <span className="testimonial-role">
                      {data[current].designation}
                    </span>
                  )}
                </div>
              </div>
            </blockquote>
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

              <div className="testimonial-dots">
                {data.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`dot ${index === current ? "active" : ""}`}
                    onClick={() => goTo(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

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