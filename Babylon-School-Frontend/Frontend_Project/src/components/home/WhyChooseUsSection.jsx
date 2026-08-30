import { Link } from "react-router-dom";
import { useSite } from "../../context/SiteContext";
import usePublicData from "../../hooks/usePublicData";
import { publicApi } from "../../services/api";
import { mediaUrl } from "../../lib/media";
import { assetPath } from "../../data/content";
import EmptyState from "../../components/common/EmptyState";

export default function WhyChooseUsSection() {
  const { data, loading } = usePublicData(publicApi.facilities, []);

  const items = [...data].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
  );

  const { home } = useSite();
  const section = home?.whyChooseUs || {};

  return (
    <section
      className="why-choose-us shell"
      style={{ padding: "5rem 0" }}
    >
      {/* Section Heading */}
      <div className="center-heading">
        <p className="eyebrow">
          {section.eyebrow || "OUR FACILITIES"}
        </p>

        <h2>
          {section.title || "Why Choose Babylon School?"}
        </h2>

        <p>
          {section.description ||
            "We provide a supportive environment for students to learn and grow."}
        </p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          Loading facilities...
        </p>
      ) : items.length === 0 ? (
        <EmptyState title="No facilities listed" />
      ) : (
        <>
          <style>{`
            .why-choose-us .facility-grid {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 0.9rem !important;
              margin-top: 2.5rem;
            }

            @media (min-width: 900px) {
              .why-choose-us .facility-grid {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 1.5rem !important;
              }
            }
          `}</style>

          <div className="facility-grid">
            {items.map((item, index) => (
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
                    backgroundColor: "#fff",
                    borderRadius: "14px",
                    overflow: "hidden",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.07)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 18px rgba(0,0,0,0.07)";
                  }}
                >
                  {/* Facility Image */}
                  <img
                    src={mediaUrl(
                      item.image,
                      `${assetPath}courses/courses_${(index % 6) + 1}.jpg`
                    )}
                    alt={item.title || ""}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  {/* Facility Name */}
                  <div
                    style={{
                      padding: "0.85rem 1rem",
                      textAlign: "center",
                      flexGrow: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1rem",
                        color: "#1a3c6e",
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}