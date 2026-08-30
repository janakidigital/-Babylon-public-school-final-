import { useState } from "react";
import PageBanner from "../../components/common/PageBanner";
import EmptyState from "../../components/common/EmptyState";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { mediaUrl } from "../../lib/media";
import { assetPath } from "../../data/content";

export default function AchievementsPage() {
  const { data, loading } = usePublicData(publicApi.achievements, []);
  const items = [...data].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
  );

  const [expanded, setExpanded] = useState({});

  const toggleExpand = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const DESCRIPTION_LIMIT = 140;

  return (
    <>
      <PageBanner
        eyebrow="ACHIEVEMENTS"
        title="Celebrating every success."
        image="banner/counter_bg.jpg"
      />

      <section className="listing-page shell">
        <div className="center-heading">
          <p className="eyebrow">SCHOOL HIGHLIGHTS</p>
          <h2>Milestones from our community.</h2>
        </div>

        {loading ? (
          <p>Loading achievements...</p>
        ) : items.length === 0 ? (
          <EmptyState
            title="No achievements published"
            text="Add awards and milestones from the admin dashboard."
          />
        ) : (
          <div
            className="facility-grid"
            style={{
              display: "grid",
              // Mobile-first: 1 column on small screens
              // On wider screens it becomes 2+ columns automatically
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
              gap: "1.5rem",
              marginTop: "2rem",
              width: "100%",
            }}
          >
            {items.map((item, index) => {
              const key = item._id || index;
              const fullText = item.description || item.category || "";
              const isLong = fullText.length > DESCRIPTION_LIMIT;
              const isExpanded = !!expanded[key];
              const displayText =
                isExpanded || !isLong
                  ? fullText
                  : fullText.slice(0, DESCRIPTION_LIMIT).trim() + "...";

              return (
                <article
                  key={key}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.07)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    width: "100%",          // full width of the grid cell
                    maxWidth: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 28px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(0,0,0,0.07)";
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={mediaUrl(
                        item.image,
                        `${assetPath}blog/blog_${(index % 3) + 1}.jpg`
                      )}
                      alt={item.title || ""}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      padding: "1.25rem 1.35rem 1.5rem",
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 0.6rem",
                        color: "#1a3c6e",
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        lineHeight: 1.35,
                      }}
                    >
                      {item.year ? `${item.year} · ` : ""}
                      {item.title}
                    </h3>

                    {fullText && (
                      <>
                        <p
                          style={{
                            margin: 0,
                            color: "#555",
                            fontSize: "0.95rem",
                            lineHeight: 1.6,
                            flexGrow: 1,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {displayText}
                        </p>

                        {isLong && (
                          <button
                            type="button"
                            onClick={() => toggleExpand(key)}
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              marginTop: "0.6rem",
                              color: "#1a3c6e",
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              cursor: "pointer",
                              textDecoration: "underline",
                              textUnderlineOffset: "3px",
                              alignSelf: "flex-start",
                            }}
                          >
                            {isExpanded ? "Show less" : "more..."}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <TestimonialsSection />
    </>
  );
}