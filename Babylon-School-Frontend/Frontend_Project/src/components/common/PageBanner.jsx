import { Link } from "react-router-dom";
import { assetPath } from "../../data/content";
import { mediaUrl } from "../../lib/media";
import { useSite } from "../../context/SiteContext";

export default function PageBanner({
  eyebrow,
  title,
  image = "banner/inner_banner_1.jpg",
  pageKey,
}) {
  const { settings } = useSite();

  // Normalize eyebrow or slug if pageKey isn't provided directly
  const normalizedKey =
    pageKey ||
    (eyebrow
      ? eyebrow
          .toLowerCase()
          .replace(/&/g, "")
          .replace(/[^a-z0-9]+/g, "")
      : "");

  // Check admin configured banner for this page, or default banner, or fallback image
  const adminBanner =
    (pageKey && settings?.pageBanners?.[pageKey]) ||
    (normalizedKey && settings?.pageBanners?.[normalizedKey]) ||
    settings?.pageBanners?.[eyebrow?.toLowerCase()] ||
    null;

  const activeImage = adminBanner || image;
  const src = mediaUrl(activeImage, `${assetPath}${activeImage}`);

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
