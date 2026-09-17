import { Link, useLocation } from "react-router-dom";

export default function AboutSidebar({ currentPage = "about" }) {
  const location = useLocation();

  // Determine active page based on route
  const getActivePage = () => {
    if (currentPage === "about" || location.pathname === "/about")
      return "about";
    if (currentPage === "team" || location.pathname === "/team") return "team";
    if (currentPage === "achievements" || location.pathname === "/achievements")
      return "achievements";
    if (
      currentPage === "facilities" ||
      location.pathname.includes("/facilities")
    )
      return "facilities";
    if (currentPage === "faq" || location.pathname === "/faq") return "faq";
    if (currentPage === "partners" || location.pathname.includes("/partners"))
      return "partners";
    return currentPage;
  };

  const activePage = getActivePage();

  return (
    <aside className="about-sidebar">
      <div className="sidebar-header">
        <h3>About</h3>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/about"
          className={`sidebar-link ${activePage === "about" ? "active" : ""}`}
        >
          About Babylon
        </Link>
        <Link
          to="/team"
          className={`sidebar-link ${activePage === "team" ? "active" : ""}`}
        >
          Our Team
        </Link>
        <Link
          to="/achievements"
          className={`sidebar-link ${activePage === "achievements" ? "active" : ""}`}
        >
          Achievements
        </Link>
        <Link
          to="/facilities"
          className={`sidebar-link ${activePage === "facilities" ? "active" : ""}`}
        >
          Facilities
        </Link>
        <Link
          to="/faq"
          className={`sidebar-link ${activePage === "faq" ? "active" : ""}`}
        >
          FAQ
        </Link>
        <Link
          to="/international-partners"
          className={`sidebar-link ${activePage === "partners" ? "active" : ""}`}
        >
          Our Learning Partners
        </Link>
      </nav>
    </aside>
  );
}
