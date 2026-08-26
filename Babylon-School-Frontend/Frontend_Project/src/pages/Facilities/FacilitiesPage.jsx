import { Link, useParams } from "react-router-dom";
import PageBanner from "../../components/common/PageBanner";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { mediaUrl } from "../../lib/media";
import { assetPath } from "../../data/content";

export default function FacilitiesPage() {
  const { id } = useParams();

  const { data, loading } = usePublicData(
    publicApi.facilities,
    []
  );

  const items = [...data].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
  );

  // Find the facility that was clicked
  const selectedFacility = id
    ? items.find((item) => item._id === id)
    : null;

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
          // SINGLE FACILITY DETAIL
          // =========================
          selectedFacility ? (
            <div
              style={{
                maxWidth: "1000px",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
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
                    height: "450px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                <div
                  style={{
                    padding: "2rem",
                  }}
                >
                  <p className="eyebrow">
                    OUR FACILITY
                  </p>

                  <h2
                    style={{
                      marginBottom: "1rem",
                      color: "#1a3c6e",
                    }}
                  >
                    {selectedFacility.title}
                  </h2>

                  <p
                    style={{
                      color: "#666",
                      lineHeight: 1.7,
                      fontSize: "1rem",
                    }}
                  >
                    {selectedFacility.description ||
                      "Thoughtfully equipped spaces that support meaningful learning and wellbeing."}
                  </p>

                  <Link
                    to="/facilities"
                    className="button"
                    style={{
                      display: "inline-block",
                      marginTop: "1.5rem",
                    }}
                  >
                    ← Back to Facilities
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            // ID exists but facility doesn't
            <EmptyState
              title="Facility not found"
            />
          )
        ) : (
          // =========================
          // ALL FACILITIES
          // =========================
          <>
            <div className="center-heading">
              <p className="eyebrow">
                OUR CAMPUS
              </p>

              <h2>
                Everything students need to thrive.
              </h2>
            </div>

            {items.length === 0 ? (
              <EmptyState
                title="No facilities listed"
              />
            ) : (
              <div className="facility-grid">
                {items.map((item, index) => (
                  <Link
                    key={item._id || item.title}
                    to={`/facilities/${item._id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <article
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={mediaUrl(
                          item.image,
                          `${assetPath}courses/courses_${(index % 6) + 1}.jpg`
                        )}
                        alt={item.title || ""}
                      />

                      <h3>{item.title}</h3>

                      <p>
                        {item.description ||
                          "Thoughtfully equipped spaces that support meaningful learning and wellbeing."}
                      </p>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}