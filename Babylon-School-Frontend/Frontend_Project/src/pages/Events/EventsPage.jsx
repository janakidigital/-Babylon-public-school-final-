import PageBanner from "../../components/common/PageBanner";
import ContentCards from "../../components/shared/ContentCards";
import NoticesSidebar from "../../components/shared/NoticesSidebar";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";

export default function EventsPage() {
  const { data, loading } = usePublicData(publicApi.events, []);

  return (
    <>
      <PageBanner
        eyebrow="SCHOOL EVENTS"
        title="Moments that bring us together."
        image="banner/inner_banner_4.jpg"
        pageKey="events"
      />

      <div className="notices-page-layout">
        <div className="notices-container">
          <NoticesSidebar currentPage="events" />

          <div className="notices-main-content">
            <section className="listing-page">
              <div className="center-heading">
                <p className="eyebrow">WHAT'S HAPPENING</p>
                <h2>Upcoming events</h2>
              </div>

              {loading ? (
                <p>Loading events...</p>
              ) : data.length === 0 ? (
                <EmptyState
                  title="No events published"
                  text="Events added from the admin panel will appear on this page."
                />
              ) : (
                <ContentCards items={data} type="event" />
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}