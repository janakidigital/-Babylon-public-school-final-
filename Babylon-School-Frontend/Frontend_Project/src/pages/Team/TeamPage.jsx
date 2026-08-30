import PageBanner from "../../components/common/PageBanner";
import TeacherGrid from "../../components/shared/TeacherGrid";
import EmptyState from "../../components/common/EmptyState";
import usePublicData from "../../hooks/usePublicData";
import { publicApi } from "../../services/api";

export default function TeamPage() {
  const { data: teachers, loading } = usePublicData(publicApi.faculty, []);

  return (
    <>
      <PageBanner
        eyebrow="OUR TEAM"
        title="Meet the people behind Babylon."
        image="banner/inner_banner_2.jpg"
        pageKey="team"
      />
      <section className="listing-page shell">
        <div className="center-heading">
          <p className="eyebrow">OUR EDUCATORS</p>
          <h2>Guiding every learner forward.</h2>
        </div>
        {loading ? (
          <p>Loading faculty...</p>
        ) : teachers.length === 0 ? (
          <EmptyState
            title="Faculty profiles coming soon"
            text="Add teachers from the admin panel to introduce them here."
          />
        ) : (
          <TeacherGrid teachers={teachers} />
        )}
      </section>
    </>
  );
}
