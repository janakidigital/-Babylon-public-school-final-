import { Link } from "react-router-dom";
import { assetPath } from "../../data/content";

export default function HeroSection() {
  const background = `${assetPath}banner/banner_1.jpg`;

  return (
    <section className="hero" id="home">
      <div
        className="hero-image"
        style={{ backgroundImage: `url(${background})` }}
      />

      <div className="hero-shade" />

      <div className="shell hero-content">
        <p className="eyebrow light">
          WELCOME TO BABYLON NATIONAL SCHOOL
        </p>

        <h1>
          Education for
          <br />
          <em>the Quest</em>
        </h1>

        <p className="hero-description">
          A community of passionate educators in Shantinagar, Kathmandu,
          dedicated since 1996 to a dynamic learning environment from PG to
          secondary.
        </p>

        <div className="hero-actions">
          <Link className="button primary" to="/academics">
            Explore Academics <span>&rarr;</span>
          </Link>

          <Link className="button ghost" to="/about">
            Discover Babylon
          </Link>
        </div>
      </div>

      <div className="hero-mark">
        01 <span />
      </div>
    </section>
  );
}