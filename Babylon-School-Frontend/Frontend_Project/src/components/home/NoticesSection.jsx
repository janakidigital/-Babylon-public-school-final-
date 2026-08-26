import { Link } from "react-router-dom";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { formatDateParts } from "../../lib/format";
import { mediaUrl } from "../../lib/media";          // ← make sure this exists
import EmptyState from "../common/EmptyState";

export default function NoticesSection({ limit }) {
  const { data, loading } = usePublicData(publicApi.notices, []);

  const items = (limit ? data.slice(0, limit) : data).map((notice) => {
    const date = formatDateParts(notice.publishedAt || notice.createdAt);
    return {
      ...notice,
      day: date.day,
      month: date.month,
      href: notice._id ? `/notices/${notice._id}` : "/notices",
    };
  });

  return (
    <section className="news shell" id="notices">
      <div className="news-heading">
        <div>
          <p className="eyebrow">STAY INFORMED</p>
          <h2>
            Latest notices &<br />
            announcements.
          </h2>
        </div>
        <Link className="text-link" to="/notices">
          View all notices <b>&rarr;</b>
        </Link>
      </div>

      {loading ? (
        <p>Loading notices...</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="No notices yet"
          text="School notices published from the admin panel will appear here."
        />
      ) : (
        <div className="notice-list">
          {items.map((notice) => (
            <article className="notice" key={notice._id || notice.title}>
              <div className="date">
                <strong>{notice.day}</strong>
                <span>{notice.month}</span>
              </div>

              <div className="notice-content">
                <h3>{notice.title}</h3>

                {/* Show attachment button if available */}
                {notice.attachment && (
                  <a
                    href={mediaUrl(notice.attachment)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="notice-attachment"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {notice.attachment.toLowerCase().endsWith(".pdf")
                      ? "📄 View PDF"
                      : "🖼️ View Image"}
                  </a>
                )}
              </div>

              <Link to={notice.href} aria-label={`Read ${notice.title}`}>
                &rarr;
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}