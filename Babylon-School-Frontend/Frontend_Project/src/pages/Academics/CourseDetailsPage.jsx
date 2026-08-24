import { Link, useParams } from "react-router-dom";
import PageBanner from "../../components/common/PageBanner";
import ArticleLayout from "../../components/shared/ArticleLayout";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const { data: program, loading } = usePublicData(
    () => (id ? publicApi.programOne(id) : Promise.resolve({ data: null })),
    null,
    [id],
  );

  if (loading) {
    return (
      <>
        <PageBanner eyebrow="PROGRAMME" title="Loading..." image="banner/inner_banner_3.jpg" />
        <section className="shell listing-page">
          <p>Loading programme...</p>
        </section>
      </>
    );
  }

  if (!program) {
    return (
      <>
        <PageBanner
          eyebrow="PROGRAMME"
          title="Programme not found."
          image="banner/inner_banner_3.jpg"
        />
        <section className="shell listing-page">
          <EmptyState title="This programme is not available" />
          <Link className="text-link" to="/academics">
            Back to academics <b>&rarr;</b>
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <PageBanner
        eyebrow={program.level || "COURSE DETAILS"}
        title={program.title}
        image={program.image || "banner/inner_banner_3.jpg"}
      />
      <ArticleLayout
        image={program.image || "courses/courses_1.jpg"}
        label={program.level || "Academic programme"}
        title={program.title}
      >
        {program.shortDescription && <p>{program.shortDescription}</p>}
        {(program.description || "").split("\n").map((para, index) =>
          para.trim() ? <p key={index}>{para}</p> : null,
        )}
        {program.duration && (
          <>
            <h3>Duration</h3>
            <p>{program.duration}</p>
          </>
        )}
        {program.eligibility && (
          <>
            <h3>Eligibility</h3>
            <p>{program.eligibility}</p>
          </>
        )}
        {program.highlights?.length > 0 && (
          <>
            <h3>What students experience</h3>
            <ul>
              {program.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        )}
      </ArticleLayout>
    </>
  );
}
