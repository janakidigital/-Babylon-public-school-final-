import SchoolLogo from "./SchoolLogo";
import { Link } from "react-router-dom";
import { useSite } from "../../context/SiteContext";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Footer() {
  const { settings } = useSite();

  return (
    <footer>
      <div className="shell footer-grid">

        {/* School Info */}
        <div>
          <SchoolLogo footer />

          <p>
            {settings.shortDescription ||
              "A co-ed English medium school from PG to secondary level."}
          </p>
        </div>


        {/* Navigation */}
        <div
          className="footer-navigation"
        >
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

            <p>
              {settings.address ||
                "Shantinagar, Kathmandu, Nepal"}
            </p>
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