import { Link } from "react-router-dom";
import { assetPath } from "../../data/content";
import { mediaUrl } from "../../lib/media";

export default function PageBanner({
  eyebrow,
  title,
  image = "banner/inner_banner_1.jpg",
}) {
  const src = mediaUrl(image, `${assetPath}${image}`);
  return (
    <section
      className="page-banner"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(3,36,76,.87), rgba(3,36,76,.48)), url(${src})`,
      }}
    >
      <div className="shell">
        <p className="eyebrow light">{eyebrow}</p>
        <h1>{title}</h1>
        <Link to="/">Home</Link>
        <span> / {title}</span>
      </div>
    </section>
  );
}
