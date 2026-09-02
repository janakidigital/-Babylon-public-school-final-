import React from "react";
import { ClipboardCheck, Sparkles, CheckCircle2, Star } from "lucide-react";

const APPROACH_ITEMS = [
  "High academic and moral expectations for all students.",
  "Small, personalized classrooms ensuring individual care.",
  "Thoughtful integration of modern technology in daily learning.",
  "Recognition and adaptation to distinct student learning styles.",
  "Focused and meaningful instructional time.",
  "Experienced, highly qualified staff and passionate mentors.",
  "Parents actively engaged as collaborative educational partners.",
];

const GUIDING_PRINCIPLES = [
  "Learning is an inspiring, lifelong journey.",
  "Every individual is capable of achieving personal excellence.",
  "Every student possesses unique intelligence and immense potential.",
  "Mistakes are viewed as valuable opportunities for growth.",
  "Collaborative, cooperative teamwork fuels authentic discovery.",
];

export default function AboutStats() {
  return (
    <section className="about-philosophy-section">
      <div className="about-section-header">
        <p className="eyebrow">OUR PHILOSOPHY</p>
        <h2>Learning with purpose, growing with confidence.</h2>
      </div>

      {/* Philosophy Context Card */}
      <div className="philosophy-intro-box">
        <p>
          We believe in the uniqueness of every child and actively explore that individuality
          without overbearing their innate creativity. Our educators nurture students to think
          critically, express their voices with confidence, respect diverse cultures, and
          develop self-respect through personalized guidance.
        </p>
      </div>

      {/* 2-Column Approach & Guiding Principles */}
      <div className="philosophy-dual-columns">
        {/* Column 1: Our Approach */}
        <div className="philosophy-col">
          <div className="philosophy-col-header">
            <ClipboardCheck size={22} color="#021a39" />
            <h3>Our Educational Approach</h3>
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

        {/* Column 2: Our Guiding Principles */}
        <div className="philosophy-col">
          <div className="philosophy-col-header">
            <Sparkles size={22} color="#021a39" />
            <h3>Our Guiding Principles</h3>
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
      </div>
    </section>
  );
}