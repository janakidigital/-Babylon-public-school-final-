import { Link } from "react-router-dom";
import schoolLogo from "../../assets/school logo.png";

export default function SchoolLogo({ footer = false }) {
  return (
    <Link
      to="/"
      aria-label="Babylon National School home"
      className={footer ? "school-logo footer-school-logo" : "school-logo"}
    >
      <img
        src={schoolLogo}
        alt="Babylon National School"
      />
    </Link>
  );
}