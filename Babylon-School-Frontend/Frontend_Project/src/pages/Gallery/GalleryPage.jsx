import { useState } from "react";
import PageBanner from "../../components/common/PageBanner";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { mediaUrl } from "../../lib/media";

export default function GalleryPage() {
  const { data, loading } = usePublicData(publicApi.gallery, []);
  const [selected, setSelected] = useState(null);

  return (
    <>
      <PageBanner
        eyebrow="GALLERY"
        title="Moments from Babylon."
        image="banner/inner_banner_4.jpg"
      />
      <section className="listing-page shell">
        {loading ? (
          <p>Loading gallery...</p>
        ) : data.length === 0 ? (
          <EmptyState
            title="No photos yet"
            text="Upload gallery images from the admin panel to show them here."
          />
        ) : (
          <div className="gallery-grid">
            {data.map((item, index) => (
              <button
                key={item._id || index}
                onClick={() => setSelected(item)}
                aria-label={item.title || `View gallery image ${index + 1}`}
              >
                <img src={mediaUrl(item.image)} alt={item.title || "School activity"} />
              </button>
            ))}
          </div>
        )}
        {selected && (
          <div
            className="lightbox"
            onClick={() => setSelected(null)}
            role="presentation"
          >
            <img src={mediaUrl(selected.image)} alt={selected.title || "Selected school activity"} />
          </div>
        )}
      </section>
    </>
  );
}
