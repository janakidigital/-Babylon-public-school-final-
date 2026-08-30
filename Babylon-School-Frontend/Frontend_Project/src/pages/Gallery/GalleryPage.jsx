import { useState, useEffect, useMemo } from "react";
import PageBanner from "../../components/common/PageBanner";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { mediaUrl } from "../../lib/media";

export default function GalleryPage() {
  const { data, loading } = usePublicData(publicApi.gallery, []);
  const [activeCategory, setActiveCategory] = useState("all"); // "all" | album._id
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Images for the current category
  const visibleImages = useMemo(() => {
    if (!data?.length) return [];

    if (activeCategory === "all") {
      // Flatten all images from all albums (keep album title for caption context)
      return data.flatMap((album) =>
        (album.images || []).map((img) => ({
          ...img,
          albumTitle: album.title,
          albumId: album._id,
        })),
      );
    }

    const album = data.find((a) => a._id === activeCategory);
    if (!album) return [];
    return (album.images || []).map((img) => ({
      ...img,
      albumTitle: album.title,
      albumId: album._id,
    }));
  }, [data, activeCategory]);

  // Active album (for header when not "all")
  const activeAlbum =
    activeCategory === "all"
      ? null
      : data.find((a) => a._id === activeCategory) || null;

  // Keyboard for lightbox
  useEffect(() => {
    if (!selectedImage || !visibleImages.length) return;

    function onKeyDown(e) {
      if (e.key === "Escape") setSelectedImage(null);
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedImage, currentIndex, visibleImages]);

  function openImage(img, index) {
    setSelectedImage(img);
    setCurrentIndex(index);
  }

  function goNext() {
    if (!visibleImages.length) return;
    const next = (currentIndex + 1) % visibleImages.length;
    setCurrentIndex(next);
    setSelectedImage(visibleImages[next]);
  }

  function goPrev() {
    if (!visibleImages.length) return;
    const prev =
      (currentIndex - 1 + visibleImages.length) % visibleImages.length;
    setCurrentIndex(prev);
    setSelectedImage(visibleImages[prev]);
  }

  function closeLightbox() {
    setSelectedImage(null);
  }

  return (
    <>
      <PageBanner
        eyebrow="GALLERY"
        title="Moments from Babylon."
        image="banner/inner_banner_4.jpg"
      />

      <section className="listing-page shell gallery-page">
        {loading ? (
          <div className="gallery-loading">
            <div className="gallery-spinner" />
            <p>Loading gallery...</p>
          </div>
        ) : data.length === 0 ? (
          <EmptyState
            title="No albums yet"
            text="Upload gallery albums from the admin panel to show them here."
          />
        ) : (
          <>
            {/* ========== CATEGORY TABS ========== */}
            <div className="gallery-header">
              <p className="eyebrow">GALLERY</p>
              <h2>Explore our moments</h2>
              <p className="gallery-subtitle">
                Browse by album or view everything together.
              </p>
            </div>

            <div className="gallery-categories" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === "all"}
                className={`gallery-cat-btn ${
                  activeCategory === "all" ? "is-active" : ""
                }`}
                onClick={() => setActiveCategory("all")}
              >
                All
                <span className="gallery-cat-count">
                  {data.reduce((n, a) => n + (a.images?.length || 0), 0)}
                </span>
              </button>

              {data.map((album) => (
                <button
                  key={album._id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === album._id}
                  className={`gallery-cat-btn ${
                    activeCategory === album._id ? "is-active" : ""
                  }`}
                  onClick={() => setActiveCategory(album._id)}
                >
                  {album.title}
                  <span className="gallery-cat-count">
                    {album.images?.length || 0}
                  </span>
                </button>
              ))}
            </div>

            {/* ========== ALL = show album cards ========== */}
            {activeCategory === "all" ? (
              <div className="gallery-albums">
                {data.map((album) => {
                  const cover =
                    album.coverImage || album.images?.[0]?.url || "";
                  const count = album.images?.length || 0;

                  return (
                    <button
                      key={album._id}
                      type="button"
                      className="gallery-album-card"
                      onClick={() => setActiveCategory(album._id)}
                    >
                      <div className="gallery-album-cover">
                        <img src={mediaUrl(cover)} alt={album.title} />
                        <div className="gallery-album-overlay">
                          <span className="gallery-view-btn">View photos</span>
                        </div>
                      </div>
                      <div className="gallery-album-info">
                        <h3>{album.title}</h3>
                        <span className="gallery-photo-count">
                          {count} {count === 1 ? "photo" : "photos"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* ========== SPECIFIC ALBUM = images below ========== */
              <>
                <div className="gallery-album-header">
                  <h3>{activeAlbum?.title}</h3>
                  {activeAlbum?.description && (
                    <p>{activeAlbum.description}</p>
                  )}
                  <span className="gallery-photo-count">
                    {visibleImages.length}{" "}
                    {visibleImages.length === 1 ? "photo" : "photos"}
                  </span>
                </div>

                {visibleImages.length === 0 ? (
                  <p className="gallery-empty-msg">
                    No photos in this album yet.
                  </p>
                ) : (
                  <div className="gallery-photos">
                    {visibleImages.map((img, index) => (
                      <button
                        key={`${img.albumId}-${index}`}
                        type="button"
                        className="gallery-photo-card"
                        onClick={() => openImage(img, index)}
                        aria-label={img.caption || `Photo ${index + 1}`}
                      >
                        <img
                          src={mediaUrl(img.url)}
                          alt={img.caption || `Photo ${index + 1}`}
                          loading="lazy"
                        />
                        {img.caption && (
                          <span className="gallery-photo-caption">
                            {img.caption}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ========== LIGHTBOX ========== */}
        {selectedImage && (
          <div
            className="gallery-lightbox"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
          >
            <button
              type="button"
              className="gallery-lightbox-close"
              onClick={closeLightbox}
              aria-label="Close"
            >
              ×
            </button>

            {visibleImages.length > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-lightbox-nav gallery-lightbox-prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="gallery-lightbox-nav gallery-lightbox-next"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Next photo"
                >
                  ›
                </button>
              </>
            )}

            <div
              className="gallery-lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={mediaUrl(selectedImage.url)}
                alt={selectedImage.caption || ""}
              />
              <div className="gallery-lightbox-meta">
                {selectedImage.caption && <p>{selectedImage.caption}</p>}
                <span>
                  {currentIndex + 1} / {visibleImages.length}
                  {selectedImage.albumTitle
                    ? ` · ${selectedImage.albumTitle}`
                    : ""}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

    
    </>
  );
}