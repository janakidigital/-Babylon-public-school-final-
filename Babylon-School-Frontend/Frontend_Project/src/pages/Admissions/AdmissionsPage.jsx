import { useState } from "react";
import PageBanner from "../../components/common/PageBanner";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import "../Admissions/AdmissionsPage.css";

const steps = [
  "Share your enquiry",
  "Visit the school",
  "Complete your application",
];

export default function AdmissionsPage() {
  const [submitted, setSubmitted] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: programs } = usePublicData(publicApi.programs, []);

  async function submit(event) {
    event.preventDefault();

    const formElement = event.currentTarget;

    setSubmitted("");
    setIsError(false);
    setSubmitting(true);

    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());

    try {
      await publicApi.admission(payload);

      setSubmitted(
        "Thank you. Your admission enquiry has been submitted. Our admissions team will contact you soon.",
      );
      setIsError(false);
      formElement.reset();
    } catch (error) {
      setSubmitted(error.message || "Something went wrong. Please try again.");
      setIsError(true);
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
        {/* LEFT — process */}
        <div className="admissions-info">
          <p className="eyebrow">ADMISSION PROCESS</p>

          <h2>A welcoming start for every family.</h2>

          <p className="admissions-lead">
            Admissions are open from PG to secondary. Our team makes the process
            easy, clear and personal for families in Kathmandu and beyond.
          </p>

          <ol className="admissions-steps">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <div className="admissions-note">
            <p>
              <strong>Need help?</strong> Call our admissions office or leave a
              message in the form — we typically respond within 1–2 working days.
            </p>
          </div>
        </div>

        {/* RIGHT — form */}
        <form className="admissions-form" onSubmit={submit} noValidate>
          <div className="admissions-form-header">
            <h3>Admission enquiry</h3>
            <p>Fill in the details below and our team will get back to you.</p>
          </div>

          {/* Parent / Guardian */}
          <fieldset className="admissions-fieldset">
            <legend>Parent / Guardian</legend>
            <div className="admissions-fields">
              <label className="full-width">
                Parent / Guardian Name
                <input
                  name="parentName"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Full name"
                />
              </label>

              <label className="full-width">
                Parent / Guardian Phone
                <input
                  name="parentPhone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="Contact number"
                />
              </label>
            </div>
          </fieldset>

          {/* Student */}
          <fieldset className="admissions-fieldset">
            <legend>Student details</legend>
            <div className="admissions-fields">
              <label className="full-width">
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
                  autoComplete="email"
                  placeholder="student@email.com"
                />
              </label>

              <label>
                Student Phone
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="Contact number"
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

              <label className="full-width">
                Temporary Address
                <textarea
                  name="temporaryAddress"
                  placeholder="Current / temporary address"
                  rows={2}
                />
              </label>

              <label className="full-width">
                Permanent Address
                <textarea
                  name="permanentAddress"
                  placeholder="Permanent address"
                  rows={2}
                />
              </label>
            </div>
          </fieldset>

          {/* Academic */}
          <fieldset className="admissions-fieldset">
            <legend>Academic information</legend>
            <div className="admissions-fields">
              <label className="full-width">
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
                      <option value="Secondary Level">Secondary Level</option>
                    </>
                  )}
                </select>
              </label>

              <label className="full-width">
                Previous School
                <input
                  name="previousSchool"
                  type="text"
                  placeholder="Name of previous school (if any)"
                />
              </label>
            </div>
          </fieldset>

          {/* Message */}
          <fieldset className="admissions-fieldset">
            <legend>Additional information</legend>
            <div className="admissions-fields">
              <label className="full-width">
                Message
                <textarea
                  name="message"
                  placeholder="Any questions or extra details..."
                  rows={4}
                />
              </label>
            </div>
          </fieldset>

          <button
            className="button primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Request information"}
            {!submitting && <span>&rarr;</span>}
          </button>

          {submitted && (
            <p className={isError ? "form-error" : "form-success"}>
              {submitted}
            </p>
          )}
        </form>
      </section>
    </>
  );
}