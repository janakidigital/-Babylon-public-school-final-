import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageBanner from "../../components/common/PageBanner";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { mediaUrl } from "../../lib/media";
import { assetPath } from "../../data/content";

export default function FacilitiesPage() {
  const { id } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, loading } = usePublicData(publicApi.facilities, []);

  const items = [...data].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
  );

  const selectedFacility = id
    ? items.find((item) => item._id === id)
    : null;

  // ~5–6 lines threshold for detail view
  const DESCRIPTION_LIMIT = 280;
  const fullDescription =
    selectedFacility?.description ||
    "Thoughtfully equipped spaces that support meaningful learning and wellbeing.";
  const isLong = fullDescription.length > DESCRIPTION_LIMIT;
  const displayDescription =
    isExpanded || !isLong
      ? fullDescription
      : fullDescription.slice(0, DESCRIPTION_LIMIT).trim() + "...";

  return (
    <>
      <PageBanner
        eyebrow="OUR FACILITIES"
        title={
          selectedFacility
            ? selectedFacility.title
            : "Spaces designed for discovery."
        }
        image="banner/inner_banner_5.jpg"
      />

      <section className="listing-page shell">
        {loading ? (
          <p>Loading facilities...</p>
        ) : id ? (
          // =========================
          // SINGLE FACILITY DETAIL (card)
          // =========================
          selectedFacility ? (
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <img
                  src={mediaUrl(
                    selectedFacility.image,
                    `${assetPath}courses/courses_1.jpg`
                  )}
                  alt={selectedFacility.title || ""}
                  style={{
                    width: "100%",
                    height: "420px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                <div style={{ padding: "2.25rem 2.5rem 2.5rem" }}>
                  <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>
                    OUR FACILITY
                  </p>

                  <h2
                    style={{
                      margin: "0 0 1.25rem",
                      color: "#1a3c6e",
                      fontSize: "1.75rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {selectedFacility.title}
                  </h2>

                  <p
                    style={{
                      color: "#555",
                      lineHeight: 1.75,
                      fontSize: "1.05rem",
                      margin: 0,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {displayDescription}
                  </p>

                  {isLong && (
                    <button
                      type="button"
                      onClick={() => setIsExpanded((prev) => !prev)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        marginTop: "0.75rem",
                        color: "#1a3c6e",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        cursor: "pointer",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                      }}
                    >
                      {isExpanded ? "Show less" : "more..."}
                    </button>
                  )}

                  <div style={{ marginTop: "2rem" }}>
                    <Link
                      to="/facilities"
                      className="button"
                      style={{ display: "inline-block" }}
                    >
                      ← Back to Facilities
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState title="Facility not found" />
          )
        ) : (
          // =========================
          // ALL FACILITIES – proper cards (mobile friendly)
          // =========================
          <>
            <div className="center-heading">
              <p className="eyebrow">OUR CAMPUS</p>
              <h2>Everything students need to thrive.</h2>
            </div>

            {items.length === 0 ? (
              <EmptyState title="No facilities listed" />
            ) : (
              <div
                className="facility-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1.75rem",
                  marginTop: "2rem",
                }}
              >
                {items.map((item, index) => {
                  const shortDesc =
                    item.description ||
                    "Thoughtfully equipped spaces that support meaningful learning and wellbeing.";
                  const truncated =
                    shortDesc.length > 120
                      ? shortDesc.slice(0, 120).trim() + "..."
                      : shortDesc;

                  return (
                    <Link
                      key={item._id || item.title}
                      to={`/facilities/${item._id}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "block",
                        height: "100%",
                      }}
                    >
                      <article
                        style={{
                          background: "#fff",
                          borderRadius: "16px",
                          overflow: "hidden",
                          boxShadow: "0 6px 20px rgba(0,0,0,0.07)",
                          border: "1px solid rgba(0,0,0,0.05)",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                          cursor: "pointer",
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
                              `${assetPath}courses/courses_${(index % 6) + 1}.jpg`
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
                              fontSize: "1.2rem",
                              fontWeight: 700,
                              lineHeight: 1.3,
                            }}
                          >
                            {item.title}
                          </h3>

                          <p
                            style={{
                              margin: 0,
                              color: "#555",
                              fontSize: "0.95rem",
                              lineHeight: 1.6,
                              flexGrow: 1,
                            }}
                          >
                            {truncated}
                          </p>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}