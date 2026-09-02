import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  ArrowRight, 
  ArrowLeft, 
  Share2, 
  ChevronDown,
  MapPin,
  Clock,
  BookOpen,
  FlaskConical,
  Music,
  Palette,
  Computer,
  Dumbbell,
  Globe,
  Sparkles,
  GraduationCap,
  Building2,
  Bus,
  Coffee,
  Heart,
  Library,
  Mic2,
  School,
  Zap
} from "lucide-react";
import PageBanner from "../../components/common/PageBanner";
import AboutSidebar from "../../components/shared/AboutSidebar";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { mediaUrl } from "../../lib/media";
import { assetPath } from "../../data/content";
import "../About/SidebarsCommon.css";

export default function FacilitiesPage() {
  const { id } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const gridRef = useRef(null);

  const { data, loading } = usePublicData(publicApi.facilities, []);

  const items = [...data].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
  );

  const selectedFacility = id ? items.find((item) => item._id === id) : null;

  useEffect(() => {
    if (id && gridRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id]);

  const DESCRIPTION_LIMIT = 280;
  const fullDescription =
    selectedFacility?.description ||
    "Thoughtfully equipped spaces that support meaningful learning and wellbeing.";
  const isLong = fullDescription.length > DESCRIPTION_LIMIT;
  const displayDescription =
    isExpanded || !isLong
      ? fullDescription
      : fullDescription.slice(0, DESCRIPTION_LIMIT).trim() + "...";

  // Get icon based on facility type
  const getFacilityIcon = (title) => {
    const lowerTitle = title?.toLowerCase() || "";
    if (lowerTitle.includes("library")) return Library;
    if (lowerTitle.includes("lab") || lowerTitle.includes("science")) return FlaskConical;
    if (lowerTitle.includes("sport") || lowerTitle.includes("gym")) return Dumbbell;
    if (lowerTitle.includes("music")) return Music;
    if (lowerTitle.includes("art")) return Palette;
    if (lowerTitle.includes("computer") || lowerTitle.includes("tech")) return Computer;
    if (lowerTitle.includes("language")) return Globe;
    if (lowerTitle.includes("math")) return Sparkles;
    if (lowerTitle.includes("playground")) return Zap;
    if (lowerTitle.includes("auditorium") || lowerTitle.includes("theater")) return Mic2;
    if (lowerTitle.includes("cafeteria") || lowerTitle.includes("dining")) return Coffee;
    if (lowerTitle.includes("medical") || lowerTitle.includes("health")) return Heart;
    if (lowerTitle.includes("transport") || lowerTitle.includes("bus")) return Bus;
    if (lowerTitle.includes("classroom")) return School;
    return Building2;
  };

  const IconComponent = getFacilityIcon(selectedFacility?.title);

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
        pageKey="facilities"
      />

      <section className="shell about-page-layout">
        <div className="about-container">
          <AboutSidebar currentPage="facilities" />
          <div className="about-main-content">
            <section className="listing-page" ref={gridRef}>
              {loading ? (
                <div className="facilities-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading amazing spaces...</p>
                </div>
              ) : id ? (
                // =========================
                // SINGLE FACILITY DETAIL
                // =========================
                selectedFacility ? (
                  <div className="facility-detail-premium">
                    <div className="facility-detail-grid">
                      <div className="facility-detail-image-wrapper">
                        <div className="facility-detail-badge">
                          {IconComponent && <IconComponent size={18} />}
                          <span>{selectedFacility.category || "Facility"}</span>
                        </div>
                        <img
                          src={mediaUrl(
                            selectedFacility.image,
                            `${assetPath}courses/courses_1.jpg`,
                          )}
                          alt={selectedFacility.title || ""}
                          className="facility-detail-image-main"
                        />
                        <div className="facility-detail-image-shapes">
                          <div className="shape-circle shape-1"></div>
                          <div className="shape-circle shape-2"></div>
                        </div>
                      </div>

                      <div className="facility-detail-info">
                        <div className="facility-detail-header">
                          <span className="facility-detail-eyebrow">✦ Facility</span>
                          <h1>{selectedFacility.title}</h1>
                          <div className="facility-detail-meta">
                            <span className="meta-item">
                              <MapPin size={16} />
                              {selectedFacility.location || "Main Campus"}
                            </span>
                            <span className="meta-item">
                              <Clock size={16} />
                              {selectedFacility.hours || "8:00 AM - 4:00 PM"}
                            </span>
                          </div>
                        </div>

                        <div className="facility-detail-body">
                          <p className="facility-detail-description">
                            {displayDescription}
                          </p>

                          {isLong && (
                            <button
                              type="button"
                              className="read-more-btn-modern"
                              onClick={() => setIsExpanded((prev) => !prev)}
                            >
                              <span>{isExpanded ? "Show Less" : "Read More"}</span>
                              <ChevronDown 
                                size={18} 
                                className={`arrow-icon ${isExpanded ? "rotated" : ""}`}
                              />
                            </button>
                          )}
                        </div>

                        <div className="facility-detail-actions">
                          <Link to="/facilities" className="btn-back-modern">
                            <ArrowLeft size={18} />
                            Back to All Facilities
                          </Link>
                          {/* <button className="btn-share-modern">
                            <Share2 size={18} />
                            Share
                          </button> */}
                        </div>

                        {/* Related Facilities */}
                        {items.length > 1 && (
                          <div className="facility-related">
                            <h4>Explore Other Facilities</h4>
                            <div className="related-grid">
                              {items
                                .filter((item) => item._id !== selectedFacility._id)
                                .slice(0, 3)
                                .map((item) => {
                                  const Icon = getFacilityIcon(item.title);
                                  return (
                                    <Link
                                      key={item._id}
                                      to={`/facilities/${item._id}`}
                                      className="related-item"
                                    >
                                      <Icon size={16} />
                                      <span className="related-name">{item.title}</span>
                                    </Link>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyState title="Facility not found" />
                )
              ) : (
                // =========================
                // ALL FACILITIES - Modern Grid (Smaller Cards)
                // =========================
                <>
                  <div className="facilities-hero-modern">
                    <div className="facilities-hero-content">
                      <span className="hero-badge">✦ Our Campus</span>
                      <h2 className="hero-title">
                        World-class facilities for
                        <span className="hero-highlight"> every learner</span>
                      </h2>
                      <p className="hero-subtitle">
                        Discover our thoughtfully designed spaces that inspire
                        creativity, foster collaboration, and support holistic
                        development.
                      </p>
                      <div className="hero-stats">
                        <div className="hero-stat">
                          <span className="stat-number">{items.length}+</span>
                          <span className="stat-label">Facilities</span>
                        </div>
                        <div className="hero-stat">
                          <span className="stat-number">100%</span>
                          <span className="stat-label">Accessible</span>
                        </div>
                        <div className="hero-stat">
                          <span className="stat-number">24/7</span>
                          <span className="stat-label">Support</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {items.length === 0 ? (
                    <EmptyState title="No facilities listed" />
                  ) : (
                    <div className="facility-grid-modern">
                      {items.map((item, index) => {
                        const Icon = getFacilityIcon(item.title);
                        const shortDesc =
                          item.description ||
                          "Thoughtfully equipped spaces that support meaningful learning and wellbeing.";
                        const truncated =
                          shortDesc.length > 100
                            ? shortDesc.slice(0, 100).trim() + "..."
                            : shortDesc;

                        return (
                          <Link
                            key={item._id || item.title}
                            to={`/facilities/${item._id}`}
                            className="facility-card-modern"
                            style={{ animationDelay: `${index * 0.08}s` }}
                          >
                            <div className="card-image-wrapper">
                              <div className="card-image-overlay">
                                <div className="card-hover-content">
                                  <ArrowRight size={20} />
                                  <span className="card-hover-text">Explore</span>
                                </div>
                              </div>
                              <img
                                src={mediaUrl(
                                  item.image,
                                  `${assetPath}courses/courses_${(index % 6) + 1}.jpg`,
                                )}
                                alt={item.title || ""}
                                className="card-image"
                              />
                              <div className="card-badge">
                                <Icon size={18} />
                              </div>
                            </div>

                            <div className="card-content">
                              <h3 className="card-title">{item.title}</h3>
                              <p className="card-description">{truncated}</p>
                              <div className="card-footer">
                                <span className="card-read-more">
                                  Learn More
                                  <ArrowRight size={16} />
                                </span>
                                <span className="card-number">
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </section>
    </>
  );
}