import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Sparkles,
  Clock,
  Award,
  ChevronRight
} from "lucide-react";
import { publicApi } from "../../services/api";
import { mediaUrl } from "../../lib/media";
import usePublicData from "../../hooks/usePublicData";
import { assetPath } from "../../data/content";
import EmptyState from "../common/EmptyState";

export default function ProgramsSection() {
  const { data, loading } = usePublicData(publicApi.programs, []);

  const preview = data.slice(0, 6);
  const hasMore = data.length > 5;

  // Get icon based on program type
  const getProgramIcon = (title) => {
    const lowerTitle = title?.toLowerCase() || "";
    if (lowerTitle.includes("kindergarten") || lowerTitle.includes("pg") || lowerTitle.includes("pre")) return Sparkles;
    if (lowerTitle.includes("primary") || lowerTitle.includes("elementary")) return BookOpen;
    if (lowerTitle.includes("secondary") || lowerTitle.includes("high")) return GraduationCap;
    if (lowerTitle.includes("science")) return BookOpen;
    if (lowerTitle.includes("math")) return BookOpen;
    if (lowerTitle.includes("language")) return BookOpen;
    return BookOpen;
  };

  // Get color based on level
  const getLevelColor = (level) => {
    const lowerLevel = level?.toLowerCase() || "";
    if (lowerLevel.includes("pre") || lowerLevel.includes("pg") || lowerLevel.includes("kindergarten")) return "#f39c12";
    if (lowerLevel.includes("primary") || lowerLevel.includes("elementary")) return "#3498db";
    if (lowerLevel.includes("secondary") || lowerLevel.includes("high")) return "#9b59b6";
    if (lowerLevel.includes("lower")) return "#2ecc71";
    return "#1a3c6e";
  };

  const items = preview.map((program, index) => ({
    ...program,
    text: program.shortDescription || program.description || "",
    image: mediaUrl(
      program.image,
      `${assetPath}courses/courses_${(index % 3) + 1}.jpg`
    ),
    href: program._id ? `/course-details/${program._id}` : "/academics",
    icon: getProgramIcon(program.title),
    level: program.level || "Program",
    levelColor: getLevelColor(program.level),
  }));

  return (
    <section className="programs-section-modern" id="programs">
      <div className="shell">
        {/* Section Header */}
        <div className="programs-header">
          <div className="programs-header-left">
            <span className="section-badge"> Our Academics</span>
            <h2 className="section-title">
              Learning for every
              <br />
              stage of life.
            </h2>
          </div>
          <p className="section-description">
            A co-ed English medium school from PG to secondary level, with
            programmes designed so students thrive from their first years
            through graduation.
          </p>
        </div>

        {loading ? (
          <div className="programs-loading">
            <div className="loading-spinner"></div>
            <p>Loading programmes...</p>
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="Programmes coming soon" />
        ) : (
          <>
            {/* Program Grid */}
            <div className="programs-grid-modern">
              {items.map((program, index) => {
                const Icon = program.icon;
                return (
                  <Link
                    key={program._id || program.title}
                    to={program.href}
                    className="program-card-modern"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div className="program-card-image">
                      <img src={program.image} alt={program.title || ""} />
                      <div className="program-card-overlay">
                        <div className="program-card-icon">
                          <Icon size={24} />
                        </div>
                        <span className="program-card-explore">
                          Explore <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                    <div className="program-card-content">
                      <div className="program-card-header">
                        <span className="program-number">0{index + 1}</span>
                        <span 
                          className="program-level"
                          style={{ 
                            backgroundColor: `${program.levelColor}15`,
                            color: program.levelColor
                          }}
                        >
                          {program.level}
                        </span>
                      </div>
                      <h3 className="program-title">{program.title}</h3>
                      <p className="program-description">{program.text}</p>
                      <span className="program-link">
                        Learn More <ChevronRight size={16} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* View All Button */}
            {hasMore && (
              <div className="programs-footer">
                <Link to="/academics" className="btn-view-all">
                  View All Programmes
                  <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}