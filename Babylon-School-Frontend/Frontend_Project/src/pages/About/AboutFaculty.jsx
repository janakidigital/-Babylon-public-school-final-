import { Link } from "react-router-dom";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { mediaUrl } from "../../lib/media";
import { assetPath } from "../../data/content";

export default function AboutFaculty() {
  const { data: faculty, loading } = usePublicData(publicApi.faculty, []);
  const preview = faculty.slice(0, 3);
  if (!loading && preview.length === 0) return null;

  return (
    <section className="about-faculty shell">
      <div className="center-heading">
        <p className="eyebrow">OUR EDUCATORS</p>
        <h2>Meet our teachers</h2>
        <p>
          Passionate mentors who guide students with knowledge, care and
          encouragement.
        </p>
      </div>
      {loading ? (
        <p>Loading faculty...</p>
      ) : (
        <>
          <div className="faculty-grid">
            {preview.map((teacher) => (
              <article key={teacher._id}>
                <Link to={`/teacher-profile/${teacher._id}`}>
                  <img
                    src={mediaUrl(teacher.image, `${assetPath}team/team_1.jpg`)}
                    alt={teacher.name}
                  />
                </Link>
                <h3>{teacher.name}</h3>
                <span>{teacher.designation}</span>
              </article>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link className="text-link" to="/team">
              View all faculty <b>&rarr;</b>
            </Link>
          </p>
        </>
      )}
    </section>
  );
}
