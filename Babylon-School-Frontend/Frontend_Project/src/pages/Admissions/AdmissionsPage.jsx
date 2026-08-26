import { useState } from "react";
import PageBanner from "../../components/common/PageBanner";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";

const steps = [
  "Share your enquiry",
  "Visit the school",
  "Complete your application",
];

export default function AdmissionsPage() {
  const [submitted, setSubmitted] = useState("");
  const { data: programs } = usePublicData(publicApi.programs, []);

  async function submit(event) {
    event.preventDefault();
    setSubmitted("");

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      await publicApi.admission(payload);

      setSubmitted(
        "Thank you. Your admission enquiry has been submitted. Our admissions team will contact you soon."
      );

      event.currentTarget.reset();
    } catch (error) {
      setSubmitted(error.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <PageBanner
        eyebrow="ADMISSIONS"
        title="Begin your Babylon journey."
        image="banner/inner_banner_1.jpg"
      />

      <section className="admissions-page shell">
        <div>
          <p className="eyebrow">ADMISSION PROCESS</p>

          <h2>A welcoming start for every family.</h2>

          <p>
            Admissions are open from PG to secondary. Our team makes the process
            easy, clear and personal for families in Kathmandu and beyond.
          </p>

          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <form onSubmit={submit}>
          {/* ==========================================
              Parent / Guardian Information
          ========================================== */}

          <label>
            Parent / Guardian Name
            <input
              name="parentName"
              required
              placeholder="Parent / guardian full name"
            />
          </label>

          <label>
            Parent / Guardian Phone
            <input
              name="parentPhone"
              type="tel"
              required
              placeholder="Parent / guardian contact number"
            />
          </label>

          {/* ==========================================
              Student Information
          ========================================== */}

          <label>
            Student Name
            <input
              name="name"
              required
              placeholder="Student's full name"
            />
          </label>

          <label>
            Student Email
            <input
              name="email"
              type="email"
              required
              placeholder="student@email.com"
            />
          </label>

          <label>
            Student Phone
            <input
              name="phone"
              type="tel"
              required
              placeholder="Student's contact number"
            />
          </label>

          <label>
            Date of Birth
            <input
              name="dateOfBirth"
              type="date"
            />
          </label>

          <label>
            Gender
            <select name="gender" defaultValue="">
              <option value="" disabled>
                Select gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label>
            Address
            <textarea
              name="address"
              placeholder="Current address"
              rows="3"
            />
          </label>

          {/* ==========================================
              Academic Information
          ========================================== */}

          <label>
            Programme
            <select name="program" required defaultValue="">
              <option value="" disabled>
                Select programme
              </option>

              {programs.map((program) => (
                <option key={program._id} value={program.title}>
                  {program.title}
                </option>
              ))}

              {programs.length === 0 && (
                <>
                  <option value="Play Group (PG)">Play Group (PG)</option>
                  <option value="Basic Level">Basic Level</option>
                  <option value="Secondary Level">
                    Secondary Level
                  </option>
                </>
              )}
            </select>
          </label>

          <label>
            Previous School
            <input
              name="previousSchool"
              placeholder="Name of previous school"
            />
          </label>

          {/* ==========================================
              Additional Message
          ========================================== */}

          <label>
            Message
            <textarea
              name="message"
              placeholder="Any additional information or questions..."
              rows="5"
            />
          </label>

          <button className="button primary" type="submit">
            Request information <span>&rarr;</span>
          </button>

          {submitted && (
            <p className="form-success">
              {submitted}
            </p>
          )}
        </form>
      </section>
    </>
  );
}