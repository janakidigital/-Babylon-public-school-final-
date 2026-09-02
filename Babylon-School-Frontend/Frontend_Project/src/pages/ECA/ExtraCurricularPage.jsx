import React, { useState } from "react";
import PageBanner from "../../components/common/PageBanner";
import EcaSidebar from "../../components/shared/EcaSidebar";
import usePublicData from "../../hooks/usePublicData";
import { publicApi } from "../../services/api";
import { mediaUrl } from "../../lib/media";
import { ZoomIn, X, ImageOff } from "lucide-react";
import "../About/SidebarsCommon.css";
import "../About/PartnersPage.css";
import "./EcaPage.css";

export default function ExtraCurricularPage() {
  const [activeModalImg, setActiveModalImg] = useState(null);

  const { data: ecaData, loading } = usePublicData(
    () => publicApi.eca("Extra Curricular Activities"),
    []
  );

  const adminItems = Array.isArray(ecaData) ? ecaData : [];

  return (
    <>
      <PageBanner
        eyebrow="INFORMATION CENTER"
        title="Extra Curricular Activities (ECA)"
        image="banner/inner_banner_3.jpg"
        pageKey="notices"
      />

      <section className="shell partners-page-layout">
        <div className="partners-container">
          <EcaSidebar currentPage="extra-curricular-activities" />

          <div className="partners-main-content">
            <div className="eca-page-wrapper">

              {/* Loading State */}
              {loading && (
                <div className="eca-loading">
                  <div className="eca-spinner" />
                  <p>Loading content...</p>
                </div>
              )}

              {/* Empty State */}
              {!loading && adminItems.length === 0 && (
                <div className="eca-empty-state">
                  <ImageOff size={48} strokeWidth={1.2} />
                  <h3>No Content Yet</h3>
                  <p>Content will appear here once added from the Admin panel.</p>
                </div>
              )}

              {/* Admin Items */}
              {!loading && adminItems.map((item, idx) => {
                const images =
                  Array.isArray(item.images) && item.images.length
                    ? item.images
                    : item.coverImage
                      ? [item.coverImage]
                      : [];
                return (
                  <div key={item._id || idx} className="eca-admin-entry">

                    {/* Title */}
                    {item.title && (
                      <h2 className="eca-entry-title">{item.title}</h2>
                    )}

                    {/* Short Description */}
                    {item.shortDescription && (
                      <p className="eca-entry-short">{item.shortDescription}</p>
                    )}

                    {/* Description */}
                    {item.description && (
                      <div className="eca-entry-desc">{item.description}</div>
                    )}

                    {/* Image Gallery */}
                    {images.length > 0 && (
                      <div className="eca-entry-gallery">
                        {images.map((img, iIdx) => {
                          const src = mediaUrl(
                            typeof img === "string" ? img : img.url
                          );
                          const caption =
                            typeof img === "object" ? img.caption : "";
                          return (
                            <div
                              key={iIdx}
                              className="eca-gallery-thumb"
                              onClick={() =>
                                setActiveModalImg({ src, caption, title: item.title })
                              }
                            >
                              <img src={src} alt={caption || item.title} loading="lazy" />
                              <div className="eca-gallery-overlay">
                                <ZoomIn size={20} />
                              </div>
                              {caption && (
                                <p className="eca-gallery-caption">{caption}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {activeModalImg && (
        <div
          className="eca-lightbox-overlay"
          onClick={() => setActiveModalImg(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="eca-lightbox-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="eca-lightbox-close"
              onClick={() => setActiveModalImg(null)}
              aria-label="Close"
            >
              <X size={22} />
            </button>
            <img
              src={activeModalImg.src}
              alt={activeModalImg.title}
              className="eca-lightbox-img"
            />
            {activeModalImg.caption && (
              <p className="eca-lightbox-caption">{activeModalImg.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
