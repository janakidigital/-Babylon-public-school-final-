import PageBanner from "../../components/common/PageBanner";
import AboutSidebar from "../../components/shared/AboutSidebar";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import "../About/SidebarsCommon.css";

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
        pageKey="faq"
      />
      <section className="shell about-page-layout">
        <div className="about-container">
          <AboutSidebar currentPage="faq" />
          <div className="about-main-content">
            <section className="about-faq">
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
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
