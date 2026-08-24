import SchoolLogo from "./SchoolLogo";
import { Link } from "react-router-dom";
import { useSite } from "../../context/SiteContext";

export default function Footer() {
  const { settings } = useSite();
  const social = settings.socialLinks || {};
  return (
    <footer>
      <div className="shell footer-grid">
        <div>
          <SchoolLogo footer />
          <p>
            {settings.shortDescription ||
              "A co-ed English medium school from PG to secondary level."}
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
          }}
        >
          <div>
            <h4>Explore</h4>
            <Link to="/about">About Babylon</Link>
            <Link to="/academics">Academics</Link>
            <Link to="/admissions">Admissions</Link>
            <Link to="/student-life">Student Life</Link>
            <Link to="/facilities">Facilities</Link>
            <Link to="/gallery">Gallery</Link>
          </div>
          <div>
            <h4>More Info</h4>
            <Link to="/notices">Notices</Link>
            <Link to="/blog">News</Link>
            <Link to="/events">Events</Link>
            <Link to="/team">Our Team</Link>
            <Link to="/become-a-teacher">Careers</Link>
            <Link to="/achievements">Achievements</Link>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>
        <div>
          <h4>Contact</h4>
          <p>{settings.address || "Shantinagar, Kathmandu, Nepal"}</p>
          <a href={`mailto:${settings.email || "info@babylonschool.edu.np"}`}>
            {settings.email || "info@babylonschool.edu.np"}
          </a>
          <p>{settings.phone || "+977-1-4108905, 4108973"}</p>
          {(social.facebook || social.instagram || social.youtube) && (
            <p className="footer-social">
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noreferrer">
                  YouTube
                </a>
              )}
            </p>
          )}
        </div>
      </div>
      <div className="shell copyright">
        &copy; {new Date().getFullYear()}{" "}
        {settings.schoolName || "Babylon National School"}. All rights reserved.
      </div>
    </footer>
  );
}
