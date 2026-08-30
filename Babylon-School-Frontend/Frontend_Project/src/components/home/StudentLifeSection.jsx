import { assetPath } from "../../data/content";
import { useSite } from "../../context/SiteContext";

export default function StudentLifeSection() {
  const { home } = useSite();

  // Prefer admin-configured statistics, otherwise use fixed fallback
  const displayStats =
    home?.statistics?.length > 0
      ? home.statistics.slice(0, 3)
      : [
          { value: "1000+", label: "Students" },
          { value: "30+", label: "Teachers" },
          { value: "1996 A.D.", label: "Since" },
        ];

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
            <p className="eyebrow light">LIFE AT BABYLON</p>
            <h2>
              Every day is an
              <br />
              <em>opportunity</em> to shine.
            </h2>
            <p>
              Beyond the classroom, students grow through sport, arts,
              scouting, music, dance and service — a home away from home in
              Shantinagar.
            </p>
          </div>

          <div className="life-photo">
            <img
              src={`${assetPath}banner/banner_2.jpg`}
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
              Growing with
              <br />
              purpose and pride.
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