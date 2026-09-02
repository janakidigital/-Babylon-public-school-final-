import React, { useState } from "react";
import {
  ClipboardCheck,
  Sparkles,
  CheckCircle2,
  Star,
  Award,
  ShieldCheck,
  ZoomIn,
  X,
} from "lucide-react";
import trophyImg from "../../assets/international-school-award-trophy.jpg";
import certImg from "../../assets/international-school-award-certificate.png";

const APPROACH_ITEMS = [
  "High expectations by all students.",
  "Small and personalized classrooms.",
  "Use of technology to enhance learning.",
  "Recognition and application of learning styles.",
  "Increased instructional time.",
  "Highly qualified staff and faculties.",
  "Parents as Partners.",
];

const GUIDING_PRINCIPLES = [
  "Learning is a lifelong process.",
  "Every individual is capable of excellence.",
  "Every individual is smart with immense potential.",
  "Learning from mistakes.",
  "Collaborative and cooperative learning.",
];

export default function AboutStats() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <section className="about-philosophy-section">
      <div className="about-section-header">
        <p className="eyebrow">OUR PHILOSOPHY</p>
        <h2>Learning with purpose, growing with confidence.</h2>
      </div>

      {/* Philosophy Context Card */}
      <div className="philosophy-intro-box">
        <p>
          We are open to broaden academic outreach of young learners into the zenith of the global standard of 21st century. We basically believe the uniqueness of the child and try accordingly to explore the uniqueness in a full scale without overbearing their creativity. Our teaching teams assume and nurture them to respect the opinions of others, draw logical conclusions of the critical questions by using their own senses, ingenuity, and inquisitiveness in a fearless environment. We duly respect the diversity of cultures in school. We maintain inclusiveness while treating a child so that he /she would feel the importance of social equity and equality in the learning process. We provide individual care to the students so that they would feel the importance of self-respect, self-discovery, and inclusion.
        </p>
      </div>

      {/* Main Philosophy & Recognition Showcase */}
      <div className="philosophy-showcase-grid">
        {/* Left/Middle Columns: Approach & Principles */}
        <div className="philosophy-col">
          <div className="philosophy-col-header">
            <ClipboardCheck size={22} color="#021a39" />
            <h3>Educational Approach</h3>
          </div>
          <ul className="philosophy-list-modern">
            {APPROACH_ITEMS.map((item, idx) => (
              <li key={idx}>
                <CheckCircle2 size={18} color="#cf2027" className="flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="philosophy-col">
          <div className="philosophy-col-header">
            <Sparkles size={22} color="#021a39" />
            <h3>Guiding Principles</h3>
          </div>
          <ul className="philosophy-list-modern">
            {GUIDING_PRINCIPLES.map((item, idx) => (
              <li key={idx}>
                <Star size={18} color="#d97706" className="flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Side Column: British Council International School Award Showcase */}
        <div className="philosophy-award-card">
          <div className="award-card-header">
            <div className="award-header-pill">
              <Award size={16} />
              <span>GLOBAL ACCREDITATION</span>
            </div>
            <h3>British Council International School Award</h3>
            <span className="award-year-tag">Session: 2017 – 2020</span>
          </div>

          <div className="award-dual-gallery">
            {/* Trophy Photo */}
            <div
              className="award-thumb-box"
              onClick={() =>
                setActiveImage({
                  src: trophyImg,
                  title: "British Council International School Award Trophy (2017-20)",
                  subtitle: "Babylon National Higher Secondary School, Kathmandu",
                })
              }
              role="button"
              tabIndex={0}
              aria-label="View Trophy"
            >
              <div className="award-img-container">
                <img
                  src={trophyImg}
                  alt="British Council International School Award Trophy"
                  className="award-thumb-img trophy-fit"
                  loading="lazy"
                />
                <div className="award-hover-hint">
                  <ZoomIn size={18} />
                  <span>View</span>
                </div>
              </div>
              <span className="award-caption">Official Trophy</span>
            </div>

            {/* Certificate Photo */}
            <div
              className="award-thumb-box"
              onClick={() =>
                setActiveImage({
                  src: certImg,
                  title: "British Council Reaccreditation Certificate",
                  subtitle: "Outstanding Development of International Dimension in Curriculum",
                })
              }
              role="button"
              tabIndex={0}
              aria-label="View Certificate"
            >
              <div className="award-img-container">
                <img
                  src={certImg}
                  alt="British Council Reaccreditation Certificate"
                  className="award-thumb-img cert-fit"
                  loading="lazy"
                />
                <div className="award-hover-hint">
                  <ZoomIn size={18} />
                  <span>View</span>
                </div>
              </div>
              <span className="award-caption">Accreditation Certificate</span>
            </div>
          </div>

          <div className="award-note-box">
            <ShieldCheck size={18} className="award-note-icon" />
            <p>
              Reaccredited for <strong>outstanding development</strong> of the international dimension in curriculum.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Lightbox Modal */}
      {activeImage && (
        <div
          className="award-lightbox-overlay"
          onClick={() => setActiveImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="award-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="award-lightbox-close"
              onClick={() => setActiveImage(null)}
              aria-label="Close image preview"
            >
              <X size={22} />
            </button>
            <div className="award-lightbox-img-wrap">
              <img
                src={activeImage.src}
                alt={activeImage.title}
                className="award-lightbox-img"
              />
            </div>
            <div className="award-lightbox-info">
              <h4>{activeImage.title}</h4>
              {activeImage.subtitle && <p>{activeImage.subtitle}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}