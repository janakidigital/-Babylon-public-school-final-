import { Link, useLocation } from "react-router-dom";

export default function NoticesSidebar({ currentPage = "notices" }) {
  const location = useLocation();

  // Determine active page based on route
  const getActivePage = () => {
    if (
      currentPage === "notices" ||
      location.pathname === "/notices" ||
      location.pathname.startsWith("/notices/")
    )
      return "notices";
    if (
      currentPage === "blog" ||
      location.pathname === "/blog" ||
      location.pathname.startsWith("/blog/")
    )
      return "blog";
    if (
      currentPage === "events" ||
      location.pathname === "/events" ||
      location.pathname.startsWith("/events/")
    )
      return "events";
    return currentPage;
  };

  const activePage = getActivePage();

  return (
    <aside className="notices-sidebar">
      <div className="sidebar-header">
        <h3>Notices</h3>
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
      </nav>
    </aside>
  );
}