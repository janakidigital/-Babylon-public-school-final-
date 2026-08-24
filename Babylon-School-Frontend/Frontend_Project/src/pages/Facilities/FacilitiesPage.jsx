import PageBanner from "../../components/common/PageBanner";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { mediaUrl } from "../../lib/media";
import { assetPath } from "../../data/content";

export default function FacilitiesPage() {
  const { data, loading } = usePublicData(publicApi.facilities, []);
  const items = [...data].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
  );

  return (
    <>
      <PageBanner
        eyebrow="OUR FACILITIES"
        title="Spaces designed for discovery."
        image="banner/inner_banner_5.jpg"
      />
      <section className="listing-page shell">
        <div className="center-heading">
          <p className="eyebrow">OUR CAMPUS</p>
          <h2>Everything students need to thrive.</h2>
        </div>
        {loading ? (
          <p>Loading facilities...</p>
        ) : items.length === 0 ? (
          <EmptyState
            title="No facilities listed"
            text="Add cafeteria, library, labs, transport and more from the admin panel."
          />
        ) : (
          <div className="facility-grid">
            {items.map((item, index) => (
              <article key={item._id || item.title}>
                <img
                  src={mediaUrl(
                    item.image,
                    `${assetPath}courses/courses_${(index % 6) + 1}.jpg`,
                  )}
                  alt=""
                />
                <h3>{item.title}</h3>
                <p>
                  {item.description ||
                    "Thoughtfully equipped spaces that support meaningful learning and wellbeing."}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
