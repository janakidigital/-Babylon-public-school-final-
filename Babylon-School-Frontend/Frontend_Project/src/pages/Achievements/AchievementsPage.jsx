import { useState } from "react";
import { 
  Calendar, 
  Award, 
  Trophy, 
  Star, 
  Medal, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from "lucide-react";
import PageBanner from "../../components/common/PageBanner";
import AboutSidebar from "../../components/shared/AboutSidebar";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { mediaUrl } from "../../lib/media";
import { assetPath } from "../../data/content";
import "../About/SidebarsCommon.css";

export default function AchievementsPage() {
  const { data, loading } = usePublicData(publicApi.achievements, []);
  const items = [...data].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
  );

  const [expanded, setExpanded] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  const toggleExpand = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const DESCRIPTION_LIMIT = 140;

  // Get icon based on achievement type
  const getAchievementIcon = (title, category) => {
    const text = (title + " " + category).toLowerCase();
    if (text.includes("first") || text.includes("gold") || text.includes("winner")) return Trophy;
    if (text.includes("second") || text.includes("silver") || text.includes("runner")) return Medal;
    if (text.includes("third") || text.includes("bronze")) return Award;
    if (text.includes("star") || text.includes("excellence") || text.includes("top")) return Star;
    if (text.includes("record") || text.includes("best") || text.includes("outstanding")) return Sparkles;
    return Award;
  };

  // Get color based on achievement type
  const getAchievementColor = (title, category) => {
    const text = (title + " " + category).toLowerCase();
    if (text.includes("first") || text.includes("gold") || text.includes("winner")) return "#f6c457";
    if (text.includes("second") || text.includes("silver") || text.includes("runner")) return "#9ca3af";
    if (text.includes("third") || text.includes("bronze")) return "#cd7f32";
    if (text.includes("star") || text.includes("excellence") || text.includes("top")) return "#e74c3c";
    if (text.includes("record") || text.includes("best") || text.includes("outstanding")) return "#3498db";
    return "#c53030";
  };

  return (
    <>
      <PageBanner
        eyebrow="ACHIEVEMENTS"
        title="Celebrating every success."
        image="banner/counter_bg.jpg"
        pageKey="achievements"
      />

      <section className="shell about-page-layout">
        <div className="about-container">
          <AboutSidebar currentPage="achievements" />
          <div className="about-main-content">
            <section className="listing-page">
              <div className="achievements-header">
                <div className="achievements-header-content">
                  <span className="achievements-badge"> School Highlights</span>
                  <h2 className="achievements-title">
                    Milestones from our <span className="text-highlight">community</span>
                  </h2>
                  <p className="achievements-subtitle">
                    Celebrating the outstanding achievements and awards earned by our students,
                    faculty, and institution.
                  </p>
                </div>
                <div className="achievements-stats">
                  <div className="stat-item">
                    <span className="stat-number">{items.length}+</span>
                    <span className="stat-label">Achievements</span>
                  </div>
                  {/* <div className="stat-divider"></div> */}
                  
                </div>
              </div>

              {loading ? (
                <div className="achievements-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading achievements...</p>
                </div>
              ) : items.length === 0 ? (
                <EmptyState
                  title="No achievements published"
                  text="Add awards and milestones from the admin dashboard."
                />
              ) : (
                <div className="achievements-grid-modern">
                  {items.map((item, index) => {
                    const key = item._id || index;
                    const fullText = item.description || item.category || "";
                    const isLong = fullText.length > DESCRIPTION_LIMIT;
                    const isExpanded = !!expanded[key];
                    const displayText = isExpanded || !isLong
                      ? fullText
                      : fullText.slice(0, DESCRIPTION_LIMIT).trim() + "...";
                    
                    const Icon = getAchievementIcon(item.title, item.category);
                    const iconColor = getAchievementColor(item.title, item.category);

                    return (
                      <article
                        key={key}
                        className="achievement-card-modern"
                        style={{ animationDelay: `${index * 0.06}s` }}
                        onMouseEnter={() => setHoveredCard(key)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className="achievement-card-image">
                          <img
                            src={mediaUrl(
                              item.image,
                              `${assetPath}blog/blog_${(index % 3) + 1}.jpg`,
                            )}
                            alt={item.title || ""}
                          />
                          <div className="achievement-card-overlay">
                            <div className="achievement-card-icon-wrapper">
                              <Icon size={28} color="#ffffff" />
                            </div>
                            {hoveredCard === key && (
                              <span className="achievement-card-hover-text">
                                View Achievement
                              </span>
                            )}
                          </div>
                          <div className="achievement-card-badge">
                            <Calendar size={12} />
                            {item.year || new Date().getFullYear()}
                          </div>
                        </div>

                        <div className="achievement-card-content">
                          <div className="achievement-card-header">
                            <div className="achievement-card-icon">
                              <Icon size={18} color={iconColor} />
                            </div>
                            <h3 className="achievement-card-title">
                              {item.title}
                            </h3>
                          </div>

                          {fullText && (
                            <>
                              <p className="achievement-card-description-bold">
                                {displayText}
                              </p>

                              {isLong && (
                                <button
                                  type="button"
                                  className="achievement-read-more"
                                  onClick={() => toggleExpand(key)}
                                >
                                  <span>{isExpanded ? "Show Less" : "Read More"}</span>
                                  {isExpanded ? (
                                    <ChevronUp size={16} />
                                  ) : (
                                    <ChevronDown size={16} />
                                  )}
                                </button>
                              )}
                            </>
                          )}

                          <div className="achievement-card-footer">
                            <span className="achievement-category">
                              {item.category || "Achievement"}
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </>
  );
}