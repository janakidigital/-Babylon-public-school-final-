import { Link, useParams } from "react-router-dom";
import PageBanner from "../../components/common/PageBanner";
import ArticleLayout from "../../components/shared/ArticleLayout";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { formatDateParts } from "../../lib/format";

export default function EventDetailsPage() {
  const { id } = useParams();
  const { data: event, loading } = usePublicData(
    () => (id ? publicApi.eventOne(id) : Promise.resolve({ data: null })),
    null,
    [id],
  );

  if (loading) {
    return (
      <>
        <PageBanner eyebrow="EVENT" title="Loading..." image="banner/inner_banner_4.jpg" />
        <section className="shell listing-page">
          <p>Loading event...</p>
        </section>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <PageBanner eyebrow="EVENT" title="Event not found." image="banner/inner_banner_4.jpg" />
        <section className="shell listing-page">
          <EmptyState title="This event is not available" />
          <Link className="text-link" to="/events">
            Back to events <b>&rarr;</b>
          </Link>
        </section>
      </>
    );
  }

  const date = formatDateParts(event.eventDate);
  return (
    <>
      <PageBanner
        eyebrow={event.category || "EVENT DETAILS"}
        title={event.title}
        image={event.image || "banner/inner_banner_4.jpg"}
      />
      <ArticleLayout
        image={event.image || "events/event_2.jpg"}
        label={`${date.full}${event.location ? ` | ${event.location}` : ""}`}
        title={event.title}
      >
        {event.shortDescription && <p>{event.shortDescription}</p>}
        {(event.description || "").split("\n").map((para, index) =>
          para.trim() ? <p key={index}>{para}</p> : null,
        )}
        {(event.startTime || event.endTime) && (
          <>
            <h3>Time</h3>
            <p>
              {event.startTime || "TBA"}
              {event.endTime ? ` – ${event.endTime}` : ""}
            </p>
          </>
        )}
      </ArticleLayout>
    </>
  );
}
