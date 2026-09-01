import schoolLogo from "../../assets/school logo.png";
import "./LoadingScreen.css";

export default function LoadingScreen({
  message = "Welcome to Babylon National School",
  fullPage = true,
  showLogo = true,
}) {
  return (
    <div
      className={`splash-screen ${fullPage ? "splash-screen--full" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className="splash-content">
        {showLogo && (
          <div className="splash-logo-wrapper">
            <img
              src={schoolLogo}
              alt="Babylon National School"
              className="splash-logo"
            />
          </div>
        )}

        <div className="splash-loader-bar">
          <div className="splash-loader-fill" />
        </div>

        {message && <p className="splash-message">{message}</p>}
      </div>
    </div>
  );
}