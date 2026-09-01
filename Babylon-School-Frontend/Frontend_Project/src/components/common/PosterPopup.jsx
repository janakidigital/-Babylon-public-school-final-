import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { publicApi } from "../../services/api";

const POSTER_SESSION_KEY = "babylon_poster_shown";

export default function PosterPopup() {
  const [posters, setPosters] = useState([]);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  // Never show in admin panel
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    // Skip if on admin routes
    if (isAdmin) return;

    // Check if poster has already been shown in this session
    const hasSeen = sessionStorage.getItem(POSTER_SESSION_KEY);
    if (hasSeen) return;

    publicApi
      .posters()
      .then((result) => {
        const list = result?.data || result || [];
        const active = list.filter(
          (p) => (p.isActive === true || p.isActive === "true") && p.image
        );

        if (active.length > 0) {
          active.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setPosters(active);
          setVisible(true);
          // Mark as shown in sessionStorage so it only shows once per session
          sessionStorage.setItem(POSTER_SESSION_KEY, "true");
        }
      })
      .catch((err) => console.error("Poster fetch failed:", err));
  }, [isAdmin]);

  const closePopup = () => {
    setVisible(false);
    sessionStorage.setItem(POSTER_SESSION_KEY, "true");
  };

  if (!visible || isAdmin || posters.length === 0) return null;

  const poster = posters[0];

  return (
    <div className="poster-overlay" onClick={closePopup}>
      <div className="poster-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="poster-close"
          onClick={closePopup}
          aria-label="Close"
        >
          ×
        </button>

        {poster.link ? (
          <a href={poster.link} target="_blank" rel="noopener noreferrer">
            <img src={poster.image} alt={poster.title || "Poster"} />
          </a>
        ) : (
          <img src={poster.image} alt={poster.title || "Poster"} />
        )}
      </div>
    </div>
  );
}