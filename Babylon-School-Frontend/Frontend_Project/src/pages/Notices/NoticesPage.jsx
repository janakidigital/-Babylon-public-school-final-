import { Link, useParams } from "react-router-dom";
import PageBanner from "../../components/common/PageBanner";
import NoticesSection from "../../components/home/NoticesSection";
import ArticleLayout from "../../components/shared/ArticleLayout";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { formatDateParts } from "../../lib/format";

export default function NoticesPage() {
  const { id } = useParams();
  const { data: notice, loading } = usePublicData(
    () => (id ? publicApi.noticeOne(id) : Promise.resolve({ data: null })),
    null,
    [id],
  );

  // Listing page (no id)
  if (!id) {
    return (
      <>
        <PageBanner
          eyebrow="SCHOOL UPDATES"
          title="Notices and announcements."
          image="banner/inner_banner_5.jpg"
          pageKey="notices"
        />
        <NoticesSection />
      </>
    );
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