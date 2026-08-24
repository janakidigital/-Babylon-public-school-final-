import { Link } from "react-router-dom";
import { mediaUrl } from "../../lib/media";
import { formatDateParts, itemId } from "../../lib/format";
import { assetPath } from "../../data/content";

export default function ContentCards({ items = [], type = "course" }) {
  return (
    <div className={`content-cards ${type}`}>
      {items.map((item) => {
        const id = itemId(item);
        const date = formatDateParts(item.eventDate || item.publishedAt || item.createdAt);
        const image = mediaUrl(
          item.image,
          `${assetPath}${type === "event" ? "events/event_1.jpg" : type === "post" ? "blog/blog_1.jpg" : "courses/courses_1.jpg"}`,
        );
        const title = item.title;
        const text = item.shortDescription || item.description || item.content || "";
        const href =
          type === "course"
            ? `/course-details/${id}`
            : type === "event"
              ? `/event-details/${id}`
              : `/blog-details/${id}`;
        return (
          <article key={id || title}>
            <img src={image} alt="" />
            {type === "event" && (
              <div className="event-date-card">
                <strong>{date.day}</strong>
                <span>{date.month}</span>
              </div>
            )}
            <div>
              <p className="eyebrow">
                {type === "event"
                  ? item.location || "School campus"
                  : type === "post"
                    ? item.category || "School news"
                    : item.level || "Academic programme"}
              </p>
              <h3>{title}</h3>
              <p>{text}</p>
              <Link className="text-link" to={href}>
                Read more <b>&rarr;</b>
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
