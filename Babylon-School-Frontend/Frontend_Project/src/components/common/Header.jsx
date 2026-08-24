import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSite } from "../../context/SiteContext";
import SchoolLogo from "./SchoolLogo";

const primaryNav = [
  ["Home", "/"],
  ["About", "/about"],
  ["Academics", "/academics"],
  ["Student Life", "/student-life"],
  ["Notices", "/notices"],
  ["Gallery", "/gallery"],
  ["Admissions", "/admissions"],
  ["Contact", "/contact"],
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { settings } = useSite();
  return (
    <>
      <div className="top-strip">
        <div className="shell top-strip-inner">
          <span>{settings.address || "Shantinagar, Kathmandu, Nepal"}</span>
          <div>
            <span>{settings.email || "info@babylonschool.edu.np"}</span>
            <span className="sep">|</span>
            <span>{settings.phone || "+977-1-4108905, 4108973"}</span>
          </div>
        </div>
      </div>
      <header className="header">
        <div className="shell header-inner">
          <SchoolLogo />
          <button
            className="mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            &#9776;
          </button>
          <nav className={menuOpen ? "nav open" : "nav"}>
            {primaryNav.map(([label, link]) => (
              <NavLink
                key={label}
                className={({ isActive }) => (isActive ? "active" : "")}
                to={link}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="button ghost header-login" to="/login">
              Login
            </Link>
            <Link className="admission-button" to="/admissions">
              Admission Open <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
