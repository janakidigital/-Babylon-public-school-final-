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

  if (!id) {
    return (
      <>
        <PageBanner
          eyebrow="SCHOOL UPDATES"
          title="Notices and announcements."
          image="banner/inner_banner_5.jpg"
        />
        <NoticesSection />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <PageBanner eyebrow="NOTICE" title="Loading..." image="banner/inner_banner_5.jpg" />
        <section className="shell listing-page">
          <p>Loading notice...</p>
        </section>
      </>
    );
  }

  if (!notice) {
    return (
      <>
        <PageBanner eyebrow="NOTICE" title="Notice not found." image="banner/inner_banner_5.jpg" />
        <section className="shell listing-page">
          <EmptyState
            title="This notice is not available"
            text="It may have been unpublished. Browse the latest notices instead."
          />
          <p>
            <Link className="text-link" to="/notices">
              Back to notices <b>&rarr;</b>
            </Link>
          </p>
        </section>
      </>
    );
  }

  const date = formatDateParts(notice.publishedAt || notice.createdAt);
  return (
    <>
      <PageBanner
        eyebrow={notice.category || "NOTICE"}
        title={notice.title}
        image="banner/inner_banner_5.jpg"
      />
      <ArticleLayout
        image="banner/inner_banner_5.jpg"
        label={`${date.full}${notice.category ? ` · ${notice.category}` : ""}`}
        title={notice.title}
      >
        {notice.shortDescription && <p>{notice.shortDescription}</p>}
        {(notice.content || "").split("\n").map((para, index) =>
          para.trim() ? <p key={index}>{para}</p> : null,
        )}
      </ArticleLayout>
    </>
  );
}
