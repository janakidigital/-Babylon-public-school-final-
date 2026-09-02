import { Link } from "react-router-dom";
import { useSite } from "../../context/SiteContext";
import detailsImage from "../../assets/details.jpg"; // Import the image

export default function ContactSection() {
  const { settings, home } = useSite();
  const cta = home?.cta || {};

  return (
    <>
      <section className="enquiry" id="contact">
        <div className="shell enquiry-inner">
          <div>
            <p className="eyebrow light">JOIN OUR COMMUNITY</p>
            <h2>
              {cta.title || (
                <>
                  Begin your Babylon
                  <br />
                  journey today.
                </>
              )}
            </h2>
          </div>

          <div>
            <p>
              {cta.description ||
                "Meet our community at Shantinagar, Kathmandu and find the right learning path for your child, from PG to secondary."}
            </p>

            <Link className="button primary" to="/admissions">
              Apply Now <span>&rarr;</span>
            </Link>

            <p className="enquiry-meta">
              {settings.phone || "+977-1-4108905, 4108973"} ·{" "}
              {settings.email || "info@babylonschool.edu.np"}
            </p>
          </div>
        </div>
      </section>

      {/* Awards/Partners Section - Single Image */}
      <div className="awards-partners-section">
        <div className="shell">
          <div className="awards-container">
            <img
              src={detailsImage}
              alt="Awards and Partners - International School Award, NCC Education, School Enterprise Challenge, Doko Securities, Eduplay, ISO 9001:2015"
              className="awards-image"
            />
          </div>
        </div>
      </div>
    </>
  );
}