import { useEffect } from "react";
import { mediaUrl } from "../../lib/media";
import { assetPath } from "../../data/content";

export default function TeacherModal({ teacher, onClose }) {
  useEffect(() => {
    if (!teacher) return;

    function onKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [teacher, onClose]);

  if (!teacher) return null;

  // Format subtitle (e.g. "HOD : Nepali" or "Principal : Administration")
  const roleSubtitle = [teacher.designation, teacher.department]
    .filter(Boolean)
    .join(" : ");

  return (
    <div
      className="teacher-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="teacher-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <div
        className="teacher-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: "#ffffff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "32px 36px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          animation: "scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "18px",
            right: "20px",
            background: "#f1f5f9",
            color: "#64748b",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            lineHeight: 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e2e8f0";
            e.currentTarget.style.color = "#0f172a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          ×
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Header section with photo and main title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {teacher.image && (
              <div
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  flexShrink: 0,
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.08)",
                  border: "2px solid #f8fafc",
                }}
              >
                <img
                  src={mediaUrl(teacher.image, `${assetPath}team/team_1.jpg`)}
                  alt={teacher.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <div style={{ flex: 1, minWidth: "220px" }}>
              <h2
                id="teacher-modal-title"
                style={{
                  margin: "0 0 6px 0",
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: "#0a192f",
                  letterSpacing: "-0.01em",
                }}
              >
                {teacher.name}
              </h2>

              {roleSubtitle && (
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    color: "#334155",
                  }}
                >
                  {roleSubtitle}
                </p>
              )}

              {teacher.category && (
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    background: "#ecfeff",
                    color: "#0a192f",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "999px",
                    letterSpacing: "0.04em",
                  }}
                >
                  {teacher.category}
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              height: "1px",
              background: "#f1f5f9",
              width: "100%",
              margin: "4px 0",
            }}
          />

          {/* Qualification Details */}
          {teacher.qualification && (
            <div>
              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "#64748b",
                }}
              >
                Qualification
              </h4>
              <div
                style={{
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                  color: "#1e293b",
                  whiteSpace: "pre-line",
                  fontWeight: 400,
                }}
              >
                {teacher.qualification}
              </div>
            </div>
          )}

          {/* Biography */}
          {teacher.bio && (
            <div>
              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "#64748b",
                }}
              >
                About
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.95rem",
                  lineHeight: 1.65,
                  color: "#475569",
                  whiteSpace: "pre-line",
                }}
              >
                {teacher.bio}
              </p>
            </div>
          )}

          {/* Contact Details */}
          {(teacher.email || teacher.phone) && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "14px 18px",
                background: "#f8fafc",
                borderRadius: "12px",
                marginTop: "4px",
              }}
            >
              {teacher.email && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.9rem",
                    color: "#334155",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Email:</span>
                  <a
                    href={`mailto:${teacher.email}`}
                    style={{ color: "#0a192f", textDecoration: "none" }}
                  >
                    {teacher.email}
                  </a>
                </div>
              )}

              {teacher.phone && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.9rem",
                    color: "#334155",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Phone:</span>
                  <a
                    href={`tel:${teacher.phone}`}
                    style={{ color: "#0a192f", textDecoration: "none" }}
                  >
                    {teacher.phone}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
