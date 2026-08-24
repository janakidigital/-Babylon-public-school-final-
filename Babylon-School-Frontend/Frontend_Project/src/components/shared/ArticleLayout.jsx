import { Link } from "react-router-dom";
import { mediaUrl } from "../../lib/media";
import { assetPath } from "../../data/content";
import { useSite } from "../../context/SiteContext";

export default function ArticleLayout({ image, title, label, children }) {
  const { settings } = useSite();
  const src = mediaUrl(image, `${assetPath}banner/inner_banner_1.jpg`);
  return (
    <section className="article-layout shell">
      <article>
        {src && <img src={src} alt="" />}
        <p className="eyebrow">{label}</p>
        <h2>{title}</h2>
        <div className="article-copy">{children}</div>
      </article>
      <aside>
        <h3>At a glance</h3>
        <p>{settings.schoolName || "Babylon National School"}</p>
        <p>{settings.address || "Shantinagar, Kathmandu"}</p>
        <p>{settings.phone || "+977-1-4108905, 4108973"}</p>
        <p>Sunday to Friday</p>
        <Link className="button primary" to="/contact">
          Get in touch <span>&rarr;</span>
        </Link>
      </aside>
    </section>
  );
}
