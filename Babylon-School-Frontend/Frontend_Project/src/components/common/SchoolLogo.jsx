import { Link } from "react-router-dom";
import { useSite } from "../../context/SiteContext";
import { mediaUrl } from "../../lib/media";

export default function SchoolLogo({ footer = false }) {
  const { settings } = useSite();
  const name = settings.schoolName || "Babylon National School";
  return (
    <Link
      className={`logo${footer ? " footer-logo" : ""}`}
      to="/"
      aria-label={`${name} home`}
    >
      {settings.logo ? (
        <img className="logo-image" src={mediaUrl(settings.logo)} alt={name} />
      ) : (
        <span className="crest">&#10022;</span>
      )}
      <span>
        <b>BABYLON</b>
        <small>NATIONAL SCHOOL</small>
      </span>
    </Link>
  );
}
