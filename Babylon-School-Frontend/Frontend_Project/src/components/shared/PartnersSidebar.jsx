import { Link } from "react-router-dom";

export default function PartnersSidebar({ currentPage = "international" }) {
  return (
    <aside className="partners-sidebar">
      <div className="sidebar-section">
        <h3>Our Learning Partners</h3>
        <nav className="sidebar-nav">
          <Link
            to="/international-partners"
            className={`sidebar-link ${currentPage === "international" ? "active" : ""}`}
          >
            International Partners
          </Link>
          <Link
            to="/national-partners"
            className={`sidebar-link ${currentPage === "national" ? "active" : ""}`}
          >
            National Partners
          </Link>
        </nav>
      </div>
    </aside>
  );
}
