import { Link } from "react-router-dom";
import { useSite } from "../../context/SiteContext";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Footer() {
  const { settings } = useSite();

  return (
    <footer>
      <div className="shell footer-grid">

        {/* Google Maps Column */}
        <div className="footer-map-col">
          <h4>Find Us</h4>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d776!2d85.3468418!3d27.6944248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198562c4ddb1%3A0x643554472674ff47!2sBabylon%20National%20School!5e0!3m2!1sen!2snp!4v1693300000000!5m2!1sen!2snp"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Babylon National School Location"
          ></iframe>
          <a
            href="https://www.google.com/maps/place/Babylon+National+School/@27.6944248,85.3468418,776m/data=!3m2!1e3!4b1!4m6!3m5!1s0x39eb198562c4ddb1:0x643554472674ff47!8m2!3d27.6944248!4d85.3468418!16s%2Fg%2F1tfqd6m3?entry=ttu&g_ep=EgoyMDI2MDgyNS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-map-link"
          >
            <i className="bi bi-box-arrow-up-right"></i>
            View on Google Maps
          </a>
        </div>


        {/* Navigation */}
        <div className="footer-navigation">
          {/* Explore */}
          <div>
            <h4>Explore</h4>

            <Link to="/about">About Babylon</Link>
            <Link to="/academics">Academics</Link>
            <Link to="/admissions">Admissions</Link>
            <Link to="/facilities">Facilities</Link>
            <Link to="/gallery">Gallery</Link>
          </div>

          {/* More Info */}
          <div>
            <h4>More Info</h4>

            <Link to="/notices">Notices</Link>
            <Link to="/blog">News & Blog</Link>
            <Link to="/events">Events</Link>
            <Link to="/team">Our Team</Link>
            <Link to="/become-a-teacher">Careers</Link>
            <Link to="/achievements">Achievements</Link>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>


        {/* Contact */}
        <div>
          <h4>Contact</h4>

          {/* Address */}
          <div className="footer-contact">
            <i className="bi bi-geo-alt-fill"></i>

            <a
              href="https://www.google.com/maps/place/Babylon+National+School/@27.6944248,85.3468418,776m/data=!3m2!1e3!4b1!4m6!3m5!1s0x39eb198562c4ddb1:0x643554472674ff47!8m2!3d27.6944248!4d85.3468418!16s%2Fg%2F1tfqd6m3?entry=ttu&g_ep=EgoyMDI2MDgyNS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
            >
              {settings.address ||
                "Shantinagar, Kathmandu, Nepal"}
            </a>
          </div>


          {/* Email */}
          <div className="footer-contact">
            <i className="bi bi-envelope-fill"></i>

            <a
              href={`mailto:${
                settings.email ||
                "info@babylonschool.edu.np"
              }`}
            >
              {settings.email ||
                "info@babylonschool.edu.np"}
            </a>
          </div>


          {/* Phone */}
          <div className="footer-contact">
            <i className="bi bi-telephone-fill"></i>

            <p>
              {settings.phone ||
                "+977-1-4108905, 4108973"}
            </p>
          </div>


          {/* Social Media */}
          <div className="footer-social">

            <a
              href="https://www.facebook.com/BabylonNationalSchool/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <i className="bi bi-facebook"></i>
            </a>

            <a
              href="https://www.instagram.com/babylonschoolofficial/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="bi bi-instagram"></i>
            </a>

            <a
              href="https://www.youtube.com/@babylonnationalschool1915"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <i className="bi bi-youtube"></i>
            </a>

          </div>
        </div>

      </div>


      {/* Copyright */}
      <div className="shell copyright">
        &copy; {new Date().getFullYear()}{" "}
        {settings.schoolName ||
          "Babylon National School"}. All rights reserved.
      </div>
    </footer>
  );
}