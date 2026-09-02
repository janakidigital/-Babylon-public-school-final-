import React from "react";
import { Link } from "react-router-dom";
import { Target, Lightbulb, HeartHandshake, ArrowRight } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import { assetPath } from "../../data/content";

export default function AboutSection() {
  const { settings } = useSite();
  const currentYear = new Date().getFullYear();
  const yearsOfExcellence = currentYear >= 1996 ? currentYear - 1996 : 30;

  return (
    <section className="home-about-section" id="about-overview">
      <div className="shell">
        <div className="home-about-grid">
          {/* Left Column: Visual Showcase */}
          <div className="home-about-visual">
            <div className="home-about-image-wrapper">
              <img
                src={`${assetPath}banner/Building.png`}
                alt="Babylon National School Building"
                className="home-about-img-main"
                onError={(e) => {
                  e.target.src = `${assetPath}banner/about_thinking.jpg`;
                }}
              />
              <div className="home-about-badge">
                <span className="badge-years">{yearsOfExcellence}+</span>
                <span className="badge-text">
                  Years of Academic <br /> Excellence
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Pillars */}
          <div className="home-about-content">
            <p className="eyebrow">ABOUT BABYLON NATIONAL SCHOOL</p>
            <h2 className="home-about-title">
              Nurturing Potential. Inspiring Excellence Since 1996.
            </h2>

            <p className="home-about-lead">
              Babylon National School in Shantinagar, Kathmandu is dedicated to providing
              a caring, inclusive, and dynamic learning environment where students thrive
              academically, emotionally, and socially.
            </p>

            {/* <p className="home-about-desc">
              Guided by our motto <em>“Knowledge, Wisdom and Education Par Excellence,”</em> we
              equip young learners with critical thinking, creativity, and moral integrity to
              succeed in a rapidly changing world.
            </p> */}

            {/* Quick Pillars Grid */}
            <div className="home-about-pillars">
              <div className="pillar-item">
                <div className="pillar-icon" aria-hidden="true">
                  <Target size={24} color="#cf2027" />
                </div>
                <div className="pillar-info">
                  <h4>Individual Care</h4>
                  <p>Small, personalized classrooms that celebrate every child's unique talents.</p>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon" aria-hidden="true">
                  <Lightbulb size={24} color="#cf2027" />
                </div>
                <div className="pillar-info">
                  <h4>21st Century Skills</h4>
                  <p>Blending technology, practical inquiry, and creative problem-solving.</p>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon" aria-hidden="true">
                  <HeartHandshake size={24} color="#cf2027" />
                </div>
                <div className="pillar-info">
                  <h4>Value-Based Growth</h4>
                  <p>Fostering discipline, empathy, leadership, and lifelong curiosity.</p>
                </div>
              </div>
            </div>

            {/* CTA Button Link */}
            <div className="home-about-actions">
              <Link to="/about" className="btn btn-primary home-about-btn">
                <span>Discover Our Full Story & Philosophy</span>
                <ArrowRight size={18} className="btn-arrow" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .home-about-section {
          padding: 5.5rem 0;
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .home-about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }

        @media (min-width: 992px) {
          .home-about-grid {
            grid-template-columns: 1.05fr 1.2fr;
            gap: 4.5rem;
          }
        }

        /* Visual Column */
        .home-about-visual {
          position: relative;
          width: 100%;
        }

        .home-about-image-wrapper {
          position: relative;
          border-radius: 18px;
          overflow: visible;
        }

        .home-about-img-main {
          width: 100%;
          height: 420px;
          object-fit: cover;
          border-radius: 18px;
          box-shadow: 0 16px 36px rgba(10, 37, 64, 0.12);
          display: block;
        }

        @media (max-width: 600px) {
          .home-about-img-main {
            height: 280px;
          }
        }

        .home-about-badge {
          position: absolute;
          bottom: -20px;
          left: 20px;
          background: var(--red, #cf2027);
          color: #ffffff;
          padding: 1rem 1.4rem;
          border-radius: 14px;
          box-shadow: 0 10px 24px rgba(207, 32, 39, 0.35);
          display: flex;
          align-items: center;
          gap: 0.85rem;
          z-index: 2;
        }

        .badge-years {
          font-size: 2.2rem;
          font-weight: 800;
          font-family: var(--serif, serif);
          line-height: 1;
        }

        .badge-text {
          font-size: 0.82rem;
          font-weight: 600;
          line-height: 1.25;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Content Column */
        .home-about-content {
          display: flex;
          flex-direction: column;
        }

        .home-about-content .eyebrow {
          color: var(--red, #cf2027);
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 0.6rem;
        }

        .home-about-title {
          font-size: 2.3rem;
          line-height: 1.22;
          color: var(--blue, #021a39);
          margin: 0 0 1.25rem;
          font-family: var(--serif, serif);
        }

        @media (max-width: 768px) {
          .home-about-title {
            font-size: 1.85rem;
          }
        }

        .home-about-lead {
          font-size: 1.08rem;
          line-height: 1.65;
          color: #2c3e50;
          font-weight: 500;
          margin-bottom: 0.75rem;
        }

        .home-about-desc {
          font-size: 0.96rem;
          line-height: 1.65;
          color: var(--muted, #596780);
          margin-bottom: 1.75rem;
        }

        /* Pillars Grid */
        .home-about-pillars {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.1rem;
          margin-bottom: 2.2rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.07);
        }

        @media (min-width: 640px) {
          .home-about-pillars {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.2rem;
          }
        }

        .pillar-item {
          background: #f8fafc;
          padding: 1rem 1.1rem;
          border-radius: 12px;
          border: 1px solid rgba(2, 26, 57, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .pillar-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
          background: #ffffff;
        }

        .pillar-icon {
          font-size: 1.4rem;
          margin-bottom: 0.4rem;
        }

        .pillar-info h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--blue, #021a39);
          margin: 0 0 0.3rem;
        }

        .pillar-info p {
          font-size: 0.82rem;
          line-height: 1.45;
          color: #64748b;
          margin: 0;
        }

        /* Button */
        .home-about-actions {
          margin-top: 0.5rem;
        }

        .home-about-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          background: var(--blue, #021a39);
          color: #ffffff;
          padding: 0.85rem 1.75rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(2, 26, 57, 0.2);
        }

        .home-about-btn:hover {
          background: var(--red, #cf2027);
          color: #ffffff;
          transform: translateX(3px);
          box-shadow: 0 6px 20px rgba(207, 32, 39, 0.3);
        }

        .btn-arrow {
          font-size: 1.1rem;
          transition: transform 0.2s ease;
        }

        .home-about-btn:hover .btn-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </section>
  );
}