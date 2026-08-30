import { assetPath } from "../../data/content";
import { useSite } from "../../context/SiteContext";
import { mediaUrl } from "../../lib/media";

export default function StudentLifeSection() {
  const { settings, home } = useSite();

  // Prefer siteSettings stats (Students, Teachers, Since) configured in Admin,
  // then home statistics, then default fallback
  const statsFromSettings = settings?.stats
    ? [
        {
          value: settings.stats.studentsCount || "1000+",
          label: settings.stats.studentsLabel || "Students",
        },
        {
          value: settings.stats.teachersCount || "30+",
          label: settings.stats.teachersLabel || "Teachers",
        },
        {
          value: settings.stats.sinceValue || "1996 A.D.",
          label: settings.stats.sinceLabel || "Since",
        },
      ]
    : null;

  const displayStats =
    statsFromSettings ||
    (home?.statistics?.length > 0
      ? home.statistics.slice(0, 3)
      : [
          { value: "1000+", label: "Students" },
          { value: "30+", label: "Teachers" },
          { value: "1996 A.D.", label: "Since" },
        ]);

  const studentLifePhoto = settings?.studentLife?.image
    ? mediaUrl(settings.studentLife.image)
    : `${assetPath}banner/banner_2.jpg`;

  const eyebrow = settings?.studentLife?.eyebrow || "LIFE AT BABYLON";
  const title = settings?.studentLife?.title || "Every day is an opportunity to shine.";
  const description =
    settings?.studentLife?.description ||
    "Beyond the classroom, students grow through sport, arts, scouting, music, dance and service — a home away from home in Shantinagar.";
  const heading =
    settings?.studentLife?.heading || "Growing with purpose and pride.";

  return (
    <section className="life" id="life">
      <div className="shell">
        {/* Top: copy + photo */}
        <div
          className="life-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2rem",
            alignItems: "center",
          }}
        >
          <style>{`
            @media (min-width: 900px) {
              .life .life-grid {
                grid-template-columns: 1fr 1fr !important;
                gap: 3rem !important;
              }
            }
          `}</style>

          <div className="life-copy">
            <p className="eyebrow light">{eyebrow}</p>
            <h2>
              {title.includes("opportunity") ? (
                <>
                  {title.split("opportunity")[0]}
                  <em>opportunity</em>
                  {title.split("opportunity")[1]}
                </>
              ) : (
                title
              )}
            </h2>
            <p>{description}</p>
          </div>

          <div className="life-photo">
            <img
              src={studentLifePhoto}
              alt="Babylon school student"
              style={{
                width: "100%",
                borderRadius: "12px",
                display: "block",
                objectFit: "cover",
                maxHeight: "340px",
              }}
            />
          </div>
        </div>

        {/* Bottom: heading + stats */}
        <div
          style={{
            marginTop: "3.5rem",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2rem",
            alignItems: "center",
          }}
        >
          <style>{`
            @media (min-width: 768px) {
              .life .life-stats-row {
                grid-template-columns: 1fr 1.2fr !important;
                gap: 2.5rem !important;
              }
            }
          `}</style>

          <div
            className="life-stats-row"
            style={{ display: "grid", gap: "2rem" }}
          >
            <h2
              style={{
                margin: 0,
                color: "#fff",
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                lineHeight: 1.25,
              }}
            >
              {heading}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
                textAlign: "center",
              }}
            >
              {displayStats.map((item) => (
                <div key={item.label}>
                  <strong
                    style={{
                      display: "block",
                      fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
                      color: "#fff",
                      fontWeight: 700,
                      lineHeight: 1.1,
                    }}
                  >
                    {item.value}
                  </strong>
                  <span
                    style={{
                      display: "block",
                      marginTop: "0.25rem",
                      fontSize: "0.9rem",
                      color: "rgba(255,255,255,0.75)",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}