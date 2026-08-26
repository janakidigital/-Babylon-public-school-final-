import { Link } from "react-router-dom";
import { publicApi } from "../../services/api";
import { mediaUrl } from "../../lib/media";
import usePublicData from "../../hooks/usePublicData";
import { assetPath } from "../../data/content";
import EmptyState from "../common/EmptyState";

export default function ProgramsSection() {
  const { data, loading } = usePublicData(publicApi.programs, []);
  const items = data.map((program, index) => ({
    ...program,
    text: program.shortDescription || program.description || "",
    image: mediaUrl(
      program.image,
      `${assetPath}courses/courses_${(index % 3) + 1}.jpg`,
    ),
    href: program._id ? `/course-details/${program._id}` : "/academics",
  }));

  return (
    <section className="program-section" id="programs">
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR ACADEMICS</p>
            <h2>
              Learning for every
              <br />
              stage of life.
            </h2>
          </div>
          <p>
            A co-ed English medium school from PG to secondary level, with
            programmes designed so students thrive from their first years
            through graduation.
          </p>
        </div>
        {loading ? (
          <p>Loading programmes...</p>
        ) : items.length === 0 ? (
          <EmptyState
            title="Programmes coming soon"
            
          />
        ) : (
          <div className="program-grid">
            {items.map((program, index) => (
              <article
                className="program-card"
                key={program._id || program.title}
              >
                <img src={program.image} alt="" />
                <div className="program-number">0{index + 1}</div>
                <div className="program-content">
                  <h3>{program.title}</h3>
                  <p>{program.text}</p>
                  <Link to={program.href}>
                    Explore <span>&rarr;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
