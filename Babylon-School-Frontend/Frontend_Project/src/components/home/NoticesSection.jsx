import { Link } from "react-router-dom";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { mediaUrl } from "../../lib/media";
import EmptyState from "../common/EmptyState";

function formatFullDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}

export default function NoticesSection({ limit = 4, showEvents = true }) {
  const { data: noticesData, loading: noticesLoading } = usePublicData(
    publicApi.notices,
    [],
  );
  const { data: eventsData, loading: eventsLoading } = usePublicData(
    publicApi.events,
    [],
  );

  const notices = (limit ? noticesData.slice(0, limit) : noticesData) || [];
  const events = (limit ? eventsData.slice(0, limit) : eventsData) || [];

  return (
    <section
      className="shell notices-events-section"
      id="notices-and-events"
      style={{
        margin: "48px auto",
        padding: "0 20px",
      }}
    >
      <style>{`
        .notices-events-grid {
          display: grid;
          grid-template-columns: ${showEvents ? "repeat(2, 1fr)" : "1fr"};
          gap: 48px;
          align-items: start;
        }

        @media (max-width: 900px) {
          .notices-events-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }

        .notice-item-hover:hover .notice-title-link {
          color: #c53030 !important;
        }
      `}</style>

      <div className="notices-events-grid">
        {/* =========================================================
            LEFT COLUMN: NEWS & NOTICES
        ========================================================= */}
        <div className="news-notices-col">
          {/* Section Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
              paddingBottom: "10px",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "#0a192f",
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  display: "inline-block",
                  position: "relative",
                }}
              >
                NEWS & NOTICES
                <span
                  style={{
                    display: "block",
                    width: "40px",
                    height: "3px",
                    background: "#0a192f",
                    marginTop: "6px",
                    borderRadius: "2px",
                  }}
                />
              </h2>
            </div>

            <Link
              to="/notices"
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#0284c7",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0369a1")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#0284c7")}
            >
              View All &raquo;
            </Link>
          </div>

          {/* Notices Content */}
          {noticesLoading ? (
            <p style={{ color: "#64748b", margin: "24px 0" }}>
              Loading notices...
            </p>
          ) : notices.length === 0 ? (
            <EmptyState
              title="No notices yet"
              text="School notices published from the admin panel will appear here."
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {notices.map((notice, index) => {
                const dateStr = formatFullDate(
                  notice.publishedAt || notice.createdAt,
                );
                const categoryStr = notice.category || "NOTICE";
                const noticeUrl = `/notices/${notice._id}`;

                return (
                  <article
                    key={notice._id || index}
                    style={{
                      padding: "16px 0",
                      borderBottom:
                        index < notices.length - 1
                          ? "1px dotted #cbd5e0"
                          : "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <Link
                      to={noticeUrl}
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#1e293b",
                        textDecoration: "none",
                        lineHeight: 1.45,
                        transition: "color 0.15s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#c53030")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#1e293b")
                      }
                    >
                      {notice.title}
                    </Link>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      {dateStr && (
                        <span
                          style={{
                            background: "#062b59",
                            color: "#ffffff",
                            fontSize: "12px",
                            fontWeight: 600,
                            padding: "4px 10px",
                            borderRadius: "4px",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {dateStr}
                        </span>
                      )}

                      <span
                        style={{
                          background: "#c53030",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "4px",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {categoryStr}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* =========================================================
            RIGHT COLUMN: EVENTS (Optional)
        ========================================================= */}
        {showEvents && (
          <div className="events-col">
            {/* Section Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
                paddingBottom: "10px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "#0a192f",
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    display: "inline-block",
                    position: "relative",
                  }}
                >
                  EVENTS
                  <span
                    style={{
                      display: "block",
                      width: "40px",
                      height: "3px",
                      background: "#0a192f",
                      marginTop: "6px",
                      borderRadius: "2px",
                    }}
                  />
                </h2>
              </div>

              <Link
                to="/events"
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#0284c7",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0369a1")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#0284c7")}
              >
                View All &raquo;
              </Link>
            </div>

            {/* Events Content */}
            {eventsLoading ? (
              <p style={{ color: "#64748b", margin: "24px 0" }}>
                Loading events...
              </p>
            ) : events.length === 0 ? (
              <EmptyState
                title="No upcoming events"
                text="Upcoming school events will be posted here."
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {events.map((event, index) => {
                  const dateStr = formatFullDate(
                    event.eventDate || event.createdAt,
                  );
                  const timeStr = [event.startTime, event.endTime]
                    .filter(Boolean)
                    .join(" - ");
                  const eventUrl = `/event-details/${event._id}`;

                  return (
                    <article
                      key={event._id || index}
                      style={{
                        padding: "16px 0",
                        borderBottom:
                          index < events.length - 1
                            ? "1px dotted #cbd5e0"
                            : "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      {/* Event Thumbnail or Placeholder */}
                      <Link
                        to={eventUrl}
                        style={{
                          width: "74px",
                          height: "74px",
                          borderRadius: "6px",
                          overflow: "hidden",
                          flexShrink: 0,
                          background: "#e0e7ff",
                          border: "1px solid #c7d2fe",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          padding: "4px",
                          textDecoration: "none",
                          transition: "transform 0.15s ease",
                        }}
                      >
                        {event.image ? (
                          <img
                            src={mediaUrl(event.image)}
                            alt={event.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "2px",
                            }}
                          >
                            <span style={{ fontSize: "16px" }}>📅</span>
                            <span
                              style={{
                                fontSize: "9px",
                                fontWeight: 800,
                                color: "#4338ca",
                                textTransform: "uppercase",
                                lineHeight: 1.1,
                              }}
                            >
                              UPCOMING EVENT
                            </span>
                          </div>
                        )}
                      </Link>

                      {/* Event Info */}
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <Link
                          to={eventUrl}
                          style={{
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#1e293b",
                            textDecoration: "none",
                            lineHeight: 1.4,
                            transition: "color 0.15s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#c53030")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "#1e293b")
                          }
                        >
                          {event.title}
                        </Link>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "8px",
                          }}
                        >
                          {timeStr && (
                            <span
                              style={{
                                background: "#c53030",
                                color: "#ffffff",
                                fontSize: "11px",
                                fontWeight: 600,
                                padding: "3px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              {timeStr}
                            </span>
                          )}

                          {dateStr && (
                            <span
                              style={{
                                background: "#062b59",
                                color: "#ffffff",
                                fontSize: "11px",
                                fontWeight: 600,
                                padding: "3px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              {dateStr}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
