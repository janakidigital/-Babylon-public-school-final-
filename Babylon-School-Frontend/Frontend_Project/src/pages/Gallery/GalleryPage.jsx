import { useState } from "react";
import PageBanner from "../../components/common/PageBanner";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { mediaUrl } from "../../lib/media";

export default function GalleryPage() {
  const { data, loading } = usePublicData(publicApi.gallery, []);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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
            title="No albums yet"
            text="Upload gallery albums from the admin panel to show them here."
          />
        ) : !selectedAlbum ? (
          // ========== SHOW ALBUMS ==========
          <div className="gallery-grid">
            {data.map((album) => (
              <button
                key={album._id}
                onClick={() => setSelectedAlbum(album)}
                style={{ textAlign: "left" }}
              >
                <img
                  src={mediaUrl(album.coverImage || album.images?.[0]?.url)}
                  alt={album.title}
                />
                <div style={{ padding: "12px 4px" }}>
                  <strong style={{ display: "block", color: "var(--blue)" }}>
                    {album.title}
                  </strong>
                  <small style={{ color: "#666" }}>
                    {album.images?.length || 0} photos
                  </small>
                </div>
              </button>
            ))}
          </div>
        ) : (
          // ========== SHOW IMAGES INSIDE ALBUM ==========
          <>
            <button
              className="text-link"
              onClick={() => setSelectedAlbum(null)}
              style={{ marginBottom: "24px", background: "none", border: "none", cursor: "pointer" }}
            >
              ← Back to Albums
            </button>

            <h2 style={{ marginBottom: "8px" }}>{selectedAlbum.title}</h2>
            {selectedAlbum.description && (
              <p style={{ color: "#666", marginBottom: "28px" }}>
                {selectedAlbum.description}
              </p>
            )}

            <div className="gallery-grid">
              {selectedAlbum.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  aria-label={img.caption || `Photo ${index + 1}`}
                >
                  <img src={mediaUrl(img.url)} alt={img.caption || ""} />
                </button>
              ))}
            </div>
          </>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="lightbox"
            onClick={() => setSelectedImage(null)}
            role="presentation"
          >
            <img
              src={mediaUrl(selectedImage.url)}
              alt={selectedImage.caption || ""}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </section>
    </>
  );
}