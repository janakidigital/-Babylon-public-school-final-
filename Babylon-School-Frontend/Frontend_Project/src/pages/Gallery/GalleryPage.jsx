import { useState, useEffect, useMemo } from "react";
import PageBanner from "../../components/common/PageBanner";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { mediaUrl } from "../../lib/media";

/** Make plain URLs clickable */
function linkify(text) {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = String(text).split(urlRegex);

  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "var(--red, #c53030)",
          textDecoration: "underline",
          wordBreak: "break-all",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/** Convert any YouTube URL → embed URL */
function getYoutubeEmbedUrl(url) {
  if (!url) return null;

  try {
    const u = new URL(url);
    let id = null;

    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.slice(1).split("/")[0];
    } else if (u.hostname.includes("youtube.com")) {
      id = u.searchParams.get("v");

      if (!id && u.pathname.startsWith("/embed/")) {
        id = u.pathname.split("/embed/")[1];
      }

      if (!id && u.pathname.startsWith("/shorts/")) {
        id = u.pathname.split("/shorts/")[1];
      }
    }

    if (!id) return null;

    return `https://www.youtube.com/embed/${id}?rel=0`;
  } catch {
    return null;
  }
}

/** Extract YouTube thumbnail */
function getYoutubeThumbnail(url) {
  if (!url) return null;

  try {
    const u = new URL(url);
    let id = null;

    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.slice(1).split("/")[0];
    } else if (u.hostname.includes("youtube.com")) {
      id = u.searchParams.get("v");

      if (!id && u.pathname.startsWith("/embed/")) {
        id = u.pathname.split("/embed/")[1];
      }

      if (!id && u.pathname.startsWith("/shorts/")) {
        id = u.pathname.split("/shorts/")[1];
      }
    }

    if (!id) return null;

    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  } catch {
    return null;
  }
}

/** Get best cover for video album card */
function getVideoAlbumCover(album) {
  if (album.coverImage) {
    const ytThumb = getYoutubeThumbnail(album.coverImage);
    if (ytThumb) return ytThumb;
    if (album.coverImage.startsWith("http") || album.coverImage.startsWith("/")) {
      return album.coverImage;
    }
  }

  if (Array.isArray(album.videos) && album.videos.length > 0) {
    const ytVideo = album.videos.find(
      (v) => v.type === "youtube" || (v.url && v.url.includes("youtu"))
    );
    if (ytVideo?.url) {
      const ytThumb = getYoutubeThumbnail(ytVideo.url);
      if (ytThumb) return ytThumb;
    }
    if (album.videos[0]?.url) {
      return album.videos[0].url;
    }
  }

  if (Array.isArray(album.images) && album.images.length > 0) {
    return album.images[0]?.url || "";
  }

  return "";
}

