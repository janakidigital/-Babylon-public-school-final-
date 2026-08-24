import { useSite } from "../../context/SiteContext";

export default function WhyChooseUsSection() {
  const { home } = useSite();
  const section = home?.whyChooseUs || {};
  const features = section.features || [];

  if (features.length === 0) return null;

  return (
    <section className="why-choose-us shell" style={{ padding: "5rem 0" }}>
      <div className="center-heading">
        <p className="eyebrow">WHY CHOOSE US</p>
        <h2>{section.title || "Discover the Babylon Difference"}</h2>
        <p>
          {section.description ||
            "We offer a comprehensive approach to education that prepares students for success."}
        </p>
      </div>

      <div
        className="features-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          marginTop: "3rem",
        }}
      >
        {features.map((feature, index) => (
          <article
            className="feature-card"
            key={feature._id || index}
            style={{
              padding: "2rem",
              backgroundColor: "#f9f9f9",
              borderRadius: "12px",
            }}
          >
            {feature.icon && (
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                {feature.icon}
              </div>
            )}
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
