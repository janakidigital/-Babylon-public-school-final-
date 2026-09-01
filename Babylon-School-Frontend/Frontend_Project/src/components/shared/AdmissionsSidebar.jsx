import { Link, useLocation } from "react-router-dom";

export default function AdmissionsSidebar({ currentPage = "admissions" }) {
  const location = useLocation();

  // Determine active page based on route
  const getActivePage = () => {
    if (currentPage === "admissions" || location.pathname === "/admissions")
      return "admissions";
    if (currentPage === "career" || location.pathname === "/become-a-teacher")
      return "career";
    return currentPage;
  };

  const activePage = getActivePage();

  return (
    <aside className="admissions-sidebar">
      <div className="sidebar-header">
        <h3>Admissions</h3>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/admissions"
          className={`sidebar-link ${activePage === "admissions" ? "active" : ""}`}
        >
          Admissions
        </Link>
        <Link
          to="/become-a-teacher"
          className={`sidebar-link ${activePage === "career" ? "active" : ""}`}
        >
          Careers
        </Link>
      </nav>
    </aside>
  );
}
