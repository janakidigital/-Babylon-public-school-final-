import { useState, useEffect } from "react";
import { publicApi } from "../../services/api";

export default function PosterPopup() {
  const [posters, setPosters] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("babylon_poster_seen");
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
        }
      })
      .catch((err) => console.error("Poster fetch failed:", err));
  }, []);

  const closePopup = () => {
    setVisible(false);
    localStorage.setItem("babylon_poster_seen", "true");
  };

  if (!visible || posters.length === 0) return null;

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