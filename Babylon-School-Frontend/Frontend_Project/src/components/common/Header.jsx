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
  ["Downloads", "/downloads"],
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
          <span>
            {settings.address || "Shantinagar, Kathmandu, Nepal"}
          </span>

          <div className="top-strip-right">
            <span>
              {settings.email || "info@babylonschool.edu.np"}
            </span>

            <span className="sep">|</span>

            <span>
              {settings.phone || "+977-1-4108905, 4108973"}
            </span>

            {/* Red Admin button - visible on desktop top strip */}
            <Link to="/admin" className="admin-login-btn desktop-only">
              🔒 Login
            </Link>
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

            {/* Admin link - shows in mobile menu */}
            <Link
              to="/admin"
              className="admin-login-btn mobile-admin"
              onClick={() => setMenuOpen(false)}
            >
              🔒Login
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}