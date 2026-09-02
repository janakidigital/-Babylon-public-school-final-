import React from "react";
import {
  Building2,
  MapPin,
  GraduationCap,
  Sparkles,
  Telescope,
  Target,
  Users,
  ShieldCheck,
  Brain,
  BookOpen,
  Lightbulb,
  Globe,
  Award,
  Compass,
  HeartHandshake,
} from "lucide-react";

const GOALS = [
  {
    icon: Users,
    title: "Community & Mutual Respect",
    description:
      "To cultivate, recognize, and respect the opinions and contributions of children, parents, and teachers.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Nurturing Environment",
    description:
      "To provide a safe, nurturing environment for learning where individuality is recognized and diversity is celebrated.",
  },
  {
    icon: Brain,
    title: "Holistic Potential",
    description:
      "To provide instruction that encourages the full development of each child’s practical, cognitive, physical, social, and moral faculties.",
  },
  {
    icon: BookOpen,
    title: "Stimulating Curriculum",
    description:
      "To present a curriculum that is intellectually stimulating and developmentally appropriate.",
  },
  {
    icon: Lightbulb,
    title: "Critical Thinking & Creativity",
    description:
      "To foster student initiative, self-discipline, inquisitive inquiry, and creative approaches to problem-solving.",
  },
  {
    icon: Globe,
    title: "Good Citizenship & Leadership",
    description:
      "To foster the values of good citizenship through community service, civic awareness, and the development of leadership potential.",
  },
  {
    icon: Award,
    title: "Meeting Modern Challenges",
    description:
      "Committed to its dictum “Knowledge, Wisdom and Education Par Excellence”, for students who are determined to meet the challenges posed by the brutal advance of scientism, modernism, and post-modernism.",
  },
  {
    icon: Compass,
    title: "Self-Reliance & Value Growth",
    description:
      "The school aims to accord the type of education that can meet the individual and collective needs of learners and make them self–confident, self-disciplined, and self–reliant by stressing value education, career guidance, social works, leadership training, and extra-curricular activities.",
  },
  {
    icon: HeartHandshake,
    title: "Institute Par Excellence",
    description:
      "Babylon National School envisions an establishment of an educational institute “Par Excellence” academically solid, socially relevant, and value-oriented.",
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
        <p className="about-hero-lead">
          We are a community of passionate educators dedicated since 1996 to providing a dynamic and engaging learning environment for all our students. We are located at Shantinagar, Kathmandu. Our team of experienced teachers works tirelessly to inspire and motivate students to achieve their full potential. We strive to create a welcoming and inclusive school culture that fosters a love of learning, creativity, and collaboration. We are committed to empowering students to become lifelong learners who are equipped with the 21st-century skills and knowledge they need to succeed in a rapidly changing world.
        </p>

        {/* Feature Badges */}
        <div className="about-badge-row">
          <span className="about-pill-badge">
            <Building2 size={16} className="text-primary" /> Est. 1996 A.D.
          </span>
          <span className="about-pill-badge">
            <MapPin size={16} className="text-danger" /> Shantinagar, Kathmandu
          </span>
          <span className="about-pill-badge">
            <GraduationCap size={16} className="text-primary" /> PG to Class 10 (Secondary)
          </span>
          <span className="about-pill-badge">
            <Sparkles size={16} className="text-warning" /> English Medium Co-Educational
          </span>
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
              <span className="vm-icon" aria-hidden="true">
                <Telescope size={26} color="#021a39" />
              </span>
              <h3>Our Vision</h3>
            </div>
            <p>
              The vision of our school is to provide an inclusive and dynamic learning environment where students can thrive both academically and personally. We aim to foster a love of learning in our students and equip them with the skills and knowledge they need to succeed in the 21st century. Our focus is on developing critical thinking, creativity, collaboration, and communication skills that will enable our students to become lifelong learners and effective problem-solvers. We strive to create a school culture that values diversity, promotes positive relationships, and encourages a growth mindset. Our ultimate goal is to prepare our students to be responsible, compassionate, and engaged citizens who will make a positive impact in their communities and the world.
            </p>
          </div>

          {/* Mission */}
          <div className="vm-card mission-card">
            <div className="vm-card-header">
              <span className="vm-icon" aria-hidden="true">
                <Target size={26} color="#cf2027" />
              </span>
              <h3>Our Mission</h3>
            </div>
            <p>
              Our mission is to provide a quality education that prepares students to become responsible, productive, and ethical members of society. We strive to create a learning environment that fosters academic excellence, social and emotional growth, and a commitment to lifelong learning. We are dedicated to promoting diversity, inclusivity, and respect for all individuals, and we seek to cultivate a strong sense of community and citizenship among our students.
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
          {GOALS.map((goal, index) => {
            const GoalIcon = goal.icon;
            return (
              <div key={index} className="goal-card">
                <div className="goal-card-top">
                  <span className="goal-icon" aria-hidden="true">
                    <GoalIcon size={24} color="#cf2027" />
                  </span>
                  <span className="goal-number">0{index + 1}</span>
                </div>
                <h4>{goal.title}</h4>
                <p>{goal.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}