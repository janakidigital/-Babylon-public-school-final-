import { Link, useParams } from "react-router-dom";
import PageBanner from "../../components/common/PageBanner";
import ArticleLayout from "../../components/shared/ArticleLayout";
import EmptyState from "../../components/common/EmptyState";
import usePublicData from "../../hooks/usePublicData";
import { publicApi } from "../../services/api";

export default function TeacherProfilePage() {
  const { id } = useParams();
  const { data: teacher, loading } = usePublicData(
    () => (id ? publicApi.facultyOne(id) : Promise.resolve({ data: null })),
    null,
    [id],
  );

  if (loading) {
    return (
      <>
        <PageBanner eyebrow="TEACHER" title="Loading..." image="banner/inner_banner_2.jpg" />
        <section className="shell listing-page">
          <p>Loading teacher profile...</p>
        </section>
      </>
    );
  }

  if (!teacher) {
    return (
      <>
        <PageBanner
          eyebrow="TEACHER"
          title="Profile not found."
          image="banner/inner_banner_2.jpg"
        />
        <section className="shell listing-page">
          <EmptyState title="This profile is not available" />
          <Link className="text-link" to="/team">
            Back to team <b>&rarr;</b>
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <PageBanner
        eyebrow="TEACHER PROFILE"
        title={`Meet ${teacher.name}.`}
        image={teacher.image || "banner/inner_banner_2.jpg"}
      />
      <ArticleLayout
        image={teacher.image || "team/team_1.jpg"}
        label={teacher.designation}
        title={teacher.name}
      >
        {teacher.bio && <p>{teacher.bio}</p>}
        {teacher.department && (
          <>
            <h3>Department</h3>
            <p>{teacher.department}</p>
          </>
        )}
        {teacher.qualification && (
          <>
            <h3>Qualification</h3>
            <p>{teacher.qualification}</p>
          </>
        )}
        {(teacher.email || teacher.phone) && (
          <>
            <h3>Contact</h3>
            {teacher.email && <p>Email: {teacher.email}</p>}
            {teacher.phone && <p>Phone: {teacher.phone}</p>}
          </>
        )}
      </ArticleLayout>
    </>
  );
}
