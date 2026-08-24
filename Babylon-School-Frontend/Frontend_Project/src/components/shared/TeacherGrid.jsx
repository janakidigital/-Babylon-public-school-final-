import { Link } from "react-router-dom";
import { mediaUrl } from "../../lib/media";
import { assetPath } from "../../data/content";

export default function TeacherGrid({ teachers = [] }) {
  return (
    <div className="teacher-grid">
      {teachers.map((teacher) => (
        <article key={teacher._id}>
          <Link to={`/teacher-profile/${teacher._id}`}>
            <img
              src={mediaUrl(teacher.image, `${assetPath}team/team_1.jpg`)}
              alt={teacher.name}
            />
          </Link>
          <div>
            <h3>
              <Link to={`/teacher-profile/${teacher._id}`}>{teacher.name}</Link>
            </h3>
            <p>{teacher.designation}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
