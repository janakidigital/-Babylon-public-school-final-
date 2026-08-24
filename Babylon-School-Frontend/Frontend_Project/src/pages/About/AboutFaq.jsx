import { Link } from "react-router-dom";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";

export default function AboutFaq() {
  const { data, loading } = usePublicData(publicApi.faqs, []);
  const items = [...data]
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    .slice(0, 4);
  if (!loading && items.length === 0) return null;

  return (
    <section className="about-faq">
      <div className="shell">
        <div className="center-heading">
          <p className="eyebrow">QUESTIONS ANSWERED</p>
          <h2>Frequently asked questions</h2>
        </div>
        {loading ? (
          <p>Loading questions...</p>
        ) : (
          <>
            <div className="faq-grid">
              {items.map((item, index) => (
                <details key={item._id || item.question}>
                  <summary>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {item.question}
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
            <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <Link className="text-link" to="/faq">
                View all FAQs <b>&rarr;</b>
              </Link>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
