import { useSite } from "../../context/SiteContext";

export default function StatisticsSection() {
  const { home } = useSite();
  const stats = home?.statistics || [];

  if (stats.length === 0) return null;

  return (
    <section className="statistics-section shell">
      <div
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem",
          textAlign: "center",
          padding: "4rem 0",
          borderTop: "1px solid #eee",
          borderBottom: "1px solid #eee",
          margin: "2rem 0",
        }}
      >
        {stats.map((stat, index) => (
          <div className="stat-card" key={stat._id || index}>
            {stat.icon && (
              <i
                className={stat.icon}
                style={{
                  fontSize: "2.5rem",
                  color: "var(--color-primary)",
                  marginBottom: "1rem",
                }}
              ></i>
            )}
            <h2 style={{ fontSize: "3rem", fontWeight: "bold", margin: "0" }}>
              {stat.value}
            </h2>
            <p
              style={{
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "bold",
                marginTop: "0.5rem",
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
