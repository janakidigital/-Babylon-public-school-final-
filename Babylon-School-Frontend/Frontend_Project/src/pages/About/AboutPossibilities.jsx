import React from "react";

const GOALS = [
  {
    icon: "🤝",
    title: "Community & Mutual Respect",
    description:
      "Cultivate, recognize, and respect the active opinions and contributions of children, parents, and teachers.",
  },
  {
    icon: "🛡️",
    title: "Safe & Nurturing Environment",
    description:
      "Provide a safe learning space where individual uniqueness is celebrated and diversity is deeply valued.",
  },
  {
    icon: "🧠",
    title: "Holistic Potential",
    description:
      "Encourage the full development of each child’s practical, cognitive, physical, social, and moral faculties.",
  },
  {
    icon: "📖",
    title: "Stimulating Curriculum",
    description:
      "Deliver an intellectually stimulating, developmentally appropriate, and socially relevant curriculum.",
  },
  {
    icon: "💡",
    title: "Critical Thinking & Creativity",
    description:
      "Foster student initiative, self-discipline, inquisitive inquiry, and creative approaches to problem-solving.",
  },
  {
    icon: "🌍",
    title: "Good Citizenship & Leadership",
    description:
      "Nurture leadership potential and civic awareness through community service, extracurriculars, and value education.",
  },
];

export default function AboutPossibilities() {
  const currentYear = new Date().getFullYear();
  const yearsLegacy = currentYear >= 1996 ? currentYear - 1996 : 30;

  return (
    <div className="about-page-wrapper">
      {/* 1. Heritage & Welcome Story Card */}
      <section className="about-hero-card">
        <p className="eyebrow">ABOUT BABYLON NATIONAL SCHOOL</p>
        <h2>A Legacy of Educational Excellence & Holistic Growth</h2>
        <p className="about-hero-lead">
          Founded in 1996 in Shantinagar, Kathmandu, Babylon National School has grown into
          one of the region's premier educational institutions. We are a passionate community
          of educators committed to nurturing young minds with 21st-century skills, high moral
          values, and boundless curiosity.
        </p>

        {/* Feature Badges */}
        <div className="about-badge-row">
          <span className="about-pill-badge">🏛️ Est. 1996 A.D.</span>
          <span className="about-pill-badge">📍 Shantinagar, Kathmandu</span>
          <span className="about-pill-badge">🎓 PG to Class 10 (Secondary)</span>
          <span className="about-pill-badge">🌟 English Medium Co-Educational</span>
        </div>

        {/* Quick Stats Bar */}
        <div className="about-stats-bar">
          <div className="about-stat-item">
            <span className="about-stat-number">{yearsLegacy}+</span>
            <span className="about-stat-label">Years of Excellence</span>
          </div>
          <div className="about-stat-item">
            <span className="about-stat-number">1000+</span>
            <span className="about-stat-label">Students Enrolled</span>
          </div>
          <div className="about-stat-item">
            <span className="about-stat-number">30+</span>
            <span className="about-stat-label">Expert Educators</span>
          </div>
          <div className="about-stat-item">
            <span className="about-stat-number">100%</span>
            <span className="about-stat-label">Board Pass Rate</span>
          </div>
        </div>
      </section>

      {/* 2. Vision & Mission Cards */}
      <section className="about-vm-section">
        <div className="about-section-header">
          <p className="eyebrow">OUR DIRECTION</p>
          <h2>Vision & Mission</h2>
        </div>

        <div className="vision-mission-grid">
          {/* Vision */}
          <div className="vm-card vision-card">
            <div className="vm-card-header">
              <span className="vm-icon" aria-hidden="true">🔭</span>
              <h3>Our Vision</h3>
            </div>
            <p>
              To provide an inclusive, dynamic, and fearless learning environment where
              students thrive both academically and personally. We aim to equip learners
              with critical thinking, creativity, collaboration, and communication skills to
              become lifelong problem-solvers and responsible global citizens.
            </p>
          </div>

          {/* Mission */}
          <div className="vm-card mission-card">
            <div className="vm-card-header">
              <span className="vm-icon" aria-hidden="true">🎯</span>
              <h3>Our Mission</h3>
            </div>
            <p>
              To provide quality, value-oriented education that prepares students to become
              productive, ethical, and compassionate members of society. We foster academic
              excellence, social-emotional maturity, inclusivity, and a deep-seated respect
              for cultural diversity and community citizenship.
            </p>
          </div>
        </div>

        {/* Motto Callout Banner */}
        <div className="about-motto-banner">
          <span className="motto-tag">OUR GUIDING DICTUM</span>
          <span className="motto-quote">“Knowledge, Wisdom and Education Par Excellence”</span>
        </div>
      </section>

      {/* 3. Thematic Goals Grid */}
      <section className="about-goals-section">
        <div className="about-section-header">
          <p className="eyebrow">OUR COMMITMENT</p>
          <h2>Institutional Goals</h2>
        </div>

        <div className="goals-grid">
          {GOALS.map((goal, index) => (
            <div key={index} className="goal-card">
              <div className="goal-card-top">
                <span className="goal-icon" aria-hidden="true">{goal.icon}</span>
                <span className="goal-number">0{index + 1}</span>
              </div>
              <h4>{goal.title}</h4>
              <p>{goal.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}