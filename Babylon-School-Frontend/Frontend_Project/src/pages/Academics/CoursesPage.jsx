import PageBanner from "../../components/common/PageBanner";
import ContentCards from "../../components/shared/ContentCards";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";

export default function CoursesPage() {
  const { data, loading } = usePublicData(publicApi.programs, []);
  return (
    <>
      <PageBanner
        eyebrow="COURSES"
        title="Explore our learning programmes."
        image="banner/inner_banner_3.jpg"
        pageKey="academics"
      />
      <section className="listing-page shell">
        <div className="center-heading">
          <p className="eyebrow">FIND YOUR PATH</p>
          <h2>Programmes designed to inspire.</h2>
          <p>
            From PG through secondary, each programme blends strong foundations
            with joyful, practical learning.
          </p>
        </div>
        {loading ? (
          <p>Loading programmes...</p>
        ) : data.length === 0 ? (
          <EmptyState
            title="No programmes published"
            text="Add programmes in the admin panel to list them here."
          />
        ) : (
          <ContentCards items={data} type="course" />
        )}
      </section>
    </>
  );
}
