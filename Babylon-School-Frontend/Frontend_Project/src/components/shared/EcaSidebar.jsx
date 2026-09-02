import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../pages/About/SidebarsCommon.css";

export default function EcaSidebar({ currentPage = "enhancing-eca" }) {
  const location = useLocation();

  const getActivePage = () => {
    const path = location.pathname;
    if (
      path === "/information-center/eca/enhancing-eca" ||
      path === "/eca/enhancing-eca" ||
      currentPage === "enhancing-eca"
    )
      return "enhancing-eca";
    if (
      path === "/information-center/eca/extra-curricular-activities" ||
      path === "/eca/extra-curricular-activities" ||
      path === "/eca" ||
      currentPage === "extra-curricular-activities"
    )
      return "extra-curricular-activities";
    return currentPage;
  };

  const activePage = getActivePage();

  return (
    <aside className="partners-sidebar eca-sidebar">
      <div className="sidebar-section">
        <h3>ECA</h3>
        <nav className="sidebar-nav">
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
      </div>

      <div className="sidebar-section" style={{ marginTop: "24px" }}>
        <h3>Information Center</h3>
        <nav className="sidebar-nav">
          <Link to="/notices" className="sidebar-link">
            Notices &amp; Announcements
          </Link>
          <Link to="/blog" className="sidebar-link">
            News &amp; Blog
          </Link>
          <Link to="/events" className="sidebar-link">
            Events Calendar
          </Link>
        </nav>
      </div>
    </aside>
  );
}
