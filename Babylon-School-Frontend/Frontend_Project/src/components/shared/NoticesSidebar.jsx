import { Link, useLocation } from "react-router-dom";

export default function NoticesSidebar({ currentPage = "notices" }) {
  const location = useLocation();

  // Determine active page based on route
  const getActivePage = () => {
    const path = location.pathname;
    if (path === "/notices" || path.startsWith("/notices/")) return "notices";
    if (path === "/blog" || path.startsWith("/blog/")) return "blog";
    if (path === "/events" || path.startsWith("/events/")) return "events";
    if (
      path === "/information-center/eca/enhancing-eca" ||
      path === "/eca/enhancing-eca"
    )
      return "enhancing-eca";
    if (
      path === "/information-center/eca/extra-curricular-activities" ||
      path === "/eca/extra-curricular-activities" ||
      path === "/eca"
    )
      return "extra-curricular-activities";
    return currentPage;
  };

  const activePage = getActivePage();

  return (
    <aside className="notices-sidebar">
      <div className="sidebar-header">
        <h3>Information Center</h3>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/notices"
          className={`sidebar-link ${activePage === "notices" ? "active" : ""}`}
        >
          Notices
        </Link>
        <Link
          to="/blog"
          className={`sidebar-link ${activePage === "blog" ? "active" : ""}`}
        >
          News & Blog
        </Link>
        <Link
          to="/events"
          className={`sidebar-link ${activePage === "events" ? "active" : ""}`}
        >
          Events
        </Link>
        <Link
          to="/information-center/eca/enhancing-eca"
          className={`sidebar-link ${
            activePage === "enhancing-eca" ? "active" : ""
          }`}
        >
          Enhancing ECA
        </Link>
        <Link
          to="/information-center/eca/extra-curricular-activities"
          className={`sidebar-link ${
            activePage === "extra-curricular-activities" ? "active" : ""
          }`}
        >
          Extra Curricular Activities
        </Link>
      </nav>
    </aside>
  );
}