import { useState } from "react";
import PageBanner from "../../components/common/PageBanner";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import toast from "react-hot-toast";

export default function BecomeTeacherPage() {
  const { data: vacancies, loading } = usePublicData(publicApi.careers, []);
  const [result, setResult] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setResult("");

    const form = event.currentTarget;
    const formData = new FormData(form); // Important: send as FormData

    try {
      await publicApi.applyCareer(formData);
      toast.success("Thank you. Your application has been sent successfully.");
      setResult("Thank you. Your application has been sent successfully.");
      form.reset();
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
      setResult(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageBanner
        eyebrow="CAREERS"
        title="Teach, inspire and grow with us."
        image="banner/instructor.jpg"
      />

      {/* ===================== OPEN ROLES ===================== */}
      <section className="shell" style={{ padding: "4rem 0 2rem" }}>
        <p className="eyebrow">OPEN ROLES</p>
        <h2>Current Vacancies</h2>

        {loading ? (
          <p>Loading open roles...</p>
        ) : vacancies.length > 0 ? (
          <div style={{ display: "grid", gap: "2rem", marginTop: "2rem" }}>
            {vacancies.map((v) => (
              <article
                key={v._id}
                style={{
                  border: "1px solid #eee",
                  padding: "2rem",
                  borderRadius: "8px",
                }}
              >
                <h3 style={{ margin: "0 0 0.5rem" }}>{v.title}</h3>

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    color: "#666",
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span>
                    <b>Department:</b> {v.department || "General"}
                  </span>
                  <span>
                    <b>Type:</b> {v.type || "Full-time"}
                  </span>
                  <span>
                    <b>Location:</b> {v.location || "On-site"}
                  </span>
                </div>

                {/* Description with proper paragraphs */}
                <div className="job-description">
                  {(v.description || "")
                    .split("\n")
                    .filter((para) => para.trim() !== "")
                    .map((para, index) => (
                      <p key={index}>{para}</p>
                    ))}
                </div>

                {v.closingDate && (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#d9534f",
                      marginTop: "1rem",
                    }}
                  >
                    <b>Apply by:</b>{" "}
                    {new Date(v.closingDate).toLocaleDateString()}
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p style={{ marginTop: "1rem" }}>
            There are no current vacancies. We are always interested in meeting
            thoughtful educators — share your interest below.
          </p>
        )}
      </section>

      {/* ===================== APPLICATION FORM ===================== */}
      <section className="career-page shell" style={{ paddingTop: "2rem" }}>
        <div>
          <p className="eyebrow">JOIN OUR TEAM</p>
          <h2>Make a difference every day.</h2>
          <p>
            We look for energetic educators committed to helping young people
            flourish at Babylon National School.
          </p>
          <ul>
            <li>A caring and collaborative culture</li>
            <li>Professional learning opportunities</li>
            <li>A purposeful role in a growing community</li>
          </ul>
        </div>

        <form onSubmit={submit} encType="multipart/form-data">
          <label>
            Full name
            <input name="name" required placeholder="Your name" />
          </label>

          <label>
            Email address
            <input
              name="email"
              type="email"
              required
              placeholder="name@email.com"
            />
          </label>

          <label>
            Phone
            <input name="phone" type="tel" placeholder="Your contact number" />
          </label>

          <label>
            Area of interest
            <select name="careerTitle" required defaultValue="">
              <option value="" disabled>
                Select an area
              </option>

              {vacancies.length > 0 && (
                <optgroup label="Open Roles">
                  {vacancies.map((v) => (
                    <option key={v._id} value={v.title}>
                      {v.title}
                    </option>
                  ))}
                </optgroup>
              )}

              <optgroup label="General">
                <option>Teaching</option>
                <option>Administration</option>
                <option>Support services</option>
              </optgroup>
            </select>
          </label>

          <label>
            Cover letter
            <textarea
              name="coverLetter"
              rows="4"
              placeholder="Tell us about yourself"
            />
          </label>

          {/* ========== CV / RESUME UPLOAD ========== */}
          <label>
            Upload CV / Resume (PDF or Word)
            <input
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              required
            />
            <small style={{ display: "block", marginTop: "6px", color: "#666" }}>
              Accepted formats: PDF, DOC, DOCX (Max 5MB recommended)
            </small>
          </label>

          <button className="button primary" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit application"}{" "}
            <span>&rarr;</span>
          </button>

          {result && <p className="form-success">{result}</p>}
        </form>
      </section>
    </>
  );
}