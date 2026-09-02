import { Link } from "react-router-dom";
import { 
  BookOpen, 
  FlaskConical, 
  Music, 
  Palette, 
  Computer, 
  Dumbbell,
  Globe,
  Sparkles,
  Building2,
  Bus,
  Coffee,
  Heart,
  Library,
  Mic2,
  School,
  Zap,
  ArrowRight,
  ChevronRight
} from "lucide-react";
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

  const displayItems = items.slice(0, 6);
  const hasMore = items.length > 6;

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

  return (
    <section className="why-choose-us-modern shell">
      {/* Section Heading */}
      <div className="why-choose-header">
        <span className="section-badge"> Why Choose Us</span>
        <h2 className="section-title">
          {section.title || "Why Choose Babylon School?"}
        </h2>
        <p className="section-subtitle">
          {section.description ||
            "We provide a supportive environment for students to learn and grow."}
        </p>
      </div>

      {loading ? (
        <div className="facilities-loading">
          <div className="loading-spinner"></div>
          <p>Loading amazing spaces...</p>
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No facilities listed" />
      ) : (
        <>
          <div className="facility-grid-modern">
            {displayItems.map((item, index) => {
              const Icon = getFacilityIcon(item.title);
              return (
                <Link
                  key={item._id || item.title}
                  to={`/facilities/${item._id}`}
                  className="facility-card-mini"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <div className="facility-card-mini-image">
                    <img
                      src={mediaUrl(
                        item.image,
                        `${assetPath}courses/courses_${(index % 6) + 1}.jpg`
                      )}
                      alt={item.title || ""}
                    />
                    <div className="facility-card-mini-overlay">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                  <div className="facility-card-mini-content">
                    <div className="facility-card-mini-icon">
                      <Icon size={16} />
                    </div>
                    <h3 className="facility-card-mini-title">{item.title}</h3>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* View All Button */}
          {hasMore && (
            <div className="why-choose-footer">
              <Link to="/facilities" className="btn-view-all-facilities">
                View All Facilities
                <ChevronRight size={18} />
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}