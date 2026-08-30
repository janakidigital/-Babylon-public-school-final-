import { Link } from "react-router-dom";
import { publicApi } from "../../services/api";
import { mediaUrl } from "../../lib/media";
import usePublicData from "../../hooks/usePublicData";
import { assetPath } from "../../data/content";
import EmptyState from "../common/EmptyState";

export default function ProgramsSection() {
  const { data, loading } = usePublicData(publicApi.programs, []);

  const preview = data.slice(0, 6);
  const hasMore = data.length > 5;

  const items = preview.map((program, index) => ({
    ...program,
    text: program.shortDescription || program.description || "",
    image: mediaUrl(
      program.image,
      `${assetPath}courses/courses_${(index % 3) + 1}.jpg`
    ),
    href: program._id ? `/course-details/${program._id}` : "/academics",
  }));

  return (
    <section className="program-section" id="programs">
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR ACADEMICS</p>
            <h2>
              Learning for every
              <br />
              stage of life.
            </h2>
          </div>
          <p>
            A co-ed English medium school from PG to secondary level, with
            programmes designed so students thrive from their first years
            through graduation.
          </p>
        </div>

        {loading ? (
          <p>Loading programmes...</p>
        ) : items.length === 0 ? (
          <EmptyState title="Programmes coming soon" />
        ) : (
          <>
            <style>{`
              .program-section .program-grid {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 0.9rem !important;
                margin-top: 1.75rem;
              }

              @media (min-width: 900px) {
                .program-section .program-grid {
                  grid-template-columns: repeat(3, 1fr) !important;
                  gap: 1.15rem !important;
                  max-width: 980px;
                  margin-left: auto;
                  margin-right: auto;
                }
              }

              /* Card = image only, text overlays on top */
              .program-section .program-card {
                position: relative !important;
                border-radius: 14px !important;
                overflow: hidden !important;
                box-shadow: 0 6px 18px rgba(0,0,0,0.1) !important;
                aspect-ratio: 4 / 3 !important;
                background: #0b1f3a !important;
                display: block !important;
                height: auto !important;
                min-height: unset !important;
              }

              .program-section .program-card img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                display: block !important;
                position: absolute !important;
                inset: 0 !important;
              }

              /* Soft gradient – no solid blue block */
              .program-section .program-card::after {
                content: "" !important;
                position: absolute !important;
                inset: 0 !important;
                background: linear-gradient(
                  to top,
                  rgba(8, 22, 48, 0.95) 0%,
                  rgba(8, 22, 48, 0.65) 40%,
                  rgba(8, 22, 48, 0.2) 65%,
                  transparent 100%
                ) !important;
                z-index: 1 !important;
                pointer-events: none !important;
              }

              .program-section .program-number {
                position: absolute !important;
                top: 0.6rem !important;
                right: 0.75rem !important;
                color: rgba(255,255,255,0.75) !important;
                font-size: 0.8rem !important;
                font-weight: 600 !important;
                z-index: 3 !important;
              }

              /* Text sits on the image, not in a separate panel */
              .program-section .program-content {
                position: absolute !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                padding: 0.85rem 0.95rem 1rem !important;
                background: transparent !important;
                z-index: 2 !important;
                margin: 0 !important;
                height: auto !important;
                min-height: unset !important;
              }

              .program-section .program-content h3 {
                margin: 0 0 0.2rem !important;
                font-size: 0.95rem !important;
                font-weight: 700 !important;
                line-height: 1.25 !important;
                color: #fff !important;
              }

              .program-section .program-content p {
                margin: 0 0 0.45rem !important;
                font-size: 0.75rem !important;
                line-height: 1.35 !important;
                color: rgba(255,255,255,0.88) !important;
                display: -webkit-box !important;
                -webkit-line-clamp: 2 !important;
                -webkit-box-orient: vertical !important;
                overflow: hidden !important;
              }

              .program-section .program-content a {
                color: #f5c542 !important;
                font-size: 0.8rem !important;
                font-weight: 600 !important;
                text-decoration: none !important;
              }
            `}</style>

            <div className="program-grid">
              {items.map((program, index) => (
                <article
                  className="program-card"
                  key={program._id || program.title}
                >
                  <img src={program.image} alt={program.title || ""} />
                  <div className="program-number">0{index + 1}</div>
                  <div className="program-content">
                    <h3>{program.title}</h3>
                    <p>{program.text}</p>
                    <Link to={program.href}>
                      Explore <span>&rarr;</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {hasMore && (
              <p style={{ textAlign: "center", marginTop: "1.75rem" }}>
                <Link className="text-link" to="/academics">
                  View all programmes <b>&rarr;</b>
                </Link>
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}