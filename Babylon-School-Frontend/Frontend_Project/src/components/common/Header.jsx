import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSite } from "../../context/SiteContext";
import SchoolLogo from "./SchoolLogo";

const primaryNav = [
  { label: "Home", link: "/" },
  {
    label: "About",
    link: "/about",
    children: [
      { label: "About Babylon", link: "/about" },
      { label: "Our Team", link: "/team" },
      { label: "Achievements", link: "/achievements" },
      { label: "Facilities", link: "/facilities" },
      { label: "FAQ", link: "/faq" },
    ],
  },
  { label: "Academics", link: "/academics" },
  {
    label: "Notices",
    link: "/notices",
    children: [
      { label: "Notices", link: "/notices" },
      { label: "News & Blog", link: "/blog" },
      { label: "Events", link: "/events" },
    ],
  },
  { label: "Gallery", link: "/gallery" },
  { label: "Downloads", link: "/downloads" },
  {
    label: "Admissions",
    link: "/admissions",
    children: [
      { label: "Admissions", link: "/admissions" },
      { label: "Careers", link: "/become-a-teacher" },
    ],
  },
  { label: "Contact", link: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { settings } = useSite();

  const toggleDropdown = (label) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <>
      {/* Top Strip */}
      <div className="top-strip">
        <div className="shell top-strip-inner">
          <span>{settings.address || "Shantinagar, Kathmandu, Nepal"}</span>

          <div className="top-strip-right">
            <span>{settings.email || "info@babylonschool.edu.np"}</span>
            <span className="sep">|</span>
            <span>{settings.phone || "+977-1-4108905, 4108973"}</span>

            <Link to="/admin" className="admin-login-btn desktop-only">
              🔒 Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        <div className="shell header-inner">
          <SchoolLogo />

          {/* Mobile Toggle Button */}
          <button
            className="mobile-toggle"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setOpenDropdown(null);
            }}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* Navigation */}
          <nav className={menuOpen ? "nav open" : "nav"}>
            {primaryNav.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className={`nav-item has-dropdown ${
                    openDropdown === item.label ? "open" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="nav-link dropdown-toggle"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleDropdown(item.label);
                    }}
                    aria-expanded={openDropdown === item.label}
                  >
                    <span>{item.label}</span>
                    <span className="arrow">
                      {openDropdown === item.label ? "▴" : "▾"}
                    </span>
                  </button>

                  <div
                    className={`dropdown-menu ${
                      openDropdown === item.label ? "show" : ""
                    }`}
                  >
                    {item.children.map((child) => (
                      <NavLink
                        key={child.link}
                        to={child.link}
                        className={({ isActive }) =>
                          isActive ? "dropdown-link active" : "dropdown-link"
                        }
                        onClick={closeMenu}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.link}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
              )
            )}

            {/* Admin Login - Mobile Only */}
            <Link
              to="/admin"
              className="admin-login-btn mobile-admin"
              onClick={closeMenu}
            >
              🔒 Login
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}