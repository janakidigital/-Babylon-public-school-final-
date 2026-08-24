import { Link } from "react-router-dom";
import { assetPath } from "../../data/content";

export default function StudentLifeSection() {
  return (
    <section className="life" id="life">
      <div className="shell life-grid">
        <div className="life-copy">
          <p className="eyebrow light">LIFE AT BABYLON</p>
          <h2>
            Every day is an
            <br />
            <em>opportunity</em> to shine.
          </h2>
          <p>
            Beyond the classroom, students grow through sport, arts, scouting,
            music, dance and service — a home away from home in Shantinagar.
          </p>
          <Link className="button light-button" to="/student-life">
            Explore student life <span>&rarr;</span>
          </Link>
        </div>
        <div className="life-photo">
          <img
            src={`${assetPath}banner/banner_2.jpg`}
            alt="Babylon school student"
          />
        </div>
      </div>
    </section>
  );
}
