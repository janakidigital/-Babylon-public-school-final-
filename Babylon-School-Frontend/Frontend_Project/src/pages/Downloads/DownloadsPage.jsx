import React from "react";
import PageBanner from "../../components/common/PageBanner";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";

export default function DownloadsPage() {
  const { data: downloads, loading, error } = usePublicData(
    publicApi.downloads,
    []
  );

  return (
    <>
      <PageBanner
        eyebrow="RESOURCES"
        title="Downloads & Documents"
        image="banner/inner_banner_5.jpg"
      />

      <section className="shell" style={{ padding: "80px 0" }}>
        {loading ? (
          <p>Loading documents...</p>
        ) : error ? (
          <EmptyState
            title="Unable to load downloads"
            text="Please try again later."
          />
        ) : downloads.length === 0 ? (
          <EmptyState
            title="No downloads available"
            text="Check back later for new documents."
          />
        ) : (
          <div className="notice-list">
            {downloads.map((item) => (
              <div className="notice" key={item._id}>
                <div className="date">
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                    PDF
                  </span>
                </div>
                <div className="notice-content">
                  <h3>{item.title}</h3>
                  {item.category && (
                    <span style={{ fontSize: "12px", color: "var(--red)", fontWeight: "bold" }}>
                      {item.category}
                    </span>
                  )}
                  {item.description && (
                    <p style={{ margin: "5px 0", fontSize: "14px", color: "var(--muted)" }}>
                      {item.description}
                    </p>
                  )}
                </div>
                <a
                  href={item.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button primary"
                  style={{ display: "inline-flex", padding: "10px 15px" }}
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
