import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageBanner from "../../components/common/PageBanner";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";

const CATEGORIES = [
  "Babylon_Buds",
  "Parents Portal",
  "Calendar",
  "Syllabus",
  "Administrative",
  "Others",
];

/** Turn plain URLs in text into clickable <a> tags */
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
          color: "var(--red)",
          textDecoration: "underline",
          wordBreak: "break-all",
          overflowWrap: "anywhere",
        }}
      >
        {part}
      </a>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

export default function DownloadsPage() {
  const { data: downloads, loading, error } = usePublicData(
    publicApi.downloads,
    []
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState(
    categoryFromUrl && CATEGORIES.includes(categoryFromUrl)
      ? categoryFromUrl
      : "All"
  );

  // Keep filter in sync when URL changes (navbar, browser back/forward)
  useEffect(() => {
    if (categoryFromUrl && CATEGORIES.includes(categoryFromUrl)) {
      setActiveCategory(categoryFromUrl);
    } else if (!categoryFromUrl) {
      setActiveCategory("All");
    }
  }, [categoryFromUrl]);

  // Change category + update URL at the same time
  const selectCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const counts = useMemo(() => {
    const map = { All: downloads.length };
    CATEGORIES.forEach((cat) => {
      map[cat] = downloads.filter(
        (d) => (d.category || "Others") === cat
      ).length;
    });
    return map;
  }, [downloads]);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return downloads;
    return downloads.filter(
      (d) => (d.category || "Others") === activeCategory
    );
  }, [downloads, activeCategory]);

  return (
    <>
      <PageBanner
        eyebrow="RESOURCES"
        title="Downloads & Documents"
        image="banner/inner_banner_5.jpg"
        pageKey="downloads"
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
          <>
            {/* Category filter chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "32px",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: "var(--muted)",
                  marginRight: "4px",
                }}
              >
                Browse by category:
              </span>

              {["All", ...CATEGORIES].map((cat) => {
                const isActive = activeCategory === cat;
                const count = counts[cat] ?? 0;
                if (cat !== "All" && count === 0) return null;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => selectCategory(cat)}
                    style={{
                      border: "1px solid",
                      borderColor: isActive
                        ? "var(--red, #c53030)"
                        : "#e2e8f0",
                      background: isActive
                        ? "var(--red, #c53030)"
                        : "#fff",
                      color: isActive ? "#fff" : "#2d3748",
                      borderRadius: "999px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {cat}
                    <span
                      style={{
                        background: isActive
                          ? "rgba(255,255,255,0.25)"
                          : "#edf2f7",
                        color: isActive ? "#fff" : "#4a5568",
                        borderRadius: "999px",
                        padding: "2px 8px",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Cards grid */}
            {filtered.length === 0 ? (
              <EmptyState
                title={`No documents in “${activeCategory}”`}
                text="Try another category or check back later."
              />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "20px",
                }}
              >
                {filtered.map((item) => {
                  const fileOrLink =
                    item.file ||
                    (item.description &&
                      (item.description.match(/https?:\/\/[^\s]+/) ||
                        [])[0]) ||
                    null;

                  return (
                    <div
                      key={item._id}
                      style={{
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                        overflow: "hidden",
                      }}
                    >
                      {/* Badge */}
                      <div
                        style={{
                          display: "inline-flex",
                          alignSelf: "flex-start",
                          background: "#edf2f7",
                          color: "#2d3748",
                          fontSize: "12px",
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: "6px",
                        }}
                      >
                        {item.file ? "PDF" : "LINK"}
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "17px",
                          lineHeight: 1.35,
                          color: "#1a202c",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.title}
                      </h3>

                      {/* Category */}
                      {item.category && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--red, #c53030)",
                            fontWeight: 700,
                          }}
                        >
                          {item.category}
                        </span>
                      )}

                      {/* Description */}
                      {item.description && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "var(--muted, #718096)",
                            lineHeight: 1.5,
                            flex: 1,
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {linkify(item.description)}
                        </p>
                      )}

                      {/* View button */}
                      {fileOrLink && (
                        <a
                          href={fileOrLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button primary"
                          style={{
                            display: "inline-flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            marginTop: "4px",
                            padding: "12px 16px",
                            textAlign: "center",
                            textDecoration: "none",
                          }}
                        >
                          View
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}