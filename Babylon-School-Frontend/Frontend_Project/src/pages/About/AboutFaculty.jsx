import { useState } from "react";
import { Link } from "react-router-dom";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { mediaUrl } from "../../lib/media";
import { assetPath } from "../../data/content";
import TeacherModal from "../../components/shared/TeacherModal";

export default function AboutFaculty() {
  const { data: faculty, loading } = usePublicData(publicApi.faculty, []);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const preview = faculty.slice(0, 3);
  if (!loading && preview.length === 0) return null;

  return (
    <section className="about-faculty shell">
      <div className="center-heading">
        <p className="eyebrow">OUR TEAM</p>
        <h2>Meet our educators</h2>
        <p>
          Passionate mentors who guide students with knowledge, care and
          encouragement.
        </p>
      </div>

      {loading ? (
        <p>Loading educators...</p>
      ) : (
        <>
          <style>{`
            .about-faculty .faculty-grid {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 0.9rem !important;
              margin-top: 1.75rem;
              max-width: 100%;
            }

            /* Desktop: 3 columns, but cards stay reasonable size */
            @media (min-width: 900px) {
              .about-faculty .faculty-grid {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 1.5rem !important;
                max-width: 960px;          /* prevents cards from becoming huge */
                margin-left: auto;
                margin-right: auto;
              }
              .about-faculty .faculty-card-img {
                height: 220px !important;  /* fixed smaller image height on desktop */
                aspect-ratio: unset !important;
              }
            }
          `}</style>

          <div className="faculty-grid">
            {preview.map((teacher) => (
              <article
                key={teacher._id}
                onClick={() => setSelectedTeacher(teacher)}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.07)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="faculty-card-img"
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={mediaUrl(
                      teacher.image,
                      `${assetPath}team/team_1.jpg`
                    )}
                    alt={teacher.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                <div style={{ padding: "0.7rem 0.5rem 0.9rem" }}>
                  <h3
                    style={{
                      margin: "0 0 0.2rem",
                      color: "#1a3c6e",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      lineHeight: 1.25,
                    }}
                  >
                    {teacher.name}
                  </h3>
                  <span
                    style={{
                      color: "#666",
                      fontSize: "0.8rem",
                      display: "block",
                    }}
                  >
                    {teacher.designation || teacher.department}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <p style={{ textAlign: "center", marginTop: "1.75rem" }}>
            <Link className="text-link" to="/team">
              View all team members <b>&rarr;</b>
            </Link>
          </p>
        </>
      )}

      {selectedTeacher && (
        <TeacherModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
        />
      )}
    </section>
  );
}