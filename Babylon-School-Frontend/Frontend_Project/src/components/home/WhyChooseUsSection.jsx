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

      {/* Loading */}
      {loading ? (
        <p
          style={{
            textAlign: "center",
            marginTop: "2rem",
          }}
        >
          Loading facilities...
        </p>
      ) : items.length === 0 ? (
        /* Empty State */
        <EmptyState title="No facilities listed" />
      ) : (
        /* Facility Cards */
        <div
          className="facility-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
            marginTop: "3rem",
          }}
        >
          {items.map((item, index) => (
            <Link
              key={item._id || item.title}
              to="/facilities"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              <article
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.07)",
                  transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-5px)";

                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";

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
                    height: "180px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                {/* Facility Name */}
                <div
                  style={{
                    padding: "1rem 1.2rem",
                    textAlign: "center",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.1rem",
                      color: "#1a3c6e",
                    }}
                  >
                    {item.title}
                  </h3>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}