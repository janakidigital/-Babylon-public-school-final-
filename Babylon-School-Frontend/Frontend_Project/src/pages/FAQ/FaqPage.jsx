import PageBanner from "../../components/common/PageBanner";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";

export default function FaqPage() {
  const { data, loading } = usePublicData(publicApi.faqs, []);
  const items = [...data].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
  );

  return (
    <>
      <PageBanner
        eyebrow="FAQ"
        title="How can we help?"
        image="banner/inner_banner_5.jpg"
      />
      <section className="about-faq">
        <div className="shell">
          {loading ? (
            <p>Loading questions...</p>
          ) : items.length === 0 ? (
            <EmptyState
              title="No FAQs yet"
              text="Questions added in the admin panel will appear here."
            />
          ) : (
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
          )}
        </div>
      </section>
    </>
  );
}