export default function GalleryPage() {
  const { data, loading } = usePublicData(publicApi.gallery, []);

  const [mediaType, setMediaType] = useState("photos"); // "photos" | "videos"
  const [activeCategory, setActiveCategory] = useState("all"); // "all" | album._id
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ---------- PHOTOS ----------
  const visibleImages = useMemo(() => {
    if (!data?.length) return [];

    if (activeCategory === "all") {
      return data.flatMap((album) =>
        (album.images || []).map((img) => ({
          ...img,
          albumTitle: album.title,
          albumId: album._id,
        }))
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

  // ---------- VIDEOS ----------
  const allVideos = useMemo(() => {
    if (!data?.length) return [];

    return data.flatMap((album) =>
      (album.videos || []).map((vid, i) => ({
        ...vid,
        albumTitle: album.title,
        albumId: album._id,
        key: `${album._id}-vid-${i}`,
      }))
    );
  }, [data]);

  const visibleVideos = useMemo(() => {
    if (activeCategory === "all") return allVideos;

    return allVideos.filter((v) => v.albumId === activeCategory);
  }, [allVideos, activeCategory]);

  // ---------- FILTER ALBUMS BY MEDIA TYPE ----------
  const photoAlbums = useMemo(
    () =>
      (data || []).filter(
        (a) =>
          a.mediaType !== "Videos" &&
          ((a.images && a.images.length > 0) ||
            a.mediaType === "Photos" ||
            !a.mediaType)
      ),
    [data]
  );

  const videoAlbums = useMemo(
    () =>
      (data || []).filter(
        (a) =>
          a.mediaType === "Videos" ||
          (a.videos && a.videos.length > 0)
      ),
    [data]
  );

  const activeAlbum =
    activeCategory === "all"
      ? null
      : data.find((a) => a._id === activeCategory) || null;

  // Keyboard for lightbox
  useEffect(() => {
    if (!selectedImage || !visibleImages.length) return;

    function onKeyDown(e) {
      if (e.key === "Escape") {
        setSelectedImage(null);
      } else if (e.key === "ArrowRight") {
        goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      }
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

  // ---------- COUNTS ----------
  const totalPhotos = photoAlbums.reduce(
    (n, a) => n + (a.images?.length || 0),
    0
  );

  const totalVideos = allVideos.length;

  return (
    <>
      <PageBanner
        eyebrow="GALLERY"
        title="Moments from Babylon."
        image="banner/inner_banner_4.jpg"
        pageKey="gallery"
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
            <div className="gallery-header">
              <p className="eyebrow">GALLERY</p>
              <h2>Explore our moments</h2>
              <p className="gallery-subtitle">
                Browse photos and videos from school life.
              </p>
            </div>

            {/* ========== PHOTOS / VIDEOS TOGGLE ========== */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "24px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMediaType("photos");
                  setActiveCategory("all");
                }}
                style={{
                  border: "1px solid",
                  borderColor:
                    mediaType === "photos"
                      ? "var(--red, #c53030)"
                      : "#e2e8f0",
                  background:
                    mediaType === "photos"
                      ? "var(--red, #c53030)"
                      : "#fff",
                  color: mediaType === "photos" ? "#fff" : "#2d3748",
                  borderRadius: "999px",
                  padding: "8px 18px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📷 Photos
                <span
                  style={{
                    marginLeft: 8,
                    background:
                      mediaType === "photos"
                        ? "rgba(255,255,255,0.25)"
                        : "#edf2f7",
                    borderRadius: "999px",
                    padding: "2px 8px",
                    fontSize: "12px",
                  }}
                >
                  {totalPhotos}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMediaType("videos");
                  setActiveCategory("all");
                }}
                style={{
                  border: "1px solid",
                  borderColor:
                    mediaType === "videos"
                      ? "var(--red, #c53030)"
                      : "#e2e8f0",
                  background:
                    mediaType === "videos"
                      ? "var(--red, #c53030)"
                      : "#fff",
                  color: mediaType === "videos" ? "#fff" : "#2d3748",
                  borderRadius: "999px",
                  padding: "8px 18px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🎬 Videos
                <span
                  style={{
                    marginLeft: 8,
                    background:
                      mediaType === "videos"
                        ? "rgba(255,255,255,0.25)"
                        : "#edf2f7",
                    borderRadius: "999px",
                    padding: "2px 8px",
                    fontSize: "12px",
                  }}
                >
                  {totalVideos}
                </span>
              </button>
            </div>

            {/* ========== ALBUM CATEGORY TABS ========== */}
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
                  {mediaType === "photos" ? totalPhotos : totalVideos}
                </span>
              </button>

              {(mediaType === "photos"
                ? photoAlbums
                : videoAlbums
              ).map((album) => {
                const count =
                  mediaType === "photos"
                    ? album.images?.length || 0
                    : album.videos?.length || 0;

                if (mediaType === "videos" && count === 0) return null;

                return (
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
                    <span className="gallery-cat-count">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* ========== PHOTOS VIEW ========== */}
            {mediaType === "photos" && (
              <>
                {activeCategory === "all" ? (
                  <div className="gallery-albums">
                    {photoAlbums.map((album) => {
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
                            <img
                              src={mediaUrl(cover)}
                              alt={album.title}
                            />

                            <div className="gallery-album-overlay">
                              <span className="gallery-view-btn">
                                View photos
                              </span>
                            </div>
                          </div>

                          {/* Description intentionally hidden on All cards */}
                          <div className="gallery-album-info">
                            <h3>{album.title}</h3>

                            <span className="gallery-photo-count">
                              {count}{" "}
                              {count === 1 ? "photo" : "photos"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    <div className="gallery-album-header">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "10px",
                          width: "100%",
                          marginBottom: "10px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveCategory("all")}
                          style={{
                            background: "#edf2f7",
                            border: "1px solid #cbd5e0",
                            borderRadius: "6px",
                            padding: "6px 14px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#2d3748",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          ← Back to All Photo Albums
                        </button>
                        <span className="gallery-photo-count">
                          {visibleImages.length}{" "}
                          {visibleImages.length === 1 ? "photo" : "photos"}
                        </span>
                      </div>

                      <h3>{activeAlbum?.title}</h3>

                      {/* Description remains visible inside opened album */}
                      {activeAlbum?.description && (
                        <p>{linkify(activeAlbum.description)}</p>
                      )}
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
                            aria-label={
                              img.caption || `Photo ${index + 1}`
                            }
                          >
                            <img
                              src={mediaUrl(img.url)}
                              alt={img.caption || `Photo ${index + 1}`}
                              loading="lazy"
                            />

                            {img.caption && (
                              <span className="gallery-photo-caption">
                                {linkify(img.caption)}
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

            {/* ========== VIDEOS VIEW ========== */}
            {mediaType === "videos" && (
              <>
                {activeCategory === "all" ? (
                  videoAlbums.length === 0 ? (
                    <EmptyState
                      title="No video collections yet"
                      text="Add videos or YouTube links from the admin panel to show them here."
                    />
                  ) : (
                    <div className="gallery-albums">
                      {videoAlbums.map((album) => {
                        const cover = getVideoAlbumCover(album);
                        const count = album.videos?.length || 0;

                        return (
                          <button
                            key={album._id}
                            type="button"
                            className="gallery-album-card"
                            onClick={() => setActiveCategory(album._id)}
                          >
                            <div
                              className="gallery-album-cover"
                              style={{ background: "#1a202c" }}
                            >
                              {cover ? (
                                <img
                                  src={mediaUrl(cover)}
                                  alt={album.title}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "42px",
                                    color: "#fff",
                                  }}
                                >
                                  🎬
                                </div>
                              )}

                              <div className="gallery-album-overlay">
                                <span className="gallery-view-btn">
                                  ▶ View videos
                                </span>
                              </div>
                            </div>

                            <div className="gallery-album-info">
                              <h3>{album.title}</h3>

                              <span className="gallery-photo-count">
                                {count}{" "}
                                {count === 1 ? "video" : "videos"}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )
                ) : (
                  <>
                    <div className="gallery-album-header">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "10px",
                          width: "100%",
                          marginBottom: "10px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveCategory("all")}
                          style={{
                            background: "#edf2f7",
                            border: "1px solid #cbd5e0",
                            borderRadius: "6px",
                            padding: "6px 14px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#2d3748",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          ← Back to All Video Collections
                        </button>
                        <span className="gallery-photo-count">
                          {visibleVideos.length}{" "}
                          {visibleVideos.length === 1 ? "video" : "videos"}
                        </span>
                      </div>

                      <h3>{activeAlbum?.title}</h3>

                      {activeAlbum?.description && (
                        <p>{linkify(activeAlbum.description)}</p>
                      )}
                    </div>

                    {visibleVideos.length === 0 ? (
                      <p className="gallery-empty-msg">
                        No videos in this collection yet.
                      </p>
                    ) : (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(300px, 1fr))",
                          gap: "24px",
                          marginTop: "16px",
                        }}
                      >
                        {visibleVideos.map((vid) => {
                          const embedUrl = getYoutubeEmbedUrl(vid.url);

                          return (
                            <div
                              key={vid.key}
                              style={{
                                background: "#fff",
                                border: "1px solid #e2e8f0",
                                borderRadius: "12px",
                                overflow: "hidden",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                              }}
                            >
                              {/* Video player: YouTube iframe or HTML5 video */}
                              <div
                                style={{
                                  position: "relative",
                                  paddingBottom: "56.25%",
                                  height: 0,
                                  background: "#000",
                                }}
                              >
                                {embedUrl ? (
                                  <iframe
                                    src={embedUrl}
                                    title={
                                      vid.title ||
                                      vid.albumTitle ||
                                      "Video"
                                    }
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                      border: 0,
                                    }}
                                  />
                                ) : (
                                  <video
                                    src={mediaUrl(vid.url) || vid.url}
                                    controls
                                    preload="metadata"
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "contain",
                                    }}
                                  />
                                )}
                              </div>

                              <div style={{ padding: "14px 16px" }}>
                                {(vid.title || vid.albumTitle) && (
                                  <h4
                                    style={{
                                      margin: "0 0 6px",
                                      fontSize: "15px",
                                      lineHeight: 1.35,
                                    }}
                                  >
                                    {vid.title || vid.albumTitle}
                                  </h4>
                                )}

                                {vid.caption && (
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "13px",
                                      color: "#718096",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {linkify(vid.caption)}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* ========== LIGHTBOX (photos only) ========== */}
        {selectedImage && mediaType === "photos" && (
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
                {selectedImage.caption && (
                  <p>{linkify(selectedImage.caption)}</p>
                )}

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

