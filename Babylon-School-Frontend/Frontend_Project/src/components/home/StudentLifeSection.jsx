import { assetPath } from "../../data/content";
import { useSite } from "../../context/SiteContext";
import "./StudentLifeSection.css"; // Import your styles here

export default function StudentLifeSection() {
  const { home } = useSite();

  const displayStats =
    home?.statistics?.length > 0
      ? home.statistics.slice(0, 3)
      : [
          { value: "1000+", label: "Students" },
          { value: "30+", label: "Teachers" },
          { value: "1996 A.D.", label: "Since" },
        ];

  return (
    <section className="life-section" id="life">
      <div className="shell">
        
        {/* Top: Copy + Photo */}
        <div className="life-grid">
          <div className="life-copy">
            <p className="eyebrow light">LIFE AT BABYLON</p>
            <h2>
              Every day is an <br />
              <span className="highlight-text">opportunity</span> to shine.
            </h2>
            <p>
              Beyond the classroom, students grow through sport, arts,
              scouting, music, dance, and service — a home away from home in
              Shantinagar.
            </p>
          </div>

          <div className="life-photo-wrapper">
            <img
              src={`${assetPath}banner/banner_2.jpg`}
              alt="Babylon school student engaged in activities"
              className="life-photo"
              loading="lazy"
            />
          </div>
        </div>

        {/* Bottom: Heading + Stats */}
        <div className="life-stats-container">
          <div className="life-stats-row">
            <h2 className="stats-heading">
              Growing with <br />
              purpose and pride.
            </h2>

            <ul className="stats-list">
              {displayStats.map((item) => (
                <li key={item.label} className="stat-item">
                  <strong className="stat-value">{item.value}</strong>
                  <span className="stat-label">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}