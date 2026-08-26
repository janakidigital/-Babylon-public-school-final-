import PageBanner from "../../components/common/PageBanner";
import ContentCards from "../../components/shared/ContentCards";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";

export default function BlogPage() {
  const { data, loading } = usePublicData(publicApi.news, []);
  return (
    <>
      <PageBanner
        eyebrow="SCHOOL STORIES"
        title="News & Blog from the Babylon community."
        image="banner/inner_banner_1.jpg"
      />
      <section className="listing-page shell">
        {loading ? (
          <p>Loading news...</p>
        ) : data.length === 0 ? (
          <EmptyState
            title="No news yet"
            text="Stories published from the admin panel will appear here."
          />
        ) : (
          <ContentCards items={data} type="post" />
        )}
      </section>
    </>
  );
}
