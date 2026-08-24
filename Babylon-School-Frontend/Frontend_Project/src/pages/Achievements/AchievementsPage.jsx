import PageBanner from "../../components/common/PageBanner";
import EmptyState from "../../components/common/EmptyState";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { mediaUrl } from "../../lib/media";
import { assetPath } from "../../data/content";

export default function AchievementsPage() {
  const { data, loading } = usePublicData(publicApi.achievements, []);
  const items = [...data].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
  );

  return (
    <>
      <PageBanner
        eyebrow="ACHIEVEMENTS"
        title="Celebrating every success."
        image="banner/counter_bg.jpg"
      />
      <section className="listing-page shell">
        <div className="center-heading">
          <p className="eyebrow">SCHOOL HIGHLIGHTS</p>
          <h2>Milestones from our community.</h2>
        </div>
        {loading ? (
          <p>Loading achievements...</p>
        ) : items.length === 0 ? (
          <EmptyState
            title="No achievements published"
            text="Add awards and milestones from the admin dashboard."
          />
        ) : (
          <div className="facility-grid">
            {items.map((item, index) => (
              <article key={item._id || item.title}>
                <img
                  src={mediaUrl(
                    item.image,
                    `${assetPath}blog/blog_${(index % 3) + 1}.jpg`,
                  )}
                  alt=""
                />
                <h3>
                  {item.year ? `${item.year} · ` : ""}
                  {item.title}
                </h3>
                <p>{item.description || item.category || ""}</p>
              </article>
            ))}
          </div>
        )}
      </section>
      <TestimonialsSection />
    </>
  );
}
