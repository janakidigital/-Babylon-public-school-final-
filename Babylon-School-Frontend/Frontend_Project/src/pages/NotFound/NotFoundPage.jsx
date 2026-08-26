import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <div className="shell not-found-inner">
        <p className="eyebrow">ERROR 404</p>
        <h1>Page not found</h1>
        <p>
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="button primary">
            Back to Home <span>&rarr;</span>
          </Link>
          <Link to="/contact" className="button outline">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}