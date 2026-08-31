import { Link } from "react-router-dom";
import { mediaUrl } from "../../lib/media";
import { assetPath } from "../../data/content";

export default function TeacherGrid({ teachers = [], onSelect }) {
  return (
    <div className="teacher-grid">
      {teachers.map((teacher) => (
        <article
          key={teacher._id}
          onClick={() => onSelect && onSelect(teacher)}
          style={{
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            borderRadius: "14px",
            background: "#fff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
          }}
        >
          <img
            src={mediaUrl(teacher.image, `${assetPath}team/team_1.jpg`)}
            alt={teacher.name}
            style={{ borderRadius: "10px" }}
          />
          <div>
            <h3>{teacher.name}</h3>
            <p>{teacher.designation || teacher.department}</p>
            {teacher.qualification && (
              <small
                style={{
                  display: "block",
                  color: "#64748b",
                  marginTop: "6px",
                  fontSize: "12px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                🎓 {teacher.qualification.split("\n")[0]}
              </small>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
