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
  const [submitting, setSubmitting] = useState(false);

  const { data: programs } = usePublicData(publicApi.programs, []);

  async function submit(event) {
    event.preventDefault();

    // Save the form reference BEFORE the async request
    const formElement = event.currentTarget;

    setSubmitted("");
    setSubmitting(true);

    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());

    try {
      await publicApi.admission(payload);

      setSubmitted(
        "Thank you. Your admission enquiry has been submitted. Our admissions team will contact you soon.",
      );

      // Reset using the saved form reference
      formElement.reset();
    } catch (error) {
      setSubmitted(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
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
        {/* ==========================================
            LEFT SIDE - ADMISSION INFORMATION
        ========================================== */}

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

        {/* ==========================================
            RIGHT SIDE - ADMISSION FORM
        ========================================== */}

        <form onSubmit={submit}>
          {/* ==========================================
              PARENT / GUARDIAN INFORMATION
          ========================================== */}

          <label>
            Parent / Guardian Name
            <input
              name="parentName"
              type="text"
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
              STUDENT INFORMATION
          ========================================== */}

          <label>
            Student Name
            <input
              name="name"
              type="text"
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
            <input name="dateOfBirth" type="date" />
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
            Temporary Address
            <textarea
              name="temporaryAddress"
              placeholder="Temporary / current address"
              rows="3"
            />
          </label>

          <label>
            Permanent Address
            <textarea
              name="permanentAddress"
              placeholder="Permanent address"
              rows="3"
            />
          </label>

          {/* ==========================================
              ACADEMIC INFORMATION
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

              {/* Fallback programmes */}
              {programs.length === 0 && (
                <>
                  <option value="Play Group (PG)">Play Group (PG)</option>

                  <option value="Basic Level">Basic Level</option>

                  <option value="Secondary Level">Secondary Level</option>
                </>
              )}
            </select>
          </label>

          <label>
            Previous School
            <input
              name="previousSchool"
              type="text"
              placeholder="Name of previous school"
            />
          </label>

          {/* ==========================================
              ADDITIONAL MESSAGE
          ========================================== */}

          <label>
            Message
            <textarea
              name="message"
              placeholder="Any additional information or questions..."
              rows="5"
            />
          </label>

          {/* ==========================================
              SUBMIT BUTTON
          ========================================== */}

          <button
            className="button primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Request information"}

            {!submitting && <span>&rarr;</span>}
          </button>

          {/* ==========================================
              SUCCESS / ERROR MESSAGE
          ========================================== */}

          {submitted && <p className="form-success">{submitted}</p>}
        </form>
      </section>
    </>
  );
}