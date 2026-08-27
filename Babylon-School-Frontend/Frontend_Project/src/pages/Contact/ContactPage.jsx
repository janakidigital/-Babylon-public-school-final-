import { useState } from "react";
import PageBanner from "../../components/common/PageBanner";
import { publicApi } from "../../services/api";
import { useSite } from "../../context/SiteContext";
import toast from "react-hot-toast";

export default function ContactPage() {
  const { settings } = useSite();
  const [result, setResult] = useState("");

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget; // capture before await

    try {
      await publicApi.contact(
        Object.fromEntries(new FormData(form).entries()),
      );
      toast.success("Thank you. Your message has been sent.");
      setResult("Thank you. Your message has been sent.");
      form.reset();
    } catch (error) {
      toast.error(error.message);
      setResult(error.message);
    }
  }

  return (
    <>
      <PageBanner
        eyebrow="GET IN TOUCH"
        title="We would love to hear from you."
        image="banner/inner_banner_1.jpg"
      />

      <section className="contact-page shell">
        <div>
          <p className="eyebrow">CONTACT BABYLON</p>
          <h2>Let us help you take the next step.</h2>
          <p>
            Babylon National School is a co-ed English medium school from PG to
            secondary level. Our office is happy to answer questions and arrange
            a campus visit.
          </p>

          <div className="contact-details">
            <p>
              <b>Visit us</b>
              {settings.address || "Shantinagar, Kathmandu, Nepal"}
            </p>
            <p>
              <b>Call us</b>
              {settings.phone || "+977-1-4108905, 4108973"}
            </p>
            <p>
              <b>Email us</b>
              {settings.email || "info@babylonschool.edu.np"}
            </p>
          </div>
        </div>

        <form onSubmit={submit}>
          <label>
            Parent / Guardian name
            <input
              name="name"
              type="text"
              required
              placeholder="Your full name"
            />
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
            Phone number
            <input
              name="phone"
              type="tel"
              placeholder="Your contact number"
            />
          </label>

          <label>
            Subject
            <input name="subject" placeholder="How can we help?" />
          </label>

          <label>
            Your message
            <textarea
              name="message"
              required
              rows="4"
              placeholder="Write your message"
            />
          </label>

          <button className="button primary">
            Send enquiry <span>&rarr;</span>
          </button>

          {result && <p className="form-success">{result}</p>}
        </form>
      </section>
    </>
  );
}