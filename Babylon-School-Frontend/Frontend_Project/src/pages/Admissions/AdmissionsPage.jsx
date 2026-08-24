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
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      await publicApi.admission(payload);
      setSubmitted("Thank you. Our admissions team will contact you soon.");
      event.currentTarget.reset();
    } catch (error) {
      setSubmitted(error.message);
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
          <label>
            Parent / guardian name
            <input name="parentName" required placeholder="Your full name" />
          </label>
          <label>
            Parent phone
            <input name="parentPhone" type="tel" required placeholder="Your contact number" />
          </label>
          <label>
            Child's name
            <input name="name" required placeholder="Child's full name" />
          </label>
          <label>
            Child's email
            <input name="email" type="email" required placeholder="name@email.com" />
          </label>
          <label>
            Child's phone
            <input name="phone" type="tel" required placeholder="Child's contact number" />
          </label>
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
                  <option>Play Group (PG)</option>
                  <option>Basic Level</option>
                  <option>Secondary Level</option>
                </>
              )}
            </select>
          </label>
          <button className="button primary">
            Request information <span>&rarr;</span>
          </button>
          {submitted && <p className="form-success">{submitted}</p>}
        </form>
      </section>
    </>
  );
}
