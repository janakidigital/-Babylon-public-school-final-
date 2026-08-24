import { useState } from "react";
import PageBanner from "../../components/common/PageBanner";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";

export default function BecomeTeacherPage() {
  const { data: vacancies, loading } = usePublicData(publicApi.careers, []);
  const [result, setResult] = useState("");

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      await publicApi.applyCareer({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        careerTitle: payload.careerTitle,
        coverLetter: payload.coverLetter,
      });
      setResult("Thank you. Your application has been sent.");
      form.reset();
    } catch (error) {
      setResult(error.message);
    }
  }

  return (
    <>
      <PageBanner
        eyebrow="CAREERS"
        title="Teach, inspire and grow with us."
        image="banner/instructor.jpg"
      />

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
                <p>{v.description}</p>
                {v.closingDate && (
                  <p style={{ fontSize: "0.85rem", color: "#d9534f" }}>
                    <b>Apply by:</b> {new Date(v.closingDate).toLocaleDateString()}
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
        <form onSubmit={submit}>
          <label>
            Full name
            <input name="name" required placeholder="Your name" />
          </label>
          <label>
            Email address
            <input name="email" type="email" required placeholder="name@email.com" />
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
            <textarea name="coverLetter" rows="4" placeholder="Tell us about yourself" />
          </label>
          <button className="button primary">
            Submit application <span>&rarr;</span>
          </button>
          {result && <p className="form-success">{result}</p>}
        </form>
      </section>
    </>
  );
}
