import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import PageBanner from "../../components/common/PageBanner";
import ArticleLayout from "../../components/shared/ArticleLayout";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { formatDateParts } from "../../lib/format";
import { mediaUrl } from "../../lib/media";

function formatFullDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}

function NoticesListAll() {
  const { data: notices, loading } = usePublicData(publicApi.notices, []);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const cats = new Set(
      (notices || [])
        .map((n) => String(n.category || "General").trim())
        .filter(Boolean)
    );
    return ["ALL", ...Array.from(cats)];
  }, [notices]);

  const filteredNotices = useMemo(() => {
    return (notices || []).filter((notice) => {
      if (selectedCategory !== "ALL") {
        const cat = String(notice.category || "General").trim().toUpperCase();
        if (cat !== selectedCategory.toUpperCase()) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (notice.title || "").toLowerCase().includes(q);
        const matchesDesc = (notice.shortDescription || notice.content || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }
      return true;
    });
  }, [notices, selectedCategory, searchQuery]);

  return (
    <>
      <PageBanner
        eyebrow="SCHOOL UPDATES"
        title="Notices and announcements."
        image="banner/inner_banner_5.jpg"
        pageKey="notices"
      />

      <section className="listing-page shell" style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
        <div className="center-heading" style={{ marginBottom: "32px" }}>
          <p className="eyebrow">STAY INFORMED</p>
          <h2>All Notices & Announcements</h2>
        </div>

        {/* Search & Category Filter */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {/* Search Box */}
          <div style={{ maxWidth: "480px", margin: "0 auto", width: "100%" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notices by keyword..."
              style={{
                width: "100%",
                padding: "12px 18px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                outline: "none",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
              }}
            />
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      background: isActive ? "#085f7e" : "#f1f5f9",
                      color: isActive ? "#ffffff" : "#334155",
                      border: "none",
                      borderRadius: "999px",
                      padding: "6px 16px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      textTransform: "uppercase",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notices Listing */}
        {loading ? (
          <p style={{ textAlign: "center", color: "#64748b", margin: "40px 0" }}>
            Loading notices...
          </p>
        ) : filteredNotices.length === 0 ? (
          <EmptyState
            title="No notices found"
            text={
              searchQuery || selectedCategory !== "ALL"
                ? "Try resetting your search query or category filter."
                : "Notices published from the admin panel will appear here."
            }
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {filteredNotices.map((notice) => {
              const dateStr = formatFullDate(notice.publishedAt || notice.createdAt);
              const dateParts = formatDateParts(notice.publishedAt || notice.createdAt);
              const categoryStr = notice.category || "NOTICE";
              const attachment = notice.attachment;

              return (
                <article
                  key={notice._id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "20px 24px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "20px",
                    flexWrap: "wrap",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "18px", flex: 1, minWidth: "260px" }}>
                    {/* Date Block */}
                    <div
                      style={{
                        background: "#085f7e",
                        color: "#ffffff",
                        borderRadius: "10px",
                        padding: "10px 14px",
                        textAlign: "center",
                        flexShrink: 0,
                        minWidth: "60px",
                      }}
                    >
                      <strong style={{ display: "block", fontSize: "1.25rem", lineHeight: 1 }}>
                        {dateParts.day}
                      </strong>
                      <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 600 }}>
                        {dateParts.month}
                      </span>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <span
                          style={{
                            background: "#c53030",
                            color: "#ffffff",
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            textTransform: "uppercase",
                          }}
                        >
                          {categoryStr}
                        </span>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          {dateStr}
                        </span>
                      </div>

                      <Link
                        to={`/notices/${notice._id}`}
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: "#1e293b",
                          textDecoration: "none",
                          lineHeight: 1.35,
                          display: "block",
                          marginBottom: notice.shortDescription ? "6px" : "0",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#c53030")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#1e293b")}
                      >
                        {notice.title}
                      </Link>

                      {notice.shortDescription && (
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "#475569", lineHeight: 1.5 }}>
                          {notice.shortDescription}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                    {attachment && (
                      <a
                        href={mediaUrl(attachment)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: "#f1f5f9",
                          color: "#0f172a",
                          border: "1px solid #cbd5e1",
                          borderRadius: "6px",
                          padding: "6px 12px",
                          fontSize: "13px",
                          fontWeight: 600,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {attachment.toLowerCase().endsWith(".pdf") ? "📄 PDF" : "🖼️ Image"}
                      </a>
                    )}

                    <Link
                      to={`/notices/${notice._id}`}
                      style={{
                        background: "#085f7e",
                        color: "#ffffff",
                        borderRadius: "6px",
                        padding: "6px 14px",
                        fontSize: "13px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      View &rarr;
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

export default function NoticesPage() {
  const { id } = useParams();
  const { data: notice, loading } = usePublicData(
    () => (id ? publicApi.noticeOne(id) : Promise.resolve({ data: null })),
    null,
    [id],
  );

  // Listing page (no id)
  if (!id) {
    return <NoticesListAll />;
  }

  // Loading
  if (loading) {
    return (
      <>
        <PageBanner
          eyebrow="NOTICE"
          title="Loading..."
          image="banner/inner_banner_5.jpg"
          pageKey="notices"
        />
        <section className="shell listing-page">
          <p>Loading notice...</p>
        </section>
      </>
    );
  }

  // Not found
  if (!notice) {
    return (
      <>
        <PageBanner
          eyebrow="NOTICE"
          title="Notice not found."
          image="banner/inner_banner_5.jpg"
          pageKey="notices"
        />
        <section className="shell listing-page">
          <EmptyState
            title="This notice is not available"
            text="It may have been unpublished. Browse the latest notices instead."
          />
          <p style={{ marginTop: "20px" }}>
            <Link className="text-link" to="/notices">
              ← Back to notices
            </Link>
          </p>
        </section>
      </>
    );
  }

  const date = formatDateParts(notice.publishedAt || notice.createdAt);

  // Detect attachment type
  const attachment = notice.attachment;
  const isImage =
    attachment && /\.(jpg|jpeg|png|webp|gif)$/i.test(attachment);
  const isPdf =
    attachment &&
    (/\.pdf$/i.test(attachment) ||
      attachment.includes("pdf") ||
      attachment.includes("/raw/upload"));

  return (
    <>
      <PageBanner
        eyebrow={notice.category || "NOTICE"}
        title={notice.title}
        image="banner/inner_banner_5.jpg"
        pageKey="notices"
      />

      {/* Removed the image prop so the big photo no longer shows */}
      <ArticleLayout
        label={`${date.full}${notice.category ? ` · ${notice.category}` : ""}`}
        title={notice.title}
      >
        {/* Back button */}
        <p style={{ marginBottom: "28px" }}>
          <Link className="text-link" to="/notices">
            ← Back to all notices
          </Link>
        </p>

        {/* Short description */}
        {notice.shortDescription && <p>{notice.shortDescription}</p>}

        {/* Main content */}
        {(notice.content || "")
          .split("\n")
          .map((para, index) =>
            para.trim() ? <p key={index}>{para}</p> : null,
          )}

        {/* ========== ATTACHMENT ========== */}
        {attachment && (
          <div className="notice-attachment-box">
            <h3>Attachment</h3>

            {isImage && (
              <div>
                <img
                  src={attachment}
                  alt={`Attachment for ${notice.title}`}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    marginTop: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <p style={{ marginTop: "14px" }}>
                  <a
                    href={attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link"
                  >
                    Open full image →
                  </a>
                </p>
              </div>
            )}

            {isPdf && (
              <div style={{ marginTop: "12px" }}>
                <a
                  href={attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button primary"
                  style={{ display: "inline-flex" }}
                >
                  📄 View / Download PDF
                </a>
              </div>
            )}

            {!isImage && !isPdf && (
              <div style={{ marginTop: "12px" }}>
                <a
                  href={attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button primary"
                  style={{ display: "inline-flex" }}
                >
                  📎 View Attachment
                </a>
              </div>
            )}
          </div>
        )}
      </ArticleLayout>
    </>
  );
}