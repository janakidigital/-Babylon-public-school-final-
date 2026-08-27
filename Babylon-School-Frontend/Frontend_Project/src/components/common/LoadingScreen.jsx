export default function LoadingScreen({
  message = "Loading...",
  fullPage = true,
}) {
  return (
    <div
      className={`loading-screen ${fullPage ? "loading-screen--full" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className="loading-screen__spinner" aria-hidden="true" />
      {message && <p className="loading-screen__message">{message}</p>}
    </div>
  );
}